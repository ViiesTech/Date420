import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Small } from '../utils/Text';
import { Like, MessageNotif, Notepad, Profile } from 'iconsax-react-native';
import { Color } from '../utils/Colors';
import { useNavigation } from '../utils/NavigationContext';

const { width, height } = Dimensions.get('screen');

const Footer = ({activeIndex}: {activeIndex: number}) => {
    const { navigate } = useNavigation();

    return (
        <>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigate('HotList')} style={{gap: 10, alignItems: 'center'}}>
                    <Notepad size={width * 0.06} color={activeIndex === 1 ? Color('primary') : Color('whiteText')} variant="Bold" />
                    <Small style={{color: activeIndex === 1 ? Color('primary') : Color('whiteText')}}>Hot List</Small>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Inbox')} style={{gap: 10, alignItems: 'center'}}>
                    <MessageNotif size={width * 0.06} color={activeIndex === 2 ? Color('primary') : Color('whiteText')} variant="Bold" />
                    <Small style={{color: activeIndex === 2 ? Color('primary') : Color('whiteText')}}>Chat</Small>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('MyMatch')} style={{gap: 10, alignItems: 'center'}}>
                    <Like size={width * 0.06} color={activeIndex === 3 ? Color('primary') : Color('whiteText')} variant="Bold" />
                    <Small style={{color: activeIndex === 3 ? Color('primary') : Color('whiteText')}}>My Match</Small>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Profile')} style={{gap: 10, alignItems: 'center'}}>
                    <Profile size={width * 0.06} color={activeIndex === 4 ? Color('primary') : Color('whiteText')} variant="Bold" />
                    <Small style={{color: activeIndex === 4 ? Color('primary') : Color('whiteText')}}>Profile</Small>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Footer;

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        backgroundColor: Color('background'),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: height * 0.01,
        zIndex: 1
    }
})