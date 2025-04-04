import {Appearance} from 'react-native';

interface Colors {
    [key: string]: string | undefined
}

// COLORS FOR THE DARK THEME
const darkColorScheme: Colors = {
    primary: "#54FF65",
    primary_opactiy_15: "rgba(84, 255, 101, .15)",
    primary_100: "#00B112",
    primary_200: "#00FF19",
    primary_300: "#004407",
    background: "#000000",
    btnText: "#000000",
    footerBackground: "rgba(0, 0, 0, .5)",
    whiteText: "#ffffff",
    galleryCross: "#FF1F00",
    otherChatBackground: "#373737",
    approvedColor: "#007bff",
    activeStatusColor: "#0088F2",
    pendingColor: "#ffc107",
    rejectedColor: "#dc3545",
    lightBorder: 'lightgray'
};

// COLORS FOR THE LIGHT THEME
const lightColorScheme: Colors = {
    primary: "#54FF65",
    primary_opactiy_15: "rgba(84, 255, 101, .15)",
    primary_100: "#00B112",
    primary_200: "#00FF19",
    primary_300: "#004407",
    background: "#000000",
    btnText: "#000000",
    footerBackground: "rgba(0, 0, 0, .5)",
    whiteText: "#ffffff",
    galleryCross: "#FF1F00",
    otherChatBackground: "#373737",
    approvedColor: "#007bff",
    activeStatusColor: "#0088F2",
    pendingColor: "#ffc107",
    rejectedColor: "#dc3545",
    lightBorder: 'lightgray'
};

export const Color = (color: string) => {
    // GET USER DEVICE THEME (LIGHT/DARK)
    const colorScheme = Appearance.getColorScheme();

    if (colorScheme === 'dark') {           // IF USER DEVICE THEME IS DARK
        return darkColorScheme[color];
    }else {                                 // IF USER DEVICE THEME IS LIGHT
        return lightColorScheme[color];
    }
}