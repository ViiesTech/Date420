import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, ImageBackground, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H2, H3, H4, H5, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Add, ArrowLeft, Edit, Heart, MaskLeft, Profile2User, RecordCircle } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { Button, ButtonOuline, ButtonWithIcon } from '../../components/Button';
import { AvatarList } from '../../components/GroupAvatar';
import { getEventDetails } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('screen');
const GetTickets = ({ navigation, route }) => {
    const { phone, url } = route?.params;

    return (
        <>
            <Background dark={1}>
                <View style={{width: width * 0.9, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>
                    <View>
                        <View style={{ 
                            borderRadius: 20, 
                            paddingHorizontal: width * 0.01, 
                            paddingVertical: height * 0.03, 
                            borderColor: Color('primary_200'), 
                            borderWidth: 1, 
                            width: width * 0.8,
                            backgroundColor: Color('primary_opactiy_15'),
                            alignItems: 'center'
                        }}>
                            <H6>Contact Info</H6>
                            <Br space={0.02} />
                            <Small numberOfLines={1}>Phone: {phone}</Small>
                            <TouchableOpacity onPress={() => Linking.openURL(url)}>
                                <Small numberOfLines={1}>Website: {url}</Small>
                            </TouchableOpacity>
                        </View>
                        <Br space={0.03} />
                        <Button onPress={() => navigation.goBack()} style={{width: width * 0.4, alignSelf: 'center'}}>Back</Button>
                    </View>
                </View>
            </Background>
        </>
    )
}

export default GetTickets;