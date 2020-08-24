/* @flow */
import * as React from 'react';
import {
    Animated,
    SpringAnimationConfig,
    StyleSheet,
    TimingAnimationConfig,
} from 'react-native';

export type ChangeEvent =
    | 'onSlidingComplete'
    | 'onSlidingStart'
    | 'onValueChange';

export type Dimensions = {height: number, width: number};

export type SliderProps = {
    animateTransitions: boolean,
    animationConfig: {|
        spring?: typeof SpringAnimationConfig,
        timing?: typeof TimingAnimationConfig,
    |},
    animationType: 'spring' | 'timing',
    containerStyle: typeof StyleSheet.styles,
    debugTouchArea: boolean,
    disabled: boolean,
    maximumTrackTintColor: string,
    maximumValue: number,
    minimumTrackTintColor: string,
    minimumValue: number,
    onSlidingComplete: (value: number | Array<number>) => void,
    onSlidingStart: (value: number | Array<number>) => void,
    onValueChange: (value: number | Array<number>) => void,
    renderAboveThumbComponent?: (index: number) => React.Node,
    renderThumbComponent: () => React.Node,
    renderTrackMarkComponent?: (index: number) => React.Node,
    step: number,
    thumbImage: string | number | Array<string | number>,
    thumbStyle: typeof StyleSheet.styles,
    thumbTintColor: string,
    thumbTouchSize: Dimensions,
    trackClickable: boolean,
    trackMarks?: Array<number>,
    trackStyle: typeof StyleSheet.styles,
    value: number | Array<number>,
};

export type SliderState = {
    allMeasured: boolean,
    containerSize: Dimensions,
    thumbSize: Dimensions,
    trackMarksValues?: Array<typeof Animated.Value>,
    values: Array<typeof Animated.Value>,
};
