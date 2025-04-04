import React from 'react';
import { Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const Br = ({space}: {space: number}) => {
    return (
        <View style={{height: height * space, opacity: 0, overflow: 'visible', zIndex: 0}}></View>
    )
}

export default Br;