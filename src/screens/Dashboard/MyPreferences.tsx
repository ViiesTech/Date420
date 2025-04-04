import React, { useEffect, useState } from 'react';
import Background from '../utils/Background';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Br from '../../components/Br';
import { H5, Pera } from '../../utils/Text';
import { Color } from '../../utils/Colors';
import { Button } from '../../components/Button';
import Toast from 'react-native-simple-toast';
import { getPreferences, updatePreferences } from '../../APIManager';
import Loading from '../Loading';

const { width, height } = Dimensions.get('window');
const MyPreferences = ({ navigation }: { navigation: any }) => {
    const [ loading, setLoading ]: any = useState(true);
    const [ preference, setPreference ]: any = useState();
    const Option = ({ item, selected, prefKey }: { prefKey?: any, item?: any, selected?: any }) => {
        return (
            <>
                <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: width * 0.9,
                    paddingVertical: 10
                }}
                onPress={() => {
                    setPreference({
                        ...preference,
                        [prefKey]: preference[prefKey] > 0 ? 0 : 1
                    });
                }}
                >
                    <View style={{width: width * 0.74}}>
                        <H5 style={{ color: Color('whiteText') }}>{item.label}</H5>
                        <Pera style={{ color: Color('whiteText') }}>{item.description}</Pera>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setPreference({
                            ...preference,
                            [prefKey]: preference[prefKey] > 0 ? 0 : 1
                        });
                    }} style={{padding: height * 0.005, gap: height * 0.005, alignItems: 'center', backgroundColor: Color('primary_opactiy_15'), borderRadius: height * 0.3, flexDirection: 'row'}}>
                        <View style={{padding: height * 0.01, backgroundColor: preference[prefKey] > 0 ? 'transparent' : Color('primary_100'), borderRadius: height * 0.5}}></View>
                        <View style={{padding: height * 0.01, backgroundColor: preference[prefKey] < 1 ? 'transparent' : Color('primary_100'), borderRadius: height * 0.5}}></View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        loadPreferences();
    }, [])

    const loadPreferences = async () => {
        await getPreferences(setPreference);
        setLoading(false);
    }
    const updatePref = async () => {
        setLoading(true);
        const res = await updatePreferences(
            preference?.subscription,
            preference?.message,
            preference?.group,
            preference?.events,
            preference?.blogs,
        );
        if (res?.status === 'success') {
            Toast.show(res?.message, Toast.SHORT);
            loadPreferences();
        }else {
            setLoading(false);
            Alert.alert("Failed to Update Preferences");
        }
    }

    if (!preference) {
        return <Loading />
    }

    return (
        <>
            <Background dark={1}>
                <View>
                    <Header
                        navigation={navigation}
                        hideMenu="true"
                        headerText="My Preferences"
                        showMenu
                        backBtn
                    />
                    <Br space={0.05} />
                    
                    <Option prefKey="subscription" selected={preference?.subscription > 0} item={{ label: "Subscribe to Newsletter", description: "Uncheck this box to stop receiving any mails" }} />

                    <Option prefKey="message" selected={preference?.message > 0} item={{ label: "Message", description: "Someone Sends Me a New Chat Message" }} />

                    <Option prefKey="group" selected={preference?.group > 0} item={{ label: "Group", description: "Someone Invites Me To a Group" }} />

                    <Option prefKey="events" selected={preference?.events > 0} item={{ label: "Events", description: "Someone Add New Event" }} />

                    <Option prefKey="blogs" selected={preference?.blogs > 0} item={{ label: "Blogs", description: "Someone Add New Blog" }} />

                    <Br space={0.03} />
                    <Button loading={loading} onPress={updatePref} style={{width: width * 0.4, marginLeft: width * 0.1}}>Update</Button>
                </View>
            </Background>
        </>
    )
}

export default MyPreferences;