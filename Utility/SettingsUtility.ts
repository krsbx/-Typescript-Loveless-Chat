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
    const UnsubsGroup = await GroupsRef.where(
      'member',
      'array-contains',
      auth.currentUser?.uid
    ).get();

    UnsubsGroup.docs.forEach(
      async (doc) =>
        await GroupsRef.doc(doc.id).update({
          member: firebase.firestore.FieldValue.arrayRemove(UID),
        })
    );

    //Remove Member in Private
    const UnsubsPrivate = await PrivateRef.where(
      'member',
      'array-contains',
      auth.currentUser?.uid
    ).get();

    UnsubsPrivate.docs.forEach(
      async (doc) =>
        await PrivateRef.doc(doc.id).update({
          member: firebase.firestore.FieldValue.arrayRemove(UID),
        })
    );

    //Profile References
    const ProfileRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID);

    //Remove Friends
    const UnsubsFriends = await ProfileRef.doc('Contacts')
      .collection('Friends')
      .get();

    UnsubsFriends.docs.forEach(
      async (doc) =>
        await ProfileRef.doc('Contacts')
          .collection('Friends')
          .doc(doc.id)
          .delete()
    );

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
      navigation.replace('Login');
    });
  } catch (error) {
    console.error(error['code']);
  }
};
