import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H5, H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Edit } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { getProfile } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('window');
const Profile = ({ navigation }: { navigation: any }) => {
    const [profile, setProfile]: any = useState();

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        await getProfile(setProfile);
    };
    const SectionA = () => {
        return (
            <>
                <Br space={0.02} />
                <H6 style={{ color: Color('whiteText') }}>{profile?.name}</H6>
                <Br space={0.01} />
                <H6 style={{ color: Color('whiteText') }}>{profile?.user_info?.your_age}</H6>
                <Br space={0.02} />
                <H5>{profile?.user_info?.gender}</H5>
                <Br space={0.02} />
                <H5>Looking for {profile?.user_info?.looking_for}</H5>
                <Br space={0.02} />
                <H5>Match desired</H5>
                <Br space={0.01} />
                <Pera style={{ color: Color('whiteText') }}>{profile?.user_info?.desired_age_from}-{profile?.user_info?.desired_age_to}y.o</Pera>
                <Br space={0.05} />
            </>
        )
    }
    const SectionB = () => {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <H4>About Me</H4>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
                        <Edit
                            size="25"
                            color={Color('primary')}
                            variant="Bold"
                        />
                    </TouchableOpacity> */}
                </View>
                <Br space={0.02} />
                <Pera style={{ color: Color('whiteText'), textAlign: 'justify', width: width * 0.7 }}>
                    {profile?.user_info?.about_me}
                </Pera>
                <Br space={0.05} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <H4>Appearance</H4>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
                        <Edit
                            size="25"
                            color={Color('primary')}
                            variant="Bold"
                        />
                    </TouchableOpacity> */}
                </View>
                <Br space={0.02} />
            </>
        )
    }
    const SectionC = () => {
        return (
            <>
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

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <H4>Life Style</H4>
                </View>
            </>
        )
    }
    const SectionD = () => {
        return (
            <>
                <Br space={0.02} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.7 }}>
                    <Pera style={{ color: Color('whiteText') }}>Hobbies</Pera>
                    <View style={{ alignItems: 'flex-end' }}>
                        {JSON.parse(profile?.user_info?.life_style).map((val: any) => <H6>{val}</H6>)}
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
            </>
        )
    }
    const SectionE = () => {
        return (
            <>
                <Br space={0.05} />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <H4>Here for</H4>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
                        <Edit
                            size="25"
                            color={Color('primary')}
                            variant="Bold"
                        />
                    </TouchableOpacity> */}
                </View>
                <Br space={0.02} />
                {
                    JSON.parse(profile?.user_info?.here_for).map((val: any) => {
                        return (
                            <H6 style={{ color: Color('whiteText') }}>{val}</H6>
                        )
                    })
                }
            </>
        )
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
                        hideMenu="true"
                        headerText="Profile"
                        showMenu
                        backBtn
                    />
                    <Br space={0.06} />
                    <Image source={{ uri: profile?.user_picture }} style={styles.userProfilePhoto} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                        data={[
                            <SectionA />,
                            <SectionB />,
                            <SectionC />,
                            <SectionD />,
                            <SectionE />,
                        ]}
                        renderItem={({ item }) => <View style={{alignItems: 'center'}}>{item}</View>}
                        keyExtractor={(item, index: any) => index}
                    />
                    <Br space={0.1} />
                </View>
            </Background>
            <Footer activeIndex={4} />
        </>
    )
}

export default Profile;

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