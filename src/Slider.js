/* @flow */
import React, {PureComponent} from 'react';
import {
    Animated,
    Image,
    PanResponder,
    View,
    Easing,
    I18nManager,
} from 'react-native';
// styles
import {defaultStyles as styles} from './styles';
// types
import {GestureState, PressEvent, ViewLayoutEvent} from 'react-native';
import type {ChangeEvent, Dimensions, SliderProps, SliderState} from './types';

type RectReturn = {
    containsPoint: (nativeX: number, nativeY: number) => boolean,
    height: number,
    trackDistanceToPoint: (nativeX: number) => number,
    width: number,
    x: number,
    y: number,
};

const Rect = ({
    height,
    width,
    x,
    y,
}: {
    height: number,
    width: number,
    x: number,
    y: number,
}) => ({
    containsPoint: (nativeX, nativeY) =>
        nativeX >= x &&
        nativeY >= y &&
        nativeX <= x + width &&
        nativeY <= y + height,
    height,
    trackDistanceToPoint: (nativeX) => {
        if (nativeX < x) {
            return x - nativeX;
        }
        if (nativeX > x + width) {
            return nativeX - (x + width);
        }
        return 0;
    },
    width,
    x,
    y,
});

const DEFAULT_ANIMATION_CONFIGS = {
    spring: {
        friction: 7,
        tension: 100,
    },
    timing: {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        delay: 0,
    },
};

function normalizeValue(
    props: SliderProps,
    value?: number | Array<number>,
): Array<number> {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return [0];
    }
    const {maximumValue, minimumValue} = props;
    const getBetweenValue = (inputValue: number) =>
        Math.max(Math.min(inputValue, maximumValue), minimumValue);
    if (!Array.isArray(value)) {
        return [getBetweenValue(value)];
    }
    return value.map(getBetweenValue).sort((a, b) => a - b);
}

function updateValues(
    values: typeof Animated.Value | Array<typeof Animated.Value>,
    newValues?: typeof Animated.Value | Array<typeof Animated.Value> = values,
) {
    if (
        Array.isArray(newValues) &&
        Array.isArray(values) &&
        newValues.length !== values.length
    ) {
        return updateValues(newValues);
    }

    // $FlowFixMe
    return values.map((value, i) => {
        if (value instanceof Animated.Value) {
            return value.setValue(
                newValues[i] instanceof Animated.Value
                    ? newValues[i].__getValue()
                    : newValues[i],
            );
        }

        if (newValues[i] instanceof Animated.Value) {
            return newValues[i];
        }
        return new Animated.Value(newValues[i]);
    });
}

function indexOfLowest(values: Array<number>): number {
    let lowestIndex = 0;
    values.forEach((value, index, array) => {
        if (value < array[lowestIndex]) {
            lowestIndex = index;
        }
    });
    return lowestIndex;
}

export class Slider extends PureComponent<SliderProps, SliderState> {
    constructor(props: SliderProps) {
        super(props);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this
                ._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminationRequest: this
                ._handlePanResponderRequestEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
        this.state = {
            allMeasured: false,
            containerSize: {width: 0, height: 0},
            thumbSize: {width: 0, height: 0},
            trackMarksValues: updateValues(
                normalizeValue(this.props, this.props.trackMarks),
            ),
            values: updateValues(normalizeValue(this.props, this.props.value)),
        };
    }

    static defaultProps = {
        animationType: 'timing',
        debugTouchArea: false,
        trackMarks: [],
        maximumTrackTintColor: '#b3b3b3',
        maximumValue: 1,
        minimumTrackTintColor: '#3f3f3f',
        minimumValue: 0,
        step: 0,
        thumbTintColor: '#343434',
        thumbTouchSize: {width: 40, height: 40},
        trackClickable: true,
        value: 0,
    };

    static getDerivedStateFromProps(props: SliderProps, state: SliderState) {
        if (
            props.trackMarks &&
            !!state.trackMarksValues &&
            state.trackMarksValues.length > 0
        ) {
            const newTrackMarkValues = normalizeValue(props, props.trackMarks);
            const statePatch = {};
            if (
                state.trackMarksValues &&
                newTrackMarkValues.length !== state.trackMarksValues.length
            ) {
                statePatch.trackMarksValues = updateValues(
                    state.trackMarksValues,
                    newTrackMarkValues,
                );
            }
            return statePatch;
        }
    }

    componentDidUpdate() {
        const newValues = normalizeValue(this.props, this.props.value);
        newValues.forEach((value, i) => {
            if (!this.state.values[i]) {
                this._setCurrentValue(value, i);
            } else if (value !== this.state.values[i].__getValue()) {
                if (this.props.animateTransitions) {
                    this._setCurrentValueAnimated(value, i);
                } else {
                    this._setCurrentValue(value, i);
                }
            }
        });
    }

    _getRawValues(values: typeof Animated.Value) {
        return values.map((value) => value.__getValue());
    }

    _handleStartShouldSetPanResponder = (
        e: typeof PressEvent /* gestureState: GestureState */,
    ): boolean =>
        // Should we become active when the user presses down on the thumb?
        this._thumbHitTest(e);

    _handleMoveShouldSetPanResponder(/* e: typeof PressEvent, gestureState: GestureState */): boolean {
        // Should we become active when the user moves a touch over the thumb?
        return false;
    }

    _handlePanResponderGrant = (e: typeof PressEvent) => {
        const {thumbSize} = this.state;
        const {nativeEvent} = e;
        this._previousLeft = this.props.trackClickable
            ? nativeEvent.locationX - thumbSize.width
            : this._getThumbLeft(this._getCurrentValue(this._activeThumbIndex));
        this._fireChangeEvent('onSlidingStart');
    };

    _handlePanResponderMove = (
        e: typeof PressEvent,
        gestureState: typeof GestureState,
    ) => {
        if (this.props.disabled) {
            return;
        }
        this._setCurrentValue(
            this._getValue(gestureState),
            this._activeThumbIndex,
            () => {
                this._fireChangeEvent('onValueChange');
            },
        );
    };

    _handlePanResponderRequestEnd = (/* e: typeof PressEvent, gestureState: GestureState */) => {
        // Should we allow another component to take over this pan?
        return false;
    };

    _handlePanResponderEnd = (
        e: typeof PressEvent,
        gestureState: typeof GestureState,
    ) => {
        if (this.props.disabled) {
            return;
        }
        this._setCurrentValue(
            this._getValue(gestureState),
            this._activeThumbIndex,
            () => {
                if (this.props.trackClickable) {
                    this._fireChangeEvent('onValueChange');
                }
                this._fireChangeEvent('onSlidingComplete');
            },
        );
        this._activeThumbIndex = 0;
    };

    _measureContainer = (e: typeof ViewLayoutEvent) => {
        this._handleMeasure('_containerSize', e);
    };

    _measureTrack = (e: typeof ViewLayoutEvent) => {
        this._handleMeasure('_trackSize', e);
    };

    _measureThumb = (e: typeof ViewLayoutEvent) => {
        this._handleMeasure('_thumbSize', e);
    };

    _handleMeasure = (
        name: '_containerSize' | '_trackSize' | '_thumbSize',
        e: typeof ViewLayoutEvent,
    ) => {
        const {width, height} = e.nativeEvent.layout;
        const size = {width, height};
        // $FlowFixMe
        const currentSize = this[name];
        if (
            currentSize &&
            width === currentSize.width &&
            height === currentSize.height
        ) {
            return;
        }
        // $FlowFixMe
        this[name] = size;

        if (this._containerSize && this._thumbSize) {
            this.setState({
                containerSize: this._containerSize,
                thumbSize: this._thumbSize,
                allMeasured: true,
            });
        }
    };

    _getRatio = (value: number) => {
        const {maximumValue, minimumValue} = this.props;
        return (value - minimumValue) / (maximumValue - minimumValue);
    };

    _getThumbLeft = (value: number) => {
        const {containerSize, thumbSize} = this.state;
        const standardRatio = this._getRatio(value);
        const ratio = I18nManager.isRTL ? 1 - standardRatio : standardRatio;
        return ratio * (containerSize.width - thumbSize.width);
    };

    _getValue = (gestureState: typeof GestureState) => {
        const {containerSize, thumbSize, values} = this.state;
        const {maximumValue, minimumValue, step} = this.props;
        const length = containerSize.width - thumbSize.width;
        const thumbLeft = this._previousLeft + gestureState.dx;

        const nonRtlRatio = thumbLeft / length;
        const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
        let minValue = minimumValue;
        let maxValue = maximumValue;
        const rawValues = this._getRawValues(values);
        const buffer = step ? step : 0.1;
        if (values.length === 2) {
            if (this._activeThumbIndex === 1) {
                minValue = rawValues[0] + buffer;
            } else {
                maxValue = rawValues[1] - buffer;
            }
        }
        if (step) {
            return Math.max(
                minValue,
                Math.min(
                    maxValue,
                    minimumValue +
                        Math.floor(
                            (ratio * (maximumValue - minimumValue)) / step,
                        ) *
                            step,
                ),
            );
        }
        return Math.max(
            minValue,
            Math.min(
                maxValue,
                ratio * (maximumValue - minimumValue) + minimumValue,
            ),
        );
    };

    _getCurrentValue = (thumbIndex: number = 0) =>
        this.state.values[thumbIndex].__getValue();

    _setCurrentValue = (
        value: number,
        thumbIndex: ?number,
        callback?: () => void,
    ) => {
        const safeIndex = thumbIndex ?? 0;
        const animatedValue = this.state.values[safeIndex];
        if (animatedValue) {
            animatedValue.setValue(value);
            if (callback) {
                callback();
            }
        } else {
            this.setState((prevState: SliderState) => {
                const newValues = [...prevState.values];
                newValues[safeIndex] = Animated.Value(value);
                return {
                    values: newValues,
                };
            }, callback);
        }
    };

    _setCurrentValueAnimated = (value: number, thumbIndex: number = 0) => {
        const {animationType} = this.props;
        const animationConfig = {
            ...DEFAULT_ANIMATION_CONFIGS[animationType],
            ...this.props.animationConfig,
            toValue: value,
            useNativeDriver: false,
        };

        Animated[animationType](
            this.state.values[thumbIndex],
            animationConfig,
        ).start();
    };

    _fireChangeEvent = (changeEventType: ChangeEvent) => {
        if (this.props[changeEventType]) {
            this.props[changeEventType](this._getRawValues(this.state.values));
        }
    };

    _getTouchOverflowSize = () => {
        const {allMeasured, containerSize, thumbSize} = this.state;
        const {thumbTouchSize} = this.props;

        const size = {};
        if (allMeasured) {
            size.width = Math.max(0, thumbTouchSize.width - thumbSize.width);
            size.height = Math.max(
                0,
                thumbTouchSize.height - containerSize.height,
            );
        }

        return size;
    };

    _getTouchOverflowStyle = () => {
        const {width, height} = this._getTouchOverflowSize();

        const touchOverflowStyle = {};
        if (width !== undefined && height !== undefined) {
            const verticalMargin = -height / 2;
            touchOverflowStyle.marginTop = verticalMargin;
            touchOverflowStyle.marginBottom = verticalMargin;

            const horizontalMargin = -width / 2;
            touchOverflowStyle.marginLeft = horizontalMargin;
            touchOverflowStyle.marginRight = horizontalMargin;
        }

        if (this.props.debugTouchArea === true) {
            touchOverflowStyle.backgroundColor = 'orange';
            touchOverflowStyle.opacity = 0.5;
        }

        return touchOverflowStyle;
    };

    _thumbHitTest = (e: typeof PressEvent) => {
        const {nativeEvent} = e;
        const {trackClickable} = this.props;
        const {values} = this.state;
        const hitThumb = values.find((_, i) => {
            const thumbTouchRect = this._getThumbTouchRect(i);
            const containsPoint = thumbTouchRect.containsPoint(
                nativeEvent.locationX,
                nativeEvent.locationY,
            );
            if (containsPoint) {
                this._activeThumbIndex = i;
            }

            return containsPoint;
        });
        if (hitThumb) {
            return true;
        }
        if (trackClickable) {
            // set the active thumb index
            if (values.length === 1) {
                this._activeThumbIndex = 0;
            } else {
                // we will find the closest thumb and that will be the active thumb
                const thumbDistances = values.map((value, index) => {
                    const thumbTouchRect = this._getThumbTouchRect(index);
                    return thumbTouchRect.trackDistanceToPoint(
                        nativeEvent.locationX,
                    );
                });
                this._activeThumbIndex = indexOfLowest(thumbDistances);
            }
            return true;
        }
        return false;
    };

    _getThumbTouchRect = (thumbIndex: number = 0): RectReturn => {
        const {containerSize, thumbSize} = this.state;
        const {thumbTouchSize} = this.props;
        const {height, width} = thumbTouchSize;
        const touchOverflowSize = this._getTouchOverflowSize();
        return Rect({
            height,
            width,
            x:
                touchOverflowSize.width / 2 +
                this._getThumbLeft(this._getCurrentValue(thumbIndex)) +
                (thumbSize.width - width) / 2,
            y:
                touchOverflowSize.height / 2 +
                (containerSize.height - height) / 2,
        });
    };

    _activeThumbIndex: number = 0;

    _containerSize: ?Dimensions;

    _panResponder: typeof PanResponder;

    _previousLeft: number = 0;

    _thumbSize: ?Dimensions;

    _trackSize: ?Dimensions;

    _renderDebugThumbTouchRect = (thumbLeft: number, index: number) => {
        const {height, y, width} = this._getThumbTouchRect() || {};
        const positionStyle = {
            height,
            left: thumbLeft,
            top: y,
            width,
        };

        return (
            <Animated.View
                key={`debug-thumb-${index}`}
                pointerEvents="none"
                style={[styles.debugThumbTouchArea, positionStyle]}
            />
        );
    };

    _renderThumbImage = (thumbIndex: number = 0) => {
        const {thumbImage} = this.props;

        if (!thumbImage) {
            return null;
        }

        return (
            <Image
                source={
                    Array.isArray(thumbImage)
                        ? thumbImage[thumbIndex]
                        : thumbImage
                }
            />
        );
    };

    render() {
        const {
            animateTransitions,
            animationType,
            containerStyle,
            debugTouchArea,
            maximumTrackTintColor,
            maximumValue,
            minimumTrackTintColor,
            minimumValue,
            renderAboveThumbComponent,
            renderTrackMarkComponent,
            renderThumbComponent,
            thumbImage,
            thumbStyle,
            thumbTintColor,
            thumbTouchSize,
            trackStyle,
            ...other
        } = this.props;
        const {
            allMeasured,
            containerSize,
            thumbSize,
            trackMarksValues,
            values,
        } = this.state;
        const interpolatedThumbValues = values.map((v) =>
            v.interpolate({
                inputRange: [minimumValue, maximumValue],
                outputRange: I18nManager.isRTL
                    ? [0, -(containerSize.width - thumbSize.width)]
                    : [0, containerSize.width - thumbSize.width],
            }),
        );

        const interpolatedTrackValues = values.map((v) =>
            v.interpolate({
                inputRange: [minimumValue, maximumValue],
                outputRange: [0, containerSize.width - thumbSize.width],
            }),
        );

        const interpolatedTrackMarksValues =
            trackMarksValues &&
            trackMarksValues.map((v) =>
                v.interpolate({
                    inputRange: [minimumValue, maximumValue],
                    outputRange: I18nManager.isRTL
                        ? [0, -(containerSize.width - thumbSize.width)]
                        : [0, containerSize.width - thumbSize.width],
                }),
            );

        const valueVisibleStyle = {};
        if (!allMeasured) {
            valueVisibleStyle.opacity = 0;
        }
        const interpolatedRawValues = this._getRawValues(
            interpolatedTrackValues,
        );
        const minThumbValue = new Animated.Value(
            Math.min(...interpolatedRawValues),
        );
        const maxThumbValue = new Animated.Value(
            Math.max(...interpolatedRawValues),
        );
        const minimumTrackStyle = {
            position: 'absolute',
            left:
                interpolatedTrackValues.length === 1
                    ? new Animated.Value(0)
                    : Animated.add(minThumbValue, thumbSize.width / 2),
            width:
                interpolatedTrackValues.length === 1
                    ? Animated.add(
                          interpolatedTrackValues[0],
                          thumbSize.width / 2,
                      )
                    : Animated.add(
                          Animated.multiply(minThumbValue, -1),
                          maxThumbValue,
                      ),
            backgroundColor: minimumTrackTintColor,
            ...valueVisibleStyle,
        };

        const touchOverflowStyle = this._getTouchOverflowStyle();

        return (
            <>
                {renderAboveThumbComponent && (
                    <View style={styles.aboveThumbComponentsContainer}>
                        {interpolatedThumbValues.map((value, i) => (
                            <Animated.View
                                key={`slider-above-thumb-${i}`}
                                style={[
                                    styles.renderThumbComponent,
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    {
                                        bottom: 0,
                                        transform: [
                                            {translateX: value},
                                            {translateY: 0},
                                        ],
                                        ...valueVisibleStyle,
                                    },
                                ]}>
                                {renderAboveThumbComponent(i)}
                            </Animated.View>
                        ))}
                    </View>
                )}
                <View
                    {...other}
                    style={[styles.container, containerStyle]}
                    onLayout={this._measureContainer}>
                    <View
                        renderToHardwareTextureAndroid
                        style={[
                            styles.track,
                            {backgroundColor: maximumTrackTintColor},
                            trackStyle,
                        ]}
                        onLayout={this._measureTrack}
                    />
                    <Animated.View
                        renderToHardwareTextureAndroid
                        style={[styles.track, trackStyle, minimumTrackStyle]}
                    />
                    {renderTrackMarkComponent &&
                        interpolatedTrackMarksValues &&
                        interpolatedTrackMarksValues.map((value, i) => (
                            <Animated.View
                                key={`track-mark-${i}`}
                                style={[
                                    styles.renderThumbComponent,
                                    {
                                        transform: [
                                            {translateX: value},
                                            {translateY: 0},
                                        ],
                                        ...valueVisibleStyle,
                                    },
                                ]}>
                                {renderTrackMarkComponent(i)}
                            </Animated.View>
                        ))}
                    {interpolatedThumbValues.map((value, i) => (
                        <Animated.View
                            key={`slider-thumb-${i}`}
                            style={[
                                renderThumbComponent
                                    ? styles.renderThumbComponent
                                    : styles.thumb,
                                renderThumbComponent
                                    ? {}
                                    : {
                                          backgroundColor: thumbTintColor,
                                          ...thumbStyle,
                                      },
                                {
                                    transform: [
                                        {translateX: value},
                                        {translateY: 0},
                                    ],
                                    ...valueVisibleStyle,
                                },
                            ]}
                            onLayout={this._measureThumb}>
                            {renderThumbComponent
                                ? renderThumbComponent()
                                : this._renderThumbImage(i)}
                        </Animated.View>
                    ))}
                    <View
                        style={[styles.touchArea, touchOverflowStyle]}
                        {...this._panResponder.panHandlers}>
                        {!!debugTouchArea &&
                            interpolatedThumbValues.map((value, i) =>
                                this._renderDebugThumbTouchRect(value, i),
                            )}
                    </View>
                </View>
            </>
        );
    }
}
