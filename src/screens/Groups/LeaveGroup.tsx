import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5 } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, CloseCircle } from 'iconsax-react-native';
import Input from '../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { leaveTheGroup } from '../../APIManager';
import Toast from 'react-native-simple-toast';
import { Message } from '../../utils/Alert';

const { width, height } = Dimensions.get('screen');
const LeaveGroup = ({ navigation, route }: { route?: any, navigation: any }) => {
    const { members, group_id } = route?.params;
    const [ loading, setLoading ]: any = useState(false);
    const [ userId, setUserId ]: any = useState(0);
    const [ searchName, setSearchName ]: any = useState('');

    useEffect(() => {
        async function getUserId() {
            const loginSession: any = await AsyncStorage.getItem("token");
            setUserId(JSON.parse(loginSession)?.user_id);
        }

        getUserId();
    }, []);

    const Member = ({ item, index }: { item?: any, index: number }) => {

        return (
            <>
                <View key={index} style={{ marginBottom: height * 0.02 }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 15, justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 15}} onPress={() => navigation.navigate('UsersProfile', {user_id: item?.get_user?.id})}>
                            <Image
                                source={{ uri: item?.get_user?.get_user_profile_photo?.url }}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 100,
                                }} 
                                resizeMode='cover'    
                            />
                            <H5>{item?.get_user?.name}</H5>
                        </TouchableOpacity>
                        {
                            parseInt(item?.user_id) === userId && (
                                <View>
                                    <TouchableOpacity disabled={loading} onPress={leaveGroup}>
                                        <CloseCircle
                                            size="32"
                                            color={Color('galleryCross')}
                                            variant="Bold"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                </View>
            </>
        )
    }
    const membersList = JSON.parse(members);

    const leaveGroup = async () => {
        setLoading(true);
        Toast.show("Please Wait...", Toast.SHORT);
        const res = await leaveTheGroup(group_id, userId);
        if (res.status === 'success') {
            Toast.show(res?.message, Toast.SHORT);
            navigation.goBack();
        }else {
            setLoading(false);
            Message('Failed To Leave', res?.message);
        }
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
                <H3 style={{ alignSelf: 'center' }}>Leave Group</H3>
                <Br space={0.04} />
                <Input
                    value={searchName}
                    label={false}
                    color={Color('primary')}
                    placeholder='Search'
                    placeholderColor={Color('primary')}
                    onChange={(text: any) => setSearchName(text)}
                />
                <Br space={0.03} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={membersList.filter((item: any) => item?.get_user?.name?.toLowerCase()?.includes(searchName.toLowerCase()))}
                    renderItem={({ item, index }) => <Member item={item} index={index} />}
                    keyExtractor={item => item.id}
                />
                <Br space={0.05} />
            </Background>
        </>
    )
}

export default LeaveGroup;