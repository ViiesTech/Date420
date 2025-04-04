import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native';
import Background from './utils/Background';
import { H1, Pera } from '../utils/Text';
import { Color } from '../utils/Colors';
import Input from '../components/Input';

import { Lock1 } from 'iconsax-react-native';
import { Button } from '../components/Button';

const { width, height } = Dimensions.get('window');
const ResetPassword = ({ navigation }: { navigation: any }) => {
    const Form = () => {
        return (
            <View>
                <H1 style={styles.commonForText}>Reset Password</H1>
                <Pera style={[styles.commonForText]}>Please enter your new </Pera>
                <Pera style={[styles.commonForText, { marginBottom: height * 0.05 }]}>password to reset password</Pera>
                <Input
                    label={true}
                    secure={true}
                    secureIcon={true}
                    labelText='New Password'
                    color={Color('primary')}
                    placeholder='Enter your password'
                    placeholderColor={Color('primary_100')}
                    icon={<Lock1 size="25" color={Color('primary')} />}
                    style={{ marginBottom: height * 0.015 }}
                />
                <Input
                    label={true}
                    secure={true}
                    secureIcon={true}
                    labelText='Confirm Password'
                    color={Color('primary')}
                    placeholder='Re enter your password'
                    placeholderColor={Color('primary_100')}
                    icon={<Lock1 size="25" color={Color('primary')} />}
                    style={{ marginBottom: height * 0.015 }}
                />
            </View>
        )
    }
    return (
        <Background dark={.60}>
            <View style={styles.layout}>
                <Form />
                <Button onPress={() => navigation.navigate("Signin")}>Next</Button>
            </View>
        </Background>
    )
}

export default ResetPassword;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        alignSelf: 'center',
        height: height,
        paddingVertical: height * 0.1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
    }
})