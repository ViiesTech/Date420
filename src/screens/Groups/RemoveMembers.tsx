import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5 } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft, CloseCircle } from 'iconsax-react-native';
import Input from '../../components/Input';
import { removeTheMember } from '../../APIManager';
import Toast from 'react-native-simple-toast';
import { Message } from '../../utils/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');
const RemoveMembers = ({ navigation, route }: { route?: any, navigation: any }) => {
    const { group_id, members } = route?.params;
    
    const [ userId, setUserId ]: any = useState(0);
    const [ membersList, setMembersList ]: any = useState(JSON.parse(members));
    const [ loading, setLoading ]: any = useState(false);
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
                            parseInt(item?.user_id) !== userId && (
                                <View>
                                    <TouchableOpacity disabled={loading} onPress={() => removeGroup(item?.get_user?.id)}>
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

    const removeGroup = async (user: any) => {
        setLoading(true);
        Toast.show("Removing The Member", Toast.SHORT);
        const res = await removeTheMember(group_id, user);
        setLoading(false);
        if (res.status === 'success') {
            Toast.show(res?.message, Toast.SHORT);
            const arr = membersList.slice().filter((val: any) => val?.get_user?.id !== parseInt(user));
            setMembersList(arr);
        }else {
            Message('Failed To Leave', res?.message);
        }
    }
    return (
        <>
            <Background dark={0.7}>
                <Br space={(0.02)} />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft
                        size="32"
                        color={Color('primary')}
                        variant="Outline"
                    />
                </TouchableOpacity>
                <Br space={(0.03)} />
                <H3 style={{ alignSelf: 'center' }}>Remove Member</H3>
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
                <Br space={0.3} />
            </Background>
        </>
    )
}

export default RemoveMembers;