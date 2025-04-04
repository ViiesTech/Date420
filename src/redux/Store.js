// store.js

import { configureStore } from '@reduxjs/toolkit';
import drawerSlice from './Reducers/drawerSlice';
import appSlice from './Reducers/appSlice';

export const store = configureStore({
    reducer: {
        drawer: drawerSlice,
        app: appSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
