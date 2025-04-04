import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Alert, Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H3, H5, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { AddCircle, ArrowLeft, Profile2User } from 'iconsax-react-native';
import { ButtonOuline } from '../../components/Button';
import { getMyGroups } from '../../APIManager';
import Loading from '../Loading';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');
const MyGroups = ({ navigation }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [ groups, setGroups ]: any = useState();
    const Group = ({ item, index }: { item?: any, index: number }) => {
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                    borderWidth: 1,
                    borderColor: Color('primary'),
                }}
                onPress={() => navigation.navigate('MyGroupDetails', {group_id: item?.id})}
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
                        <H5 numberOfLines={1} style={{color: Color('whiteText')}}>{item?.title}</H5>
                        <Pera numberOfLines={1}>{item?.get_user?.name}</Pera>
                        <Br space={0.02} />
                        <ButtonOuline fontSize={14} style={{ padding: width * 0.05 }} onPress={() => navigation.navigate('Chat', {
                            photo: item?.get_photo?.url,
                            name: item?.title,
                            user_id: item?.get_user?.id,
                            group_id: item?.id
                        })}>Start Chat</ButtonOuline>
                    </View>
                </TouchableOpacity>
            </>
        )
    };

    useEffect(() => {
        if (isFocused) loadGroups();
    }, [isFocused])

    const loadGroups = async () => {
        await getMyGroups(setGroups);
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
                    <TouchableOpacity onPress={() => navigation.navigate('SuggestedGroups')} style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Color('primary'), paddingVertical: height * 0.01, paddingHorizontal: width* 0.02, borderRadius: 6,}}>
                        <Profile2User
                            size="20"
                            color={Color('btnText')}
                            variant="Outline"
                        />
                        <Small style={{color: Color('btnText')}}>Suggested Groups</Small>
                    </TouchableOpacity>
                </View>
                <Br space={(0.03)} />
                <View>
                    <H3>My Groups</H3>
                    <Pera style={{color: Color('whiteText')}}>Your created groups.</Pera>
                </View>
                <Br space={0.04} />
                {
                    groups?.length === 0
                    ?
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>Not Group Found</Pera>
                    :
                    <View style={{paddingBottom: height * 0.35}}>
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
            <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')} style={{flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: height * 0.05, zIndex: 2, right: width * 0.25, backgroundColor: Color('primary'), paddingVertical: height * 0.012, width: width * 0.5, borderRadius: 6}}>
                <AddCircle
                    size="20"
                    color={Color('btnText')}
                    variant="Outline"
                />
                <Pera style={{ color: Color('btnText') }}>Create Group</Pera>
            </TouchableOpacity>
        </>
    )
}

export default MyGroups;