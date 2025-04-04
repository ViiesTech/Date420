import { RecordCircle } from 'iconsax-react-native'
import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { Color } from '../utils/Colors';
import { Pera } from '../utils/Text';

const { width, height } = Dimensions.get('screen');
const RadioButton = ({ selected, label, onSelectOption, disabled }) => {
    return (
        <TouchableOpacity style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: width * 0.015
        }}
            disabled={disabled}
            onPress={onSelectOption}
        >
            {
                selected
                    ?
                    <RecordCircle size="20" color={Color('primary')} variant="Bold" />
                    :
                    <RecordCircle size="20" color={Color('primary')} />
            }
            <Pera style={{ color: Color('whiteText') }}>{label}</Pera>
        </TouchableOpacity>
    )
}

export default RadioButton