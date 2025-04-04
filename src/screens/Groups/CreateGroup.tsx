import React, {useState} from 'react';
import Background from '../utils/Background';
import {
    Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Br from '../../components/Br';
import {H2, Pera, Small} from '../../utils/Text';
import {Color} from '../../utils/Colors';
import {ArrowLeft, GalleryExport} from 'iconsax-react-native';
import {Button} from '../../components/Button';
import Input from '../../components/Input';
import {launchImageLibrary} from 'react-native-image-picker';
import {Message} from '../../utils/Alert';
import {createGroup} from '../../APIManager';
import Toast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('screen');
const CreateGroup = ({navigation}: {navigation: any}) => {
  const [loading, setLoading]: any = useState(false);
  const [title, setTitle]: any = useState('');
  const [description, setDescription]: any = useState('');
  const [groupImage, setGroupImage]: any = useState({
    uri: null,
    base64: null,
    type: null,
  });

  const checkValidations = () => {
    if (!groupImage.uri) {
      Message('Photo is required', 'Please fill all the fields!');
      return;
    }

    if (title.length === 0) {
      Message('Title is required', 'Please fill all the fields!');
      return;
    }

    if (description.length === 0) {
      Message('Description is required', 'Please fill all the fields!');
      return;
    }

    return true;
  };
  const onAddGroup = async () => {
    const isValidData = checkValidations();
    if (isValidData) {
      setLoading(true);
      const group = await createGroup(
        `data:${groupImage.type};base64,${groupImage.base64}`,
        title,
        description,
      );
      if (group?.status === 'success') {
        Toast.show(group?.message, Toast.SHORT);
        navigation.replace('MyGroups');
      } else {
        const errors = Object.keys(group.errors).map(key => [
          key,
          group.errors[key],
        ]);
        Alert.alert(group.message, errors[0][1][0]);
        setLoading(false);
      }
    }
  };
  const onUpload = async () => {
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    });

    if (!result.didCancel && result.assets) {
      const uri = result?.assets[0]?.uri;
      const base64 = result.assets[0].base64;
      const type = result?.assets[0]?.type;
      setGroupImage({
        ...groupImage,
        uri: uri || '',
        base64: base64 || '',
        type: type || '',
      });
    }
  };
  return (
    <>
      <Background dark={1}>
        <Br space={0.02} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size="32" color={Color('primary')} variant="Outline" />
        </TouchableOpacity>
        <Br space={0.03} />
        <H2 style={{alignSelf: 'center'}}>Create a Group</H2>
        <Pera style={{alignSelf: 'center'}}>Enter your group details</Pera>
        <Br space={0.1} />
        <TouchableOpacity onPress={onUpload} style={{alignItems: 'center'}}>
          {groupImage.uri ? (
            <View style={styles.profileImage}>
              <Image
                source={{uri: groupImage.uri}}
                style={{width: 120, height: 120, borderRadius: 6}}
              />
            </View>
          ) : (
            <>
              <GalleryExport
                size="80"
                color={Color('primary')}
                variant="Bold"
              />
              <Br space={0.01} />
              <Small>Size: 350 x 350</Small>
            </>
          )}
        </TouchableOpacity>
        <Br space={0.1} />
        <Input
          value={title}
          label={false}
          color={Color('primary')}
          placeholder="Title"
          placeholderColor={Color('primary')}
          onChange={(text: any) => setTitle(text)}
        />
        <Br space={0.02} />
        <Input
          value={description}
          label={false}
          color={Color('primary')}
          placeholder="Description ( 200words)"
          placeholderColor={Color('primary')}
          style={{height: height * 0.15}}
          onChange={(text: any) => setDescription(text)}
          numberOfLines={4}
        />
        <Br space={0.03} />
        <Button loading={loading} onPress={onAddGroup}>
          Create New
        </Button>
        <Br space={0.1} />
      </Background>
    </>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomColor: Color('primary_300'),
    borderBottomWidth: 1,
    gap: 10,
  },
  chatUserImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  profileImage: {
    borderRadius: 6,
    overflow: 'hidden',
    borderColor: Color('primary'),
    borderWidth: 1,
    position: 'relative',
    width: 120,
    height: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
