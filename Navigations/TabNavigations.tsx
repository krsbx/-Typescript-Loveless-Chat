import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AfterLoginStack from './AfterLoginStack';
import ProfileStack from './ProfileStack';
import { UseMode } from '../Component/ModeContext';

const Tab = createBottomTabNavigator();

const TabNav = () => {
  const { VisibleTab } = UseMode();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={AfterLoginStack}
        options={{
          tabBarVisible: VisibleTab,
          tabBarIcon: ({ focused }: any) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome
                name="home"
                color={focused ? 'black' : '#e2e2e2'}
                size={20}
              />
              <Text style={{ color: focused ? 'black' : '#e2e2e2' }}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarVisible: VisibleTab,
          tabBarIcon: ({ focused }: any) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome
                name="user"
                color={focused ? 'black' : '#e2e2e2'}
                size={20}
              />
              <Text style={{ color: focused ? 'black' : '#e2e2e2' }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;

const styles = StyleSheet.create({});
