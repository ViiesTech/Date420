import axios from 'axios';
import io from 'socket.io-client';
import { Message } from './utils/Alert';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { saveLatLong } from './redux/Reducers/appSlice';

export const basUrl = "https://date420friendly.com";
const api = axios.create({
    baseURL: basUrl,
    timeout: 30000
})

export const socket = io.connect("https://socket.predemo.site", { autoConnect: true });
const errHandler = async (err, callback) => {
    console.log(err?.response);
    if (err?.error?.includes('Token expired')) {
        await AsyncStorage.removeItem('session');
        await AsyncStorage.removeItem('token');
        Toast.show('Token Expired', Toast.SHORT);
        RNRestart.restart();
    }
    if (err?.error?.includes('Invalid token.')) {
        await AsyncStorage.removeItem('session');
        await AsyncStorage.removeItem('token');
        Toast.show('Invalid Token', Toast.SHORT);
        RNRestart.restart();
    }
    return err;
}

const refreshToken = async (callback) => {
    const loginSession = await AsyncStorage.getItem("token");
    const session = await AsyncStorage.getItem("session");
    fetch(basUrl + '/api/user/refresh', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
        }
    })
    .then(res => res.json())
    .then(async res => {
        await AsyncStorage.setItem(
            "token",
            JSON.stringify(res.data)
        );
        if (session) await AsyncStorage.setItem(
            "session",
            JSON.stringify(res.data)
        );
        await callback();
    })
    .catch(err => {
        throw err;
    });
}

export const onUserLogin = async (email, password, fcm, setLoading) => {
    try {
        const res = await api.post('/api/user/login', {
            username: email,
            password: password,
            remember_token: fcm
        });
        return res.data;
    }catch (err) {
        Message("Login Failed", "Your login request has been failed with following reason: " + err.message);
        setLoading(false);
        errHandler(err, () => onUserLogin(email, password, setLoading));
    }
}

export const onUserSignup = async (name, username, email, gender, password, fcm, setLoading) => {
    try {
        const res = await api.post('/api/user/register', {
            name: name,
            email: email,
            password: password,
            username: username,
            gender: gender,
            remember_token: fcm
        });
        return res.data;
    }catch (err) {
        Message("Signup Failed", "Your signup request has been failed with following reason: " + err.message);
        setLoading(false);
        errHandler(err, () => onUserSignup(name, username, email, gender, password, setLoading));
    }
}

export const getEmailOnForgotPass = async (email, setLoading) => {
    try {
        const res = await api.post('/api/user/forget-password', {
            email: email
        });
        return res.data;
    }catch (err) {
        Message("Failed to Send Email", "Your forgot password request has been failed with following reason: " + err.message);
        setLoading(false);
        errHandler(err, () => getEmailOnForgotPass(email, setLoading));
    }
}

export const getAppData = async () => {
    try {
        const res = await api.get('/api/app-data');
        return res.data;
    }catch (err) {
        Toast.show('Failed to load AppData', Toast.SHORT);
        setTimeout(async () => {
            await getAppData();
        }, 2000);
    }
}

export const uploadPhoto = async (photo) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/user/upload-photo', {photo: photo}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load My Matches Data', Toast.SHORT);
        errHandler(err, () => uploadPhoto(photo));
    }
}

export const getMyMatches = async (page, radius = null) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const token = JSON.parse(loginSession)?.access_token;
        
        let url = `/api/my-matches?page=${page}`;
        if (radius) {
            url += `&radius=${radius}`;
        }

        const res = await api.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        Toast.show('Failed to load My Matches Data', Toast.SHORT);
        errHandler(err, null);
    }
};


export const getProfile = async (setState, user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/user/me', {
            user_id: user_id || JSON.parse(loginSession)?.user_id
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        setState(res.data?.data);
        return;
    }catch (err) {
        Toast.show('Failed to load profile data', Toast.SHORT);
        errHandler(err, () => getProfile(setState, user_id));
    }
}

export const loadHotList = async (page, setState, setLast) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/hotlist?page=' + page, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res, () => loadHotList(page, setState));
            }else {
                setState(res.data);
                if (setLast) setLast(res.data?.last_page);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Hotlist', Toast.SHORT);
        errHandler(err, () => loadHotList(page, setState));
    }
}

export const addToHotlist = async (user_id, callback) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/hotlist/add-to-hostlist', {
            user_id: user_id
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        Toast.show(res.data.message, Toast.SHORT);
        await callback();
    }catch (err) {
        Toast.show('Failed to add user to your hotlist', Toast.SHORT);
        errHandler(err, () => addToHotlist(user_id, callback));
    }
}

export const removeFromHotList = async (user_id, callback) => {
    try {
        Toast.show("Removing user from hotlist...", Toast.SHORT);
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/hotlist/remove-from-hostlist', {
            user_id: user_id
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        Toast.show(res.data.message, Toast.SHORT);
        await callback();
    }catch (err) {
        Toast.show('Failed to load remove user from your hotlist', Toast.SHORT);
        errHandler(err, null);
    }
}

export const onUpdateProfile = async (name, dob_month, dob_month_day, dob_month_year, looking_for, desired_age_from, desired_age_to, about_me, ethnicity, body_type, hair_color, eye_color, smoking, drinking, here_for_basic, life_style, file_profile) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('dob_month', dob_month);
        formData.append('dob_month_day', dob_month_day);
        formData.append('dob_month_year', dob_month_year);
        formData.append('looking_for', looking_for);
        formData.append('desired_age_from', desired_age_from);
        formData.append('desired_age_to', desired_age_to);
        formData.append('about_me', about_me);
        formData.append('ethnicity', ethnicity);
        formData.append('body_type', body_type);
        formData.append('hair_color', hair_color);
        formData.append('eye_color', eye_color);
        formData.append('smoking', smoking);
        formData.append('drinking', drinking);
        formData.append('here_for_basic', here_for_basic);
        formData.append('life_style', life_style);
        formData.append('file_profile', file_profile);
        fetch(basUrl + '/api/user/update-profile', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            },
            body: formData,
        }).then(async (res) => {
            // const res = await uploadPhoto(file_profile);
            return;
        });
    }catch (err) {
        Toast.show('Failed to update user profile', Toast.SHORT);
        errHandler(err, () => onUpdateProfile(name, dob_month, dob_month_day, dob_month_year, looking_for, desired_age_from, desired_age_to, about_me, ethnicity, body_type, hair_color, eye_color, smoking, drinking, here_for_basic, life_style, file_profile));
    }
}

export const getChatInbox = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/chat/inbox', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to update profile data', Toast.SHORT);
        errHandler(err, () => getChatInbox(setState));
    }
}

export const getGroupInbox = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/groups/index', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to get group inbox', Toast.SHORT);
        errHandler(err, () => getChatInbox(setState));
    }
}

export const getGroups = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/group', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res.data?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load groups', Toast.SHORT);
        errHandler(err, () => getGroups(setState));
    }
}

export const getMyGroups = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/group/your-group', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res.data?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load your groups', Toast.SHORT);
        errHandler(err, () => getMyGroups(setState));
    }
}

export const getGroupDetails = async (group_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/detail', {group_id: group_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load Group Details', Toast.SHORT);
        errHandler(err, () => getGroupDetails(group_id));
    }
}

export const updateGroup = async (group_id, desc, title) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/update', {title: title, desc: desc, group_id: group_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to update Group Details', Toast.SHORT);
        errHandler(err, () => getGroupDetails(group_id));
    }
}

export const joinTheGroup = async (group_id, user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/join', {group_id: group_id, user_id: user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to join group', Toast.SHORT);
        errHandler(err, () => joinTheGroup(group_id, user_id));
    }
}

export const addMember = async (group_id, user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/join', {group_id: group_id, user_id: user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to add member', Toast.SHORT);
        errHandler(err, () => addMember(group_id, user_id));
    }
}

export const leaveTheGroup = async (group_id, user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/remove-member', {group_id: group_id, user_id: user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to leave group', Toast.SHORT);
        errHandler(err, () => leaveTheGroup(group_id, user_id));
    }
}

export const removeTheMember = async (group_id, user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/remove-member', {group_id: group_id, user_id: user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to remove group', Toast.SHORT);
        errHandler(err, () => removeTheMember(group_id, user_id));
    }
}

export const sendLocation = async (lat, long) => {
    // console.log('hhh',lat,long) 
    let data = new FormData()
    data.append('latitude',lat)
    data.append('longitude',long)
    try {
        const loginSession = await AsyncStorage.getItem("token");
        // console.log('hello',loginSession)
        const res = await api.post('/api/user/location', data, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        console.log('response =======>',res.data)
        return res.data;
    }catch (err) {
        console.log('hhh',err)
        // Toast.show('Failed to send location', Toast.SHORT);
        // errHandler(err, () => removeTheMember(group_id, user_id));
    }
}


export const getChat = async (UUID) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/chat/get-chat', {uuid: UUID, sender_id: JSON.parse(loginSession)?.user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load chat', Toast.SHORT);
        errHandler(err, () => getChat(UUID));
    }
}

export const getGroupChat = async (group_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/chat/get-group-chat', {group_id: group_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load group chat', Toast.SHORT);
        errHandler(err, () => getGroupChat(group_id));
    }
}

export const getEvents = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/events', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Events', Toast.SHORT);
        errHandler(err, () => getEvents(setState));
    }
}

export const getPreferences = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/preference/status', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data?.notifications);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Events', Toast.SHORT);
        errHandler(err, () => getPreferences(setState));
    }
}

export const updatePreferences = async (subscription, message, group, events, blogs) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/preference/update_status', {
            subscription: subscription,
            message: message,
            group: group,
            events: events,
            blogs: blogs,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to update preferences', Toast.SHORT);
        errHandler(err, () => updatePreferences(subscription, message, group, events, blogs));
    }
}

export const getMyEvents = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/events/my', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Events', Toast.SHORT);
        errHandler(err, () => getMyEvents(setState));
    }
}

export const getEventDetails = async (event_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/events/detail', {event_id: event_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load My Matches Data', Toast.SHORT);
        errHandler(err, () => getEventDetails(event_id));
    }
}

export const getMyPackage = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/pacakges/my', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load package', Toast.SHORT);
        errHandler(err, () => getMyPackage(setState));
    }
}

// export const subscribe = async (package_id,subscription_id) => {
//     try {
//         var data = {
//             package_id: package_id,
//             subscription_id: subscription_id
//         }
//         const loginSession = await AsyncStorage.getItem("token");
//         fetch(basUrl + '/api/pacakges/subscribe', {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
//             },
//             body: data
//         })
//         .then(res => res.json())
//         .then(res => {
//             if (res.error) {
//                 errHandler(res);
//             }else {
                
//                 // setState(res?.data);
//             }
//         })
//         .catch(err => {
//             throw err;
//         });
//     }catch (err) {
//         console.log(err)
//         // Toast.show('Failed to load package', Toast.SHORT);
//         // errHandler(err, () => getMyPackage(setState));
//     }
// }


export const getPackages = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/pacakges', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                const result = Object.keys(res?.data).map((key) => res?.data[key]);
                setState(result);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load package', Toast.SHORT);
        errHandler(err, () => getPackages(setState));
    }
}

export const subscribePackage = async (package_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/pacakges/subscribe', {package_id: package_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to scubscribe', Toast.SHORT);
        errHandler(err, () => subscribePackage(package_id));
    }
}

export const createEvent = async (photo, title, desc, url, phone) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/events/store', {
            photo: photo,
            title: title,
            desc: desc,
            url: url,
            phone: phone,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to create event', Toast.SHORT);
        errHandler(err, () => createEvent(photo, title, desc, url, phone));
    }
}

export const createGroup = async (photo, title, desc) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/group/create', {
            photo: photo,
            title: title,
            desc: desc,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to create group', Toast.SHORT);
        errHandler(err, () => createGroup(photo, title, desc));
    }
}

export const getMyAds = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/ads', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Events', Toast.SHORT);
        errHandler(err, () => getMyAds(setState));
    }
}

export const getPublishedAds = async (setState) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        fetch(basUrl + '/api/ads/get-published-ads', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                errHandler(res);
            }else {
                setState(res?.data);
            }
        })
        .catch(err => {
            throw err;
        });
    }catch (err) {
        Toast.show('Failed to load Events', Toast.SHORT);
        errHandler(err, () => getMyAds(setState));
    }
}

export const createAd = async (photo, title, desc, url, phone) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/ads/store', {
            photo: photo,
            title: title,
            desc: desc,
            url: url,
            phone_number: phone,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to create ad', Toast.SHORT);
        errHandler(err, () => createAd(photo, title, desc, url, phone));
    }
}

export const getAdDetails = async (ad_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/ads/view-detail', {ad_id: ad_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load My ad details Data', Toast.SHORT);
        errHandler(err, () => getAdDetails(ad_id));
    }
}

export const chatUUID = async (user_id) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/chat/get-uuid', {user_id: user_id}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to load chat UUID', Toast.SHORT);
        errHandler(err, () => chatUUID(user_id));
    }
}

export const onChat = async (uuid, user_id, message) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/chat/submit-chat', {
            message: message, 
            sender_id: user_id, 
            uuid: uuid
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to submit chat', Toast.SHORT);
        errHandler(err, () => onChat(uuid, sender_id, message));
    }
}

export const onGroupChat = async (group_id, message) => {
    try {
        const loginSession = await AsyncStorage.getItem("token");
        const res = await api.post('/api/chat/submit-group-chat', {
            message: message, 
            group_id: group_id
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(loginSession)?.access_token}`
            }
        });
        return res.data;
    }catch (err) {
        Toast.show('Failed to submit group chat', Toast.SHORT);
        errHandler(err, () => onGroupChat(group_id, message));
    }
}