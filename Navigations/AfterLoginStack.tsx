import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import AddChatScreen from '../Screens/AddChatScreen';
import ChatScreen from '../Screens/ChatScreen';
import AddContactScreen from '../Screens/AddContactScreen';
import ContactScreen from '../Screens/ContactScreen';
import AddMemberScreen from '../Screens/AddMemberScreen';

const Stack = createStackNavigator();

const AfterLoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Add Chat" component={AddChatScreen} />
      <Stack.Screen name="Add Contact" component={AddContactScreen} />
      <Stack.Screen name="Contacts" component={ContactScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Add Member" component={AddMemberScreen} />
    </Stack.Navigator>
  );
};

export default AfterLoginStack;
