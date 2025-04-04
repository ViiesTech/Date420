import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H4, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft } from 'iconsax-react-native';
import { Button } from '../../components/Button';
import { getEventDetails } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('screen');
const EventDetails = ({ navigation, route }: { navigation: any, route?: any }) => {
    const [ event, setEvent ]: any = useState();
    const { event_id } = route?.params;

    useEffect(() => {
        loadDetails();
    }, [])

    const loadDetails = async () => {
        const details = await getEventDetails(event_id);
        setEvent(details.data);
    }

    if (!event) {
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
                    <H3>Events</H3>
                    <Pera style={{color: Color('whiteText')}}>Your created groups</Pera>
                    <Br space={0.03} />
                    <View>
                        <Image
                            source={{ uri: event?.get_photo?.url }}
                            style={{
                                width: '100%',
                                height: height * 0.35,
                                borderColor: Color('primary'), borderWidth: 1, borderBottomWidth: 0
                            }} 
                            resizeMode='cover'    
                        />
                        <View style={{ borderColor: Color('primary'), borderWidth: 1, borderTopWidth: 0, paddingVertical: height * 0.03, paddingHorizontal: width * 0.03 }}>
                            <H4 style={{color: Color('whiteText')}}>{event?.title}</H4>
                            <Pera>{event?.created_at?.substring(0,10)}</Pera>
                            <Br space={0.03} />
                            <H4>About</H4>
                            <Br space={0.01} />
                            <Pera style={{color: Color('whiteText'), textAlign: 'justify'}}>
                                {event?.desc}
                            </Pera>
                            <Br space={0.02} />
                            <Button fontSize={20} onPress={() => navigation.navigate('GetTickets', { phone: event?.phone, url: event?.url })} style={{ alignSelf: 'center', width: width * 0.5, transform: [{translateY: height * 0.06}]}}>Get Tickets</Button>
                        </View>
                        <Br space={0.05} />
                    </View>
                </View>
            </Background>
        </>
    )
}

export default EventDetails;