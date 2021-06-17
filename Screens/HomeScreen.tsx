import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth, database } from '../Component/FirebaseSDK';
import { MaterialCommunityIcons, Entypo, Fontisto } from '@expo/vector-icons';
import ListChat from '../Component/ListChat';
import { UseMode } from '../Component/ModeContext';
import PopUpMenu from '../Component/PopupMenu';
import HomePopUp from './Pop Up/HomePopUp';
import { ContactsCleaner } from '../Utility/ContactsCleaner';
import { useIsFocused } from '@react-navigation/native';
import SearchBar from '../Component/SearchBar';
import { ChatCollections, ChatInformations } from '../Component/DataInterface';

const HomeScreen = ({ navigation }: any) => {
  const [Chat, SetChat] = useState<ChatCollections[]>([]);
  const [Visible, SetVisible] = useState(false);
  const [FirstLogin, SetFirstLogin] = useState(true);
  const [SearchParams, SetSearchParams] = useState<string>('');

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
    return Chat.filter((chat: ChatCollections) => {
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
              const data: ChatInformations = doc.data() as ChatInformations;

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
            .filter(
              (
                chats: ChatCollections | undefined
              ): chats is ChatCollections => {
                return chats != undefined;
              }
            )
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
        <SearchBar
          placeholder="Chats Name"
          SetValue={SetSearchParams}
          value={SearchParams}
          leftIcon={<Fontisto name="search" size={24} />}
          rightIcon={<Entypo name="cross" size={24} />}
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
});
