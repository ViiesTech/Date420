import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, Linking, Platform, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H4, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft } from 'iconsax-react-native';
import { getAdDetails } from '../../APIManager';
import Loading from '../Loading';
import { Button } from '../../components/Button';

const { width, height } = Dimensions.get('screen');
const MyAdDetails = ({ navigation, route }: { navigation: any, route: any }) => {
    const [ ad, setAd ]: any = useState();
    const { ad_id, shouldNotOwn } = route?.params;

    useEffect(() => {
        loadDetails();
    }, [])

    const loadDetails = async () => {
        const details = await getAdDetails(ad_id);
        setAd(details.data);
    }

    if (!ad) {
        return <Loading />
    }

    return (
        <>
            <Background dark={1}>
                <View>
                    <Br space={(0.02)} />
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft
                            size="32"
                            color={Color('primary')}
                            variant="Outline"
                        />
                    </TouchableOpacity>
                    <Br space={0.03} />
                    <H3>Ad</H3>
                    <Pera style={{color: Color('whiteText')}}>Your created ads</Pera>
                    <Br space={0.03} />
                    <View>
                        <View style={{
                            borderColor: Platform.OS === 'ios' ? Color('primary') : 'transparent', borderWidth: Platform.OS === 'ios' ? 1 : 0
                        }}>
                            <Image
                                source={{ uri: ad?.get_image?.url }}
                                style={{
                                    width: '100%',
                                    height: height * 0.35,
                                    borderColor: Color('primary'), borderWidth: 1, borderBottomWidth: 0
                                }} 
                                resizeMode='cover'    
                            />
                        </View>
                        <View style={{ borderColor: Color('primary'), borderWidth: 1, borderTopWidth: 0, paddingVertical: height * 0.03, paddingHorizontal: width * 0.03 }}>
                            <H4 style={{color: Color('whiteText')}}>{ad?.title}</H4>
                            {!shouldNotOwn && (
                                <>
                                    <Br space={0.03} />
                                    <H4>About</H4>
                                </>
                            )}
                            <Br space={0.01} />
                            <Pera style={{color: Color('whiteText')}}>
                                {ad?.desc}
                            </Pera>
                            {
                                !shouldNotOwn && ad?.get_user_clicks?.length > 0 && (
                                    <>
                                        <Br space={0.03} />
                                        <H4>User Clicks</H4>
                                        <Br space={0.015} />
                                        <View style={{marginBottom: height * 0.01, flexDirection: 'row', gap: 10, paddingHorizontal: width * 0.01}}>
                                            <View style={{width: (width * 0.9) / 6}}>
                                                <H6>No</H6>
                                            </View>
                                            <View style={{width: (width * 0.9) / 3}}>
                                                <H6>Clicks</H6>
                                            </View>
                                            <View style={{width: (width * 0.9) / 2.6}}>
                                                <H6>Date</H6>
                                            </View>
                                        </View>
                                        {
                                            ad?.get_user_clicks.map((val: { num_clicks: any; created_at: string; }, index: any) => {
                                                return (
                                                    <View key={index} style={{marginBottom: height * 0.01, flexDirection: 'row', gap: 10, backgroundColor: Color('primary_opactiy_15'), borderColor: Color('primary'), borderWidth: 1, paddingVertical: height * 0.01, paddingHorizontal: width * 0.01}}>
                                                        <View style={{width: (width * 0.9) / 6}}>
                                                            <Small>{index + 1}</Small>
                                                        </View>
                                                        <View style={{width: (width * 0.9) / 3}}>
                                                            <Small>{val.num_clicks}</Small>
                                                        </View>
                                                        <View style={{width: (width * 0.9) / 2.6}}>
                                                            <Small>{val.created_at.substring(0,10)}</Small>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </>
                                )
                            }
                            {
                                !shouldNotOwn && (
                                    <>
                                        <Br space={0.03} />
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <H4>Total Clicks</H4>
                                            <H4>{ad?.get_user_clicks?.length}</H4>
                                        </View>
                                    </>
                                )
                            }
                            <Button fontSize={20} onPress={() => Linking.openURL(ad?.url)} style={{ alignSelf: 'center', width: width * 0.5, transform: [{translateY: height * 0.06}]}}>View Online</Button>
                        </View>
                        <Br space={0.05} />
                    </View>
                </View>
            </Background>
        </>
    )
}

export default MyAdDetails;