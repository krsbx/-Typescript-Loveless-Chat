import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const SelectPicture = async (
  SetPictures: React.Dispatch<React.SetStateAction<string>>
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 3],
    quality: 0.5,
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
