import React from 'react';
import { Dimensions, Text } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { Color } from './Colors';

const { height } = Dimensions.get('window');

interface Props {
    children: any,
    style?: object,
    numberOfLines?: number
}

const standardHeight = height < 600 ? 800 : 700;

export const H1 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(39, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

export const H2 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(30, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

export const H3 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(27, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

export const H4 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(25, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

export const H5 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(20, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

export const H6 = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(17, standardHeight), fontFamily: 'OrelegaOne' }, style]}>{children}</Text>
    )
}

// PERAGRAPH
export const Pera = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(14, standardHeight), fontFamily: "Jakarta" }, style]}>{children}</Text>
    )
}

export const Small = ({children, numberOfLines, style}: Props) => {
    return (
        <Text numberOfLines={numberOfLines} style={[{ color: Color('primary'), fontSize: RFValue(12, standardHeight), fontFamily: "Jakarta" }, style]}>{children}</Text>
    )
}