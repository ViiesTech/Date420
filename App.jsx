/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Suspense, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProvider, useNavigation } from './src/utils/NavigationContext';

import Splash from './src/screens/utils/Splash';
import Loading from './src/screens/Loading';
import Signin from './src/screens/Signin';
import Signup from './src/screens/Signup';
import EditProfile from './src/screens/EditProfile';
import UpdateProfile from './src/screens/UpdateProfile';
import MySubscription from './src/screens/Dashboard/MySubscription';
import Subscriptions from './src/screens/Dashboard/Subscriptions';
import Profile from './src/screens/Dashboard/Profile';
import Notifications from './src/screens/Dashboard/Notifications';
import MyPreferences from './src/screens/Dashboard/MyPreferences';
import ForgotPassword from './src/screens/ForgotPassword';
import OTP from './src/screens/OTP';
import ResetPassword from './src/screens/ResetPassword';
import HotList from './src/screens/Dashboard/HotList';
import MyMatch from './src/screens/Dashboard/MyMatch';
import Inbox from './src/screens/Inbox/Inbox';
import Chat from './src/screens/Inbox/Chat';
import SuggestedGroups from './src/screens/Groups/SuggestedGroups';
import MyGroups from './src/screens/Groups/MyGroups';
import MyGroupsDetails from './src/screens/Groups/MyGroupDetails';
import AddMembers from './src/screens/Groups/AddMembers';
import GroupDetails from './src/screens/Groups/GroupDetails';
import CreateGroup from './src/screens/Groups/CreateGroup';
import Events from './src/screens/Events/Events';
import EventDetails from './src/screens/Events/EventDetails';
import GetTickets from './src/screens/Events/GetTickets';
import MyEvents from './src/screens/Events/MyEvents';
import AddEvent from './src/screens/Events/AddEvent';
import RemoveMembers from './src/screens/Groups/RemoveMembers';
import UsersProfile from './src/screens/Dashboard/UsersProfile';
import LeaveGroup from './src/screens/Groups/LeaveGroup';
import MyAds from './src/screens/Ads/MyAds';
import CreateAd from './src/screens/Ads/CreateAdd';
import MyAdDetails from './src/screens/Ads/MyAddDetails';
import AllHotList from './src/screens/Dashboard/AllHotList';
import Purchases from 'react-native-purchases';

const Stack = createNativeStackNavigator();

function App() {
  const { navigationRef } = useNavigation();

  const Sus = ({ component }) => {
    return <Suspense fallback={<Loading />}>{component}</Suspense>
  }


  useEffect(() => {

   
const setupPurchases = async () => {
  try {
    console.log('🔵 Setting up RevenueCat...');

    await Purchases.configure({
      apiKey: 'appl_qSXoPtDvyxnorrjXPlQZAoJNQRH'
    });

    console.log('🟢 RevenueCat is initialized!');

  } catch (error) {
    console.error('🔴 RevenueCat Setup Error:', error);
  }
};
    setupPurchases()


  },[])


  return (
    <>
      <Provider store={store}>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: 'black' }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Signup">
              {props => <Sus component={<Signup {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Signin">
              {props => <Sus component={<Signin {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="EditProfile">
              {props => <Sus component={<EditProfile {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="UpdateProfile">
              {props => <Sus component={<UpdateProfile {...props} />} />}
            </Stack.Screen> 
             <Stack.Screen name="MySubscription">
              {props => <Sus component={<MySubscription {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Subscriptions">
              {props => <Sus component={<Subscriptions {...props} />} />}
             </Stack.Screen>
             <Stack.Screen name="Profile">
              {props => <Sus component={<Profile {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="UsersProfile">
              {props => <Sus component={<UsersProfile {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Notifications">
              {props => <Sus component={<Notifications {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyPreferences">
              {props => <Sus component={<MyPreferences {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword">
              {props => <Sus component={<ForgotPassword {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="OTP">
              {props => <Sus component={<OTP {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="ResetPassword">
              {props => <Sus component={<ResetPassword {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="HotList">
              {props => <Sus component={<HotList {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyMatch">
              {props => <Sus component={<MyMatch {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="AllHotList">
              {props => <Sus component={<AllHotList {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Inbox">
              {props => <Sus component={<Inbox {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Chat">
              {props => <Sus component={<Chat {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="SuggestedGroups">
              {props => <Sus component={<SuggestedGroups {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyGroups">
              {props => <Sus component={<MyGroups {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyGroupDetails">
              {props => <Sus component={<MyGroupsDetails {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="AddMembers">
              {props => <Sus component={<AddMembers {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="RemoveMembers">
              {props => <Sus component={<RemoveMembers {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="LeaveGroup">
              {props => <Sus component={<LeaveGroup {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="GroupDetails">
              {props => <Sus component={<GroupDetails {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="CreateGroup">
              {props => <Sus component={<CreateGroup {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="Events">
              {props => <Sus component={<Events {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="EventDetails">
              {props => <Sus component={<EventDetails {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="GetTickets">
              {props => <Sus component={<GetTickets {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyEvents">
              {props => <Sus component={<MyEvents {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="AddEvent">
              {props => <Sus component={<AddEvent {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyAds">
              {props => <Sus component={<MyAds {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="CreateAd">
              {props => <Sus component={<CreateAd {...props} />} />}
            </Stack.Screen>
            <Stack.Screen name="MyAdDetails">
              {props => <Sus component={<MyAdDetails {...props} />} />}
            </Stack.Screen> 
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}

export default function WrappedApp() {
  return (
    <NavigationProvider>
      <App />
    </NavigationProvider>
  );
}
