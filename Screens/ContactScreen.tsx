import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import ContactElement from '../Component/ContactElement';
import { auth, database } from '../Component/FirebaseSDK';
import { Ionicons } from '@expo/vector-icons';
import {
  ChatInformations,
  ContactInformations,
  UserProfileURL,
} from '../Component/DataInterface';
import { UseMode } from '../Component/ModeContext';

const ContactScreen = ({ navigation }: any) => {
  const [Contacts, SetContacts] = useState<ContactInformations[]>([]);
  const { SetVisibleTab } = UseMode();

  const GetContacts = async () => {
    const UID: string = auth.currentUser?.uid as string;

    const ContactRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    const ContactRes = await ContactRef.get({
      source: 'server',
    });

    const ConResult = ContactRes.docs.map((doc) => {
      const data = doc.data();
      return {
        UID: data['UID'],
        Nickname: data['Nickname'],
      };
    });

    const ProfileResult = await Promise.all(
      ConResult.map(async (contact) => {
        const UserRef = database
          .collection('Database')
          .doc('Users')
          .collection(contact['UID'])
          .doc('Informations');

        const UserSnap: ContactInformations = (
          await UserRef.get()
        ).data() as ContactInformations;

        if (UserSnap['Profile'] !== undefined) {
          return {
            Profile: UserSnap['Profile'],
          };
        }
      })
    );

    const FriendsProfile: UserProfileURL[] = ProfileResult.filter(
      (friends: UserProfileURL | undefined): friends is UserProfileURL => {
        return friends != undefined;
      }
    );

    SetContacts(
      ConResult.map((contact, id) => ({
        UID: contact['UID'],
        Nickname: contact['Nickname'],
        Profile: FriendsProfile[id]['Profile'],
      }))
    );
  };

  const EnterChat = (ID: string, Nickname: string) => {
    const CurrentNickname: string = auth.currentUser?.displayName as string;

    SetVisibleTab(false);

    navigation.navigate('Chat', {
      id: ID,
      chatName: `${CurrentNickname}, ${Nickname}`,
      currentMode: 'Private',
    });
  };

  const CreateChat = async (selected: string, Nickname: string) => {
    const UserNickname: string = auth.currentUser?.displayName as string;
    const UserUID: string = auth.currentUser?.uid as string;

    const NewChat: ChatInformations = {
      chatName: `${UserNickname}, ${Nickname}`,
      member: [UserUID, selected],
    };

    try {
      const CheckExistRef = database
        .collection('Database')
        .doc('Chats')
        .collection('Private');

      const CheckChatExist = await CheckExistRef.get();
      let Exists = '';

      CheckChatExist.docs.map((doc) => {
        const data = doc.data()['member'];
        Exists =
          data.includes(selected) && data.includes(UserUID) ? doc.id : '';
      });

      if (!Exists) {
        const CreatedChat = await database
          .collection('Database')
          .doc('Chats')
          .collection('Private')
          .add(NewChat);

        EnterChat(CreatedChat.id, Nickname);
      } else {
        EnterChat(Exists, Nickname);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
        </View>
      ),
    });

    GetContacts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Contacts}
        keyExtractor={(item) => item['UID']}
        renderItem={({ item }) => (
          <ContactElement
            profile={item['Profile']}
            Nickname={item['Nickname']}
            UID={item['UID']}
            createChat={CreateChat}
          />
        )}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
