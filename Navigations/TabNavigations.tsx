import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AfterLoginStack from './AfterLoginStack';
import ProfileStack from './ProfileStack';
import { UseMode } from '../Component/ModeContext';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { auth, database } from '../Component/FirebaseSDK';
import { Subscription } from '@unimodules/core';

type UserData = {
  FullName: string;
  Nickname: string;
  Profile: string;
  UID: string;
  Token: string;
};

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

const RegisterPushNotifications = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    const UID: string = auth.currentUser?.uid as string;

    const UserRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Informations');

    const currentData: UserData = (await UserRef.get()).data() as UserData;
    const currentToken: string = currentData['Token'];
    console.log(currentToken);

    if (token && currentToken !== token) {
      await UserRef.update({
        Token: token,
      });
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#fff',
      });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }
};

interface NewNotificationRequest
  extends Omit<Notifications.NotificationRequest, 'content'> {
  content: {
    sound: string;
    title: string;
    body: string;
    data: {
      id: string;
      chatName: string;
      currentMode: string;
    };
  };
}

interface NotificationData extends Omit<Notifications.Notification, 'request'> {
  request: NewNotificationRequest;
}

interface NotificationResponse
  extends Omit<Notifications.NotificationResponse, 'notification'> {
  notification: NotificationData;
}

const TabNav = ({ navigation }: any) => {
  const { VisibleTab } = UseMode();

  const [Notification, SetNotification] = useState<any>(false);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    RegisterPushNotifications();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notifications) =>
        SetNotification(notifications)
      );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response: Notifications.NotificationResponse) => {
          const NewResponseType: NotificationResponse =
            response as unknown as NotificationResponse;
          navigation.navigate('Chat', {
            id: NewResponseType.notification.request.content.data['id'],
            chatName:
              NewResponseType.notification.request.content.data['chatName'],
            currentMode:
              NewResponseType.notification.request.content.data['currentMode'],
          });
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as Subscription
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as Subscription
      );
    };
  }, []);

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
