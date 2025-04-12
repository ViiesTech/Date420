import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { H5, Pera } from '../utils/Text';
import { ArrowLeft, Category2 } from 'iconsax-react-native';
import { Color } from '../utils/Colors';
import { useDispatch } from 'react-redux';
import { showDrawer } from '../redux/Reducers/drawerSlice';

const { width, height } = Dimensions.get('window');
interface Props {
    headerText?: string,
    showSecondIcon?: boolean,
    secondIcon?: any,
    hideMenu?: string,
    backBtn?: boolean,
    navigation?: any,
    showMenu?: boolean,
    backScreen?: any,
}

const Header = ({backScreen, showMenu,  navigation, backBtn, hideMenu, headerText, showSecondIcon, secondIcon}: Props) => {
    const dispatch = useDispatch();

    return (
        <>
            {backBtn && (
                <TouchableOpacity onPress={() => {
                    if (backScreen) {
                        navigation.navigate(backScreen)
                    }else {
                        navigation.goBack()
                    }
                }} style={styles.backIcon}>
                    <ArrowLeft size="25" color={Color('primary')} />
                </TouchableOpacity>
            )}
            {!hideMenu && <Image source={require('../assets/images/app_icon.png')} style={styles.logo} />}
            <H5 style={styles.headerText}>{headerText}</H5>
            
            {
                showSecondIcon && (
                    <View style={styles.optionalIcon}>
                        {secondIcon}
                    </View>
                )
            }
            {
                (!hideMenu || showMenu) && (
                    <TouchableOpacity onPress={() => dispatch(showDrawer())} style={styles.drawerIcon}>
                        <Category2 size="25" color={Color('whiteText')} variant="Bold" />
                    </TouchableOpacity>
                )
            }
                      
        </>
    )
}

export default Header;

const styles = StyleSheet.create({
    logo: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: height * 0.01,
        left: width * 0.03,
        borderRadius: 50,
        overflow: 'hidden'
    },
    headerText: {
        marginTop: height * 0.02,
        textAlign: 'center',
        width: width * 0.9,
        zIndex: 1,
    },
    optionalIcon: {
        position: 'absolute',
        top: height * 0.02,
        right: width * 0.12,
        zIndex: 1
    },
    drawerIcon: {
        position: 'absolute',
        top: height * 0.02,
        right: width * 0.01,
        zIndex: 1
    },
    backIcon: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.01,
        zIndex: 2
    }
})