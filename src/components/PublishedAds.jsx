import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, TouchableOpacity, View } from 'react-native';
import { getMyAds, getPublishedAds } from '../APIManager';
import { Small } from '../utils/Text';
import { Color } from '../utils/Colors';

const { width, height } = Dimensions.get('window');
const PublishedAds = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [ ads, setAds ] = useState();

    const Ad = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('MyAdDetails', {ad_id: item?.id, shouldNotOwn: true})} style={{borderColor: Color('primary'), borderWidth: 0.5, marginBottom: height * 0.03, marginRight: width * 0.03}}>
                <ImageBackground resizeMode='cover' style={{width: width * 0.6, paddingTop: height * 0.1, paddingBottom: height * 0.015, paddingHorizontal: width * 0.03, justifyContent: 'flex-end' }} source={{ uri: item?.get_image?.url }}>
                    <View>
                        <Small numberOfLines={1} style={{color: Color('whiteText')}}>{item?.title}</Small>
                        <Small numberOfLines={1}>{item?.desc}</Small>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        if (isFocused) loadAds();
    }, [isFocused])

    const loadAds = async () => {
        await getPublishedAds(setAds);
    }

    return (
        <View>
            {
                ads && ads?.length > 0
                ?
                ads?.length === 1
                ?
                <TouchableOpacity onPress={() => navigation.navigate('MyAdDetails', { ad_id: ads[0]?.id, shouldNotOwn: true })} style={{ borderColor: Color('primary'), borderWidth: 0.5, marginBottom: height * 0.03 }}>
                    <ImageBackground resizeMode='cover' style={{ width: width * 0.9, paddingTop: height * 0.1, paddingBottom: height * 0.015, paddingHorizontal: width * 0.03, justifyContent: 'flex-end' }} source={{ uri: ads[0]?.get_image?.url }}>
                        <View>
                            <Small numberOfLines={1} style={{ color: Color('whiteText') }}>{ads[0]?.title}</Small>
                            <Small numberOfLines={1}>{ads[0]?.desc}</Small>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
                :
                <FlatList
                    horizontal
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={ads}
                    renderItem={({ item }) => <Ad item={item} />}
                    keyExtractor={(item, index) => index}
                />
                :
                <></>
            }
        </View>
    )
}

export default PublishedAds;