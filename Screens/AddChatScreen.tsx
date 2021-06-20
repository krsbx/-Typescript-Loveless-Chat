import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { CreateChat } from '../Utility/CreateGroupsUtility';

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

  const CreateGroups = async () => {
    await CreateChat(ChatName, navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          ref={ChatNameRef}
          value={ChatName}
          onChangeText={(e) => setChatName(e)}
          onSubmitEditing={CreateGroups}
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
          onPress={CreateGroups}
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
