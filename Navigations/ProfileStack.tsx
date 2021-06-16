import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreens from '../Screens/ProfileScreens';
import SettingsScreen from '../Screens/SettingsScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreens} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
