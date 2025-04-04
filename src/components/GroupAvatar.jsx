import { ImageBackground, StyleSheet, View } from "react-native";
import { Color } from "../utils/Colors";

const Avatar = ({ width, height, data, index }) => {
    return <ImageBackground source={{uri: data?.get_user?.get_user_profile_photo?.url}} key={index} style={[styles.avatar, { width: width, height: height, marginRight: -(width/2) }]}></ImageBackground>;
};

export const AvatarList = ({ width, height, arr }) => {
    return (
        <View style={styles.avatarList}>
            {
                arr.slice(0,10).map((val, index) => {
                    return <Avatar width={width} height={height} data={val} index={index} />
                })
            }
        </View>
    );
};

const styles = StyleSheet.create({
    avatarList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: Color('background'),
        borderRadius: 25,
        borderWidth: 3,
        borderColor: Color('background'),
        shadowColor: Color('background'),
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        overflow: 'hidden'
    },
})