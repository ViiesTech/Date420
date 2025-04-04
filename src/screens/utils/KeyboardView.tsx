import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

interface Props {
    children: any
}

const KeyboardView = ({children}: Props) => {
    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0}>
            {children}
        </KeyboardAvoidingView>
    )
}

export default KeyboardView;