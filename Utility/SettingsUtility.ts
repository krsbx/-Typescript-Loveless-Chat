import { ChatMember } from '../Component/DataInterface';
import { auth, database } from '../Component/FirebaseSDK';
import firebase from 'firebase';

export const DeleteData = async (navigation: any) => {
  try {
    const UID: string = auth.currentUser?.uid as string;

    //Chat References
    const ChatRef = database.collection('Database').doc('Chats');
    const GroupsRef = ChatRef.collection('Groups');
    const PrivateRef = ChatRef.collection('Private');

    //Remove Member in Groups
    const UnsubsGroup = GroupsRef.onSnapshot(async (snap) => {
      snap.docs.forEach(async (doc) => {
        const data: ChatMember = doc.data() as ChatMember;

        if (data['member'] !== undefined) {
          const IsMember = data['member'].includes(UID);
          if (IsMember) {
            await GroupsRef.doc(doc.id).update({
              member: firebase.firestore.FieldValue.arrayRemove(UID),
            });
          }
        }
      });
    });

    //Remove Member in Private
    const UnsubsPrivate = PrivateRef.onSnapshot(async (snap) => {
      snap.docs.forEach(async (doc) => {
        const data: ChatMember = doc.data() as ChatMember;

        if (data['member'] !== undefined) {
          const IsMember = data['member'].includes(UID);
          if (IsMember) {
            await PrivateRef.doc(doc.id).update({
              member: firebase.firestore.FieldValue.arrayRemove(UID),
            });
          }
        }
      });
    });

    //Profile References
    const ProfileRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID);

    //Remove Friends
    const UnsubsFriends = ProfileRef.doc('Contacts')
      .collection('Friends')
      .onSnapshot(async (snap) => {
        snap.docs.forEach(async (doc) => {
          await ProfileRef.doc('Contacts')
            .collection('Friends')
            .doc(doc.id)
            .delete();
        });
      });

    await ProfileRef.doc('Contacts').delete();

    //Remove Informations
    await ProfileRef.doc('Informations').delete();

    // Remove User Entry
    const UserRef = database.collection('Database').doc('Users');
    const Nickname = auth.currentUser?.displayName;

    const Key = `UID.${Nickname}`;

    let toUpdate: any = {};
    toUpdate[Key] = firebase.firestore.FieldValue.delete();

    await UserRef.update(toUpdate);

    await auth.currentUser?.delete().then(() => {
      UnsubsGroup();
      UnsubsPrivate();
      UnsubsFriends();

      navigation.replace('Login');
    });
  } catch (error) {
    console.error(error['code']);
  }
};
