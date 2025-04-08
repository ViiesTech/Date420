import { PermissionsAndroid, Platform } from "react-native";
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

const config = {
  apiKey: 'AIzaSyCcqJR5ch6nizGv09yk90N24YEmHf00KUQ',
  authDomain: 'date420-c38ee.firebaseapp.com',
  projectId: 'date420-c38ee',
  storageBucket: 'date420-c38ee.appspot.com',
  messagingSenderId: '436381275114',
  appId: '1:436381275114:web:f3e13c7045d0a674725893',
  persistence: true,
  measurementId: "G-5BQPGBTEP6",
  databaseURL: "https://date420-c38ee-default-rtdb.firebaseio.com/"
};

export async function connectFirebase() {
if(Platform.OS === 'android') {    
  try {
    PermissionsAndroid?.request(PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS);
    if (!firebase?.apps?.length) {
      firebase?.initializeApp(config)
    }else {
      firebase?.app()
    }
    const fcmToken = await messaging()?.getToken();
    await messaging()?.subscribeToTopic('date420');
    return fcmToken;
  }catch(err) {
    console.log(err)
  }
}
}