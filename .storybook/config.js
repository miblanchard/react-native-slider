/* @flow */
/* eslint-disable global-require */
import {configure} from "@storybook/react-native";

configure(() => {
    const req = require.context(
        "../src", // path where stories live
        true, // recursive?
        /.*__stories__\/.*.js$/ // story files match this pattern
    );
    req.keys().forEach((module) => req(module));
}, module);
