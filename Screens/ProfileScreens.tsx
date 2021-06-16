import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { auth, database } from '../Component/FirebaseSDK';
import { useIsFocused } from '@react-navigation/native';
import { UseMode } from '../Component/ModeContext';

type UserData = {
  FullName: string;
  Nickname: string;
  Profile: string;
  UID: string;
};

const ProfileScreens = ({ navigation }: any) => {
  const { SetVisibleTab } = UseMode();
  const [FullName, SetFullName] = useState('');

  const IsFocus = useIsFocused();

  const SignOut = () => {
    auth.signOut();
    navigation.replace('Login');
  };

  const GetProfile = async () => {
    const UID: string = auth.currentUser?.uid as string;

    const ProfileRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Informations');

    const ProfileRes: UserData = (await ProfileRef.get()).data() as UserData;

    SetFullName(ProfileRes['FullName']);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: auth.currentUser?.photoURL as string,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      title: auth.currentUser?.displayName,
      headerTitleStyle: { fontWeight: '800' },
    });

    GetProfile();
  }, []);

  useEffect(() => {
    if (IsFocus) {
      SetVisibleTab(true);
    }
  }, [IsFocus]);

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
        <View
          style={{
            borderColor: '#e2e2e2',
            borderWidth: 5,
            borderRadius: 50,
          }}
        >
          <Avatar
            source={{ uri: auth.currentUser?.photoURL as string }}
            rounded
            size="large"
          />
        </View>
        <Text style={{ fontWeight: '800', color: 'black', padding: 5 }}>
          {auth.currentUser?.displayName}
        </Text>
        <Text style={{ fontWeight: '500', color: 'black', padding: 5 }}>
          {FullName ? `(${FullName})` : ''}
        </Text>
        <View style={{ padding: 5 }}>
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            containerStyle={styles.button}
          />
          <Button
            title="Sign Out"
            titleStyle={styles.danger}
            type="outline"
            onPress={SignOut}
            containerStyle={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreens;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: '#e2e2e2',
    width: 250,
    padding: 5,
  },
  danger: {
    color: 'red',
    fontWeight: '500',
  },
});
