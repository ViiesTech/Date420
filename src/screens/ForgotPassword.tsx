import React, { useMemo, useState } from 'react'
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import Background from './utils/Background';
import { H1, Pera } from '../utils/Text';
import { Color } from '../utils/Colors';
import Input from '../components/Input';
import Toast from 'react-native-simple-toast';

import { Sms } from 'iconsax-react-native';
import { Button } from '../components/Button';
import { getEmailOnForgotPass } from '../APIManager';

const { width, height } = Dimensions.get('window');
const ForgotPassword = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const Form = () => {
        const [emailAddress, setEmailAddress] = useState('');
        return (
            <View>
                <H1 style={styles.commonForText}>Forgot password</H1>
                <Pera style={[styles.commonForText, { marginBottom: height * 0.05 }]}>Please enter your email to reset password</Pera>
                <Input
                    value={emailAddress}
                    label={true}
                    labelText='Enter Email address'
                    color={Color('primary')}
                    icon={<Sms size="25" color={Color('primary')} />}
                    placeholder='xyz@gmail.com'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onBlur={() => setEmail(emailAddress)}
                    onChange={(text: string) => setEmailAddress(text)}
                />
            </View>
        )
    }

    const handleForgotPassword = async () => {
        if (email.trim().length === 0) {
            Alert.alert("Email Required", "Please insert/enter a valid email address.", [{ text: "Okay" }])
            return;
        }

        setLoading(true);
        const request = await getEmailOnForgotPass(email, setLoading);
        if (request.status === 'success') {
            Alert.alert("OTP Sent", request.message, [
                {text: "Okay", onPress: () => navigation.replace("Signin")}
            ])
            // Toast.show(request.message, Toast.SHORT);
            // navigation.replace("OTP");
        }else {
            const errors = Object.keys(request.errors).map((key) => [key, request.errors[key]]);
            Alert.alert(request.message, errors[0][1][0]);
            setLoading(false);
        }
    }
    return (
        <Background dark={.60}>
            <View style={styles.layout}>
                {
                    useMemo(() => {
                        return <Form />
                    }, [])
                }
                <Button loading={loading} onPress={handleForgotPassword}>Next</Button>
            </View>
        </Background>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        alignSelf: 'center',
        height: height,
        paddingVertical: height * 0.1,
        display: 'flex',
        justifyContent: 'space-between',
        // backgroundColor: 'red'
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
    }
})