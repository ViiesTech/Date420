import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Alert, Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, Profile2User } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { getGroups, joinTheGroup, leaveTheGroup } from '../../APIManager';
import Loading from '../Loading';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../../utils/Alert';

const { width, height } = Dimensions.get('screen');
const SuggestedGroups = ({ navigation }: { navigation: any }) => {
    const [ groups, setGroups ]: any = useState();
    const [ loading, setLoading ]: any = useState(false);
    const Group = ({ item, index }: { item?: any, index: number }) => {
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                    borderWidth: 1,
                    borderColor: Color('primary'),
                }}
                key={index}
                onPress={() => navigation.navigate('GroupDetails', {group_id: item?.id})}
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
                        <H6 numberOfLines={1} style={{color: Color('whiteText')}}>{item.title}</H6>
                        <Small numberOfLines={1}>{item?.get_user?.name}</Small>
                        <Br space={0.02} />
                        {
                            item?.member_joined
                            ?
                            <Button loading={loading} fontSize={14} style={{ paddingVertical: width * 0.03 }} onPress={() => leaveGroup(item?.id, index)}>Leave Group</Button>
                            :
                            <Button loading={loading} fontSize={14} style={{ paddingVertical: width * 0.03 }} onPress={() => joinGroup(item?.id, index)}>Join Group</Button>
                        }
                    </View>
                </TouchableOpacity>
            </>
        )
    };

    useEffect(() => {
        loadGroups();
    }, [])

    const loadGroups = async () => {
        await getGroups(setGroups);
    }

    const joinGroup = async (group_id: any, index: any) => {
        setLoading(true);
        const loginSession: any = await AsyncStorage.getItem("token");
        const res = await joinTheGroup(group_id, JSON.parse(loginSession)?.user_id);
        setLoading(false);
        if (res.status === 'success') {
            setGroups((prevState: any) => {
                const newArray = [...prevState];
                newArray[index].member_joined = true;
                return newArray;
            });
            Toast.show(res?.message, Toast.SHORT);
            loadGroups();
        }else {
            Message('Failed To Join', res?.message);
        }
    }

    const leaveGroup = async (group_id: any, index: any) => {
        setLoading(true);
        const loginSession: any = await AsyncStorage.getItem("token");
        const res = await leaveTheGroup(group_id, JSON.parse(loginSession)?.user_id);
        setLoading(false);
        if (res.status === 'success') {
            setGroups((prevState: any) => {
                const newArray = [...prevState];
                newArray[index].member_joined = false;
                return newArray;
            });
            Toast.show(res?.message, Toast.SHORT);
            loadGroups();
        }else {
            Message('Failed To Leave', res?.message);
        }
    }

    if (!groups) {
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
                    <TouchableOpacity onPress={() => navigation.navigate('MyGroups')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Color('primary'), paddingVertical: height * 0.01, paddingHorizontal: width* 0.02, borderRadius: 6,}}>
                        <Profile2User
                            size="20"
                            color={Color('btnText')}
                            variant="Outline"
                        />
                        <Small style={{color: Color('btnText')}}>My Groups</Small>
                    </TouchableOpacity>
                </View>
                <Br space={(0.03)} />
                <View>
                    <H3>Suggested Groups</H3>
                    <Pera style={{color: Color('whiteText')}}>Groups you might be interested in.</Pera>
                </View>
                <Br space={0.04} />
                {
                    groups?.length === 0
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>Not Group Found</Pera>
                    :
                    <View style={{paddingBottom: height * 0.08}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 10, justifyContent: 'center' }}
                            data={groups}
                            renderItem={({ item, index }) => <Group item={item} index={index} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                }
            </Background>
            <Footer activeIndex={4} />
        </>
    )
}

export default SuggestedGroups;