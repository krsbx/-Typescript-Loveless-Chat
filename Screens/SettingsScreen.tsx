import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth, database, storage } from '../Component/FirebaseSDK';
import { CreateBlob } from '../Utility/Utility';
import ErrorElement from '../Component/ErrorElement';
import firebase from 'firebase';
import ReloginElement from '../Component/ReloginElement';

type UserData = {
  FullName?: string;
  Nickname?: string;
  Profile?: string;
  UID?: string;
  Token?: string;
};

type Member = {
  member: Array<string>;
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

  const SelectPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      SetNewPhoto(result.uri);
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
      const extensions = NewPhoto.split(',')[0].split(';')[0].split('/')[1];

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

  const UpdateProfile = () => {
    try {
      if (FullName !== NewFullName) {
        UpdateFullName();
      }

      if (NewPhoto) {
        UpdatePictures();
      }
    } catch (error) {
      console.error(error);
    }

    SetRequest(true);
  };

  const DeleteData = async () => {
    try {
      const UID: string = auth.currentUser?.uid as string;

      //Chat References
      const ChatRef = database.collection('Database').doc('Chats');
      const GroupsRef = ChatRef.collection('Groups');
      const PrivateRef = ChatRef.collection('Private');

      //Remove Member in Groups
      GroupsRef.onSnapshot(async (snap) => {
        snap.docs.forEach(async (doc) => {
          const data: Member = doc.data() as Member;

          if (data['member'] !== undefined) {
            const IsMember = data['member'].includes(UID);
            if (IsMember) {
              await GroupsRef.doc(doc.id).update({
                member: firebase.firestore.FieldValue.arrayRemove(UID),
              });
            }
          }
        });
      });

      //Remove Member in Private
      PrivateRef.onSnapshot(async (snap) => {
        snap.docs.forEach(async (doc) => {
          const data: Member = doc.data() as Member;

          if (data['member'] !== undefined) {
            const IsMember = data['member'].includes(UID);
            if (IsMember) {
              await PrivateRef.doc(doc.id).update({
                member: firebase.firestore.FieldValue.arrayRemove(UID),
              });
            }
          }
        });
      });

      //Profile References
      const ProfileRef = database
        .collection('Database')
        .doc('Users')
        .collection(UID);

      //Remove Friends
      ProfileRef.doc('Contacts')
        .collection('Friends')
        .onSnapshot(async (snap) => {
          snap.docs.forEach(async (doc) => {
            await ProfileRef.doc('Contacts')
              .collection('Friends')
              .doc(doc.id)
              .delete();
          });
        });

      await ProfileRef.doc('Contacts').delete();

      //Remove Informations
      await ProfileRef.doc('Informations').delete();

      // Remove User Entry
      const UserRef = database.collection('Database').doc('Users');
      const Key = `UID.${Nickname}`;

      let toUpdate: any = {};
      toUpdate[Key] = firebase.firestore.FieldValue.delete();

      await UserRef.update(toUpdate);

      await auth.currentUser?.delete().then(() => {
        navigation.replace('Login');
      });
    } catch (error) {
      console.error(error['code']);
    }
  };

  const DeleteAccounts = () => {
    //Get Last Time User Sign In
    const metadata = new Date(
      auth.currentUser?.metadata['lastSignInTime'] as string
    );
    const date = new Date();

    if (date.getTime() - metadata.getTime() > 5 * 60 * 1000) {
      SetError('Please Relogin!');
      SetShowAuth(true);
      return;
    }

    DeleteData();
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
          DeleteAccounts={DeleteData}
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
              onPress={SelectPicture}
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
