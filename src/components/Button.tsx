import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { Color } from '../utils/Colors';

const { width, height } = Dimensions.get('window');

interface Props {
    children: any,
    style?: object,
    fontSize?: number,
    onPress: any,
    icon?: any,
    loading?: boolean
}

const Loading = ({color}: {color?: any}) => {
    return <ActivityIndicator color={color || Color('btnText')} />
}

export const Button = ({loading, children, style, fontSize, onPress}: Props) => {
    return (
        <TouchableOpacity disabled={loading} onPress={() => onPress()} style={[styles.btn, style]}>
            {
                loading
                ?
                <Loading />
                :
                <Text style={{ fontSize: RFValue(fontSize || 24, height), color: Color("btnText"), textAlign: 'center', fontFamily: 'OrelegaOne' }}>{children}</Text>
            }
        </TouchableOpacity>
    )
}

export const ButtonWithIcon = ({icon, loading, children, style, fontSize, onPress}: Props) => {
    return (
        <TouchableOpacity disabled={loading}  onPress={() => onPress()} style={[styles.btn, styles.btnWithIcon, style]}>
            {
                loading
                ?
                <Loading />
                :
                <>
                    {icon}
                    <Text style={{ fontSize: RFValue(fontSize || 24, height), color: Color("btnText"), fontFamily: 'OrelegaOne' }}>{children}</Text>
                </>
            }
        </TouchableOpacity>
    )
}

export const ButtonOuline = ({loading, children, style, fontSize, onPress}: Props) => {
    return (
        <TouchableOpacity disabled={loading}  onPress={() => onPress()} style={[styles.btnOutline, style]}>
            {
                loading
                ?
                <Loading color={Color('primary')} />
                :
                <Text style={{ fontSize: RFValue(fontSize || 24, height), color: Color("primary"), textAlign: 'center', fontFamily: 'OrelegaOne' }}>{children}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Color('primary'),
        borderRadius: 10,
        paddingVertical: height * 0.02
    },
    btnOutline: {
        borderRadius: 10,
        paddingVertical: height * 0.02,
        borderColor: Color('primary'),
        borderWidth: 1
    },
    btnWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: width * 0.04
    }
})