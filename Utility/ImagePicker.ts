import { Dispatch, SetStateAction } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const SelectPicture = async (
  SetPictures: Dispatch<SetStateAction<string>>,
  profiles: boolean
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.65,
    base64: true,
    aspect: profiles === true ? [3, 3] : undefined,
  });

  if (!result.cancelled) {
    SetPictures(result.uri);
  }
};

export const TakePictures = async (
  SetPictures: Dispatch<SetStateAction<string>>
) => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.65,
    base64: true,
  });

  if (!result.cancelled) {
    SetPictures(result.uri);
  }
};

export const AskPermission = async () => {
  if (Platform.OS === 'web') {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('We need permission for your media library');
    }
  }
};
