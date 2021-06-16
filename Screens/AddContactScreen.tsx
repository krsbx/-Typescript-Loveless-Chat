import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { auth, database } from '../Component/FirebaseSDK';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

type UserData = {
  UID: Map<string, string>;
};

type FriendsType = {
  UID: string;
  Nickname: string;
};

const AddContactScreen = ({ navigation }: any) => {
  const [Name, setName] = useState<string>('');
  const [Request, SetRequest] = useState<boolean>(false);

  const NameRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Add New Contact',
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

    NameRef.current?.focus();
  }, []);

  const AddContact = async () => {
    if (Name === undefined) return;

    if (Name === auth.currentUser?.displayName) return;

    SetRequest(true);

    try {
      const userRef = database.collection('Database').doc('Users');

      const userSnap: UserData = (await userRef.get()).data() as UserData;

      const data = userSnap['UID'];

      if (data.hasOwnProperty(Name)) {
        const UID: string = auth.currentUser?.uid as string;

        const NewFriends: FriendsType = {
          UID: data.get(Name) as string,
          Nickname: Name,
        };

        const CreatedContact = await database
          .collection('Database')
          .doc('Users')
          .collection(UID)
          .doc('Contacts')
          .collection('Friends')
          .add(NewFriends);

        if (CreatedContact) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error(error);
    }

    SetRequest(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={NameRef}
          value={Name}
          onChangeText={(e) => setName(e)}
          onSubmitEditing={AddContact}
          placeholder="User Nickname"
          leftIcon={<Entypo size={24} name="users" color="black" />}
          style={styles.inputs}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Button
          title="Add Contacts"
          type="solid"
          onPress={AddContact}
          containerStyle={styles.button}
          disabled={Request}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    padding: 5,
    width: 300,
  },
  inputs: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
  button: {
    width: 300,
    padding: 5,
  },
});
