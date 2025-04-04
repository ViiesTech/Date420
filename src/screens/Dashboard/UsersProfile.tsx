import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { MessageNotif } from 'iconsax-react-native';
import { getProfile } from '../../APIManager';
import Loading from '../Loading';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');
const UsersProfile = ({ navigation, route }: { navigation: any, route: any }) => {
    const [profile, setProfile]: any = useState();
    const { user_id } = route?.params;

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        await getProfile(setProfile, user_id);
    }

    if (!profile) {
        return <Loading />
    }
    
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
                                <Image source={require('../../assets/images/icons8-speech-bubble-50.png')} style={{width: width * 0.08, height: width * 0.08}} />
                            </TouchableOpacity>
                        }
                    />
                    <Br space={0.05} />
                    <FastImage source={{ uri: profile?.user_picture }} style={styles.userProfilePhoto} />
                    <View style={{alignItems: 'center'}}>
                        <Br space={0.02} />
                        <H6 style={{color: Color('whiteText')}}>{profile?.name}</H6>
                        <Br space={0.01} />
                        <H6 style={{color: Color('whiteText')}}>{profile?.user_info?.your_age}</H6>
                        <Br space={0.05} />
                        
                        <H4>About Me</H4>

                        <Br space={0.02} />
                        <Pera style={{color: Color('whiteText'), textAlign: 'justify', width: width * 0.7}}>
                            {profile?.user_info?.about_me}
                        </Pera>
                        <Br space={0.05} />

                        <H4>Appearance</H4>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Ethnicity</Pera>
                            <H6>{profile?.user_info?.ethnicity}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Body Type</Pera>
                            <H6>{profile?.user_info?.body_type}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Hair Color</Pera>
                            <H6>{profile?.user_info?.hair_color}</H6>
                        </View>

                        <Br space={0.05} />

                        <H4>Life Style</H4>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Hobbies</Pera>
                            <View style={{alignItems: 'flex-end'}}>
                                {JSON.parse(profile?.user_info?.life_style)?.map((val: any) => <H6>{val}</H6>)}
                            </View>
                        </View>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Smoking</Pera>
                            <H6>{profile?.user_info?.smoking}</H6>
                        </View>
                        <Br space={0.02} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.7}}>
                            <Pera style={{color: Color('whiteText')}}>Drinking</Pera>
                            <H6>{profile?.user_info?.drinking}</H6>
                        </View>
                    </View>
                    <Br space={0.07} />
                </View>
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