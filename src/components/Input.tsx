import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Color } from '../utils/Colors';
import { Pera, Small } from '../utils/Text';
import { Eye, EyeSlash } from 'iconsax-react-native';

const { width, height } = Dimensions.get('window');

interface Props {
    icon?: any,
    label?: boolean,
    labelText?: string,
    color?: string,
    placeholder?: string,
    placeholderColor?: string,
    style?: object,
    secure?: boolean,
    secureIcon?: boolean,
    numberOfLines?: number,
    onChange?: any,
    value?: any,
    keyboardType: string;
    onBlur?: any,
    secondIcon?: any,
    defaultValue?: any
}

const Input = ({keyboardType,defaultValue, onBlur, secure, icon, label, labelText, color, placeholder, placeholderColor, style, secureIcon, numberOfLines, onChange, value, secondIcon}: Props) => {
    const [ toggleSecure, setToggleSecure ] = useState(secure);
    return (
        <>
            {label && <Small style={{
                color: color, 
                fontFamily: 'Manrope-font',
                marginBottom: height * 0.008,
                marginLeft: width * 0.03
            }}>{labelText}</Small>}
            <View style={[styles.input, style, { alignItems: icon ? 'center' : 'flex-start' }]}>
                <View style={{
                    display: 'flex',
                    alignItems: icon ? 'center' : 'flex-start',
                    flexDirection: 'row',
                    gap: 10,
                    flex: 1,
                }}>
                    {icon}
                    <TextInput keyboardType={keyboardType} defaultValue={defaultValue} onBlur={onBlur} value={value} onChangeText={(value) => onChange(value)} multiline={numberOfLines && numberOfLines > 0 ? true : false} numberOfLines={numberOfLines} secureTextEntry={toggleSecure} style={[styles.field, {color: color, textAlignVertical: numberOfLines && numberOfLines > 0 ? 'top' : 'center'}]} placeholder={placeholder} placeholderTextColor={placeholderColor} />
                </View>
                {
                    secureIcon
                    ?
                    toggleSecure 
                    ?
                    <TouchableOpacity onPress={() => setToggleSecure(!toggleSecure)}>
                        <Eye size="25" color={color} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setToggleSecure(!toggleSecure)}>
                        <EyeSlash size="25" color={color} />
                    </TouchableOpacity>
                    :null
                }
                {secondIcon}
            </View>
        </>
    )
}

export default Input;

const styles = StyleSheet.create({
    input: {
        borderColor: Color('primary'),
        borderWidth: 1,
        paddingHorizontal: width * 0.04,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color('primary_opactiy_15'),
    },
    field: {
        flex: 1,
        minHeight: Platform.OS === 'ios' ? 60 : height * 0.07
    }
})