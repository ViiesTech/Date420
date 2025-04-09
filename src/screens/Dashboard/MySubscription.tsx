import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, View } from 'react-native';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Br from '../../components/Br';
import { Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { getMyPackage } from '../../APIManager';
import Loading from '../Loading';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');
const MySubscription = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [currPackage, setPackage]: any = useState();

  console.log('my ajeeb',currPackage)
  const CardContent = () => {
    return (
      <>
        <Pera style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>
          {currPackage?.pacakge_detail?.sub_heading}
        </Pera>
        <Br space={0.01} />
        <Pera style={{ color: Color('whiteText'), fontFamily: 'OrelegaOne' }}>
          Next billing date -{' '}
          {moment(currPackage?.end_date).format('MMM DD, YYYY')}
        </Pera>
      </>
    );
  };

  useEffect(() => {
    if (isFocused) loadCurrentPackage();
  }, [isFocused]);

  const setExpiry = async () => {
    await AsyncStorage.setItem('expiry',currPackage?.end_date)    
  }

  const loadCurrentPackage = async () => {
    // return alert('hello world')
    await getMyPackage(setPackage);
     await setExpiry()
  };

  if (!currPackage) {
    return <Loading />;
  }

  return (
    <Background dark={1}>
      <View style={{ height: height * 0.9, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center' }}>
          <Header navigation={navigation} backScreen={'HotList'} hideMenu="true" showMenu backBtn headerText="My Subscription" />
          <Br space={0.05} />
          <Card
            showActiveTag
            showBtn
            title={currPackage?.pacakge_detail?.title}
            content={<CardContent />}
            btnText="Upgrade"
            btnFunc={() => navigation.navigate('Subscriptions')}
          />
        </View>
        {/* <Button onPress={() => navigation.navigate('Subscriptions')}>
          Cancel Subscription
        </Button> */}
      </View>
    </Background>
  );
};

export default MySubscription;
