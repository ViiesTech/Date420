import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H4, H5, H6, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Edit, Heart, MaskLeft, RecordCircle } from 'iconsax-react-native';
import Footer from '../../components/Footer';
import { Button, ButtonOuline } from '../../components/Button';
import { getChatInbox, getGroupInbox } from '../../APIManager';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');
const Inbox = ({ navigation }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [chatInbox, setChatInbox] = useState([]);
    const [groupInbox, setGroupInbox] = useState([]);
    const [isChat, setIsChat] = useState(true);

    useEffect(() => {
        if (isChat) {
            loadChatInbox();
        } else {
            loadGroupInbox();
        }
    }, [isChat, isFocused])
    const ChatItem = ({ item }: { item: any }) => {
        const img = isChat ? item?.photo : item?.get_photo?.url;
        const title = isChat ? item?.name : item?.title;
        return (
            <>
                <TouchableOpacity onPress={() => navigation.navigate('Chat', {
                    photo: img,
                    name: title,
                    user_id: item?.user_id,
                    group_id: item?.id
                })}
                    style={styles.chatItem}
                >
                    <Image source={{ uri: img }} style={styles.chatUserImage} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.74 }}>
                        <View>
                            <H6 numberOfLines={1}>{title}</H6>
                            <Pera numberOfLines={1} style={{ color: Color('whiteText') }}>{item?.last_message.length === 0 ? "No Chat Found" : item?.last_message}</Pera>
                        </View>
                        {/* <View>
                            <Pera style={{marginBottom: height * 0.005}}>05:42</Pera>
                            <View style={{width: 20, height: 20, borderRadius: 50, backgroundColor: Color('primary'), alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end'}}>
                                <Pera style={{color: Color('btnText')}}>1</Pera>
                            </View>
                        </View> */}
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    const loadChatInbox = async () => {
        await getChatInbox(setChatInbox);
    }
    const loadGroupInbox = async () => {
        await getGroupInbox(setGroupInbox);
    }
    return (
        <>
            <Background dark={1}>
                <View style={{ paddingBottom: height * 0.4 }}>
                    <Header
                        navigation={navigation}
                        hideMenu="true"
                        headerText="Inbox"
                        showMenu
                        backBtn
                    />
                    <Br space={0.05} />
                    {
                        isChat
                            ?
                            <View style={{ flexDirection: 'row' }}>
                                <ButtonOuline style={{ width: width * 0.45, borderTopEndRadius: 0, borderBottomRightRadius: 0, backgroundColor: Color('primary_opactiy_15') }} fontSize={20} onPress={() => setIsChat(true)}>
                                    All Chat
                                </ButtonOuline>
                                <Button style={{ width: width * 0.45, borderTopStartRadius: 0, borderBottomLeftRadius: 0 }} fontSize={20} onPress={() => setIsChat(false)}>
                                    Groups
                                </Button>
                            </View>
                            :
                            <View style={{ flexDirection: 'row' }}>
                                <Button style={{ width: width * 0.45, borderTopEndRadius: 0, borderBottomRightRadius: 0 }} fontSize={20} onPress={() => setIsChat(true)}>
                                    All Chat
                                </Button>
                                <ButtonOuline style={{ width: width * 0.45, borderTopStartRadius: 0, borderBottomLeftRadius: 0, backgroundColor: Color('primary_opactiy_15') }} fontSize={20} onPress={() => setIsChat(false)}>
                                    Groups
                                </ButtonOuline>
                            </View>
                    }

                    <Br space={0.03} />
                    {(isChat && chatInbox?.length < 1) || (!isChat && groupInbox?.length < 1) ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                            {isChat
                                ? "No chats yet. Start a conversation to see it here!"
                                : "No groups found. Join or create a group to get started!"}
                        </Text>
                    ) : (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={isChat ? chatInbox : groupInbox}
                            renderItem={({ item, index }) => <ChatItem item={item} />}
                            keyExtractor={(item, index) => 'key' + index}
                        />
                    )}
                </View>
            </Background>
            <Footer activeIndex={2} />
        </>
    )
}

export default Inbox;

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.015,
        borderBottomColor: Color('primary_300'),
        borderBottomWidth: 1,
        gap: 10
    },
    chatUserImage: {
        width: 50,
        height: 50,
        borderRadius: 100
    }
})