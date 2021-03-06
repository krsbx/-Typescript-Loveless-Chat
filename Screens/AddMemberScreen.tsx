import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Entypo, Fontisto } from '@expo/vector-icons';
import { auth, database } from '../Component/FirebaseSDK';
import MemberElement from '../Component/MemberElement';
import firebase from 'firebase';
import SearchBar from '../Component/SearchBar';
import {
  ContactInformations,
  ChatMember,
  UserProfileURL,
  FriendInformations,
} from '../Component/DataInterface';
import { AddMember } from '../Component/ScreensInterface';

const AddMemberScreen = ({ navigation, route }: AddMember) => {
  const [Friends, SetFriends] = useState<ContactInformations[]>([]);
  const [Member, SetMember] = useState<string[]>([]);
  const [Invitations, SetInvitations] = useState<string[]>([]);
  const [SearchParams, SetSearchParams] = useState('');

  //Get current user list of friends
  //...Get current groups list of members
  const GetFriendsMember = async () => {
    const UID = auth.currentUser?.uid as string;

    const MemberRef = database
      .collection('Database')
      .doc('Chats')
      .collection('Groups')
      .doc(route['params']['id']);

    const MemberRes = (await MemberRef.get()).data() as ChatMember;

    SetMember(MemberRes['member']);

    const ContactRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    const ContactRes = await ContactRef.get();

    const ConResult: FriendInformations[] = ContactRes.docs
      .map((doc) => {
        const data: FriendInformations = doc.data() as FriendInformations;

        if (data['UID'] && !MemberRes['member'].includes(data['UID'])) {
          return {
            UID: data['UID'],
            Nickname: data['Nickname'],
          };
        }
      })
      .filter(
        (
          friend: FriendInformations | undefined
        ): friend is FriendInformations => {
          return friend !== undefined;
        }
      );

    const ProfileResult = await Promise.all(
      ConResult.map(async (contact) => {
        const UserRef = database
          .collection('Database')
          .doc('Users')
          .collection(contact['UID'])
          .doc('Informations');

        const UserSnap: UserProfileURL = (
          await UserRef.get()
        ).data() as UserProfileURL;

        if (UserSnap !== undefined) {
          return {
            Profile: UserSnap['Profile'],
          };
        }
      })
    );

    const ProfileURL: UserProfileURL[] = ProfileResult.filter(
      (profile: UserProfileURL | undefined): profile is UserProfileURL => {
        return profile !== undefined;
      }
    );

    SetFriends(
      ConResult.map((contact, id) => ({
        UID: contact['UID'],
        Nickname: contact['Nickname'],
        Profile: ProfileURL[id]['Profile'],
      }))
    );
  };

  const Search = () => {
    //Filter if friends in the groups or not
    //  Filter to remove undefined data
    return Friends.filter((contacts: ContactInformations) => {
      if (SearchParams == '') {
        return contacts;
      } else if (
        SearchParams !== undefined &&
        contacts['Nickname'].toLowerCase().includes(SearchParams.toLowerCase())
      ) {
        return contacts;
      }
    })
      .filter(
        (
          contacts: ContactInformations | undefined
        ): contacts is ContactInformations => {
          return contacts != null;
        }
      )
      .map((contacts: ContactInformations) => {
        return contacts;
      });
  };

  const AddRemoveInvitations = (selected: string, UID: string) => {
    if (selected) {
      Invitations.splice(Invitations.indexOf(UID), 1);
    } else {
      Invitations.push(UID);
    }
  };

  const Invites = async () => {
    //Update group member with new selected member
    try {
      const MemberRef = database
        .collection('Database')
        .doc('Chats')
        .collection('Groups')
        .doc(route['params']['id']);

      const InviteMember = Invitations.map(async (inv) => {
        await MemberRef.update({
          member: firebase.firestore.FieldValue.arrayUnion(inv),
        });
      });

      await Promise.all(InviteMember).then(() => {
        navigation.goBack();
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: '800',
      },
      headerTitleAlign: 'center',
      headerRight: () => (
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              backgroundColor: '#e2e2e2',
              marginRight: 20,
              borderRadius: 20,
            }}
            onPress={Invites}
          >
            <Text
              style={{
                padding: 10,
              }}
            >
              Invite
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });

    GetFriendsMember();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', height: '100%' }}>
        <SearchBar
          placeholder="Contacts Name"
          SetValue={SetSearchParams}
          value={SearchParams}
          leftIcon={<Fontisto name="search" size={24} />}
          rightIcon={<Entypo name="cross" size={24} />}
        />
        <FlatList
          style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}
          data={Search()}
          keyExtractor={(item) => item['UID']}
          renderItem={({ item }) => (
            <MemberElement
              AddRemove={AddRemoveInvitations}
              Nickname={item['Nickname']}
              Profile={item['Profile']}
              UID={item['UID']}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddMemberScreen;

const styles = StyleSheet.create({
  inputs: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  searchContainer: { backgroundColor: '#fff' },
  inputStyle: { backgroundColor: '#fff', color: 'black' },
});
