import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Lock1, Sms } from 'iconsax-react-native';
import { Color } from '../utils/Colors';
import Background from './utils/Background';
import { H1, H6, Pera } from '../utils/Text';
import { connectFirebase } from '../utils/firebase';

import Br from '../components/Br';
import Input from '../components/Input';
import { Button } from '../components/Button';
import { onUserLogin } from '../APIManager';

import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Purchases from 'react-native-purchases';

const { width, height } = Dimensions.get('window');
const Login = ({ navigation }) => {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) isTokenAvaialble();
    }, [isFocused])

   


    const isTokenAvaialble = async () => {
        const userSession = await AsyncStorage.getItem("session");
        if (userSession) {
            await AsyncStorage.setItem("token", userSession);
            navigation.replace("HotList")
        }
    }

    const Form = () => {
        const [rememberMe, setRememberMe] = useState(false);
        const [loading, setLoading] = useState(false);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [fcm, setFCM] = useState('');

        useEffect(() => {
            getFireBaseConnection();
        }, []);

        const getFireBaseConnection = async () => {
            try {
                const token = await connectFirebase();
                if (token) {
                    setFCM(token);
                }
            }catch (err){
                console.log(err);
            }
        }

        const handleUserLogin = async () => {
            if (email.trim().length === 0) {
                Alert.alert("Email Required", "Please insert/enter a valid email address.", [{ text: "Okay" }])
                return;
            }
            if (password.trim().length === 0) {
                Alert.alert("Password Required", "Please insert/enter your exact password.", [{ text: "Okay" }])
                return;
            }

            setLoading(true);
            const request = await onUserLogin(email, password, fcm, setLoading);
            // IF LOGIN SUCCESSFUL
             console.log('login rsponse',request)
            if (request.access_token) {

                // SETUP TOKEN
                await AsyncStorage.setItem(
                    "token",
                    JSON.stringify(request)
                );

                // IF USER PROFILE HAS NOT BEEN SETUP
                if (!request.update_profile) {
                    navigation.replace("EditProfile", { name: request.name });
                    Toast.show('Profile is not Setup Yet', Toast.SHORT);
                    return;
                } else { // OTHERWISE REDIRECT TO HOTLIST
                    // IF USER CHECKS THE REMEMBER ME CHECKBOX
                    if (rememberMe) {
                        await AsyncStorage.setItem(
                            "session",
                            JSON.stringify(request)
                        );
                    } else { // IF NOT CHECKED, REMOVE THE SESSION
                        await AsyncStorage.removeItem("session");
                    }

                    navigation.replace("HotList");
                    Toast.show('Login Successful', Toast.SHORT);
                }

            } else {
                setLoading(false);
                Alert.alert(request.message, "Failed to login due to invalid username or password, please retry!!", [{ text: "Okay" }])
            }
        }
        return (
            <View style={{ zIndex: 1 }}>
                <H1 style={styles.commonForText}>Welcome Back!</H1>
                <Pera style={[styles.commonForText, { marginBottom: height * 0.05 }]}>Enter your account details to login.</Pera>
                <Input
                    value={email}
                    label={true}
                    labelText='Email address'
                    color={Color('primary')}
                    icon={<Sms size="25" color={Color('primary')} />}
                    placeholder='xyz@gmail.com'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(emailAddress) => setEmail(emailAddress)}
                />
                <Input
                    value={password}
                    label={true}
                    secure={true}
                    secureIcon={true}
                    labelText='Password'
                    color={Color('primary')}
                    icon={<Lock1 size="25" color={Color('primary')} />}
                    placeholder='Enter your password'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(secretPassword) => setPassword(secretPassword)}
                />
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: Platform.OS === 'ios' ? height * 0.01 : 0
                }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: Platform.OS === 'ios' ? 10 : 0,
                    }}>
                        <CheckBox
                            style={{ borderRadius: 10 }}
                            disabled={false}
                            value={rememberMe}
                            onValueChange={(event) => setRememberMe(event)}
                            tintColor={Color('primary')}
                            tintColors={{ true: Color('primary'), false: Color('primary') }}
                        />
                        <Pera style={{ color: Color('primary') }}>Remember Me</Pera>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Pera style={{ color: Color('primary'), textDecorationLine: 'underline' }}>Forgot Password?</Pera>
                    </TouchableOpacity>
                </View>
                <Br space={0.04} />
                <Button loading={loading} onPress={handleUserLogin}>Login</Button>
            </View>
        )
    }

    return (
        <Background dark={.60}>
            <View style={styles.layout}>
                <Form />
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <H6 style={{ color: Color('whiteText'), fontFamily: "Jakarta", justifyContent: 'center' }}>
                            Don't have an account?
                        </H6>
                        <H6 style={{ color: Color('primary') }}> Signup</H6>
                    </View>
                </TouchableOpacity>
            </View>
        </Background>
    )
}

export default Login;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        alignSelf: 'center',
        height: height * 0.85,
        paddingTop: height < 600 ? height * 0.04 : height * 0.07,
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
    }
})