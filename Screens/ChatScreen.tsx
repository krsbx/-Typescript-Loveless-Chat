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
} from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import { auth, database, timestamp } from '../Component/FirebaseSDK';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ChatElement from '../Component/ChatElement';
// import PopUpMenu from '../Component/PopupMenu';
// import ChatPopUp from '../Screens/Pop Up/ChatPopUp';

type MessageType = {
  Nickname: string;
  email: string;
  message: string;
  profile: string;
  timestamp: any;
};

type ChatType = {
  id: string;
  data: MessageType;
};

const ChatScreen = ({ navigation, route }: any) => {
  const [Chat, SetChat] = useState<string>('');
  const [Visible, SetVisible] = useState(false);
  const [Message, SetMessage] = useState<ChatType[]>([]);

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
          {/* <PopUpMenu visible={Visible} style={styles.popStyle}>
            <ChatPopUp
              SetVisible={SetVisible}
              navigation={navigation}
              CurrentMode={route.params.currentMode}
              params={route.params}
            />
          </PopUpMenu> */}
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
            const newMsg: ChatType = {
              id: doc.id,
              data: doc.data() as MessageType,
            };

            return newMsg;
          })
        )
      );

    return unsubscribe;
  }, [route]);

  const ScrollToEnd = () => {
    ScrollRef.current?.scrollToEnd({ animated: true });
  };

  const SendChat = async () => {
    if (Chat === '') return;

    const NewMessage: MessageType = {
      Nickname: auth.currentUser?.displayName as string,
      email: auth.currentUser?.email as string,
      message: Chat,
      profile: auth.currentUser?.photoURL as string,
      timestamp: timestamp,
    };

    await database
      .collection('Database')
      .doc('Chats')
      .collection(route.params.currentMode)
      .doc(route.params.id)
      .collection('message')
      .add(NewMessage);

    SetChat('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="height"
        style={styles.container}
        keyboardVerticalOffset={30}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ height: '100%' }}>
            <FlatList
              ref={ScrollRef}
              onContentSizeChange={ScrollToEnd}
              data={Message}
              keyExtractor={(item) => item['id']}
              style={styles.scrollAble}
              renderItem={({ item }) => (
                <ChatElement
                  key={item['id']}
                  sender={item['data']['email'] === auth.currentUser?.email}
                  Nickname={item['data']['Nickname']}
                  message={item['data']['message']}
                  profile={item['data']['profile']}
                />
              )}
            />
            <View style={styles.inputContainer}>
              <TextInput
                value={Chat}
                onChangeText={(e) => SetChat(e)}
                placeholder="Your chats"
                style={styles.inputs}
                multiline
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
  },
  inputs: {
    width: '90%',
    height: 40,
    bottom: 0,
    flex: 1,
    padding: 10,
    backgroundColor: '#ECECEC',
    borderRadius: 30,
  },
  scrollAble: {
    backgroundColor: '#fff',
  },
  popStyle: {
    top: '-2.5%',
    right: '2.5%',
    width: 200,
    backgroundColor: 'white',
    borderColor: '#e2e2e2',
    borderWidth: 1,
  },
});
