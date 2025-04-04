import React from 'react';
import { Dimensions, View } from 'react-native';
import { Color } from '../utils/Colors';

const { height } = Dimensions.get('window');

const Hr = ({style}: {style?: any}) => {
    return (
        <View style={[{borderWidth: 0.15, borderColor: Color('primary_300'), marginVertical: height * 0.01}, style]}></View>
    )
}

export default Hr;