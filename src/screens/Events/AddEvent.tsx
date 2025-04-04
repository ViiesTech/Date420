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
import {H2, H3, Pera, Small} from '../../utils/Text';
import {Color} from '../../utils/Colors';
import {ArrowLeft, GalleryExport} from 'iconsax-react-native';
import {Button} from '../../components/Button';
import Input from '../../components/Input';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {Message} from '../../utils/Alert';
import {createEvent} from '../../APIManager';
import Toast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('screen');
const AddEvent = ({navigation}: {navigation: any}) => {
  const patterns = useSelector(({app}: {app: any}) => app?.patterns);

  const phoneReg = new RegExp(patterns?.phone, 'gm');
  const urlReg = new RegExp(patterns?.url, 'gm');

  const [loading, setLoading]: any = useState(false);
  const [eventImage, setEventImage]: any = useState({
    uri: null,
    base64: null,
    type: null,
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('https://');
  const [phone, setPhone] = useState('');

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
      setEventImage({
        ...eventImage,
        uri: uri || '',
        base64: base64 || '',
        type: type || '',
      });
    }
  };
  const checkValidations = () => {
    if (!eventImage.uri) {
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

    if (url.length === 0) {
      Message('URL is required', 'Please fill all the fields!');
      return;
    }
    if (!urlReg.test(url)) {
      Message(
        'Invalid URL',
        'Please enter your valid website url with http/https protocol!',
      );
      return;
    }

    if (phone.length === 0) {
      Message('Phone Number is required', 'Please fill all the fields!');
      return;
    }
    if (!phoneReg.test(phone)) {
      Message('Invalid Phone Number', 'Please enter your valid phone number!');
      return;
    }

    return true;
  };
  const onAddEvent = async () => {
    const isValidData = checkValidations();
    if (isValidData) {
      setLoading(true);
      const event = await createEvent(
        `data:${eventImage.type};base64,${eventImage.base64}`,
        title,
        description,
        url,
        phone,
      );
      if (event?.status === 'success') {
        Toast.show('Event has been created!!', Toast.SHORT);
        navigation.replace('MyEvents');
      } else {
        setLoading(false);
        const errors = Object.keys(event?.errors).map(key => [
          key,
          event?.errors[key],
        ]);
        Alert.alert(event?.message, errors[0][1][0]);
      }
    }
  };
  return (
    <>
      <Background dark={0.7}>
        <Br space={0.02} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size="32" color={Color('primary')} variant="Outline" />
        </TouchableOpacity>
        <Br space={0.03} />
        <View>
          <H2 style={{alignSelf: 'center'}}>Create an Event</H2>
          <Pera style={{alignSelf: 'center'}}>Enter your event details</Pera>
          <Br space={0.1} />
          <TouchableOpacity onPress={onUpload} style={{alignItems: 'center'}}>
            {eventImage.uri ? (
              <View style={styles.profileImage}>
                <Image
                  source={{uri: eventImage.uri}}
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
          <Br space={0.05} />
          <H3>Get your tickets From</H3>
          <Br space={0.02} />
          <Input
            value={url}
            label={false}
            color={Color('primary')}
            placeholder="URL"
            placeholderColor={Color('primary')}
            onChange={(text: any) => setUrl(text)}
          />
          <Br space={0.02} />
          <Input
            value={phone}
            label={false}
            color={Color('primary')}
            placeholder="Phone"
            placeholderColor={Color('primary')}
            onChange={(text: any) => setPhone(text)}
          />
          <Br space={0.04} />
          <Button loading={loading} onPress={onAddEvent}>
            Add New Event
          </Button>
          <Br space={0.05} />
        </View>
      </Background>
    </>
  );
};

export default AddEvent;

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
