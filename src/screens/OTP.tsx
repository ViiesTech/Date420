import React from 'react'
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import Background from './utils/Background';
import { H1, Pera } from '../utils/Text';
import { Color } from '../utils/Colors';
import { Button } from '../components/Button';
import Br from '../components/Br';
import CircularTimer from '../utils/CircularTimer';
import OTPInput from '../utils/OTPInput';

const { width, height } = Dimensions.get('window');
const OTP = ({ navigation }: { navigation: any }) => {
    const handleTimeout = () => {
      console.log('OTP timeout occurred!');
      Alert.alert("OTP Timeout");
    };
    const Form = () => {
        return (
            <View>
                <H1 style={styles.commonForText}>OTP</H1>
                <Pera style={[styles.commonForText]}>
                    We have sent you an email containing
                </Pera>
                <Pera style={[styles.commonForText]}>
                    6 digits verification code. Please enter 
                </Pera>
                <Pera style={[styles.commonForText, { marginBottom: height * 0.05 }]}>
                    the code to verify your identity
                </Pera>
                <OTPInput inputs={6} onComplete={(enteredOTP: any) => Alert.alert("Entered OTP", enteredOTP)} />
                <Br space={0.05} />
                <CircularTimer duration={30} onTimeout={handleTimeout} />
            </View>
        )
    }
    return (
        <Background dark={.60}>
            <View style={styles.layout}>
                <Form />
                <Button onPress={() => navigation.navigate("ResetPassword")}>Next</Button>
            </View>
        </Background>
    )
}

export default OTP;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        alignSelf: 'center',
        minHeight: height * 0.9,
        paddingTop: height * 0.1,
        paddingBottom: height * 0.01,
        display: 'flex',
        justifyContent: 'space-between',
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
    },
    otpText: {
      marginTop: 20,
      fontSize: 18,
    },
    resendButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#007bff',
      borderRadius: 5,
    },
    resendButtonText: {
      color: '#fff',
      fontSize: 16,
    },
})