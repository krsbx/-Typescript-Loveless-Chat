import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AddContact } from '../Utility/AddContactUtility';

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

  const AddUsers = () => {
    AddContact(Name, SetRequest, navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={NameRef}
          value={Name}
          onChangeText={(e) => setName(e)}
          onSubmitEditing={AddUsers}
          placeholder="User Nickname"
          leftIcon={<Entypo size={24} name="users" color="black" />}
          style={styles.inputs}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Button
          title="Add Contacts"
          type="solid"
          onPress={AddUsers}
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
