/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import Background from '../utils/Background';
import {Dimensions, StyleSheet, View} from 'react-native';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Br from '../../components/Br';
import {Button} from '../../components/Button';
import {H6, Pera, Small} from '../../utils/Text';
import {Color} from '../../utils/Colors';
import Toast from 'react-native-simple-toast';
import WebView from 'react-native-webview';
import queryString from 'query-string';

import Swiper from 'react-native-swiper';
import {
  ArrowCircleLeft2,
  ArrowCircleRight2,
  Notification,
} from 'iconsax-react-native';
import {getMyPackage, getPackages, subscribePackage} from '../../APIManager';
import Loading from '../Loading';
import {useIsFocused} from '@react-navigation/native';
import { captureSubscription, generateToken, subscribe } from '../../Paypal';
import { Message } from '../../utils/Alert';
import moment from 'moment';

const {width, height} = Dimensions.get('screen');

const Subscriptions = ({navigation}: {navigation: any}) => {
  const isFocused = useIsFocused();
  const [packages, setPackages]: any = useState([]);
  const [loading, setLoading]: any = useState(false);
  const [currPackage, setPackage]: any = useState();

  const [paypalUrl, setPaypalUrl]: any = useState(null);
  const [accessToken, setAccessToken]: any = useState(null);
  const [packageToSubscribe, setPackageToSubscribe]: any = useState(null);

  const SecondIcon = () => (
    <Notification size="25" color={Color('whiteText')} variant="Bold" />
  );
  const CardContent = ({data}: {data: any}) => {
    return (
      <>
        {data?.bullets.map((val: any, index: React.Key | null | undefined) => {
          return (
            <View key={index}>
              <H6 style={{color: Color('whiteText'), fontFamily: 'OrelegaOne'}}>
                - {val}
              </H6>
              <Br space={0.01} />
            </View>
          );
        })}
        <Br space={0.01} />
        <Pera>$ {parseFloat(data?.price).toFixed(2)}/-</Pera>

        {/* <H6 style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>- Create or Join Group</H6>
                <Br space={0.01} />
                <H6 style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>- Create Events</H6> */}
      </>
    );
  };

  useEffect(() => {
    if (isFocused) loadPackages();
  }, [isFocused]);

  useEffect(() => {
    if (packages.length > 0) loadCurrentPackage();
  }, [packages]);

  const loadCurrentPackage = async () => {
    await getMyPackage(setPackage);
  };

  const loadPackages = async () => {
    await getPackages(setPackages);
  };

  const upgradePackage = async (id: any, title: any, descArr: any, price: any) => {
    setLoading(true);
    try {
      if (parseFloat(price) < 1) {
        subscribeNow(id);
        return;
      }

      const desc = descArr.join(', ');
      const token = await generateToken();
      const res = await subscribe(token, title, desc, price);
      if (res?.links) {
        const findUrl = res.links.find((urls: any) => urls.rel === 'approve');
        setLoading(false);
        setPaypalUrl(findUrl?.href);
        setAccessToken(token);
        setPackageToSubscribe(id);
      }
    }catch (err) {
      clearPaypalState();
      Toast.show("Error: " + err, Toast.SHORT);
    }
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
          {text: "Okay", onPress: () => subscribeNow(packageToSubscribe)}
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

  if (packages.length === 0 || !currPackage || loading) {
    return <Loading />;
  }

  if (paypalUrl) {
    return <WebView source={{ uri: paypalUrl }} onNavigationStateChange={onUrlChange} />
  }

  const isPackageExpired = moment(moment().format('YYYY-MM-DD')).isAfter(currPackage?.end_date);

  return (
    <Background dark={1}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
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
            <Swiper
              showsPagination={false}
              showsButtons={true}
              style={{height: height * 0.6, paddingTop: height * 0.08}}
              nextButton={
                <ArrowCircleRight2 size="32" color={Color('whiteText')} />
              }
              prevButton={
                <ArrowCircleLeft2 size="32" color={Color('whiteText')} />
              }>
              {packages.map((val: any) => {
                return (
                  <View key={val.id} style={styles.slide}>
                    <Card
                      showActiveTag={parseInt(val.id) === currPackage?.package_id}
                      showFreeTag={val?.sub_heading === 'Free'}
                      title={val?.title}
                      content={<CardContent data={val} />}
                    />
                    <Br space={0.03} />
                    {
                      (parseInt(val.id) !== currPackage?.package_id || isPackageExpired) && (
                        <Button
                          loading={loading}
                          style={{width: width * 0.8}}
                          onPress={() => upgradePackage(val.id, val?.title, val?.bullets, val?.price)}>
                          Choose This
                        </Button>
                      )
                    }
                  </View>
                );
              })}
            </Swiper>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  slide: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
