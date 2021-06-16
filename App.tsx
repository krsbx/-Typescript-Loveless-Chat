import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ModeProvider } from './Component/ModeContext';
import BaseStack from './Navigations/BaseStack';

export default function App() {
  return (
    <ModeProvider>
      <NavigationContainer>
        <BaseStack />
      </NavigationContainer>
    </ModeProvider>
  );
}
