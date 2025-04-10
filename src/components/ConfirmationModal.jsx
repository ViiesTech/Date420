import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from './Button';
import { Color } from '../utils/Colors';

const ConfirmationModal = ({
  modalText,
  onCancel,
  onConfirm,
  onRequestClose,
  visible,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalWrapper}>
        <View style={styles.modalView}>
          <Text style={styles.text}>{modalText}</Text>
          <View style={styles.buttonWrapper}>
            <Button
              children={'Cancel'}
              style={styles.cancelButton}
              onPress={onCancel}
              // textStyle={{color: 'red'}}
            />
            <Button
              children={'Confirm'}
              onPress={onConfirm}
              style={[styles.confirmButton, {width: '45%'}]}
              // textStyle={{color: 'blue'}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    backgroundColor: 'black',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 6,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: Color('primary_200'),
    width: '45%',
  },
  confirmButton: {
    backgroundColor: Color('primary_200'),
    width: '45%',
  },
});
