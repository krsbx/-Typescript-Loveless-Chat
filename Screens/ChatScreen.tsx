import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInputContentSizeChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { auth, database, timestamp } from '../Component/FirebaseSDK';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import ChatElement from '../Component/ChatElement';
import PopUpMenu from '../Component/PopupMenu';
import ChatPopUp from '../Screens/Pop Up/ChatPopUp';
import { sendPushNotification } from '../Component/NotificationsSDK';
import {
  MessageContext,
  UserInformations,
  ChatMember,
  MessageData,
  NotificationContent,
} from '../Component/DataInterface';
import MediaElement from '../Component/MediaElement';

const ChatScreen = ({ navigation, route }: any) => {
  const [Chat, SetChat] = useState<string>('');
  const [Visible, SetVisible] = useState(false);
  const [MediaPopUp, SetMediaPopUp] = useState(false);
  const [Message, SetMessage] = useState<MessageData[]>([]);
  const [Size, SetSize] = useState<number>(55);
  const [Pictures, SetPictures] = useState<string>('');
  const [MediaName, SetMediaName] = useState<string>('');

  const ScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.chatName,
      headerTitleStyle: {
        fontWeight: '800',
      },
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerLeft: () => (
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 80,
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
          <TouchableOpacity>
            <Avatar
              rounded
              size="small"
              source={{ uri: Message?.[Message.length - 1]?.data['profile'] }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            marginRight: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
          }}
        >
          <TouchableOpacity onPress={() => SetVisible((Visible) => !Visible)}>
            <MaterialCommunityIcons name="dots-vertical" size={20} />
          </TouchableOpacity>
          <PopUpMenu visible={Visible} SetVisible={SetVisible}>
            <ChatPopUp
              SetVisible={SetVisible}
              navigation={navigation}
              params={route.params}
            />
          </PopUpMenu>
        </View>
      ),
    });
  }, [navigation, Message, Visible]);

  useEffect(() => {
    const unsubscribe = database
      .collection('Database')
      .doc('Chats')
      .collection(route.params.currentMode)
      .doc(route.params.id)
      .collection('message')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snap) =>
        SetMessage(
          snap.docs.map((doc) => {
            const newMsg: MessageData = {
              id: doc.id,
              data: doc.data() as MessageContext,
            };

            return newMsg;
          })
        )
      );

    return () => {
      unsubscribe();
    };
  }, []);

  const ScrollToEnd = () => {
    ScrollRef.current?.scrollToEnd({ animated: true });
  };

  const SendChat = async () => {
    if (Chat === '' && Pictures === '') return;

    const NewMessage: MessageContext = {
      Nickname: auth.currentUser?.displayName as string,
      email: auth.currentUser?.email as string,
      message: Chat,
      picture: Pictures,
      profile: auth.currentUser?.photoURL as string,
      timestamp: timestamp,
    };

    const ChatRef = database
      .collection('Database')
      .doc('Chats')
      .collection(route.params.currentMode)
      .doc(route.params.id);

    await ChatRef.collection('message').add(NewMessage);

    const Member: ChatMember = (await ChatRef.get()).data() as ChatMember;

    Member['member'].forEach(async (UID) => {
      if (UID !== auth.currentUser?.uid) {
        const UserRef = database
          .collection('Database')
          .doc('Users')
          .collection(UID)
          .doc('Informations');

        const UserInformations: UserInformations = (
          await UserRef.get()
        ).data() as UserInformations;

        if (
          UserInformations['Token'] !== undefined &&
          UserInformations['Token'] !== ''
        ) {
          const Notifications: NotificationContent = {
            to: UserInformations['Token'],
            sound: 'default',
            title: route.params.chatName,
            body: `${auth.currentUser?.displayName} : ${Chat}`,
            data: {
              id: route.params.id,
              chatName: route.params.chatName,
              currentMode: route.params.currentMode,
            },
          };

          sendPushNotification(Notifications);
        }
      }
    });

    SetChat('');
    SetPictures('');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#fff',
      borderTopColor: '#e2e2e2',
      borderTopWidth: 1,
    },
    inputs: {
      width: '90%',
      height: Math.min(Math.max(40, Size), 100),
      bottom: 0,
      flex: 1,
      padding: 10,
      backgroundColor: '#ECECEC',
      borderRadius: 30,
    },
    scrollAble: {
      backgroundColor: '#fff',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ height: '100%' }}>
            <MediaElement
              Visible={MediaPopUp}
              SetVisible={SetMediaPopUp}
              SetPictures={SetPictures}
            />
            <FlatList
              ref={ScrollRef}
              onContentSizeChange={ScrollToEnd}
              data={Message}
              keyExtractor={(item) => item['id']}
              style={styles.scrollAble}
              renderItem={({ item }) => {
                const Message: MessageData = item;
                return (
                  <ChatElement
                    key={Message['id']}
                    sender={
                      Message['data']['email'] === auth.currentUser?.email
                    }
                    Nickname={Message['data']['Nickname']}
                    message={Message['data']['message']}
                    profile={Message['data']['profile']}
                    picture={Message['data']['picture']}
                  />
                );
              }}
            />
            {Pictures !== '' && (
              <View
                style={{
                  height: 120,
                  flex: 1,
                  position: 'absolute',
                  bottom: Size,
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    backgroundColor: '#ffffff77',
                    padding: 5,
                    position: 'absolute',
                    right: 0,
                    zIndex: 1,
                    borderRadius: 30,
                  }}
                >
                  <Entypo
                    name="cross"
                    size={24}
                    color="black"
                    onPress={() => SetPictures('')}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: Pictures }}
                  style={{
                    height: 100,
                  }}
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                value={Chat}
                onChangeText={(e) => SetChat(e)}
                placeholder="Your chats"
                style={styles.inputs}
                multiline
                onContentSizeChange={(
                  e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
                ) => SetSize(e.nativeEvent.contentSize.height)}
              />
              <TouchableOpacity
                onPress={() => SetMediaPopUp(true)}
                activeOpacity={0.5}
                style={{
                  marginLeft: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="paperclip"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={SendChat}
                activeOpacity={0.5}
                style={{
                  marginLeft: 10,
                }}
              >
                <Ionicons name="send" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
