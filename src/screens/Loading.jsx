import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Color } from '../utils/Colors';

const Loading = () => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Color('background')}}>
            <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 70} color={Color('primary')} />
        </View>
    )
}

export default Loading;