import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Background from '../utils/Background';
import { Dimensions, FlatList, Image, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Br from '../../components/Br';
import { H6, Pera, Small } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Add, ArrowLeft, Send2, Setting5 } from 'iconsax-react-native';
import Input from '../../components/Input';
import { chatUUID, getChat, getGroupChat, onChat, onGroupChat, socket } from '../../APIManager';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');
const Chat = ({ navigation, route }: { navigation: any, route: any }) => {
  const scrollViewRef: any = useRef();
  const [chat, setChat]: any = useState([]);
  const [UUID, setUUID]: any = useState();
  const [currUser, setCurrUser]: any = useState();
  const [username, setName]: any = useState("");
  const [userphoto, setPhoto]: any = useState("");
  const { user_id, photo, name, group_id } = route?.params;
  const OwnTweet = ({ time, tweet, index, dateTime }: { dateTime: any, time: any, tweet: any, index: any }) => {
    const timezoneOffset: any = new Date().getTimezoneOffset().toString().split('-').pop();
    const serverTime = new Date(dateTime);
    const userTime = new Date(serverTime.getTime() + (parseInt(timezoneOffset) * 60000));
    const formattedTime = userTime.toISOString().split('T').pop()?.split('.').shift();


    
    
    // TESTED ONLY IN PAKISTAN
    // NEED TO TEST IN OTHER COUNTRIES
    // const tweetTime = moment(formattedTime, 'hh:mm:ss').format('hh:mm A') // CHANGED 2024-08-26 moment(time, 'HH:mm:ss').format('hh:mm A');
    const tweetTime = moment(time, 'HH:mm:ss').format('hh:mm A');
    return (
      <>
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <H6 numberOfLines={1}>
              {username}
            </H6>
            <Image source={{ uri: userphoto }} style={{
              width: 30,
              height: 30,
              borderRadius: 100
            }} />
          </View>
        </View>
        <Br space={0.005} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Color('primary'), paddingVertical: height * 0.015, paddingHorizontal: width * 0.06, borderTopLeftRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}>
            <Pera style={{ color: Color('btnText') }}>{tweet}</Pera>
          </View>
        </View>
        <Br space={0.01} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Small>{tweetTime}</Small>
        </View>
        <Br space={0.02} />
      </>
    )
  };
  const OtherTweet = ({ time, tweet, index, name, profilePhoto }: { profilePhoto: any, name: any, time: any, tweet: any, index: any }) => {
    const tweetTime = moment(time, 'HH:mm:ss').format('hh:mm A');
    return (
      <>
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={{ uri: profilePhoto }} style={{
              width: 30,
              height: 30,
              borderRadius: 100
            }} />
            <H6>
              {name}
            </H6>
          </View>
        </View>
        <Br space={0.005} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ backgroundColor: Color('otherChatBackground'), paddingVertical: height * 0.015, paddingHorizontal: width * 0.06, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}>
            <Pera style={{ color: Color('whiteText') }}>{tweet}</Pera>
          </View>
        </View>
        <Br space={0.01} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Small>{tweetTime}</Small>
        </View>
        <Br space={0.02} />
      </>
    )
  };

  useEffect(() => {
    if (!group_id) {
      getUUID(true);
    }else {
      loadGroupChat();
    }
    loadMyData();

    socket.on('receive_user_message', (data: any) => {
      if (parseInt(data?.user_id) === parseInt(user_id) || parseInt(data?.user_id) === parseInt(currUser)) loadChat(UUID);
    });

    socket.on('receive_group_chat', (data: any) => {
      if (parseInt(data?.group_id) === parseInt(group_id)) loadGroupChat();
    });
  }, []);

  const loadGroupChat = async () => {
    const res = await getGroupChat(group_id);
    setChat(res?.data?.get_chat);
  }
  const loadMyData = async () => {
    const loginSession: any = await AsyncStorage.getItem("token");
    setName(JSON.parse(loginSession)?.name);
    setPhoto(JSON.parse(loginSession)?.profile_photo);
    setCurrUser(JSON.parse(loginSession)?.user_id);
  }
  const loadChat = async (id?: any) => {
    const chatID = UUID || id;
    if (chatID) {
      const res = await getChat(chatID);
      setChat(res?.data?.chats);
    }else {
      getUUID(true);
    }
  }
  const getUUID = async (isToLoadChat?: any) => {
    const receivedUUID = await chatUUID(user_id);
    setUUID(receivedUUID?.data?.uuid);
    if (isToLoadChat) loadChat(receivedUUID?.data?.uuid);
  }
  const ChatInputBox = () => {
    const [textMsg, setTextMsg]: any = useState("");

    const filterBadWords = (text: string) => {
      const badWords = [
        'porn', 'blowjob', 'anal', 'nude', 'sex', 'fetish', 'bdsm', 'orgasm', 'xxx',
        'slut', 'dick', 'pussy', 'kill', 'rape', 'shoot', 'stab', 'bomb', 'attack',
        'choke', 'beat', 'murder', 'n\\*\\*r', 'tranny', 
        'terrorist', 'retard', 'bitch'
      ];
    
      const escapeRegex = (word: string) =>
        word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    
      const escapedWords = badWords.map(escapeRegex);
      const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    
      const result = text.replace(regex, (match) => {
        console.log("Matched:", match);
        return '*'.repeat(match.length);
      });
    
      return result;
    };
    
    const onEnterChat = async () => {
      if (textMsg.length > 0) {
        // alert(textMsg)
        Keyboard.dismiss();
        const chatID = UUID || uuidv4();
        const cleanedText = filterBadWords(textMsg.trim()); 

      //  return alert(cleanedText)
    
        Toast.show('Sending Message...', Toast.SHORT);

        // if (regex.test(textMsg)) {
        //   Toast.show('Your message contains inappropriate words.', Toast.LONG);
        //   return;
        // }
    
        if (group_id) {
          const submittedChat = await onGroupChat(group_id, cleanedText);
          if (submittedChat.status === 'success') {
            setTextMsg("");
            socket.emit('group_message', submittedChat.data);
          }
        } else {
          const submittedChat = await onChat(chatID, user_id, cleanedText);
          if (submittedChat.status === 'success') {
            if (!UUID) getUUID();
            setTextMsg("");
            socket.emit('send_user_message', submittedChat.data);
          }
        }
      }
    };
    

    // const onEnterChat = async () => {
    //   if (textMsg.length > 0) {
    //     Keyboard.dismiss();
    //     const chatID = UUID || uuidv4();
    //     Toast.show('Sending Message...', Toast.SHORT);

    //     if (group_id) {
    //       const submittedChat =  await onGroupChat(group_id, textMsg);
    //       if (submittedChat.status === 'success') {
    //         setTextMsg("");
    //         socket.emit('group_message', submittedChat.data);
    //       }
    //     }else {
    //       const submittedChat =  await onChat(chatID, user_id, textMsg);
    //       if (submittedChat.status === 'success') {
    //         if (!UUID) getUUID();
    //         setTextMsg("");
    //         socket.emit('send_user_message', submittedChat.data);
    //       }
    //     }
    //   }
    // }
    return (
      <>
        <View
          style={{
            position: 'absolute',
            bottom: height * 0.01,
            left: width * 0.05,
            width: width * 0.9,
            backgroundColor: Color('background'),
          }}>
          <Input
            value={textMsg}
            label={false}
            color={Color('primary')}
            icon={<Add size="25" color={Color('primary')} />}
            placeholder="Type your message..."
            placeholderColor={Color('primary')}
            onChange={(text: any) => setTextMsg(text)}
            secondIcon={
              <TouchableOpacity onPress={onEnterChat}>
                <Send2 size="25" color={Color('primary')} />
              </TouchableOpacity>
            }
          />
        </View>
      </>
    )
  }
  const onContentLoad = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }

  return (
    <>
      <Background dark={1}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size="32" color={Color('primary')} variant="Outline" />
          </TouchableOpacity>
          <View
            style={{
              width: width * 0.8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => navigation.replace('UsersProfile', { user_id: user_id })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Image
                source={{ uri: photo }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                }}
              />
              <View>
                <H6 numberOfLines={1}>{name}</H6>
                {/* <Pera style={{ color: Color('whiteText') }}>Online</Pera> */}
              </View>
            </TouchableOpacity>
            {/* <Setting5 size="25" color={Color('primary')} variant="Outline" /> */}
          </View>
        </View>
        <Br space={0.03} />
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} onContentSizeChange={onContentLoad} style={{height: height < 650 ? (height * 0.7) : (height * 0.75)}}>
          {
            chat?.reverse()?.map((val: any, index: any) => {
              if (val?.user_id === user_id || val?.user_id !== parseInt(currUser)) {
                return (
                  <View key={index}>
                    <OtherTweet profilePhoto={group_id ? val?.get_user?.get_user_profile_photo?.url : photo} name={group_id ? val?.get_user?.name : name} index={index} time={val.created_at.substring(11, 19)} tweet={group_id ? val.message : val.text} />
                  </View>
                )
              } else {
                return (
                  <View key={index}>
                    <OwnTweet index={index} dateTime={val.created_at} time={val.created_at.substring(11, 19)} tweet={group_id ? val.message : val.text} />
                  </View>
                )
              }
            })
          }
        </ScrollView>
        <Br space={0.1} />
      </Background>
      <ChatInputBox />
    </>
  );
}

export default Chat;