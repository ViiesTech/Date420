import React, { lazy, useEffect, useState } from 'react'
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-simple-toast';
import Background from './utils/Background';
import { Color } from '../utils/Colors';
import Input from '../components/Input';
import { H1, H6, Pera } from '../utils/Text';

import { Lock1, ProfileCircle, SecurityUser, Sms } from 'iconsax-react-native';
import Br from '../components/Br';
import { Button } from '../components/Button';
import { useSelector } from 'react-redux';
import { Message } from '../utils/Alert';
import { onUserSignup } from '../APIManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectFirebase } from '../utils/firebase';

const Dropdown = lazy(() => import('./utils/Dropdown'));

const { width, height } = Dimensions.get('window');
const Signup = ({ navigation }: { navigation: any }) => {
    const genderList = useSelector(({app}: {app: any}) => app?.gender);

    const Form = () => {
        const patterns = useSelector(({app}: {app: any}) => app?.patterns);
        const [genders, setGenders]: any = useState([]);
        const [loading, setLoading] = useState(false);
        const [name, setName] = useState('');
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [gender, setGender] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [fcm, setFCM] = useState('');

        const nameReg = new RegExp(patterns?.name, '');
        const emailReg = new RegExp(patterns?.email, 'g');
        const passwordReg = new RegExp(patterns?.password, '');

        useEffect(() => {
            const arr = Object.keys(genderList).map((key: any) => {return {"label": genderList[key],"value": key}});
            setGenders(arr);
        }, [genderList])
        useEffect(() => {
            getFireBaseConnection();
        }, []);

        const getFireBaseConnection = async () => {
            const token: any = await connectFirebase();
            if (!token) {
                getFireBaseConnection();
            }else {
                setFCM(token);
            }
        }

        const checkValidations = () => {

            // NAME PART
            if (name.length === 0) {
                Message("name is required", "Please fill all the fields!");
                return;
            }
            if (!nameReg.test(name)) {
                Message("Invalid Name", "Name can only contains characters!");
                return;
            }
            
            // USERNAME PART
            if (username.length === 0) {
                Message("Username is required", "Please fill all the fields!");
                return;
            }

            // EMAIL PART
            if (email.length === 0) {
                Message("Email is required", "Please fill all the fields!");
                return;
            }
            if (!emailReg.test(email)) {
                Message("Invalid Email", "Please enter your valid email address!");
                return;
            }

            // GENDER PART
            if (gender.length === 0) {
                Message("Gender is required", "Please fill all the fields!");
                return;
            }


            // PASSWORD PART
            if (password.length === 0) {
                Message("Password is required", "Please fill all the fields!");
                return;
            }
            if (!passwordReg.test(password)) {
                Message("Password is Weak", "Your entered password is weak, please pick a strong password!");
                return;
            }

            // CONFIRM PASSWORD PART
            if (confirmPassword.length === 0) {
                Message("Confirm Password is required", "Please fill all the fields!");
                return;
            }
            if (confirmPassword !== password) {
                Message("Password Mismatched", "Password and confirm password are not equal!");
                return;
            }

            return true;
        }
        const signup = async () => {
            const isValidData = checkValidations();
            if (isValidData) {
                setLoading(true);
                const request = await onUserSignup(name, username, email, gender, password, fcm, setLoading);
                if (request.access_token) {
                    Toast.show('Account has been created!!', Toast.SHORT);
                    await AsyncStorage.setItem(
                        "token",
                        JSON.stringify(request)
                    );
                    navigation.replace('EditProfile', {name: name});
                }else {
                    const errors = Object.keys(request.errors).map((key) => [key, request.errors[key]]);
                    Alert.alert(request.message, errors[0][1][0]);
                    setLoading(false);
                }
            }
        }
        return (
            <View>
                <H1 style={styles.commonForText}>Signup</H1>
                <Pera style={[styles.commonForText, { marginBottom: height * 0.05 }]}>Enter your account details to Signup</Pera>
                <Input
                    value={name}
                    label={true}
                    labelText='Name'
                    color={Color('primary')}
                    icon={<ProfileCircle size="25" color={Color('primary')} />}
                    placeholder='Full Name'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(fullName: string) => setName(fullName)}
                />
                <Input
                    value={username}
                    label={true}
                    labelText='Username'
                    color={Color('primary')}
                    icon={<SecurityUser size="25" color={Color('primary')} />}
                    placeholder='A Unique Username'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(user_name: string) => setUsername(user_name)}
                />
                <Input
                    value={email}
                    label={true}
                    labelText='Email address'
                    color={Color('primary')}
                    icon={<Sms size="25" color={Color('primary')} />}
                    placeholder='xyz@gmail.com'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(email_address: string) => setEmail(email_address)}
                />
                <Dropdown
                    icon
                    defaultStyle
                    data={genders}
                    style={{ marginBottom: height * 0.015 }}
                    selectedValue={gender}
                    onValueChange={(value: React.SetStateAction<string>) => setGender(value)}
                    label="Gender"
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
                    onChange={(password: string) => setPassword(password)}
                />
                <Input
                    value={confirmPassword}
                    label={true}
                    secure={true}
                    secureIcon={true}
                    labelText='Confirm Password'
                    color={Color('primary')}
                    icon={<Lock1 size="25" color={Color('primary')} />}
                    placeholder='Re enter password'
                    placeholderColor={Color('primary_100')}
                    style={{ marginBottom: height * 0.015 }}
                    onChange={(confirm_password: string) => setConfirmPassword(confirm_password)}
                />
                <Br space={0.05} />
                <Button onPress={signup} loading={loading}>Signup</Button>
            </View>
        )
    }
    return (
        <Background dark={.60}>
            <View style={styles.layout}>
                <Form />
                <Br space={0.02} />
                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <H6 style={{ color: Color('whiteText'), fontFamily: "Jakarta", justifyContent: 'center' }}>
                            Already have an account?
                        </H6>
                        <H6 style={{ color: Color('primary') }}> Login</H6>
                    </View>
                </TouchableOpacity>
                <Br space={0.03} />
            </View>
        </Background>
    )
}

export default Signup;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        flex: 1,
        alignSelf: 'center',
        paddingTop: height < 600 ? 0 : height * 0.03,
        display: 'flex',
        justifyContent: 'space-between'
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
    }
})