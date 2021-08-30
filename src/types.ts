import * as React from 'react';
import {Animated, ImageSourcePropType, ViewStyle} from 'react-native';

export type Dimensions = {
    height: number;
    width: number;
};

/**
 * Callback for slider change events. The second number value will be only if provided an array with two values in `value` prop
 */
type SliderOnChangeCallback = (value: number | Array<number>) => void;

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
    onSlidingComplete?: SliderOnChangeCallback;
    onSlidingStart?: SliderOnChangeCallback;
    onValueChange?: SliderOnChangeCallback;
    renderAboveThumbComponent?: (index: number) => React.ReactNode;
    renderThumbComponent?: () => React.ReactNode;
    renderTrackMarkComponent?: (index: number) => React.ReactNode;
    step?: number;
    thumbImage?: ImageSourcePropType;
    thumbStyle?: ViewStyle;
    thumbTintColor?: string;
    thumbTouchSize?: Dimensions;
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
