import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H5, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Heart, SearchFavorite1, TagCross } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { addToHotlist, getMyMatches, removeFromHotList } from '../../APIManager';
import Loading from '../Loading';
import FastImage from 'react-native-fast-image';
import Input from '../../components/Input';
import { useSelector } from 'react-redux';
import * as Progress from 'react-native-progress';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('screen');
const MyMatch = ({ navigation, route }: { navigation: any, route?: any }) => {
    const keywords = route?.params?.keywords;
    const [searchKeyword, setSearchKeyword]: any = useState(keywords || "");
    const [Matches, setMatches]: any = useState();
    const [currPage, setCurrPage]: any = useState(1);
    const [lastPage, setLastPage]: any = useState(1);
    const [radius, setRadius] = useState('')
    const [loading, setLoading] = useState(false);

    const { lat,long } = useSelector(state => state.app)

    console.log('hhh latlong', lat,long);

    const Match = ({ item, index }: { item?: any, index: number }) => {
        // console.log('hhhhh',item?.get_user?.get_user_profile_photo?.url)
        const hotlistToggle = () => {
            if (item.hotlist) {
                removeFromHotList(item?.user_id, () => loadList())
            } else {
                addToHotlist(item?.user_id, () => loadList())
            }
        }
        return (
            <>
                <TouchableOpacity style={{
                    flex: 1,
                    marginBottom: height * 0.02,
                }}
                    key={index}
                    onPress={() => navigation.navigate('UsersProfile', { user_id: item?.user_id })}
                >
                    <View style={{
                        borderWidth: 1,
                        borderColor: Color('primary'),
                        borderRadius: 10,
                        overflow: 'hidden'
                    }}>
                        <FastImage
                            style={{ width: 200, height: 200 }}
                            source={{
                                uri: item?.get_user?.get_user_profile_photo?.url,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <TouchableOpacity onPress={hotlistToggle} style={{ position: "absolute", bottom: 5, right: 5 }}>
                            <Heart size="25" color={Color('whiteText')} variant={item.hotlist ? "Bold" : "Outline"} />
                        </TouchableOpacity>
                    </View>
                    <Br space={0.01} />
                    <H5 numberOfLines={1} style={{ color: Color('whiteText'), textAlign: 'center' }}>{item?.user_name}</H5>
                    <Pera style={{ color: Color('whiteText'), textAlign: 'center' }}>{item?.your_age}</Pera>
                </TouchableOpacity>
            </>
        )
    };



    useEffect(() => {
        loadList();
    }, [radius]);


    const loadList = async () => {
        try {
            setLoading(true);
            const requests = await getMyMatches(currPage, radius ? radius : null);
            if (requests?.data?.data) {
                setMatches(requests?.data?.data);
                setLastPage(requests?.data?.last_page);
            } else {
                setMatches([]);
            }
        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setLoading(false);
        }
    };
    const callMoreList = async () => {
        // setLoading(true)
        if (currPage < lastPage) {
            const nextPage = currPage + 1;
            const requests = await getMyMatches(nextPage, radius ? radius : null);
            const arr = Matches.slice();
            for (let x = 0; x < requests.data.data.length; x++) {
                arr.push(requests.data.data[x]);
            }
            setCurrPage(nextPage);
            setMatches(arr);
        }
        // setLoading(false)
    }
    // console.log(Matches?.length);
    // if (!Matches) {
    //     return <Loading />
    // }
    return (
        <>
            <Background dark={1}>
                <View style={{ paddingBottom: height * 0.08 }}>
                    <Header
                        navigation={navigation}
                        hideMenu="true"
                        headerText="My Match"
                        showMenu
                        backBtn
                    />
                    <Br space={0.04} />

                        <>
                            {keywords && searchKeyword.length > 0 ? (
                                <>
                                    <View style={{ borderColor: Color('primary'), borderWidth: 0.5, flexDirection: 'row', alignItems: 'flex-start', gap: 8, justifyContent: 'center', backgroundColor: Color('primary_opactiy_15'), alignSelf: 'flex-start', paddingVertical: height * 0.005, paddingHorizontal: width * 0.03, borderRadius: 30 }}>
                                        <Pera>Filter Keyword: {searchKeyword}</Pera>
                                        <TouchableOpacity onPress={() => setSearchKeyword("")}>
                                            <TagCross size="20" color={Color('primary')} />
                                        </TouchableOpacity>
                                    </View>
                                    <Br space={0.02} />
                                </>
                            ) : (
                                <>
                                {lat && long &&
                                <>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: 'white',
                                                textAlign: 'center',
                                                // marginBottom: 15, 
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                                                paddingVertical: 5,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                            }}>
                                                Distance: {radius || 0}km 
                                            </Text>
                                            <Slider
                                                style={{ width: '100%', height: 20, justifyContent: 'center' }}
                                                minimumValue={0}
                                                maximumValue={1000}
                                                thumbTintColor={Color('primary')}
                                                step={1}
                                                // onValueChange={setRadius}
                                                value={radius}
                                                onSlidingComplete={setRadius}
                                                minimumTrackTintColor={'red'}
                                                maximumTrackTintColor="grey"
                                            />
                                        {/* <Progress.Bar
                                            borderColor="lightgray"
                                            height={3}
                                            progress={0.5}
                                            color={Color('primary')}
                                            unfilledColor={'red'}
                                            width={width - 35}
                                         /> */}
                                     {/* <Input
                                        label={false}
                                        color={Color('primary')}
                                        value={radius}
                                        keyboardType='numeric'
                                        icon={<SearchFavorite1 size="25" color={Color('primary')} />}
                                        placeholder='Enter distance'
                                        placeholderColor={Color('whiteText')}
                                        onChange={(text) => {
                                            setRadius(text);
                                            // setLoading(true)
                                        }}
                                    /> */}
                                    <Br space={0.04} /> 
                                    </>
                                }
                                </> 
                            )}
                            {loading ? (
                                <Loading />
                            ) : Matches?.length === 0 ? (
                                <Pera style={{ color: Color('whiteText'), textAlign: 'center' }}>No Match Found</Pera>
                            ) : (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    numColumns={2}
                                    columnWrapperStyle={{ gap: 10, justifyContent: 'center' }}
                                    data={Matches?.filter((val) => val?.user_name.toLowerCase().includes(searchKeyword.toLowerCase()))}
                                    renderItem={({ item, index }) => <Match item={item} index={index} />}
                                    keyExtractor={(item) => item.id}
                                    onEndReached={callMoreList}
                                />
                            )}
                        </>
                </View>
            </Background>
            <Footer activeIndex={3} />
        </>
    );
}

export default MyMatch;