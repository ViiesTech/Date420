import { createSlice } from '@reduxjs/toolkit';

export const drawerSlice = createSlice({
    name: 'counter',
    initialState: {
        drawer: false,
    },
    reducers: {
        showDrawer: (state) => {
            state.drawer = true;
        },
        hideDrawer: (state) => {
            state.drawer = false;
        }
    },
});

export const { showDrawer, hideDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
