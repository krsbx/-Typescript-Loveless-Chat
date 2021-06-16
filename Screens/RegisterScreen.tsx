import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { Avatar, Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, database, storage } from '../Component/FirebaseSDK';
import { CreateBlob } from '../Utility/Utility';
import { Formik } from 'formik';
import * as yup from 'yup';
import ErrorElement from '../Component/ErrorElement';

const RegisterScreen = () => {
  const [Profile, setProfile] = useState<string>('');
  const [Request, setRequest] = useState(false);

  const NameRef = useRef<TextInput>(null);

  const emptyProfile =
    'https://www.pngfind.com/pngs/b/16-168360_user-icon-png.png';

  const SelectPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      setProfile(result.uri);
    }
  };

  const AskPermission = async () => {
    if (Platform.OS === 'web') {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert('We need permission for your media library');
      }
    }
  };

  const Register = async (
    Nickname: string,
    Email: string,
    Password: string
  ) => {
    setRequest(true);

    try {
      let ProfileUrl: string = emptyProfile;

      const currentUser = await auth.createUserWithEmailAndPassword(
        Email,
        Password
      );

      const Key = `UID.${Nickname}`;

      const UID: string = currentUser.user?.uid as string;

      let toUpdate: any = {};
      toUpdate[Key] = UID;

      //Add User To Database Entry
      await database.collection('Database').doc('Users').update(toUpdate);

      if (Profile) {
        const extensions = Profile.split(',')[0].split(';')[0].split('/')[1];

        const PicturesRef = storage
          .ref(`Profile`)
          .child(`${UID}.${extensions}`);

        await PicturesRef.put(await CreateBlob(Profile));
        const PicturesUrl = await PicturesRef.getDownloadURL();
        ProfileUrl = PicturesUrl;
      }

      //Add User Informations in Databases
      await database
        .collection('Database')
        .doc('Users')
        .collection(UID)
        .doc('Informations')
        .set({
          Nickname: Nickname,
          UID: UID,
          Profile: ProfileUrl,
          FullName: '',
        });

      await currentUser.user?.updateProfile({
        displayName: Nickname,
        photoURL: ProfileUrl,
      });
    } catch (error) {
      console.error(error);

      setRequest(false);
    }
  };

  const RegisterSchema = yup.object().shape({
    Nickname: yup
      .string()
      .required()
      .min(5)
      .test('CheckName', 'Nickname already in use', async (Nick) => {
        let ExistNick = false;

        const ProfileNameRef = database.collection('Database').doc('Users');
        const ProfileNameDocs = (await ProfileNameRef.get()).data();

        if (ProfileNameDocs) {
          ExistNick = ProfileNameDocs['UID'].hasOwnProperty(Nick);
        }

        return !ExistNick;
      }),
    Email: yup.string().email().required(),
    Password: yup.string().required().min(6),
  });

  useEffect(() => {
    AskPermission();
    NameRef.current?.focus();
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Formik
        initialValues={{
          Nickname: '',
          Email: '',
          Password: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          Register(values['Nickname'], values['Email'], values['Password']);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }: any) => (
          <View style={styles.viewContainer}>
            <TouchableOpacity
              onPress={SelectPicture}
              activeOpacity={0.8}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <Avatar
                source={{ uri: Profile || emptyProfile }}
                size="large"
                rounded
              />
              <Text style={{ marginTop: 5 }}>Profile Pictures</Text>
            </TouchableOpacity>
            <View style={{ height: 50 }} />
            <Input
              ref={NameRef}
              placeholder="Nickname"
              value={values['Nickname']}
              onChangeText={handleChange('Nickname')}
              leftIcon={
                <MaterialIcons
                  name="drive-file-rename-outline"
                  size={24}
                  color="black"
                />
              }
              style={styles.inputs}
              editable={!Request}
              containerStyle={styles.inputContainer}
            />
            {errors['Nickname'] && (
              <ErrorElement>{errors['Nickname']}</ErrorElement>
            )}
            <Input
              placeholder="Email"
              value={values['Email']}
              onChangeText={handleChange('Email')}
              leftIcon={<MaterialIcons name="email" size={24} color="black" />}
              style={styles.inputs}
              editable={!Request}
              containerStyle={styles.inputContainer}
            />
            {errors['Email'] && <ErrorElement>{errors['Email']}</ErrorElement>}
            <Input
              placeholder="Password"
              value={values['Password']}
              onChangeText={handleChange('Password')}
              secureTextEntry
              leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
              style={styles.inputs}
              onSubmitEditing={handleSubmit}
              editable={!Request}
              containerStyle={styles.inputContainer}
            />
            {errors['Password'] && (
              <ErrorElement>{errors['Password']}</ErrorElement>
            )}
            <Button
              title="Register"
              onPress={handleSubmit}
              containerStyle={styles.button}
              disabled={Request}
            />
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    width: 300,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    padding: 5,
  },
  inputs: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
});
