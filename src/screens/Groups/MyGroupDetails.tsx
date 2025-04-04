import React, {useEffect, useState} from 'react';
import Background from '../utils/Background';
import Toast from 'react-native-simple-toast';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Br from '../../components/Br';
import {H3, H4, Pera, Small} from '../../utils/Text';
import {Color} from '../../utils/Colors';
import {Add, ArrowLeft, CloseCircle, Edit} from 'iconsax-react-native';
import Footer from '../../components/Footer';
import {AvatarList} from '../../components/GroupAvatar';
import {getGroupDetails, updateGroup} from '../../APIManager';
import Loading from '../Loading';
import {nFormatter} from '../../utils/nFormatter';
import {useIsFocused} from '@react-navigation/native';
import Input from '../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('screen');
const MyGroupsDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) => {
  const isFocused = useIsFocused();
  const [group, setGroup]: any = useState();

  const [editTitle, setEditTitle]: any = useState(false);
  const [editedTitle, setEditedTitle]: any = useState('');

  const [editDesc, setEditDesc]: any = useState(false);
  const [editedDesc, setEditedDesc]: any = useState('');

  const [loading, setLoading]: any = useState(false);
  const {group_id} = route?.params;

  useEffect(() => {
    if (isFocused) loadDetails();
  }, [isFocused]);

  const loadDetails = async () => {
    setGroup();
    const details = await getGroupDetails(group_id);
    setGroup(details.data);
  };
  const updateDetails = async () => {
    setLoading(true);
    Toast.show('Updating Group Details...', Toast.SHORT);
    const groupTitle = editedTitle.length > 0 ? editedTitle: group?.title;
    const description = editedDesc.length > 0 ? editedDesc: group?.desc;
    const res = await updateGroup(group_id, description, groupTitle);
    setLoading(false);
    if (res.status === 'success') {
      
      setEditTitle(false);
      setEditDesc(false);
      setEditedTitle("");
      setEditedDesc("");

      loadDetails();
      Toast.show(res?.message, Toast.SHORT);
    }else {
      Toast.show('Failed to update Group Details...', Toast.SHORT);
    }
  };

  if (!group) {
    return <Loading />;
  }
  const numberOfMembers = group?.get_group_members?.length;

  const Header = () => {
    const [user, setUser]: any = useState();
    useEffect(() => {
      loadUserData()
    }, []);

    const loadUserData = async () => {
      const loginSession: any = await AsyncStorage.getItem("token");
      setUser(JSON.parse(loginSession));
    }
    if (!user) {
      return <></>;
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size="32" color={Color('primary')} variant="Outline" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', {
            photo: group?.get_photo?.url,
            name: group?.title,
            user_id: user?.user_id,
            group_id: group_id
          })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Color('primary'),
            paddingVertical: height * 0.01,
            paddingHorizontal: width * 0.04,
            borderRadius: 6,
          }}>
          <Small style={{color: Color('btnText')}}>Start Chat</Small>
        </TouchableOpacity>
      </View>
    );
  }
  const GroupLabel = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <H3>My Groups</H3>
          <Pera style={{color: Color('whiteText')}}>Your created groups.</Pera>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddMembers', {
              group_id: group_id,
              members: JSON.stringify(group?.get_group_members),
            })
          }
          style={{alignItems: 'flex-end'}}>
          <View
            style={{
              borderColor: Color('primary'),
              borderWidth: 1,
              borderRadius: 10,
              borderBottomLeftRadius: 0,
            }}>
            <Add size="25" color={Color('primary')} variant="Outline" />
          </View>
          <Pera style={{color: Color('whiteText')}}>Add Members</Pera>
        </TouchableOpacity>
      </View>
    );
  }
  const Title = () => {
    const [titleToEdit, setTitle]: any = useState('');
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
        {editTitle ? (
          <Input
            defaultValue={editedTitle.length ? editedTitle : group?.title}
            label={false}
            color={Color('primary')}
            placeholder="Title"
            placeholderColor={Color('primary')}
            onChange={(text: any) => setTitle(text)}
            onBlur={() => setEditedTitle(titleToEdit)}
          />
        ) : (
          <H4 style={{color: Color('whiteText')}}>{group?.title}</H4>
        )}
        <TouchableOpacity onPress={() => setEditTitle(!editTitle)}>
          {editTitle ? (
            <CloseCircle
              size="20"
              color={Color('galleryCross')}
              variant="Outline"
            />
          ) : (
            <Edit size="20" color={Color('primary')} variant="Outline" />
          )}
        </TouchableOpacity>
      </View>
    );
  }
  const Description = () => {
    const [descToEdit, setDesc]: any = useState('');
    return (
      <>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <H4>Description</H4>
          <TouchableOpacity onPress={() => setEditDesc(!editDesc)}>
            {editDesc ? (
              <CloseCircle
                size="20"
                color={Color('galleryCross')}
                variant="Outline"
              />
            ) : (
              <Edit size="20" color={Color('primary')} variant="Outline" />
            )}
          </TouchableOpacity>
        </View>
        <Br space={0.01} />
        {editDesc ? (
          <Input
            defaultValue={editedDesc.length ? editedDesc : group?.desc}
            label={false}
            color={Color('primary')}
            placeholder="Description (200 words)"
            placeholderColor={Color('primary')}
            onChange={(text: any) => setDesc(text)}
            numberOfLines={4}
            style={{height: height * 0.15}}
            onBlur={() => setEditedDesc(descToEdit)}
          />
        ) : (
          <Pera style={{color: Color('whiteText'), textAlign: 'justify'}}>{group?.desc}</Pera>
        )}
      </>
    );
  }
  const NoOfMembers = () => {
    return (
      <>
        {numberOfMembers > 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RemoveMembers', {
                group_id: group_id,
                members: JSON.stringify(group?.get_group_members),
              })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 25,
            }}>
            <AvatarList width={35} height={35} arr={group?.get_group_members} />
            <Pera>
              {nFormatter(numberOfMembers, 1)} Member
              {numberOfMembers > 1 && 's'}
            </Pera>
          </TouchableOpacity>
        )}
      </>
    );
  }
  const BannerImage = () => {
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: height * 0.015,
            right: width * 0.025,
            zIndex: 1,
          }}>
          <Edit
            size="25"
            color={Color('primary')}
            variant="Outline"
          />
        </TouchableOpacity>
        <Image
          source={{ uri: group?.get_photo?.url }}
          style={{
            width: '100%',
            height: height * 0.35,
            borderColor: Color('primary'),
            borderWidth: 1,
            borderBottomWidth: 0,
          }}
          resizeMode="cover"
        />
      </View>
    )
  }

  return (
    <>
      <Background dark={1}>
        <View>
          <Br space={0.02} />
          <Header />
          <Br space={0.03} />
          <GroupLabel />
          <Br space={0.04} />
          <View>
            <BannerImage />
            <View
              style={{
                borderColor: Color('primary'),
                borderWidth: 1,
                borderTopWidth: 0,
                paddingVertical: height * 0.03,
                paddingHorizontal: width * 0.03,
              }}>
              <Title />
              <NoOfMembers />
              <Br space={0.03} />
              <Description />
            </View>
          </View>
        </View>
        {(editedTitle.length > 0 || editedDesc.length > 0) && (
          <TouchableOpacity
            onPress={updateDetails}
            disabled={loading}
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: height * 0.05,
              zIndex: 2,
              right: width * 0.25,
              backgroundColor: Color('primary'),
              paddingVertical: height * 0.01,
              width: width * 0.5,
              borderRadius: 6,
            }}>
            <Pera style={{color: Color('btnText')}}>Update Details</Pera>
          </TouchableOpacity>
        )}
      </Background>
    </>
  );
};

export default MyGroupsDetails;
