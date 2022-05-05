import * as React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {Slider} from '..';
// styles
import {
    aboveThumbStyles,
    componentThumbStyles,
    customStyles,
    customStyles2,
    customStyles3,
    customStyles4,
    customStyles5,
    customStyles6,
    customStyles7,
    customStyles8,
    customStyles9,
    iosStyles,
    styles,
    trackMarkStyles,
} from './styles';

const thumbImage = require('./img/thumb.png');

const DEFAULT_VALUE = 0.2;

const CustomThumb = () => (
    <View style={componentThumbStyles.container}>
        <Text>Any</Text>
    </View>
);

const renderAboveThumbComponent = () => {
    return <View style={aboveThumbStyles.container} />;
};

const SliderContainer = (props: {
    caption: string;
    children: React.ReactElement;
    sliderValue?: number | Array<number>;
    trackMarks?: Array<number>;
}) => {
    const {caption, sliderValue, trackMarks} = props;
    const [value, setValue] = React.useState(
        sliderValue ? sliderValue : DEFAULT_VALUE,
    );
    let renderTrackMarkComponent: React.ReactNode;

    if (trackMarks?.length && (!Array.isArray(value) || value?.length === 1)) {
        renderTrackMarkComponent = (index: number) => {
            const currentMarkValue = trackMarks[index];

            const style =
                currentMarkValue >
                Math.max(Array.isArray(value) ? value[0] : value)
                    ? trackMarkStyles.activeMark
                    : trackMarkStyles.inactiveMark;
            return <View style={style} />;
        };
    }

    const renderChildren = () => {
        return React.Children.map(
            props.children,
            (child: React.ReactElement) => {
                if (!!child && child.type === Slider) {
                    return React.cloneElement(child, {
                        onValueChange: setValue,
                        renderTrackMarkComponent,
                        trackMarks,
                        value,
                    });
                }

                return child;
            },
        );
    };

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.titleContainer}>
                <Text>{caption}</Text>
                <Text>{Array.isArray(value) ? value.join(' - ') : value}</Text>
            </View>
            {renderChildren()}
        </View>
    );
};

const App = () => (
    <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
            <SliderContainer caption="<Slider/> to test the start from zero - symmetric">
                <Slider
                    value={DEFAULT_VALUE}
                    minimumValue={-1}
                    maximumValue={1}
                    step={0.01}
                    startFromZero
                    trackClickable={true}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> to test the start from zero - asymmetric">
                <Slider
                    value={DEFAULT_VALUE}
                    minimumValue={-0.4}
                    maximumValue={1}
                    step={0.01}
                    startFromZero
                    trackClickable={true}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> to test click rounding">
                <Slider
                    value={3}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    trackClickable={true}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with default style">
                <Slider />
            </SliderContainer>
            <SliderContainer
                caption="<Slider/> with track marks"
                sliderValue={[1]}
                trackMarks={[3, 7, 11]}>
                <Slider maximumValue={17} minimumValue={0} step={1} />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom thumb component">
                <Slider
                    animateTransitions
                    renderThumbComponent={CustomThumb}
                    trackStyle={customStyles.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom above thumb component">
                <Slider
                    animateTransitions
                    renderAboveThumbComponent={renderAboveThumbComponent}
                />
            </SliderContainer>
            <SliderContainer
                caption="<Slider/> 2 thumbs, min, max, and custom tint"
                sliderValue={[6, 18]}>
                <Slider
                    animateTransitions
                    maximumTrackTintColor="#d3d3d3"
                    maximumValue={20}
                    minimumTrackTintColor="#1fb28a"
                    minimumValue={4}
                    step={2}
                    thumbTintColor="#1a9274"
                />
            </SliderContainer>

            <SliderContainer caption="<Slider/> with min, max and custom tints">
                <Slider
                    animateTransitions
                    maximumTrackTintColor="#d3d3d3"
                    maximumValue={42}
                    minimumTrackTintColor="#1fb28a"
                    minimumValue={-10}
                    thumbTintColor="#1a9274"
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style">
                <Slider
                    animateTransitions
                    maximumTrackTintColor="#b7b7b7"
                    minimumTrackTintColor="#1073ff"
                    thumbStyle={iosStyles.thumb}
                    trackStyle={iosStyles.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #2">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#30a935"
                    thumbStyle={customStyles2.thumb}
                    trackStyle={customStyles2.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #3">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#eecba8"
                    thumbStyle={customStyles3.thumb}
                    trackStyle={customStyles3.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #4">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#d14ba6"
                    thumbStyle={customStyles4.thumb}
                    trackStyle={customStyles4.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #5">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#ec4c46"
                    thumbStyle={customStyles5.thumb}
                    trackStyle={customStyles5.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #6">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#e6a954"
                    thumbStyle={customStyles6.thumb}
                    trackStyle={customStyles6.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #7">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#2f2f2f"
                    thumbStyle={customStyles7.thumb}
                    trackStyle={customStyles7.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #8 and thumbTouchSize">
                <Slider
                    animateTransitions
                    containerStyle={customStyles8.container}
                    minimumTrackTintColor="#31a4db"
                    thumbStyle={customStyles8.thumb}
                    thumbTouchSize={{
                        width: 50,
                        height: 40,
                    }}
                    trackStyle={customStyles8.track}
                />
            </SliderContainer>
            <SliderContainer caption="<Slider/> with custom style #9 and thumbImage">
                <Slider
                    animateTransitions
                    minimumTrackTintColor="#13a9d6"
                    thumbImage={thumbImage}
                    thumbStyle={customStyles9.thumb}
                    thumbTintColor="#0c6692"
                />
            </SliderContainer>
        </ScrollView>
    </SafeAreaView>
);

export default App;
