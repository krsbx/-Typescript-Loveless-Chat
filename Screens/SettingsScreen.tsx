import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { auth, database, storage } from '../Component/FirebaseSDK';
import { CreateBlob } from '../Utility/Utility';
import ErrorElement from '../Component/ErrorElement';
import ReloginElement from '../Component/ReloginElement';
import { SelectPicture, AskPermission } from '../Utility/ImagePicker';
import { DeleteData } from '../Utility/SettingsUtility';

type UserData = {
  FullName?: string;
  Nickname?: string;
  Profile?: string;
  UID?: string;
  Token?: string;
};

const SettingsScreen = ({ navigation }: any) => {
  const [Nickname, SetNickname] = useState('');
  const [FullName, SetFullName] = useState('');
  const [PhotoURL, SetPhotoURL] = useState('');

  const [NewFullName, SetNewFullName] = useState('');
  const [NewPhoto, SetNewPhoto] = useState('');
  const [Error, SetError] = useState('');

  const [ShowAuth, SetShowAuth] = useState(false);
  const [Request, SetRequest] = useState(false);

  const GetProfile = async () => {
    const UID: string = auth.currentUser?.uid as string;

    const ProfileRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Informations');

    const ProfileRes: UserData = (await ProfileRef.get()).data() as UserData;
    SetNickname(ProfileRes['Nickname'] as string);
    SetFullName(ProfileRes['FullName'] as string);
    SetNewFullName(ProfileRes['FullName'] as string);
    SetPhotoURL(ProfileRes['Profile'] as string);
  };

  const UpdateFullName = async () => {
    try {
      const UID: string = auth.currentUser?.uid as string;

      const ProfileRef = database
        .collection('Database')
        .doc('Users')
        .collection(UID)
        .doc('Informations');

      const NewData: UserData = {
        FullName: NewFullName,
      };

      await ProfileRef.update(NewData);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdatePictures = async () => {
    try {
      const UID: string = auth.currentUser?.uid as string;

      let ProfileUrl = PhotoURL;
      const extensions = NewPhoto.split('.').pop();

      const PicturesRef = storage.ref(`Profile`).child(`${UID}.${extensions}`);

      await PicturesRef.put(await CreateBlob(NewPhoto));
      const PicturesUrl = await PicturesRef.getDownloadURL();
      ProfileUrl = PicturesUrl;

      const NewData: UserData = {
        Profile: ProfileUrl,
      };

      const ProfileRef = database
        .collection('Database')
        .doc('Users')
        .collection(UID)
        .doc('Informations');
      await ProfileRef.update(NewData);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateProfile = async () => {
    try {
      if (FullName !== NewFullName) {
        await UpdateFullName();
      }

      if (NewPhoto) {
        await UpdatePictures();
      }

      SetRequest(true);
    } catch (error) {
      console.error(error);
    }

    SetRequest(false);
  };

  const DeleteAccounts = async () => {
    //Get Last Time User Sign In
    const metadata = new Date(
      auth.currentUser?.metadata['lastSignInTime'] as string
    );
    const date = new Date();

    //If use last sign in time is more than 5 minutes
    //  Ask the users for new logins (Use Relogin Element)
    if (date.getTime() - metadata.getTime() > 5 * 60 * 1000) {
      SetError('Please Relogin!');
      SetShowAuth(true);
      return;
    }

    await DeleteData(navigation);
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerLeft: () => (
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
      ),
    });

    AskPermission();

    GetProfile();
  }, []);

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <ReloginElement
          Visible={ShowAuth}
          SetVisible={SetShowAuth}
          DeleteAccounts={DeleteData.bind(navigation)}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              borderColor: '#e2e2e2',
              borderWidth: 3,
              borderRadius: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => SelectPicture(SetNewPhoto, true)}
              activeOpacity={0.8}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <Avatar
                source={{
                  uri: NewPhoto
                    ? NewPhoto
                    : (auth.currentUser?.photoURL as string),
                }}
                rounded
                size="large"
              />
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 10, marginBottom: 10 }}>
            Profile Pictures
          </Text>
          <Text style={{ fontWeight: '800', color: 'black', marginBottom: 2 }}>
            {auth.currentUser?.displayName}
          </Text>
          <Text style={{ fontWeight: '500', color: 'black', marginBottom: 2 }}>
            {FullName ? `(${FullName})` : ''}
          </Text>
        </View>
        <View style={styles.viewContainer}>
          <Text>Nickname</Text>
          <View style={styles.inputContainer}>
            <Input value={Nickname} editable={false} style={styles.inputs} />
          </View>
          <Text>Full Name</Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Full Name"
              value={NewFullName}
              onChangeText={(e) => SetNewFullName(e)}
              editable={!Request}
              style={styles.inputs}
            />
          </View>
          <View style={{ padding: 5 }}>
            <Button
              title="Save Changes!"
              onPress={UpdateProfile}
              disabled={Request}
              containerStyle={styles.button}
            />
            <Button
              title="Delete Accounts"
              titleStyle={styles.danger}
              type="outline"
              onPress={DeleteAccounts}
              containerStyle={styles.button}
            />
          </View>
          {Error !== undefined && <ErrorElement>{Error}</ErrorElement>}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 5,
  },
  danger: {
    color: 'red',
    fontWeight: '500',
  },
  viewContainer: {
    width: 300,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
