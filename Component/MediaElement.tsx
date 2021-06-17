import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import {
  SelectPicture,
  TakePictures,
  AskPermission,
} from '../Utility/ImagePicker';

type ToPass = {
  Visible: boolean;
  SetVisible: Dispatch<SetStateAction<boolean>>;
  SetPictures: Dispatch<SetStateAction<string>>;
};

const MediaElement = ({ Visible, SetVisible, SetPictures }: ToPass) => {
  useEffect(() => {
    AskPermission();
  }, []);

  return (
    <Modal visible={Visible} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            SetVisible(false);
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={styles.PopUp}>
              <TouchableOpacity
                style={styles.MediaSelections}
                onPress={() => {
                  SelectPicture(SetPictures, false);
                  SetVisible(false);
                }}
              >
                <Fontisto name="photograph" size={40} color="black" />
                <Text style={{ fontWeight: '800', marginTop: 10 }}>Galery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.MediaSelections}
                onPress={() => {
                  TakePictures(SetPictures);
                  SetVisible(false);
                }}
              >
                <Fontisto name="camera" size={40} color="black" />
                <Text style={{ fontWeight: '800', marginTop: 10 }}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

export default MediaElement;

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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    padding: 25,
    position: 'absolute',
    bottom: 20,
    borderColor: '#e2e2e2',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    flexDirection: 'row',
  },
  MediaSelections: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 25,
  },
});
