import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Color } from './Colors';
import { H2 } from './Text';

const { width, height } = Dimensions.get('window');
const CircularTimer = ({ duration, onTimeout }) => {
    const [fill, setFill] = useState(100);
    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => {
        let interval = null;

        if (remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
                setFill(() => (remainingTime / duration) * 100);
            }, 1000);
        } else {
            setFill(0);
            clearInterval(interval);
            onTimeout();
        }

        return () => clearInterval(interval);
    }, [remainingTime]);

    return (
        <View style={styles.container}>
            <AnimatedCircularProgress
                size={width * 0.4}
                width={3}
                fill={fill}
                tintColor={Color('primary')}
                backgroundColor={Color('whiteText')}
            >
                {() => (
                    <H2>{remainingTime}s</H2>
                )}
            </AnimatedCircularProgress>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height * 0.05,
    }
});

export default CircularTimer;
