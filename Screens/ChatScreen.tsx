import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInputContentSizeChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { auth, database } from '../Component/FirebaseSDK';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import ChatElement from '../Component/ChatElement';
import PopUpMenu from '../Component/PopupMenu';
import ChatPopUp from '../Screens/Pop Up/ChatPopUp';
import {
  MessageContext,
  MessageData,
  DocsObjects,
} from '../Component/DataInterface';
import MediaElement from '../Component/MediaElement';
import { SendChat } from '../Utility/ChatUtility';
import { ChatSections } from '../Component/ScreensInterface';

const ChatScreen = ({ navigation, route }: ChatSections) => {
  const [Chat, SetChat] = useState<string>('');
  const [Visible, SetVisible] = useState(false);
  const [MediaPopUp, SetMediaPopUp] = useState(false);
  const [Message, SetMessage] = useState<MessageData[]>([]);
  const [Size, SetSize] = useState<number>(55);
  const [Media, SetMedia] = useState<string>('');
  const [Docs, SetDocs] = useState<DocsObjects>({});

  const ScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: route['params']['chatName'],
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
              source={{ uri: Message?.[Message.length - 1]?.data['Profile'] }}
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
              params={route['params']}
            />
          </PopUpMenu>
        </View>
      ),
    });
  }, [navigation, Visible]);

  useEffect(() => {
    const unsubscribe = database
      .collection('Database')
      .doc('Chats')
      .collection(route['params']['currentMode'])
      .doc(route['params']['id'])
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
  }, [Message]);

  const ScrollToEnd = () => {
    ScrollRef.current?.scrollToEnd({ animated: true });
  };

  const Send = async () => {
    await SendChat(
      route['params']['chatName'],
      Chat,
      Media,
      Docs,
      route['params']['currentMode'],
      route['params']['id'],
      SetChat,
      SetMedia,
      SetDocs
    );
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
              SetMedia={SetMedia}
              SetDocs={SetDocs}
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
                      Message['data']['Email'] === auth.currentUser?.email
                    }
                    Nickname={Message['data']['Nickname']}
                    Message={Message['data']['Message']}
                    Profile={Message['data']['Profile']}
                    Media={Message['data']['Media']}
                    Docs={Message['data']['Docs']}
                  />
                );
              }}
            />
            {Docs.uri !== undefined && (
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
                    onPress={() => SetDocs({})}
                  />
                </TouchableOpacity>
                <Text>{Docs.name as string}</Text>
              </View>
            )}
            {Media !== '' && (
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
                    onPress={() => SetMedia('')}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: Media }}
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
                onPress={Send}
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
