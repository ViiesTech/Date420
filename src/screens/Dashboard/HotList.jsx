import React, { useEffect, useRef, useState } from 'react';
import Background from '../utils/Background';
import { Alert, Dimensions, Image, ImageBackground, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { ArrowCircleLeft2, ArrowCircleRight2, Heart, Notification, SearchFavorite1 } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import Input from '../../components/Input';
import Swiper from 'react-native-swiper';
import { Button } from '../../components/Button';
import { getMyPackage, loadHotList, removeFromHotList, sendLocation } from '../../APIManager';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../Loading';
import Hr from '../../components/Hr';
import PublishedAds from '../../components/PublishedAds';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useDispatch } from 'react-redux';
import { saveLatLong } from '../../redux/Reducers/appSlice';

const { width, height } = Dimensions.get('window');
const HotList = ({ navigation }) => {
    const [ currPackage, setPackage ] = useState();
    const [ hostList, setHostList ] = useState();
    const [permissionDenied, setPermissionDenied] = useState(false);
    const hasRequestedLocation = useRef(false);
    const isFocused = useIsFocused()
    const disptach = useDispatch()


    // console.log('gello',lat,long)
      
    
   
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (status === RESULTS.GRANTED) return true;

      if (status === RESULTS.DENIED) {
        const newStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (newStatus === RESULTS.GRANTED) return true;
        if (newStatus === RESULTS.DENIED) {
          setPermissionDenied(true); 
          return false;
        }
      }

      if (status === RESULTS.BLOCKED) {
        setPermissionDenied(true);
        return false;
      }

      return false;
    }
  };

  const getLocation = async () => {
    if (hasRequestedLocation.current || permissionDenied) return;
    hasRequestedLocation.current = true;

    const hasPermission = await requestLocationPermission();
    console.log("Permission status:", hasPermission);

    if (!hasPermission) return; 

    Geolocation.getCurrentPosition(
      async position  => {
        const { latitude, longitude } = position.coords;
       const res = await sendLocation(latitude, longitude);
        if(res.status === 'success') {
            disptach(saveLatLong(res.user))
        }
      },
      error => {
        Alert.alert("Error", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    if (isFocused) {
      hasRequestedLocation.current = false;
      getLocation();
    }
  }, [isFocused]);

    const HostListCard = ({data}) => {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('UsersProfile', {user_id: data?.get_liked_user_profile?.id})}>
                    <View style={styles.hotListCard}>
                        <Image source={require('../../assets/images/hot-list-card-overlay.png')} style={styles.hotListCardOverlay} />
                        <ImageBackground source={{ uri: data?.get_user_profile_photo?.url }} style={styles.hotListCardImage}>
                            <View style={{ zIndex: 2 }}>
                                <H4 style={{ textAlign: 'center', color: Color('whiteText'), width: width * 0.5 }}>{data?.get_liked_user_profile?.name}</H4>
                                <H6 style={{ textAlign: 'center', color: Color('whiteText') }}>{data?.get_user_info?.your_age}</H6>
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.hotListCardBottom}></View>
                <TouchableOpacity onPress={() => removeFromHotList(data?.get_liked_user_profile?.id, () => loadHotListData())} style={styles.hotListCardHeart}>
                    <Heart size="32" color={Color('background')} variant="Bold"/>
                </TouchableOpacity>
            </>
        )
    }
    
    useEffect(() => {
        if (isFocused) {
            loadHotListData();
        }
    }, [isFocused]);
    useEffect(() => {
        loadCurrentPackage();
    }, []);
    useEffect(() => {
        if (currPackage) {
            const isPackageExpired = moment(moment().format('YYYY-MM-DD')).isAfter(currPackage?.end_date);
            if (isPackageExpired) navigation.replace('Subscriptions');
        }
    }, [currPackage]);

    const loadCurrentPackage = async () => {
        await getMyPackage(setPackage);
    };
    const loadHotListData = async () => {
        setHostList();
        await loadHotList(1, setHostList);
    }
    const SearchBar = () => {
        const [ keywords, setKeywords ] = useState("");
        return (
            <Input
                label={false}
                color={Color('primary')}
                icon={<SearchFavorite1 size="25" color={Color('primary')} />}
                placeholder='Filter your best match'
                placeholderColor={Color('whiteText')}
                onChange={(text) => setKeywords(text)}
                onBlur={() => navigation.navigate('MyMatch', {keywords: keywords})}
            />
        )
    }

    if (!hostList) {
        return <Loading />
    }

    return (
        <>
            <Background dark={0.7}>
                <ScrollView alwaysBounceVertical showsVerticalScrollIndicator={false}>
                    <View>
                        <Header headerText="Date420" showSecondIcon secondIcon={
                            <TouchableOpacity onPress={() => console.log('a')}>
                                <Notification size="25" color={Color('whiteText')} variant="Bold" />
                            </TouchableOpacity>
                        } />
                        <Br space={0.05} />
                        <PublishedAds navigation={navigation} />
                        <SearchBar />
                        <Br space={0.05} />
                        <H4 style={{textAlign: 'center'}}>Hot List</H4>
                        <Br space={0.03} />
                        {
                            hostList?.data?.length === 0
                            ?
                            <>
                                <Hr style={{backgroundColor: Color('primary'), width: width * 0.9, height: 0.5}} />
                                <Pera style={{color: Color('whiteText'), textAlign: 'center'}}>No Hotlist Created</Pera>
                            </>
                            :
                            hostList?.data?.length === 1
                            ?
                            <View style={{ height: height * 0.5}}>
                                <View style={styles.slide}>
                                    <HostListCard data={hostList?.data[0]} />
                                </View>
                            </View>
                            :
                            hostList && (
                                <>
                                    <Swiper 
                                        centerContent
                                        showsButtons={true} 
                                        style={{ height: height * 0.5}}
                                        showsPagination={false}
                                        nextButton={<ArrowCircleRight2 size="32" color={Color('whiteText')} />}
                                        prevButton={<ArrowCircleLeft2 size="32" color={Color('whiteText')} />}
                                    >
                                        {
                                            hostList?.data?.slice(0, 10).map((val) => {
                                                return (
                                                    <View style={styles.slide} key={val?.get_liked_user_profile?.id}>
                                                        <HostListCard data={val} />
                                                    </View>
                                                )
                                            })
                                        }
                                    </Swiper>
                                    <Button style={{width: width * 0.5, alignSelf: 'center'}} onPress={() => navigation.navigate('AllHotList')}>View All</Button>
                                </>
                            )
                        }
                        <Br space={0.1} />
                    </View>
                </ScrollView>
            </Background>
            <Footer activeIndex={1} />
        </>
    )
}

export default HotList;

const styles = StyleSheet.create({
    slide: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hotListCard: {
        height: height * 0.4,
        width: width * 0.6,
        borderRadius: 20,
        borderWidth: 5,
        alignSelf: 'center',
        borderColor: Color('whiteText'),
        overflow: 'hidden',
    },
    hotListCardBottom: {
        width: width * 0.5,
        borderRadius: 5,
        borderWidth: 3,
        transform: [{translateY: -4}],
        borderColor: Color('whiteText'),
    },
    hotListCardImage: {
        height: height * 0.4,
        width: width * 0.58,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: height * 0.05
    },
    hotListCardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: height * 0.4,
        width: width * 0.6,
        zIndex: 1
    },
    hotListCardHeart: {
        transform: [{translateY: -30}],
        backgroundColor: Color('primary'),
        borderRadius: 100,
        width: 60, height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
})