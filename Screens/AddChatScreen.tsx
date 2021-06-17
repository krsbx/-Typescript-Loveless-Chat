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
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ChatInformations } from '../Component/DataInterface';

const AddChatScreen = ({ navigation }: any) => {
  const [ChatName, setChatName] = useState('');

  const ChatNameRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Create Groups',
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

    ChatNameRef.current?.focus();
  }, []);

  //Create New Chat Entry in Group Sections
  //  Each creations => 1 Member (Users who created the groups)
  const CreateChat = async () => {
    const NewChat: ChatInformations = {
      chatName: ChatName,
      member: [auth.currentUser?.uid as string],
    };

    try {
      const CreatedChat = await database
        .collection('Database')
        .doc('Chats')
        .collection('Groups')
        .add(NewChat);

      if (CreatedChat) navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={ChatNameRef}
          value={ChatName}
          onChangeText={(e) => setChatName(e)}
          onSubmitEditing={CreateChat}
          placeholder="Group Chat Name"
          leftIcon={
            <MaterialIcons size={24} name="chat-bubble" color="black" />
          }
          style={styles.inputs}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Button
          title="Create Groups"
          type="solid"
          onPress={CreateChat}
          containerStyle={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddChatScreen;

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
