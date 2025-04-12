import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H5, H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { getProfile, onBlockUser, onReportAnyUser } from '../../APIManager';
import Loading from '../Loading';
import FastImage from 'react-native-fast-image';
import ConfirmationModal from '../../components/ConfirmationModal';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');
const UsersProfile = ({ navigation, route }: { navigation: any, route: any }) => {
    const [profile, setProfile]: any = useState();
    const [reportModal, setReportModal] = useState(false)
    const [actionType, setActionType] = useState('')
    const [message, setMessage] = useState('')
    const { user_id } = route?.params;


    console.log(message)

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        await getProfile(setProfile, user_id);
    }

    if (!profile) {
        return <Loading />
    }

    const onReportPress = async () => {
        setReportModal(true)
    }

    const onConfirm = async () => {
        let res;
      
        if (actionType === 'Report') {
          res = await onReportAnyUser(user_id, message);
        } else if (actionType === 'Block') {
            // alert('hh')
          res = await onBlockUser(user_id); 
        }

        console.log('block',res)
      
        if (res?.status === 'success') {
          Toast.show(res.message, Toast.SHORT);
          setReportModal(false);
          setMessage('');
        } else {
          Toast.show(res?.message || 'Something went wrong', Toast.SHORT);
        }
      };

    return (
        <>
            <Background dark={1}>
                <View>
                    <Header
                        navigation={navigation}
                        backBtn
                        showSecondIcon
                        headerText="My Match"
                        hideMenu="required"
                        secondIcon={
                            <TouchableOpacity onPress={() => navigation.navigate('Chat', { photo: profile?.user_picture, name: profile?.name, user_id: user_id })}>
                                {/* <MessageNotif
                                    size="25"
                                    color={Color('primary')}
                                    variant="Bold"
                                /> */}
                                <Image source={require('../../assets/images/icons8-speech-bubble-50.png')} style={{ width: width * 0.08, height: width * 0.08 }} />
                            </TouchableOpacity>
                        }
                    />
                    <Br space={0.05} />
                    <FastImage source={{ uri: profile?.user_picture }} style={styles.userProfilePhoto} />
                    <View style={{ alignItems: 'center' }}>
                        <Br space={0.02} />

                        <Br space={0.01} />
                        <H6 style={{ color: Color('whiteText') }}>{profile?.name}</H6>
                        <Br space={0.01} />
                        <H6 style={{ color: Color('whiteText') }}>{profile?.user_info?.your_age}</H6>
                        <Br space={0.01} />
                        <TouchableOpacity onPress={() => {
                            setActionType('Report')
                            onReportPress()
                        }}>
                            <H5>Report</H5>
                        </TouchableOpacity>
                        <Br space={0.01} />
                        <TouchableOpacity onPress={() => {
                            setActionType('Block')
                            onReportPress()
                        }}>
                            <H5>Block</H5>
                        </TouchableOpacity>
                        <Br space={0.05} />
                        <H4>About Me</H4>
                        <Br space={0.02} />
                        <Pera style={{ color: Color('whiteText'), textAlign: 'justify', width: width * 0.7 }}>
                            {profile?.user_info?.about_me}
                        </Pera>
                        <Br space={0.05} />

                        <H4>Appearance</H4>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Ethnicity</Pera>
                            <H6>{profile?.user_info?.ethnicity}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Body Type</Pera>
                            <H6>{profile?.user_info?.body_type}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Hair Color</Pera>
                            <H6>{profile?.user_info?.hair_color}</H6>
                        </View>

                        <Br space={0.05} />

                        <H4>Life Style</H4>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Hobbies</Pera>
                            <View style={{ alignItems: 'flex-end' }}>
                                {JSON.parse(profile?.user_info?.life_style)?.map((val: any) => <H6>{val}</H6>)}
                            </View>
                        </View>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Smoking</Pera>
                            <H6>{profile?.user_info?.smoking}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7 }}>
                            <Pera style={{ color: Color('whiteText') }}>Drinking</Pera>
                            <H6>{profile?.user_info?.drinking}</H6>
                        </View>
                    </View>
                    <Br space={0.07} />
                </View>
                <ConfirmationModal
                    visible={reportModal}
                    input={actionType === 'Report'}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    modalText={`Are you sure you want to ${actionType} this user?`}
                    onCancel={() => {
                        setReportModal(false);
                        setMessage('');
                    }}
                    onConfirm={onConfirm}
                    onRequestClose={() => {
                        setReportModal(false);
                    }}
                />
            </Background>
        </>
    )
}

export default UsersProfile;

const styles = StyleSheet.create({
    userProfilePhoto: {
        borderRadius: 6,
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderColor: Color('primary'),
        borderWidth: 1
    }
})