import React from 'react';
import { Dimensions, FlatList, Image, Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Color } from '../../utils/Colors';
import Drawer from '../../components/Drawer';
import KeyboardView from './KeyboardView';

const { width, height } = Dimensions.get('screen');

interface Props {
    children: any,
    dark: number
}
const Background = ({children, dark}: Props) => {
    return (
        <>
            <Drawer />
            <SafeAreaView style={[styles.safeAreaView]}>
                <View style={[styles.darkness, {opacity: dark}]}></View>
                {/* RED SHADES */}
                <Image source={require('../../assets/images/shade2.jpg')} style={styles.shadeTop} />
                <Image source={require('../../assets/images/shade.png')} style={styles.shadeBottom} />
                {/* RED SHADES END */}

                <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage} />
                <View style={styles.content}>
                    <KeyboardView>
                        <View>
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <TouchableWithoutFeedback onPress={() => {
                                    Keyboard.dismiss();
                                }}>
                                    <View>
                                        {children}
                                    </View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </View>
                    </KeyboardView>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Background;

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    shadeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height * 0.3,
        zIndex: 1
    },
    shadeBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height * 0.3,
        zIndex: 1,
        opacity: 0.5
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height,
    },
    darkness: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: Color('background'),
        zIndex: 1
    },
    content: {
        zIndex: 1,
        paddingTop: height * 0.030,
        paddingHorizontal: width * 0.040,
    }
})