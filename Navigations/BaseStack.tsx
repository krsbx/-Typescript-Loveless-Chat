import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import TabNavigations from './TabNavigations';

const Stack = createStackNavigator();

const BaseStack = () => {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Tabs"
        component={TabNavigations}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default BaseStack;
