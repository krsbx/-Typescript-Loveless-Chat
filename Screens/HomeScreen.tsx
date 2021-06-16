import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import { auth, database } from '../Component/FirebaseSDK';
import { MaterialCommunityIcons, Entypo, Fontisto } from '@expo/vector-icons';
import ListChat from '../Component/ListChat';
import { UseMode } from '../Component/ModeContext';
import PopUpMenu from '../Component/PopupMenu';
import HomePopUp from './Pop Up/HomePopUp';
import { ContactsCleaner } from '../Utility/ContactsCleaner';
import { useIsFocused } from '@react-navigation/native';

type DocsChat = {
  chatName: string;
  member: Array<string>;
};

type ChatType = {
  id: string;
  data: DocsChat;
};

type LastChatType = {
  Nickname: string;
  email: string;
  message: string;
  profile: string;
  timestamp: Date;
};

const HomeScreen = ({ navigation }: any) => {
  const [Chat, SetChat] = useState<ChatType[]>([]);
  const [LastChat, SetLastChat] = useState<any[]>([]);
  const [Visible, SetVisible] = useState(false);
  const [FirstLogin, SetFirstLogin] = useState(true);
  const [SearchParams, SetSearchParams] = useState<string>('');

  const SearchBar = useRef<TextInput>(null);

  const IsFocus = useIsFocused();

  const { Mode, SetMode, CurrentMode, SetVisibleTab } = UseMode();

  const SignOut = () => {
    auth.signOut();
    navigation.replace('Login');
  };

  const EnterChat = (id: string, chatName: string, chatMode: string) => {
    navigation.navigate('Chat', {
      id: id,
      chatName: chatName,
      currentMode: chatMode,
    });
  };

  const Search = () => {
    return Chat.filter((chat: ChatType) => {
      if (SearchParams == '') {
        return chat;
      } else if (
        SearchParams !== undefined &&
        chat['data']['chatName']
          .toLowerCase()
          .includes(SearchParams.toLowerCase())
      ) {
        return chat;
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={SignOut}>
            <Avatar
              rounded
              source={{
                uri: auth.currentUser?.photoURL as string,
              }}
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
            <HomePopUp
              SetMode={SetMode}
              SetVisible={SetVisible}
              navigation={navigation}
            />
          </PopUpMenu>
        </View>
      ),
      title: auth.currentUser?.displayName,
      headerTitleStyle: { fontWeight: '800' },
    });

    const UID: string = auth.currentUser?.uid as string;

    const unsubscribe = database
      .collection('Database')
      .doc('Chats')
      .collection(CurrentMode())
      .onSnapshot((snap) => {
        SetChat(
          snap.docs
            .map((doc) => {
              const data: DocsChat = doc.data() as DocsChat;

              if (data['member'] !== undefined) {
                const IsMember = data['member'].includes(UID);
                if (IsMember) {
                  return {
                    id: doc.id,
                    data: data,
                  };
                }
              }
            })
            .filter((chats: ChatType | undefined): chats is ChatType => {
              return chats != undefined;
            })
        );
      });

    return unsubscribe;
  }, [Visible, Mode]);

  useEffect(() => {
    if (FirstLogin) {
      ContactsCleaner();
      SetFirstLogin(false);
    }
  }, []);

  useEffect(() => {
    if (IsFocus) {
      SetVisibleTab(true);
    }
  }, [IsFocus]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', height: '100%' }}>
        <Input
          ref={SearchBar}
          placeholder="Chats Name"
          onChangeText={(text: string) => SetSearchParams(text)}
          value={SearchParams}
          style={{
            width: '100%',
            backgroundColor: '#ECECEC',
            color: 'black',
          }}
          inputStyle={styles.inputStyle}
          containerStyle={styles.searchContainer}
          leftIcon={
            <TouchableOpacity>
              <Fontisto name="search" size={24} />
            </TouchableOpacity>
          }
          rightIcon={
            SearchBar.current?.isFocused() &&
            SearchParams !== '' && (
              <TouchableOpacity onPress={() => SetSearchParams('')}>
                <Entypo name="cross" size={24} />
              </TouchableOpacity>
            )
          }
        />
        <FlatList
          data={Search()}
          keyExtractor={(item) => item['id']}
          style={styles.scrollAble}
          renderItem={({ item }) => (
            <ListChat
              id={item['id']}
              chatName={item['data']['chatName']}
              chatMode={CurrentMode()}
              enterChat={EnterChat}
              SetVisible={SetVisible}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollAble: {
    backgroundColor: '#fff',
    width: '100%',
  },
  searchContainer: { backgroundColor: '#fff', marginTop: 10 },
  inputStyle: { backgroundColor: '#fff', color: 'black' },
});
