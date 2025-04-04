import React, { useEffect, useState } from 'react';
import OtpTextInput from 'react-native-text-input-otp';
import { Color } from './Colors';

const OTPInput = ({ inputs, onComplete }) => {
    const [ otp, setOtp ] = useState("");
    useEffect(() => {
        if (otp.length === inputs) onComplete(otp);
    }, [otp])
    return (
        <OtpTextInput 
            style={{height: 70, borderColor: Color('primary'), justifyContent: 'center', backgroundColor: Color('primary_opactiy_5')}} 
            fontStyle={{color: Color('primary')}} 
            otp={otp} 
            setOtp={setOtp} 
            digits={inputs} 
        />
    )
}

export default OTPInput;