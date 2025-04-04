import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, PermissionsAndroid, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H5, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Heart } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { loadHotList, removeFromHotList } from '../../APIManager';
import Loading from '../Loading';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('screen');
const AllHotList = ({ navigation }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [ nexthostList, setNextHostList ]: any = useState([]);
    const [ hostList, setHostList ]: any = useState();
    const [ currPage, setCurrPage ]: any = useState(1);
    const [ lastPage, setLastPage ]: any = useState(1);
    const HotList = ({ item, index }: { item?: any, index: number }) => {

     

        return (
            <>
                <View style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                }}
                key={index}
                >
                    <View style={{
                    borderWidth: 1,
                    borderColor: Color('primary'),
                    borderRadius: 10,
                    overflow: 'hidden'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('UsersProfile', {user_id: item?.get_liked_user_profile?.id})}>    
                            <Image
                                source={{ uri: item?.get_user_profile_photo?.url }}
                                style={{
                                    width: '100%',
                                    height: height * 0.2,
                                }} 
                                resizeMode='cover'    
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeFromHotList(item?.get_liked_user_profile?.id, () => getAllHotlist())} style={{position: "absolute", bottom: 5, right: 5}}>
                            <Heart size="25" color={Color('whiteText')} variant="Bold" />
                        </TouchableOpacity>
                    </View>
                    <Br space={0.01} />
                    <H5 style={{color: Color('whiteText'), textAlign: 'center'}}>{item?.get_liked_user_profile?.name}</H5>
                    <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>{item?.get_user_info?.your_age}</Pera>
                </View>
            </>
        )
    }

    useEffect(() => {
        if (isFocused) getAllHotlist();
    }, [isFocused])
    useEffect(() => {
        if (nexthostList.length > 0) {
            const nextPage = currPage + 1;
            const arr = hostList.slice();
            for (let x = 0; x < nexthostList.length; x++) {
                arr.push(nexthostList[x]);
            }
            setCurrPage(nextPage);
            setHostList(arr);
        }
    }, [nexthostList])

    const getAllHotlist = async () => {
        setHostList();
        await loadHotList(currPage, setHostList, setLastPage);
    }
    const callMoreList = async () => {
        if (currPage < lastPage) {
            const nextPage = currPage + 1;
            await loadHotList(nextPage, setNextHostList);
        }
    }
    if (!hostList) {
        return <Loading />
    }

    return (
        <>
            <Background dark={1}>
                <View style={{paddingBottom: height * 0.2}}>
                    <Header headerText="Hot List" />
                    <Br space={0.05} />
                    {
                        hostList?.data.length === 0
                        ?
                        <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>Your Hotlist is Empty</Pera>
                        :
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 10, justifyContent: 'center' }}
                            data={hostList?.data}
                            renderItem={({ item, index }) => <HotList item={item} index={index} />}
                            keyExtractor={item => item.id}
                            onEndReached={callMoreList}
                        />
                    }
                </View>
            </Background>
            <Footer activeIndex={1} />
        </>
    )
}

export default AllHotList;