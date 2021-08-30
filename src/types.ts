import * as React from 'react';
import {Animated, ViewStyle} from 'react-native';

export type Dimensions = {
    height: number;
    width: number;
};

export type SliderProps = {
    animateTransitions?: boolean;
    animationConfig?: {
        spring?: Animated.AnimatedProps<ViewStyle>;
        timing?: Animated.AnimatedProps<ViewStyle>;
    };
    animationType: 'spring' | 'timing';
    containerStyle?: ViewStyle;
    debugTouchArea?: boolean;
    disabled?: boolean;
    maximumTrackTintColor?: string;
    maximumValue: number;
    minimumTrackTintColor?: string;
    minimumValue: number;
    onSlidingComplete?: (value: number | Array<number>) => void;
    onSlidingStart?: (value: number | Array<number>) => void;
    onValueChange?: (value: number | Array<number>) => void;
    renderAboveThumbComponent?: (index: number) => React.ReactNode;
    renderThumbComponent?: () => React.ReactNode;
    renderTrackMarkComponent?: (index: number) => React.ReactNode;
    step?: number;
    thumbImage?: string | number | Array<string | number>;
    thumbStyle?: ViewStyle;
    thumbTintColor?: string;
    thumbTouchSize: Dimensions;
    trackClickable?: boolean;
    trackMarks?: Array<number>;
    trackStyle?: ViewStyle;
    value?: Animated.Value | number | Array<number>;
};

export type SliderState = {
    allMeasured: boolean;
    containerSize: Dimensions;
    thumbSize: Dimensions;
    trackMarksValues?: Array<Animated.Value>;
    values: Array<Animated.Value>;
};
