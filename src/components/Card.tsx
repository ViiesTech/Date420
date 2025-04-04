import React from 'react';
import { Dimensions, View } from 'react-native';
import { Color } from '../utils/Colors';
import { H3, H4, H6 } from '../utils/Text';
import Br from './Br';
import { Button } from './Button';

const { width, height } = Dimensions.get('window');

interface Props {
    showFreeTag?: boolean,
    showActiveTag?: boolean,
    title?: string,
    content?: any,
    showBtn?: boolean,
    btnText?: string,
    btnFunc?: any
}

const Card = ({ showFreeTag, showActiveTag, title, content, showBtn, btnText, btnFunc }: Props) => {

    const ActiveTag = () => {
        return (
            <View style={{
                borderRadius: 100,
                backgroundColor: Color('galleryCross'),
                paddingBottom: width * 0.015,
                paddingHorizontal: width * 0.05
            }}>
                <H6 style={{ color: Color('whiteText'), fontFamily: "Manrope-font" }}>Active</H6>
            </View>
        )
    }
    const FreeTag = () => {
        return (
            <>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                    backgroundColor: Color('primary'),
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: -50,
                    zIndex: 1
                }}>
                    <H4 style={{ color: Color('btnText') }}>FREE</H4>
                </View>
            </>
        )
    }
    return (
        <View style={{
            borderColor: Color('primary'),
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: Color('primary_300'),
            paddingHorizontal: width * 0.1,
            paddingBottom: height * 0.07,
            paddingTop: showFreeTag ? width * 0.2 : width * 0.1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: width * 0.9,
            zIndex: 1
        }}>
            {/* <View style={{zIndex: -1 , position: 'absolute', top: height * 0.02, left: -(width * 0.025), width: width * 0.9, height: height * 0.35, borderWidth: 1, borderColor: Color('primary'), borderRadius: 10}}></View> */}
            {showFreeTag && <FreeTag />}
            {showActiveTag && <ActiveTag />}
            <Br space={0.03} />
            <H3 style={{color: Color('whiteText')}}>{title}</H3>
            <Br space={0.03} />
            {content}
            {
                showBtn && <Button style={{paddingHorizontal: width * 0.1, position: 'absolute', bottom: -30}} onPress={() => btnFunc()}>{btnText}</Button>
            }
        </View>
    )
}

export default Card;