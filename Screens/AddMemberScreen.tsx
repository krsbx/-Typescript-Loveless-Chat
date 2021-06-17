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

type FriendList = {
  UID: string;
  Nickname: string;
};

type UserProfileURL = {
  Profile: string;
};

type FriendInformations = {
  UID: string;
  Nickname: string;
  Profile: string;
};

type GroupsMember = {
  member: Array<string>;
};

const AddMemberScreen = ({ navigation, route }: any) => {
  const [Friends, SetFriends] = useState<FriendInformations[]>([]);
  const [Member, SetMember] = useState<string[]>([]);
  const [Invitations, SetInvitation] = useState<string[]>([]);
  const [SearchParams, SetSearchParams] = useState('');

  const GetFriendsMember = async () => {
    const UID = auth.currentUser?.uid as string;

    const ContactRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    const ContactRes = await ContactRef.get();

    const ConResult: FriendList[] = ContactRes.docs
      .map((doc) => {
        const data: FriendList = doc.data() as FriendList;

        if (data['UID'] != undefined) {
          return {
            UID: data['UID'],
            Nickname: data['Nickname'],
          };
        }
      })
      .filter((friend: FriendList | undefined): friend is FriendList => {
        return friend !== undefined;
      });

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

    const MemberRef = database
      .collection('Database')
      .doc('Chats')
      .collection('Groups')
      .doc(route.params.id);

    const MemberRes = (await MemberRef.get()).data() as GroupsMember;

    SetMember(MemberRes['member']);
  };

  const Search = () => {
    return Friends.filter((contacts: FriendInformations) => {
      if (Member.includes(contacts['UID'])) {
        return null;
      } else if (SearchParams == '') {
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
          contacts: FriendInformations | undefined
        ): contacts is FriendInformations => {
          return contacts != null;
        }
      )
      .map((contacts: FriendInformations) => {
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
    try {
      const MemberRef = database
        .collection('Database')
        .doc('Chats')
        .collection('Groups')
        .doc(route.params.id);

      await Promise.all(
        Invitations.map(async (inv) => {
          await MemberRef.update({
            member: firebase.firestore.FieldValue.arrayUnion(inv),
          });
        })
      ).then(() => {
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
