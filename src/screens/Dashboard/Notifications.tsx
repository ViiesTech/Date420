import React from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H5, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import Footer from '../../components/Footer';
import Hr from '../../components/Hr';

const { width, height } = Dimensions.get('window');
const Notifications = ({ navigation }: { navigation: any }) => {
    const ParticularNote = () => {
        return (
            <>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: height * 0.015}}>
                    <Image source={{ uri: "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2072" }} style={styles.notificationImage} />
                    <View style={{flexDirection: 'row', gap: 10, justifyContent: 'space-between'}}>
                        <View style={{width: width * 0.6}}>
                            <H6>New Match Alert</H6>
                            <Pera style={{color: Color('whiteText')}}>You got  a new match waiting to connect with you</Pera>
                            <Pera style={{color: Color('whiteText')}}>02:30 AM</Pera>
                        </View>
                        <View style={{backgroundColor: Color('primary'), borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 20, height: 20}}>
                            <Small style={{color: Color('btnText')}}>
                                1
                            </Small>
                        </View>
                    </View>
                </View>
            </>
        )
    }
    return (
        <>
            <Background dark={1}>
                <ScrollView alwaysBounceVertical showsVerticalScrollIndicator={false}>
                    <View>
                        <Header headerText="Notifications" />
                        <Br space={0.05} />
                        <H5 style={{color: Color('whiteText')}}>Today</H5>
                        <ParticularNote />
                        <ParticularNote />
                        <Hr />
                        <Br space={0.01} />
                        <H5 style={{color: Color('whiteText')}}>Yesterday</H5>
                        <ParticularNote />
                        <ParticularNote />
                        <Hr />
                        <Br space={0.01} />
                        <H5 style={{color: Color('whiteText')}}>October, 2024</H5>
                        <ParticularNote />
                        <ParticularNote />
                        <Br space={0.1} />
                    </View>
                </ScrollView>
            </Background>
            <Footer activeIndex={0} />
        </>
    )
}

export default Notifications;

const styles = StyleSheet.create({
    notificationImage: {
        borderRadius: 6,
        width: 60,
        height: 60,
        alignSelf: 'center',
    }
})