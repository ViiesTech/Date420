import { Alert } from "react-native"

export const Message = (title, message, buttons) => {
    return Alert.alert(title, message, buttons);
}