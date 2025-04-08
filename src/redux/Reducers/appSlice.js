import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        patterns: null,
        splashTimeout: null,
        user_id: null,
        ageFromRange: null,
        ageToRange: null,
        loginSession: null,
        ethencity: null,
        lookingFor: null,
        hereFor: null,
        bodyType: null,
        hairColor: null,
        eyeColor: null,
        lifeStyle: null,
        smoking: null,
        drinking: null,
        gender: null,
        lat: null,
        long: null,
        subscription_expiry: null
    },
    reducers: {
        saveAppData: (state, { payload }) => {
            state.patterns = payload?.patterns;
            state.splashTimeout = payload?.splashTimeOut;
            state.ageFromRange = payload?.ageFromRange;
            state.ageToRange = payload?.ageToRange;
            state.ethencity = payload?.ethencity;
            state.lookingFor = payload?.lookingFor;
            state.hereFor = payload?.hereFor;
            state.bodyType = payload?.bodyType;
            state.hairColor = payload?.hairColor;
            state.eyeColor = payload?.eyeColor;
            state.lifeStyle = payload?.lifeStyle;
            state.smoking = payload?.smoking;
            state.drinking = payload?.drinking;
            state.gender = payload?.gender;
        },
        saveUserId: (state, { payload }) => {
            state.user_id = payload?.user_id;
        },
        saveLatLong: (state,action) => {
            console.log('redux',action.payload, action.payload?.latitude)
            state.lat = action.payload?.latitude
            state.long = action.payload?.longitude
        },
        saveDate: (state,action) => {
            state.subscription_expiry = action.payload
        },
        startSession: async (state, { payload }) => {
            await AsyncStorage?.setItem(
                "token",
                payload?.access_token
            );
            state.loginSession = payload;
        },
        endSession: async (state) => {
            await AsyncStorage?.removeItem("token");
            await AsyncStorage?.removeItem("session");
            // state.loginSession = null;
        },
    },
});

export const { saveAppData, saveUserId, startSession, endSession,saveLatLong,saveDate } = appSlice?.actions;
export default appSlice?.reducer;
