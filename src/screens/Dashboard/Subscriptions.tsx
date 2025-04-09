/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Alert, Dimensions, FlatList, StyleSheet,  TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Br from '../../components/Br';
import { Button } from '../../components/Button';
import { H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import Toast from 'react-native-simple-toast';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import {
  Notification,
} from 'iconsax-react-native';
import { getMyPackage,  subscribePackage } from '../../APIManager';
import Loading from '../Loading';
import { useIsFocused } from '@react-navigation/native';
import { captureSubscription,  } from '../../Paypal';
import { Message } from '../../utils/Alert';
import moment from 'moment';
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');

const Subscriptions = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [packages, setPackages]: any = useState([]);
  const [loading, setLoading]: any = useState(false);
  const [purchaseLoading,setPurchaseLoading] = useState(false)
  const [currPackage, setCurrentPackage]: any = useState({});
  // const [packages,setPackages] = useState([])

  const [paypalUrl, setPaypalUrl]: any = useState(null);
  const [accessToken, setAccessToken]: any = useState(null);
  const [packageToSubscribe, setPackageToSubscribe]: any = useState(null);
  const [currentIndex,setCurrentIndex] = useState(0)
  const [scrolling,setScrolling] = useState(false)



  const SecondIcon = () => (
    <Notification size="25" color={Color('whiteText')} variant="Bold" />
  );
  const CardContent = ({ data }: { data: any }) => {
    // console.log('card content',data)
    return (
      <>
        {/* {data?.bullets.map((val: any, index: React.Key | null | undefined) => {
          return (
            <View key={index}>
              <H6 style={{color: Color('whiteText'), fontFamily: 'OrelegaOne'}}>
                - {val}
              </H6>
              <Br space={0.01} />
            </View>
          );
        })} */}
           {/* <View >
              <H6 style={{color: Color('whiteText'), fontFamily: 'OrelegaOne'}}>
                - {data?.packageType === 'ANNUAL' ? '1 YEAR PACKAGE' : data?.packageType === 'MONTH' ? '1 MONTH PACKAGE' : '3 MONTH PACKAGE'  }
              </H6>
              <Br space={0.01} />
            </View> */}
        <Br space={0.01} />
        {data?.product.priceString &&
        <Pera>{ data?.product.priceString}/-</Pera>}
        <H6 style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>- Create or Join Group</H6>
        <Br space={0.01} />
        <H6 style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>- Create Events</H6>
      </>
    );
  };



  useEffect(() => {
    if (isFocused) {
      offerings()
    }
  }, [isFocused]);

  // const checkActiveSubscription = async () => {
  //   try {
  //     const customerInfo = await Purchases.getCustomerInfo();
  
  //     // Check for active entitlement
  //     const activeEntitlement = customerInfo.entitlements.active;
  //     // alert('hh')
  //     if (Object.keys(activeEntitlement).length > 0) {
  //       alert('hh')
  //       // There is at least one active subscription
  //       const entitlement = Object.values(activeEntitlement)[0]; // Get the first one (or match by ID)
  //       console.log('hhellogg',entitlement.productIdentifier);
  //       // setCurrentPackage(entitlement.productIdentifier)
  
  //       return entitlement.productIdentifier; // e.g., 'date420_month1'
  //     } else {
  //       console.log("User is not subscribed.");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch customer info:", error);
  //     return null;
  //   }
  // };


  const offerings = async () => {
    setLoading(true)
    try {
      const offering = await Purchases.getOfferings();
      let packages = offering?.current?.availablePackages || [];
  
      // 🆕 Add mock Free Trial package
      const freeTrialPackage = {
        packageType: 'FREE_TRIAL',
        identifier: '$rc_free_trial',
        title: 'Free',
        product:{
          priceString: ''
        }
      };
  
      // Insert the Free Trial package
      packages = [freeTrialPackage, ...packages];
  
      // 🔃 Sort packages in preferred order
      const sorted = packages.sort((a, b) => {
        const order = {
          'FREE_TRIAL': 0,
          'MONTHLY': 1,
          'THREE_MONTH': 2,
          'ANNUAL': 3,
        };
        return order[a.packageType] - order[b.packageType];
      });
  
      // Set to state
      setPackages(sorted);
  
      console.log('hhhththththh', sorted);
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  };

  useEffect(() => {
    //  checkActiveSubscription();
    loadCurrentPackage()
  }, []);

  const loadCurrentPackage = async () => {
    await getMyPackage(setCurrentPackage);
  };

  // const loadPackages = async () => {
  //   await getPackages(setPackages);
  // };

  // const upgradePackage = async (id: any, title: any, descArr: any, price: any) => {
  //   setLoading(true);
  //   try {
  //     if (parseFloat(price) < 1) {
  //       subscribeNow(id);
  //       return;
  //     }

  //     const desc = descArr.join(', ');
  //     const token = await generateToken();
  //     const res = await subscribe(token, title, desc, price);
  //     if (res?.links) {
  //       const findUrl = res.links.find((urls: any) => urls.rel === 'approve');
  //       setLoading(false);
  //       setPaypalUrl(findUrl?.href);
  //       setAccessToken(token);
  //       setPackageToSubscribe(id);
  //     }
  //   } catch (err) {
  //     clearPaypalState();
  //     Toast.show("Error: " + err, Toast.SHORT);
  //   }
  // };

  const upgradePackage = async (data) => {
 
    // return console.log(apiData)

    if (!data) {
      Alert.alert('Error', 'No available package for this plan.');
      setLoading(false);
      return;
    }

    
      try {
        setPurchaseLoading(false);
        const purchaseMade = await Purchases.purchasePackage(data);
        setPurchaseLoading(true);


        // ✅ Check if purchase was successful
        // const entitlement = purchaseMade?.customerInfo?.entitlements?.active["pro_access"];

        if (purchaseMade.transaction.purchaseDate) {
              try {
                let apiData = {
                  package_id: data.packageType === 'MONTHLY' ? 1 : data.packageType === 'THREE_MONTH' ? 4 : 12,
                  subscription_id: '1'
              }
                  console.log('api dataa of subscribe ====>',apiData)
                  const loginSession = await AsyncStorage.getItem("token");
                  // console.log(loginSession)
                 await fetch('https://date420friendly.com/api/pacakges/subscribe', {
                      method: 'POST',
                      headers: {
                          Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`,
                           'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(apiData)
                  })
                  .then(res => res.json())
                  .then(async res => {
                      if (res.status === 'success') {
                        // alert('api chal gyi')
                        loadCurrentPackage()
                        console.log(res.message)
                        // setCurrentPackage(entitlement.productIdentifier);
                      }else {
                        console.log('else',res.message)
                          // setState(res?.data);
                      }
                  })
                  .catch(err => {
                      throw err;
                  });
              }catch (err) {
                  console.log(err)
                  // Toast.show('Failed to load package', Toast.SHORT);
                  // errHandler(err, () => getMyPackage(setState));
              }
          // console.log("✅ Subscribed to:", entitlement.productIdentifier);
        } else {
          console.log("❌ revenue cat issue");
        }
    
  
        // const obj = {
        //   purchase_date: purchaseMade?.transaction?.purchaseDate,
        //   sub_type: data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly',
        // };
        // const identify = await checkActiveSubscription()
        // setCurrentPackage(identify)
     
        // if (purchaseMade?.transaction?.purchaseDate && !context?.token) {
        //   navigation.navigate('Message', {
        //     theme: 'light',
        //     title: 'Login Required',
        //     message:
        //       'To access your subscription benefits, please create or log in to your account',
        //     screen: 'Login',
        //   });
        // } 
        // setContext({
        //   ...context,
        //   subscribed_details: purchaseMade?.transaction?.purchaseDate && {
        //   purchased_date: purchaseMade?.transaction?.purchaseDate,
        //   sub_type: data?.packageType === 'ANNUAL' ? 'yearly' : 'monthly',
        // }})
      
  
        // const response = await api.post('user/subscribe', obj, {
        //   headers: {
        //     Authorization: `Bearer ${context?.token}`,
        //   },
        // });
  
        // if (response?.data?.status === 'success' && response?.data?.user?.expired_at) {
        //   setContext({
        //     ...context,
        //     user: {
        //       ...context.user,
        //       expired_at: response.data.user.expired_at,
        //     },
        //   });
        // }
        // navigation.navigate('Home')
      } catch (error) {
        console.log('Error:', error?.response?.data || error?.message);
  
        if (error?.response?.status === 401) {
          Alert.alert('Unauthorized', 'Please log in again.');
        } else {
          Alert.alert('Error', error?.message || 'Something went wrong');
        }
      }
    

    setPurchaseLoading(false);
  };

  const onUrlChange = (webviewState: any) => {
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes("https://example.com/return")) {
      const urlValues = queryString.parseUrl(webviewState.url);
      const { token } = urlValues.query;
      if (token) paymentSucceed(token);
    }
  }

  const paymentSucceed = async (id: any) => {
    try {
      const res = await captureSubscription(id, accessToken);
      if (res?.status === "COMPLETED") {
        clearPaypalState();
        Message("Payment Succeed", "Subscription has been completed successfully!!", [
          { text: "Okay", onPress: () => subscribeNow(packageToSubscribe) }
        ]);
      }
    } catch (err) {
      clearPaypalState();
      Toast.show("Error: " + err, Toast.SHORT);
    }
  }

  const subscribeNow = async (packageToSubscribe: any) => {
    const res: any = await subscribePackage(packageToSubscribe);
    if (res.status === 'success') {
      if (loading) setLoading(false);
      setPackages([]);
      Toast.show(res?.message, Toast.SHORT);
      navigation.replace('HotList');
    } else {
      setLoading(false);
      Toast.show(res?.message, Toast.SHORT);
    }
  }

  const clearPaypalState = () => {
    setPaypalUrl(null);
    setAccessToken(null);
  }

  if (packages.length === 0 || loading) {
    return <Loading />;
  }

  if (paypalUrl) {
    return <WebView source={{ uri: paypalUrl }} onNavigationStateChange={onUrlChange} />
  }


  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width * 0.8)); // Assuming each item is about 80% of the screen width
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
  };

  const onScrollEnd = () => {
    setScrolling(false);
  };

  const isPackageExpired = moment(moment().format('YYYY-MM-DD')).isAfter(currPackage?.end_date);

  return (
    <Background dark={1}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Header
            headerText="Subscriptions"
            secondIcon={<SecondIcon />}
            showSecondIcon
          />
          <Br space={0.1} />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <FlatList
              onScroll={onScroll}
              onMomentumScrollEnd={onScrollEnd} // When scroll finishes
              showsHorizontalScrollIndicator={false}
              snapToInterval={width} // Make each item snap to the center
              decelerationRate="fast" // Smooth scrolling effect
              snapToAlignment="center"
              horizontal contentContainerStyle={{gap: 20}}  data={packages} renderItem={({item,index}) => {
                console.log('identifier',item.product?.identifier)
                     return (  
                      <TouchableOpacity key={index} style={styles.slide}>
                        <Card
                          showActiveTag={!isPackageExpired ? `${'$' + currPackage?.pacakge_detail?.price}` == item.product?.priceString : isPackageExpired}
                          showFreeTag={item?.title === 'Free'}
                          title={item?.packageType === 'MONTHLY' ? '1 Month Package' : item?.packageType === 'THREE_MONTH' ? '3 Month Package' : item?.packageType === 'FREE_TRIAL' ? 'Free Trial - 1 Month' : '1 Year Package'}
                          content={<CardContent data={item} />}
                        />
                        <Br space={0.03} />
                       {/* {item.packageType != 'FREE_TRIAL' &&
                        <Button
                              loading={loading}
                              style={{width: width * 0.8}}
                              onPress={() => upgradePackage(item)}>
                              Choose This
                            </Button>
                          } */}
                        {
                      `${'$' + currPackage?.pacakge_detail?.price}` == item.product?.priceString && !isPackageExpired || item.title === 'Free' ? (
                            null
                           ) : (
                            <Button
                              loading={purchaseLoading}
                              style={{width: width * 0.8}}
                              onPress={() => upgradePackage(item)}>
                              Choose This
                            </Button>
                          )
                        }
                      </TouchableOpacity>
                    );
              }} 
              />  
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  slide: {
    height: height * 0.6,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
