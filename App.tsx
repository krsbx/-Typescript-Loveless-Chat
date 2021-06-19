import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ModeProvider } from './Component/ModeContext';
import BaseStack from './Navigations/BaseStack';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  return (
    <ModeProvider>
      <NavigationContainer>
        <BaseStack />
      </NavigationContainer>
    </ModeProvider>
  );
}
