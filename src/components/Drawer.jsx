import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { hideDrawer } from '../redux/Reducers/drawerSlice';
import Toast from 'react-native-simple-toast';
import { Color } from '../utils/Colors';
import { ArrowLeft, ArrowRight, Card, Cards, Coin1, Home, MessageNotif, Notification, Profile, Profile2User, ProfileTick, Reserve } from 'iconsax-react-native';
import { H5, H6, Pera } from '../utils/Text';
import Br from './Br';
import { ButtonWithIcon } from './Button';
import { useNavigation } from '../utils/NavigationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const { width, height } = Dimensions.get('screen');

const Drawer = () => {
    // Create animated value for the horizontal position
    const slideAnim = new Animated.Value(-width);
    const showDrawer = useSelector(({drawer}) => drawer?.drawer);
    const dispatch = useDispatch();
    const { navigate } = useNavigation();
    
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showDrawer ? 0 : -width, // End position (i.e., slide to the right side)
            duration: 1000, // Duration of the animation in milliseconds
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [slideAnim, showDrawer]);
    
    if (!showDrawer) return;

    const Header = () => {
        const [ user, setUser ] = useState({
            photo: "",
            name: "",
            email: ""
        });
        useEffect(() => {
            if (user.name.length === 0) getUser();
        }, [user]);

        const getUser = async () => {
            const loginSession = await AsyncStorage.getItem("token");
            const details = JSON.parse(loginSession);
            setUser({
                photo: details?.profile_photo,
                name: details?.name,
                email: details?.email,
            });
        }
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => dispatch(hideDrawer())}>
                    <ArrowLeft size="35" color={Color('whiteText')} variant="Bold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('go to profile')}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: width * 0.05
                    }}>
                        <View>
                            <H5 style={{ textAlign: 'right', color: Color('whiteText') }}>{user?.name}</H5>
                            <Pera style={{ textAlign: 'right', color: Color('primary_100') }}>{user?.email}</Pera>
                        </View>
                        {user?.photo && <Image source={{ uri: user?.photo }} style={styles.userProfilePhoto} />}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    const DrawerItem = ({ icon, label, screen }) => {
        const clicked = () => {
            navigate(screen);
            dispatch(hideDrawer());
        }
        return (
            <>
                <TouchableOpacity onPress={clicked}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                        paddingVertical: height * 0.01
                    }}>
                        {icon}
                        <H6 style={{ color: Color('primary') }}>{label}</H6>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <Animated.View
            style={[
                styles.drawer,
                {
                    transform: [{ translateX: slideAnim }], // Apply the animated value to translateX
                },
            ]}
        >
            {/* <Image source={require('../assets/images/side_menu.png')} style={styles.backgroundImage} /> */}

            <View style={[styles.darkness, {opacity: 1}]}></View>
            {/* RED SHADES */}
            <Image source={require('../assets/images/shade2.jpg')} style={styles.shadeTop} />
            <Image source={require('../assets/images/shade.png')} style={styles.shadeBottom} />
            {/* RED SHADES END */}

            
            <View style={{width: width * 0.9, paddingTop: height * 0.07, alignSelf: 'center', zIndex: 1}}>
                <Header />
                <Br space={0.03} />
                <DrawerItem 
                    icon={<Home size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Home"
                    screen="HotList"
                />
                <DrawerItem 
                    icon={<Profile size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Profile"
                    screen="Profile"
                />
                {/* <DrawerItem 
                    icon={<Notification size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Notification"
                    screen="Notifications"
                /> */}
                <DrawerItem 
                    icon={<MessageNotif size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Inbox"
                    screen="Inbox"
                />
                <DrawerItem 
                    icon={<Profile2User size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Groups"
                    screen="SuggestedGroups"
                />
                <DrawerItem 
                    icon={<Reserve size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="Events"
                    screen="Events"
                />
                <DrawerItem 
                    icon={<ProfileTick size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="My Match"
                    screen="MyMatch"
                />
                <DrawerItem 
                    icon={<Card size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="My Subscription"
                    screen="MySubscription"
                />
                <DrawerItem 
                    icon={<Coin1 size="25" color={Color('whiteText')} variant="Bold"/>}
                    label="My Preferences"
                    screen="MyPreferences"
                />
            </View>
            <ButtonWithIcon 
                style={{ position: 'absolute', bottom: height * 0.08, left: width * 0.05, backgroundColor: Color('primary_200'), width: width * 0.6, zIndex: 1 }} 
                onPress={async () => {
                    dispatch(hideDrawer());
                    await AsyncStorage.removeItem('session');
                    await AsyncStorage.removeItem('token');
                    Toast.show('Logout Successful', Toast.SHORT);
                    RNRestart.restart();
                }}
                fontSize={20}
                icon={<ArrowRight size="25" color={Color('background')} variant="Bold"/>}
            >Logout</ButtonWithIcon>
        </Animated.View>
    )
}

export default Drawer;

const styles = StyleSheet.create({
    drawer: {
        width: width,
        height: height,
        right: 0,
        top: 0,
        position: 'absolute',
        zIndex: 10,
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height,
    },
    userProfilePhoto: {
        borderRadius: 6,
        width: 80,
        height: 80
    },
    darkness: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: Color('background'),
        zIndex: 1
    },
    shadeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height * 0.3,
        zIndex: 1
    },
    shadeBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height * 0.3,
        zIndex: 1,
        opacity: 0.5
    },
})