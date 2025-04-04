import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, Profile2User } from 'iconsax-react-native';
import { getEvents } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('screen');
const Events = ({ navigation }: { navigation: any }) => {
    const [ events, setEvent ]: any = useState();
    const Event = ({ item, index }: { item?: any, index: number }) => {
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                    borderWidth: 1,
                    borderColor: Color('primary'),
                }}
                onPress={() => navigation.navigate('EventDetails', {event_id: item?.id})}
                key={index}
                >
                    <View style={{
                    borderBottomWidth: 1,
                    borderColor: Color('primary'),
                    borderRadius: 5,
                    overflow: 'hidden'}}>
                        <Image
                            source={{ uri: item?.get_photo?.url }}
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
                        <H6 numberOfLines={1} style={{color: Color('whiteText')}}>{item?.title}</H6>
                        <Br space={0.01} />
                        <Small numberOfLines={2}>{item?.desc}</Small>
                        <Br space={0.01} />
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        loadEvents();
    }, [])

    const loadEvents = async () => {
        await getEvents(setEvent);
    }
    if (!events) {
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
                    <TouchableOpacity onPress={() => navigation.navigate('MyEvents')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Color('primary'), paddingVertical: height * 0.01, paddingHorizontal: width* 0.02, borderRadius: 6,}}>
                        <Profile2User
                            size="20"
                            color={Color('btnText')}
                            variant="Outline"
                        />
                        <Small style={{color: Color('btnText')}}>My Events</Small>
                    </TouchableOpacity>
                </View>
                <Br space={(0.03)} />
                <View>
                    <H3>Events</H3>
                    <Pera style={{color: Color('whiteText')}}>Events you might be interested in.</Pera>
                </View>
                <Br space={0.04} />
                {
                    events?.length === 0
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>No Event Found</Pera>
                    :
                    <View style={{paddingBottom: height * 0.035}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 10, justifyContent: 'center' }}
                            data={events}
                            renderItem={({ item, index }) => <Event item={item} index={index} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                }
            </Background>
        </>
    )
}

export default Events;