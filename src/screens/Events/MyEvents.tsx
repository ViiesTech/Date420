import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, Profile2User, Reserve } from 'iconsax-react-native';
import { ButtonOuline } from '../../components/Button';
import { getMyEvents } from '../../APIManager';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../Loading';

const { width, height } = Dimensions.get('screen');
const MyEvents = ({ navigation }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [ events, setEvents ]: any = useState();
    const Event = ({ item, index }: { item?: any, index: number }) => {
        const color = item.status === 'approved' ? "whiteText" : item.status === 'pending' ? "btnText" : "whiteText";
        const bgColor = item.status === 'approved' ? "approvedColor" : item.status === 'pending' ? "pendingColor" : "rejectedColor";
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                    borderWidth: 1,
                    borderColor: Color('primary'),
                }}
                key={index}
                onPress={() => navigation.navigate('EventDetails', {event_id: item?.id})}
                >
                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: Color('primary'),
                        borderRadius: 5,
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <Image
                            source={{ uri: item?.get_photo?.url }}
                            style={{
                                width: '100%',
                                height: height * 0.2,
                                borderRadius: 5,
                            }} 
                            resizeMode='cover'    
                        />
                        <Small style={{textTransform: 'capitalize', paddingVertical: height * 0.002, paddingBottom: height * 0.004, paddingHorizontal: width * 0.02, borderRadius: 20, position: 'absolute', top: height * 0.01, left: width * 0.02, color: Color(color), backgroundColor: Color(bgColor)}}>
                            {item?.status}
                        </Small>
                    </View>
                    <Br space={0.01} />
                    <View style={{ paddingVertical: height * 0.01, paddingHorizontal: width * 0.03 }}>
                        <H6 numberOfLines={1} style={{color: Color('whiteText')}}>{item?.title}</H6>
                        <Br space={0.005} />
                        <Small numberOfLines={2}>{item?.desc}</Small>
                        <Br space={0.01} />
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        if (isFocused) loadEvents();
    }, [isFocused])

    const loadEvents = async () => {
        await getMyEvents(setEvents);
    }

    if (!events) {
        return <Loading />
    }

    return (
        <>
            <Background dark={1}>
                <Br space={(0.02)} />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft
                        size="32"
                        color={Color('primary')}
                        variant="Outline"
                    />
                </TouchableOpacity>
                <Br space={(0.03)} />
                <View>
                    <H3>My Events</H3>
                    <Pera style={{color: Color('whiteText')}}>Events you might be interested in.</Pera>
                </View>
                <Br space={0.04} />
                {
                    events?.length === 0
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>No Event Found</Pera>
                    :
                    <View style={{paddingBottom: height * 0.35}}>
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
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent')} style={{flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: height * 0.05, zIndex: 2, right: width * 0.25, backgroundColor: Color('primary'), paddingVertical: height * 0.015, width: width * 0.5, borderRadius: 6}}>
                <Reserve
                    size="20"
                    color={Color('btnText')}
                    variant="Outline"
                />
                <Pera style={{ color: Color('btnText') }}>Add Event</Pera>
            </TouchableOpacity>
        </>
    )
}

export default MyEvents;