import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, Cards, Profile2User } from 'iconsax-react-native';
import { Button, ButtonOuline } from '../../components/Button';
import { useIsFocused } from '@react-navigation/native';
import { getMyAds } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('screen');
const MyAds = ({ navigation }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [ ads, setAds ]: any = useState();
    const Ad = ({ item, index }: { item?: any, index: number }) => {
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                    borderWidth: 1,
                    borderColor: Color('primary'),
                }}
                key={index}
                onPress={() => navigation.navigate('MyAdDetails', {ad_id: item?.id})}
                >
                    <View style={{
                    borderBottomWidth: 1,
                    borderColor: Color('primary'),
                    borderRadius: 5,
                    overflow: 'hidden'}}>
                        <Image
                            source={{ uri: item?.get_image?.url }}
                            style={{
                                width: '100%',
                                height: height * 0.2,
                                borderRadius: 5,
                            }} 
                            resizeMode='cover'    
                        />
                    </View>
                    <Br space={0.01} />
                    <View style={{ paddingVertical: height * 0.01, paddingHorizontal: width * 0.03 }}>
                        <Pera numberOfLines={1}>{item?.title}</Pera>
                        <Small style={{color: Color('whiteText')}} numberOfLines={1}>{item?.desc}</Small>
                        <Br space={0.02} />
                        <Button fontSize={14} style={{ backgroundColor: item?.status === 'pending' ? Color('pendingColor') : Color('activeStatusColor'), paddingVertical: height * 0.015 }} onPress={() => console.log('clicked on my ad')}>{item?.status}</Button>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        if (isFocused) loadAds();
    }, [isFocused])

    const loadAds = async () => {
        await getMyAds(setAds);
    }

    if (!ads) {
        return <Loading />
    }

    return (
        <>
            <Background dark={1}>
                <Br space={(0.02)} />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft
                            size="32"
                            color={Color('primary')}
                            variant="Outline"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateAd')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Color('primary'), paddingVertical: height * 0.01, paddingHorizontal: width* 0.03, borderRadius: 6,}}>
                        <Cards
                            size="20"
                            color={Color('btnText')}
                            variant="Outline"
                        />
                        <Small style={{color: Color('btnText')}}>Create Ads</Small>
                    </TouchableOpacity>
                </View>
                <Br space={(0.03)} />
                <H3>Your Ads</H3>
                <Br space={0.04} />
                {
                    ads?.length === 0
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>Not Ad Found</Pera>
                    :
                    <View style={{paddingBottom: height * 0.05}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 10, justifyContent: 'center' }}
                            data={ads}
                            renderItem={({ item, index }) => <Ad item={item} index={index} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                }
            </Background>
        </>
    )
}

export default MyAds;