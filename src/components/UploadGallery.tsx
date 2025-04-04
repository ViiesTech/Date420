import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonOuline } from './Button';
import { Color } from '../utils/Colors';
import { CloseCircle, TagCross } from 'iconsax-react-native';

interface Props {
}

const { width, height } = Dimensions.get('window');

const UploadGallery = ({ }: Props) => {
    function alert(arg0: string) {
        throw new Error('Function not implemented.');
    }

    const standardWidth = width * 0.8;
    const numColumns = 3;
    const size = (standardWidth) / numColumns;

    const data = [
        { id: 'a', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'b', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'c', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'd', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'e', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'f', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'a', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'b', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'c', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'd', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'e', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
        { id: 'f', image: 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2068' },
    ];

    const GalleryImage = ({ item }: { item: any }) => {
        return (
            <View style={styles.galleryImage}>
                <Image source={{uri : item.image}} style={{width: size, height: size, borderRadius: 6}} />
                <TouchableOpacity style={styles.cross}>
                    <CloseCircle size="25" color={Color('galleryCross')} variant="Bold" />
                    <View style={styles.crossInner}></View>
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <View>
            <ButtonOuline style={{marginBottom: height * 0.02}} fontSize={15} onPress={() => alert('')}>Upload</ButtonOuline>
            <FlatList
                data={data}
                style={{ width: width * 0.9, alignSelf: 'center' }}
                renderItem={({ item }) => <GalleryImage item={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingTop: height * 0.02, paddingRight: width * 0.02, gap: 10, alignItems: 'center' }}
                columnWrapperStyle={{ gap: 10 }}
                numColumns={numColumns} />
        </View>
    )
}

export default UploadGallery;

const styles = StyleSheet.create({
    galleryImage: {
        borderRadius: 6,
        borderColor: Color('primary'),
        borderWidth: 1,
        position: 'relative'
    },
    cross: {
        position: 'absolute',
        top: -(height * 0.01),
        right: -(width * 0.02),
        alignItems: 'center',
        justifyContent: 'center'
    },
    crossInner: {
        backgroundColor: 'black',
        width: width * 0.001,
        height: height * 0.001
    }
})