import React, { useEffect } from 'react';
import { Image, StyleSheet, View, Dimensions, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { getAppData } from '../../APIManager';
import { useDispatch, useSelector } from 'react-redux';
import { saveAppData } from '../../redux/Reducers/appSlice';
import { H6 } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import Purchases from 'react-native-purchases';

const { width, height } = Dimensions.get('screen');

const Splash = ({ navigation }: { navigation: any }) => {
    const dispatch = useDispatch();
    const splashTimeout = useSelector(({ app }: { app: any }) => app?.splashTimeout);

    useEffect(() => {
        if (splashTimeout === null) {
            getData();
        }
    }, [splashTimeout]);

      useEffect(() => {
    
        offerings()
    
    
      },[])
    
      const offerings = async () => {
      try {  
        const offering = await Purchases.getOfferings();
        console.log('hh',offering.current?.availablePackages)
        // alert(offering.current)
    } catch (error) {
        console.log(error)
    }
    
      }

    const getData = async () => {
        const res = await getAppData();
        dispatch(saveAppData(res?.data));
    }

    return (
        <View>
            <Image
                source={require('../../assets/images/splash/splash.jpg')}
                style={styles.container}
            />
            <ImageBackground style={{ position: 'absolute', bottom: height * 0.07, left: width * 0.05, width: width * 0.9, zIndex: 1 }} resizeMode='stretch' source={require('../../assets/images/button.png')}>
                <TouchableOpacity onPress={() => navigation.replace('Signin')} style={{ paddingVertical: height * 0.025 }}>
                    <H6 style={{ textAlign: 'center', color: Color('whiteText') }}>Start Dating</H6>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    }
});