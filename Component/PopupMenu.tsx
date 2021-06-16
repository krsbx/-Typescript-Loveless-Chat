import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

type ToPass = {
  children: any;
  visible: boolean;
  SetVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopUpMenu = ({ children, visible, SetVisible }: ToPass) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            SetVisible(false);
            console.log('Damn');
          }}
        >
          <View style={{ width: '100%', height: '100%' }}>
            <View style={styles.PopUp}>{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

export default PopUpMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    width: '100%',
    height: '100%',
  },
  PopUp: {
    width: 225,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    position: 'absolute',
    right: 15,
    top: 15,
    borderColor: '#e2e2e2',
  },
});
