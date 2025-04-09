import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from './utils/Background';
import { Color } from '../utils/Colors';
import { H2, H4, H5, Pera } from '../utils/Text';
import Br from '../components/Br';
import { Button, ButtonOuline } from '../components/Button';
import { RecordCircle, TickSquare, User } from 'iconsax-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
// import DatePicker from 'react-native-date-picker';
import Input from '../components/Input';
import Dropdown from './utils/Dropdown';
import { useSelector } from 'react-redux';
import { Message } from '../utils/Alert';
import moment from 'moment';
import { onUpdateProfile } from '../APIManager';
import Toast from 'react-native-simple-toast';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

interface Props {
    navigation: any,
    route?: any
}

const { width, height } = Dimensions.get('window');
const EditProfile = ({ navigation, route }: Props) => {
    const currentDate = moment();

    const [About, setAbout] = useState('');
    const [DesiredAgeFrom, setDesiredAgeFrom] = useState('');
    const [DesiredAgeTo, setDesiredAgeTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeTurmofUse, setAgreeTurmofUse]: any[] = useState(false);

    const [wayToSpendTimeOptions, setWayToSpendTimeOptions]: any[] = useState([]);
    const [smokingOptions, setSmokingOptions]: any[] = useState([]);
    const [drinkingOptions, setDrinkingOptions]: any[] = useState([]);

    const [hairColorOptions, setHairColorOptions]: any[] = useState([]);
    const [eyeColorOptions, setEyeColorOptions]: any[] = useState([]);
    const [bodyTypeOptions, setBodyTypeOptions]: any[] = useState([]);
    const [ethnicityOptions, setEthnicityOptions]: any[] = useState([]);
    const [hereForOptions, setHereForOptions]: any[] = useState([]);
    const [lookingForOptions, setLookingForOptions]: any[] = useState([]);
    // const [show, setShow] = useState(false);

    const [profileDetails, setProfileDetails] = useState({
        profileImage: {
            uri: '',
            name: '',
            type: '',
            base64: '',
        },
        birthday: new Date(),
    });

    console.log('hello world',About);


    const onUpload = async () => {
        const result = await launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: true,
        });

        if (!result.didCancel && result.assets) {
            const uri = result?.assets[0]?.uri;
            const fileName = result?.assets[0]?.fileName;
            const type = result?.assets[0]?.type;
            const base64 = result.assets[0].base64;
            setProfileDetails({
                ...profileDetails,
                profileImage: {
                    uri: uri || '',
                    name: fileName || '',
                    type: type || '',
                    base64: base64 || '',
                },
            });
        }
    };

    const ProfileImage = () => {
        return (
            <View style={styles.profileImage}>
                {
                    profileDetails.profileImage.name.length > 0
                        ?
                        <Image source={{ uri: profileDetails.profileImage.uri }} style={{ width: 120, height: 120, borderRadius: 6 }} />
                        :
                        <User size="32" color="#54ff65" variant="Bold" />
                }
            </View>
        );
    };

    const Options = ({ i, item, data, setData }: { i?: any, item: any, data: any, setData: any }) => {
        const onSelectOption = () => {
            const arr = data.slice(); // GET THE PASSED ARRAY
            const index = arr.findIndex(({ label }: { label: string }) => label === item.label); // GET THE SELECTED INDEX
            arr.forEach(function (val: any) { delete val.selected; }); // DELETE SELECTED VALUE FROM ALL INDEXES
            arr[index].selected = true; // SET SELECTED TRUE TO THE SELECTED INDEX
            setData(arr); // UPDATE ARRAY
        };
        return (
            <>
                <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: width * 0.015,
                }}
                    onPress={onSelectOption}
                    key={i}
                >
                    {
                        item.selected
                            ?
                            <RecordCircle size="20" color={Color('primary')} variant="Bold" />
                            :
                            <RecordCircle size="20" color={Color('primary')} />
                    }
                    <Pera style={{ color: Color('whiteText') }}>{item.title}</Pera>
                </TouchableOpacity>
            </>
        );
    };

    const OptionsCheckBox = ({ i, item, data, setData }: { i?: any, item: any, data: any, setData: any }) => {
        const onSelectOption = () => {
            const arr = data.slice(); // GET THE PASSED ARRAY
            const index = arr.findIndex(({ label }: { label: string }) => label === item.label); // GET THE SELECTED INDEX
            // arr.forEach(function (val: any) { val.selected = false }); // DELETE SELECTED VALUE FROM ALL INDEXES
            const isChecked = arr[index].selected ? true : false;
            arr[index].selected = !isChecked; // SET SELECTED TRUE TO THE SELECTED INDEX
            setData(arr); // UPDATE ARRAY
        };
        return (
            <>
                <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: width * 0.015,
                }}
                    onPress={onSelectOption}
                    key={i}
                >
                    {
                        item.selected
                            ?
                            <TickSquare size="20" color={Color('primary')} variant="Bold" />
                            :
                            <TickSquare size="20" color={Color('primary')} />
                    }
                    <Pera style={{ color: Color('whiteText') }}>{item.title}</Pera>
                </TouchableOpacity>
            </>
        );
    };

    const HereForSection = () => {
        const hereFor = useSelector(({ app }: { app: any }) => app?.hereFor);

        useEffect(() => {
            if (hereFor && hereForOptions.length === 0) {
                const arr = Object.keys(hereFor).map((key) => { return { 'label': key, 'title': hereFor[key] }; });
                setHereForOptions(arr);
            }
        }, [hereFor, hereForOptions]);
        return (
            <>
                <H5 style={{ color: Color('whiteText') }}>Here For</H5>
                <Br space={0.02} />

                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    hereForOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <OptionsCheckBox i={i} item={item} data={hereForOptions} setData={setHereForOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [hereForOptions])
                }
            </>
        );
    };
    const BirthdaySection = () => {
        // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        // const [date, setDate] = useState(dayjs());

        return (
            <>
                <H5 style={{ color: Color('whiteText') }}>Birthday</H5>
                <View style={{ backgroundColor: Color('primary'), width: '100%', padding: 20, borderRadius: 5, marginTop: 5 }}>
                    {/* <Text style={{ color: Color('black') }}>
                        {profileDetails?.birthday ? moment(profileDetails.birthday).format("MMM DD, YYYY") : "Select Date"}
                    </Text> */}
                    <DateTimePicker
                        mode="single"
                        date={profileDetails?.birthday}
                        onChange={(params) => setProfileDetails({...profileDetails,birthday: params.date?.toLocaleString()})}
                    />
                    {/* <DateTimePickerModal
                 isVisible={isDatePickerVisible}
                 mode={'date'}
                //  date={new Date() || undefined}
                 pickerComponentStyleIOS={{height: 300,width: '100%'}}
                //  display={'spinner'}
                 onCancel={hideDatePicker}
                 onConfirm={handleConfirm}

             /> */}
                </View>

                {/* <DatePicker
                    date={profileDetails.birthday}
                    onDateChange={(date) => setProfileDetails({...profileDetails, birthday: date})}
                    mode="date"
                    theme='dark'
                    // onConfirm={(date) => setProfileDetails({...profileDetails,birthday: date})}
                    dividerColor={Color('whiteText')}
                    style={{
                        width: width * 0.9
                    }}
                /> */}
            </>
        );
    };
    const LookingForSection = () => {
        const lookingFor = useSelector(({ app }: { app: any }) => app?.lookingFor);

        useEffect(() => {
            if (lookingFor && lookingForOptions.length === 0) {
                const arr = Object.keys(lookingFor).map((key) => { return { 'label': key, 'title': lookingFor[key] }; });
                setLookingForOptions(arr);
            }
        }, [lookingFor, lookingForOptions]);
        return (
            <>
                <H5 style={{ color: Color('whiteText') }}>Looking For</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    lookingForOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={lookingForOptions} setData={setLookingForOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [lookingForOptions])
                }
            </>
        );
    };
    const DesiredAgeSection = () => {
        let ageFromRange = useSelector(({ app }: { app: any }) => app?.ageFromRange || []);
        let ageToRange = useSelector(({ app }: { app: any }) => app?.ageToRange || []);

        const [rangeFrom, setRangeFrom]: any[] = useState([]);
        const [rangeTo, setRangeTo]: any[] = useState([]);

        useEffect(
            () => {
                if (rangeFrom.length === 0 && rangeTo.length === 0) {
                    const arr1 = [];
                    for (let x = 0; x < ageFromRange.length; x++) {
                        arr1.push({
                            label: ageFromRange[x],
                            value: ageFromRange[x],
                        });
                    }
                    const arr2 = [];
                    for (let x = 0; x < ageToRange.length; x++) {
                        arr2.push({
                            label: ageToRange[x],
                            value: ageToRange[x],
                        });
                    }

                    setRangeFrom(arr1);
                    setRangeTo(arr1);
                }
            }, []
        );

        return (
            <>
                <H5 style={{ color: Color('whiteText') }}>Desired Age</H5>

                <Br space={0.02} />
                <Pera style={{ color: Color('whiteText'), marginBottom: height * 0.01 }}>From</Pera>
                <Dropdown
                    data={rangeFrom}
                    selectedValue={DesiredAgeFrom}
                    onValueChange={(value: React.SetStateAction<string>) => setDesiredAgeFrom(value)}
                    style={undefined}
                    defaultStyle={undefined}
                    label={undefined}
                    icon={undefined}
                />

                <Br space={0.02} />
                <Pera style={{ color: Color('whiteText'), marginBottom: height * 0.01 }}>To</Pera>
                <Dropdown
                    data={rangeTo}
                    selectedValue={DesiredAgeTo}
                    onValueChange={(value: React.SetStateAction<string>) => setDesiredAgeTo(value)}
                    style={undefined}
                    defaultStyle={undefined}
                    label={undefined}
                    icon={undefined}
                />
            </>
        );
    };
    const AboutSection = () => {
        const [AboutText, setAboutText] = useState('');
        return (
            <>
                <H5 style={{ color: Color('whiteText') }}>About</H5>
                <Br space={0.02} />
                <Input
                    value={AboutText}
                    color={Color('primary')}
                    numberOfLines={5}
                    style={{ minHeight: Platform.OS === 'ios' ? height * 0.2 : 0 }}
                    onChange={(text: any) => setAbout(text)}
                    onBlur={() => setAbout(AboutText)}
                />
            </>
        );
    };
    const AppearanceSection = () => {
        const ethencity = useSelector(({ app }: { app: any }) => app?.ethencity);
        const bodyType = useSelector(({ app }: { app: any }) => app?.bodyType);
        const hairColor = useSelector(({ app }: { app: any }) => app?.hairColor);
        const eyeColor = useSelector(({ app }: { app: any }) => app?.eyeColor);

        useEffect(() => {
            if (ethencity && ethnicityOptions.length === 0) {
                const arr = Object.keys(ethencity).map((key) => { return { 'label': key, 'title': ethencity[key] }; });
                setEthnicityOptions(arr);
            }
            if (bodyType && bodyTypeOptions.length === 0) {
                const arr = Object.keys(bodyType).map((key) => { return { 'label': key, 'title': bodyType[key] }; });
                setBodyTypeOptions(arr);
            }
            if (hairColor && hairColorOptions.length === 0) {
                const arr = Object.keys(hairColor).map((key) => { return { 'label': key, 'title': hairColor[key] }; });
                setHairColorOptions(arr);
            }
            if (eyeColor && eyeColorOptions.length === 0) {
                const arr = Object.keys(eyeColor).map((key) => { return { 'label': key, 'title': eyeColor[key] }; });
                setEyeColorOptions(arr);
            }
        }, [ethencity, bodyType, hairColor, eyeColor, ethnicityOptions, bodyTypeOptions, hairColorOptions, eyeColorOptions]);
        return (
            <>
                <H4>Appearance</H4>
                <Br space={0.02} />

                <H5 style={{ color: Color('whiteText') }}>Ethnicity</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    ethnicityOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={ethnicityOptions} setData={setEthnicityOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [ethnicityOptions])
                }

                <Br space={0.05} />

                <H5 style={{ color: Color('whiteText') }}>Body type</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    bodyTypeOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={bodyTypeOptions} setData={setBodyTypeOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [bodyTypeOptions])
                }

                <Br space={0.05} />

                <H5 style={{ color: Color('whiteText') }}>Hair color</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    hairColorOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={hairColorOptions} setData={setHairColorOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [hairColorOptions])
                }

                <Br space={0.05} />

                <H5 style={{ color: Color('whiteText') }}>Eye color</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    eyeColorOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={eyeColorOptions} setData={setEyeColorOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [eyeColorOptions])
                }
            </>
        );
    };
    const LifeStyleSection = () => {
        const lifeStyle = useSelector(({ app }: { app: any }) => app?.lifeStyle);
        const drinking = useSelector(({ app }: { app: any }) => app?.drinking);
        const smoking = useSelector(({ app }: { app: any }) => app?.smoking);

        useEffect(() => {
            if (lifeStyle && wayToSpendTimeOptions.length === 0) {
                const arr = Object.keys(lifeStyle).map((key) => { return { 'label': key, 'title': lifeStyle[key] }; });
                setWayToSpendTimeOptions(arr);
            }
            if (drinking && drinkingOptions.length === 0) {
                const arr = Object.keys(drinking).map((key) => { return { 'label': key, 'title': drinking[key] }; });
                setDrinkingOptions(arr);
            }
            if (smoking && smokingOptions.length === 0) {
                const arr = Object.keys(smoking).map((key) => { return { 'label': key, 'title': smoking[key] }; });
                setSmokingOptions(arr);
            }
        }, [lifeStyle, drinking, smoking, wayToSpendTimeOptions, drinkingOptions, smokingOptions]);
        return (
            <>
                <H4>Lifestyle</H4>
                <Br space={0.02} />

                <H5 style={{ color: Color('whiteText') }}>Favorite way to Spend Time</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    wayToSpendTimeOptions.map(
                                        (item: any, i: any) => {
                                            return <OptionsCheckBox i={i} item={item} data={wayToSpendTimeOptions} setData={setWayToSpendTimeOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [wayToSpendTimeOptions])
                }

                <Br space={0.05} />

                <H5 style={{ color: Color('whiteText') }}>Smoking</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    smokingOptions.map(
                                        (item: any, i: any) => {
                                            return <Options i={i} item={item} data={smokingOptions} setData={setSmokingOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [smokingOptions])
                }

                <Br space={0.05} />

                <H5 style={{ color: Color('whiteText') }}>Drinking</H5>
                <Br space={0.02} />
                {
                    useMemo(() => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {
                                    drinkingOptions.map(
                                        (item: any, i: React.Key | null | undefined) => {
                                            return <Options i={i} item={item} data={drinkingOptions} setData={setDrinkingOptions} />;
                                        }
                                    )
                                }
                            </View>
                        );
                    }, [drinkingOptions])
                }
            </>
        );
    };
    const TermsofUse = () => {
        return (
            <>
                <H4>Term of use</H4>
                <Br space={0.02} />
                <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: width * 0.015,
                }}
                    onPress={() => setAgreeTurmofUse(true)}
                >
                    {
                        agreeTurmofUse
                            ?
                            <RecordCircle size="20" color={Color('primary')} variant="Bold" />
                            :
                            <RecordCircle size="20" color={Color('primary')} />
                    }
                    <Pera style={{ color: Color('whiteText') }}>I agree with terms of use</Pera>
                </TouchableOpacity>
            </>
        );
    };

    const checkValidations = () => {

        // PROFILE IMAGE PART
        if (profileDetails.profileImage.base64.length === 0) {
            Message('Profile Image is required', 'Please fill all the fields!');
            return;
        }

        // HERE FOR PART
        if (hereForOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Why You Here?', 'Please check one of the options!');
            return;
        }


        // BIRTHDAY PART
        const years = moment(profileDetails.birthday).diff(currentDate.format('YYYY-MM-DD'), 'years');
        const convertIntoPositive = -years;
        if (convertIntoPositive < 18 || years === 0) {
            Message('Invalid Birthday', 'Please make sure the your age is more than 18 years!!');
            return;
        }

        // LOOKING FOR PART
        if (lookingForOptions.findIndex((val: any) => val.selected) < 0) {
            Message('What Are You Looking For?', 'Please check one of the options!');
            return;
        }

        // DESIRED AGE PART
        if (DesiredAgeFrom.length === 0) {
            Message('Desired Age (From)?', 'Please check one of the options!');
            return;
        }
        if (DesiredAgeTo.length === 0) {
            Message('Desired Age (To)?', 'Please check one of the options!');
            return;
        }

        // ABOUT PART
        if (About.trim().length === 0) {
            Message('Tell Us About Yourself?', 'Please check one of the options!');
            return;
        }

        // Ethnicity PART
        if (ethnicityOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Ethnicity?', 'Please check one of the options!');
            return;
        }

        // BODY TYPE PART
        if (bodyTypeOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Your Desired Body Type?', 'Please check one of the options!');
            return;
        }

        // HAIR COLOR PART
        if (hairColorOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Your Desired Hair Color?', 'Please check one of the options!');
            return;
        }

        // EYE COLOR PART
        if (eyeColorOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Your Desired Eye Color?', 'Please check one of the options!');
            return;
        }

        // LIFESTYLE
        // WAY TO SPEND TIME PART
        if (wayToSpendTimeOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Your favorite way to spend time?', 'Please check one of the options!');
            return;
        }

        // SMOKING PART
        if (smokingOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Do you smoke?', 'Please check one of the options!');
            return;
        }

        // DRINKING PART
        if (smokingOptions.findIndex((val: any) => val.selected) < 0) {
            Message('Do you drink?', 'Please check one of the options!');
            return;
        }

        // AGREE TERMS OF USE PART
        if (!agreeTurmofUse) {
            Message('Do You Agree Our terms of Use?', 'We require you to agree our terms of use!!');
            return;
        }

        return true;
    };

    const getSelectedOption = (arr: any) => {
        const index = arr.findIndex((val: any) => val.selected);
        return arr[index];
    };
    const getSelectedOptions = (arr: any) => {
        const array: any[] = [];
        const index = arr.filter((val: any) => val.selected).forEach((val: any) => {
            array.push(val.label);
        });
        return JSON.stringify(array);
    };
    const onEditProfile = async () => {
        const isValid = await checkValidations();

        if (isValid) {
            const lookingFor = getSelectedOption(lookingForOptions);
            const ethnicity = getSelectedOption(ethnicityOptions);
            const bodyType = getSelectedOption(bodyTypeOptions);
            const hairColor = getSelectedOption(hairColorOptions);
            const eyeColor = getSelectedOption(eyeColorOptions);
            const isSmoker = getSelectedOption(smokingOptions);
            const isDrinker = getSelectedOption(drinkingOptions);
            const hereFor = getSelectedOptions(hereForOptions);
            const lifeStyle = getSelectedOptions(wayToSpendTimeOptions);

            setLoading(true);
            await onUpdateProfile(
                route?.params?.name,
                moment(profileDetails.birthday).format('MMM'),
                moment(profileDetails.birthday).format('DD'),
                moment(profileDetails.birthday).format('YYYY'),
                lookingFor?.label,
                DesiredAgeFrom,
                DesiredAgeTo,
                About.trim(),
                ethnicity?.label,
                bodyType?.label,
                hairColor?.label,
                eyeColor?.label,
                isSmoker?.label,
                isDrinker?.label,
                hereFor,
                lifeStyle,
                `data:${profileDetails.profileImage.type};base64,${profileDetails.profileImage.base64}`
            );
            setLoading(false);
            Toast.show('Profile has been created!!', Toast.SHORT);
            navigation.replace('Subscriptions');
        }
    };

    return (
        <Background dark={1}>
            <View>
                <H2 style={styles.commonForText}>Edit Profile</H2>
                <Br space={0.02} />
                <ProfileImage />
                <ButtonOuline style={{ marginVertical: height * 0.02, width: width * 0.5, alignSelf: 'center' }} fontSize={15} onPress={onUpload}>Upload</ButtonOuline>

                <Br space={0.02} />

                <HereForSection />

                <Br space={0.05} />

                <BirthdaySection />

                <Br space={0.05} />

                <LookingForSection />

                <Br space={0.05} />

                <DesiredAgeSection />

                <Br space={0.05} />

                {
                    useMemo(() => {
                        return <AboutSection />;
                    }, [])
                }

                <Br space={0.05} />

                <AppearanceSection />

                <Br space={0.05} />

                <LifeStyleSection />

                <Br space={0.05} />

                <TermsofUse />

                <Br space={0.05} />

                <Button loading={loading} onPress={onEditProfile}>Submit</Button>

                <Br space={0.03} />
            </View>
        </Background>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    layout: {
        width: width * 0.9,
        alignSelf: 'center',
        height: height,
        paddingVertical: height * 0.1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    commonForText: {
        color: Color('primary'),
        textAlign: 'center',
        marginTop: height * 0.03,
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
