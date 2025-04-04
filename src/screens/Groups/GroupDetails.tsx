import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H4, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft } from 'iconsax-react-native';
import { Button } from '../../components/Button';
import { AvatarList } from '../../components/GroupAvatar';
import { getGroupDetails, joinTheGroup, leaveTheGroup } from '../../APIManager';
import Loading from '../Loading';
import { nFormatter } from '../../utils/nFormatter';
import { Message } from '../../utils/Alert';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');
const GroupDetails = ({ navigation, route }: { navigation: any, route: any }) => {
    const isFocused = useIsFocused();
    const [ group, setGroup ]: any = useState();
    const [ loading, setLoading ]: any = useState(false);
    const [ isAlreadyJoined, setIsAlreadyJoined ]: any = useState(false);
    const { group_id } = route?.params;

    useEffect(() => {
        if (isFocused) loadDetails();
    }, [isFocused])

    const loadDetails = async () => {
        setGroup();
        const details = await getGroupDetails(group_id);
        isGroupJoined(details.data);
        setGroup(details.data);
        setLoading(false);
    }

    const joinGroup = async () => {
        setLoading(true);
        const loginSession: any = await AsyncStorage.getItem("token");
        const res = await joinTheGroup(group_id, JSON.parse(loginSession)?.user_id);
        if (res.status === 'success') {
            Toast.show(res?.message, Toast.SHORT);
            loadDetails();
        }else {
            setLoading(false);
            Message('Failed To Join', res?.message);
        }
    }
    
    const leaveGroup = async () => {
        setLoading(true);
        const loginSession: any = await AsyncStorage.getItem("token");
        const res = await leaveTheGroup(group_id, JSON.parse(loginSession)?.user_id);
        if (res.status === 'success') {
            Toast.show(res?.message, Toast.SHORT);
            loadDetails();
        }else {
            setLoading(false);
            Message('Failed To Leave', res?.message);
        }
    }

    const isGroupJoined = async (groupDate: any) => {
        setIsAlreadyJoined(false);
        const loginSession: any = await AsyncStorage.getItem("token");
        for (let x = 0; x < groupDate?.get_group_members?.length; x++) {
            if (groupDate?.get_group_members[x].user_id === parseInt(JSON.parse(loginSession)?.user_id)) {
                setIsAlreadyJoined(true);
                return;
            }
        }
    }

    if (!group) {
        return <Loading />
    }

    const numberOfMembers = group?.get_group_members?.length;
    return (
        <>
            <Background dark={1}>
                <View>
                    <Br space={(0.03)} />
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft
                            size="32"
                            color={Color('primary')}
                            variant="Outline"
                        />
                    </TouchableOpacity>
                    <Br space={0.03} />
                    <View>
                        <Image
                            source={{ uri: group?.get_photo?.url }}
                            style={{
                                width: '100%',
                                height: height * 0.35,
                                borderColor: Color('primary'), borderWidth: 1, borderBottomWidth: 0
                            }} 
                            resizeMode='cover'    
                        />
                        <View style={{ borderColor: Color('primary'), borderWidth: 1, borderTopWidth: 0, paddingVertical: height * 0.03, paddingHorizontal: width * 0.03 }}>
                            <H4 style={{color: Color('whiteText')}}>{group?.title}</H4>
                            {
                                numberOfMembers > 0 && (
                                    <TouchableOpacity onPress={() => navigation.navigate('LeaveGroup', {group_id: group_id, members: JSON.stringify(group?.get_group_members)})} style={{flexDirection: 'row', alignItems: 'center', gap: 25}}>
                                        <AvatarList width={35} height={35} arr={group?.get_group_members} />
                                        <Pera>{nFormatter(numberOfMembers, 1)} Member{numberOfMembers > 1 && "s"}</Pera>
                                    </TouchableOpacity>
                                )
                            }
                            <Br space={0.03} />
                            <H4>Description</H4>
                            <Br space={0.01} />
                            <Pera style={{color: Color('whiteText'), textAlign: 'justify'}}>
                                {group?.desc}
                            </Pera>
                        </View>
                        <Br space={0.02} />
                        <View style={{alignItems: 'flex-end'}}>
                            {
                                isAlreadyJoined
                                ?
                                <Button loading={loading} onPress={() => Message('Confirm To Leave', "Please confirm to leave this group!", [{text: "Confirm", onPress: () => leaveGroup()}, {text: "Cancel"}])} style={{width: width * 0.5}}>Leave Group</Button>
                                :
                                <Button loading={loading} onPress={() => Message('Confirm To Join', "Please confirm to join this group!", [{text: "Confirm", onPress: () => joinGroup()}, {text: "Cancel"}])} style={{width: width * 0.5}}>Join Group</Button>
                            }
                        </View>
                        <Br space={0.02} />
                    </View>
                </View>
            </Background>
        </>
    )
}

export default GroupDetails;