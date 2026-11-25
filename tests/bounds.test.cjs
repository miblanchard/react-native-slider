const {after, afterEach, beforeEach, describe, it, mock} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const renderer = require('react-test-renderer');
const {PanResponder} = require('react-native-web');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const cache = path.join(root, 'node_modules/.cache');
fs.mkdirSync(cache, {recursive: true});
const fixtureDir = fs.mkdtempSync(path.join(cache, 'slider-bounds-'));
esbuild.buildSync({
    entryPoints: [path.join(root, 'src/index.tsx')],
    outfile: path.join(fixtureDir, 'slider.cjs'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    alias: {'react-native': 'react-native-web'},
    external: ['react', 'react-native-web'],
});
const {Slider} = require(path.join(fixtureDir, 'slider.cjs'));
after(() => fs.rmSync(fixtureDir, {recursive: true, force: true}));

const {act} = renderer;
describe('bounds changed during a range drag', () => {
    let handlers;
    beforeEach(() => {
        mock.method(PanResponder, 'create', (config) => {
            handlers = config;
            return {panHandlers: {}};
        });
    });
    afterEach(() => mock.restoreAll());

    const cases = [
        [0, [20, 80], {maximumValue: 60}, 10, [18, 60]],
        [1, [20, 80], {minimumValue: 40}, -10, [40, 82]],
        [1, [80, 90], {maximumValue: 60}, 0, [60, 60]],
        [0, [10, 20], {minimumValue: 40}, 0, [40, 40]],
    ];
    for (const [index, value, bounds, dx, expected] of cases) {
        for (const animateTransitions of [false, true]) {
            it(`commits ${expected}, animated=${animateTransitions}`, () => {
                const onSlidingComplete = mock.fn();
                const onSlidingStart = mock.fn();
                const ref = React.createRef();
                const props = {
                    ref,
                    value,
                    animateTransitions,
                    minimumValue: 0,
                    maximumValue: 100,
                    step: 1,
                    trackClickable: false,
                    thumbTouchSize: {width: 20, height: 20},
                    onSlidingComplete,
                    onSlidingStart,
                };
                let tree;
                act(() => {
                    tree = renderer.create(React.createElement(Slider, props));
                });
                try {
                    act(() => {
                        ref.current._measureContainer({
                            nativeEvent: {layout: {width: 120, height: 20}},
                        });
                        ref.current._measureThumb({
                            nativeEvent: {layout: {width: 20, height: 20}},
                        });
                    });
                    const rect = ref.current._getThumbTouchRect(index);
                    const event = {
                        nativeEvent: {
                            locationX:
                                rect.x +
                                rect.width * (index === 1 ? 0.9 : 0.25),
                            locationY: rect.y + rect.height / 2,
                        },
                    };
                    assert.equal(
                        handlers.onStartShouldSetPanResponder(event),
                        true,
                    );
                    act(() => handlers.onPanResponderGrant(event));
                    assert.deepEqual(
                        onSlidingStart.mock.calls.at(-1).arguments,
                        [value, index],
                    );
                    act(() => handlers.onPanResponderMove(event, {dx, dy: 0}));
                    act(() =>
                        tree.update(
                            React.createElement(Slider, {...props, ...bounds}),
                        ),
                    );
                    act(() =>
                        handlers.onPanResponderRelease(event, {dx, dy: 0}),
                    );
                    assert.deepEqual(
                        onSlidingComplete.mock.calls.at(-1).arguments,
                        [expected, index],
                    );
                } finally {
                    act(() => tree.unmount());
                }
            });
        }
    }
});
