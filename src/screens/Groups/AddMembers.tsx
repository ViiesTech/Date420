import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowLeft } from 'iconsax-react-native';
import Input from '../../components/Input';
import RadioButton from '../../components/RadioButton';
import { addMember, getMyMatches } from '../../APIManager';
import Toast from 'react-native-simple-toast';
import { Message } from '../../utils/Alert';

const { width, height } = Dimensions.get('screen');
const AddMembers = ({ navigation, route }: { navigation: any, route?: any }) => {
    const [ Matches, setMatches ]: any = useState();
    const [ searchName, setSearchName ]: any = useState('');
    const [ loading, setLoading ]: any = useState(false);
    const { group_id, members } = route?.params;
    
    const Member = ({ item, index }: { item?: any, index: number }) => {
        const isExist = JSON.parse(members).filter((val: any) => val?.get_user?.id === item?.get_user?.id)
        const selectMember = async (id: any) => {
            setLoading(true);
            Toast.show("Adding the Member...", Toast.SHORT);
            const res = await addMember(group_id, id);
            setLoading(false);
            if (res.status === 'success') {
                Toast.show(res?.message, Toast.SHORT);
                const arr = Matches.slice().filter((val: any) => val?.get_user?.id !== item?.get_user?.id);
                setMatches(arr);
            }else {
                Message('Failed To Add', res?.message);
            }
        };

        if (isExist.length > 0) {
            return <></>
        }
        return (
            <>
                <TouchableOpacity key={index} style={{ marginBottom: height * 0.02 }} onPress={() => navigation.navigate('Profile')}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 15, justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
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
                        </View>
                        <View>
                            <RadioButton selected={false} label={undefined} onSelectOption={() => selectMember(item?.get_user?.id)} disabled={loading}  />
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        loadList();
    }, [])

    const loadList = async () => {
        const requests = await getMyMatches();
        setMatches(requests.data.data);
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
                <H3 style={{ alignSelf: 'center' }}>Add New Member</H3>
                <Br space={0.04} />
                <Input
                    value={searchName}
                    label={false}
                    color={Color('primary')}
                    placeholder='Search'
                    placeholderColor={Color('primary')}
                    onChange={(text: any) => setSearchName(text)}
                />
                <Br space={0.04} />
                {
                    !Matches
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>Finding Members...</Pera>
                    :
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={Matches.filter((item: any) => item?.get_user?.name?.toLowerCase()?.includes(searchName.toLowerCase()))}
                        renderItem={({ item, index }) => <Member item={item} index={index} />}
                        keyExtractor={item => item.id}
                    />
                }
                <Br space={0.03} />
            </Background>
        </>
    )
}

export default AddMembers;