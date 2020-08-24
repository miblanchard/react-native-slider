/* @flow */
import 'resize-observer-polyfill/dist/ResizeObserver.global';
import {configure} from '@storybook/react-native';

configure(() => {
    const req = require.context(
        '../src', // path where stories live
        true, // recursive?
        /.*__stories__\/.*.js$/, // story files match this pattern
    );
    req.keys().forEach((module) => req(module));
}, module);
