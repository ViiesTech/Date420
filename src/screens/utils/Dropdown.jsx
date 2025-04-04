import { useState } from "react";
import { Dimensions, FlatList, Modal, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "../../utils/Colors";
import { ArrowDown2, User } from "iconsax-react-native";
import { Pera, Small } from "../../utils/Text";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('screen');
const Dropdown = ({ style, data, selectedValue, onValueChange, defaultStyle, label, icon }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleSelect = (item) => {
        onValueChange(item);
        setIsVisible(false);
    };

    const defaulDropdownButton = defaultStyle ? {
        backgroundColor: Color('primary_opactiy_15'),
        borderColor: Color('primary'),
        borderWidth: 1,
        minHeight: Platform.OS === 'ios' ? 60 : height * 0.07
    } : {};
    const defaultDropdownButtonText = defaultStyle ? {
        color: Color('primary_100'),
        fontSize: RFValue(15, height)
    }: {};

    return (
        <View style={style}>
            {defaultStyle && <Small style={{
                fontFamily: 'Manrope-font',
                marginBottom: height * 0.008,
                marginLeft: width * 0.03
            }}>{label}</Small>}
            <TouchableOpacity style={[styles.dropdownButton, defaulDropdownButton]} onPress={() => setIsVisible(true)}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    {icon && (
                        <User
                            size="25"
                            color={Color(defaultStyle ? 'primary' : 'background')}
                        />
                    )}
                    <Pera style={[styles.dropdownButtonText, defaultDropdownButtonText]}>{selectedValue || "Select an option"}</Pera>
                </View>
                <ArrowDown2
                    size="20"
                    color={Color(defaultStyle ? 'primary_100' : 'background')}
                    variant="Bold"
                />
            </TouchableOpacity>
            <Modal visible={isVisible} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
                    <View style={styles.dropdown}>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item.value)}>
                                    <Pera style={styles.dropdownItemText}>{item.label}</Pera>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownButton: {
        padding: width * 0.04,
        backgroundColor: Color('primary'),
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropdownButtonText: {
        color: Color('btnText')
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color('footerBackground'),
        zIndex: 1
    },
    dropdown: {
        width: width * 0.9,
        backgroundColor: Color('background'),
        borderWidth: 1,
        borderColor: Color('primary'),
        borderRadius: 5,
        maxHeight: height * 0.5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Color('primary'),
    },
    dropdownItemText: {
        color: Color('whiteText')
    },
});

export default Dropdown;
