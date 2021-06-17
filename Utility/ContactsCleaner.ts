import { auth, database } from '../Component/FirebaseSDK';
import { ListUser, FriendInformations } from '../Component/DataInterface';

//One time calls each logins
export const ContactsCleaner = async () => {
  //All User Ref
  const UserRef = database.collection('Database').doc('Users');
  const UserData: ListUser = (await UserRef.get()).data() as ListUser;

  if (UserData['UID'] !== undefined) {
    const UID: any = auth.currentUser?.uid;

    //User Contacts Ref
    const ContactsRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    //Clean unnecessary contacts
    const unsubscribe = ContactsRef.onSnapshot(async (snap) => {
      snap.docs.forEach(async (doc) => {
        const Data: FriendInformations = (
          await ContactsRef.doc(doc.id).get()
        ).data() as FriendInformations;

        if (Data['UID'] !== undefined) {
          const UserID: string = Data['UID'];

          if (Object.values(UserData['UID']).indexOf(UserID) == -1) {
            await ContactsRef.doc(doc.id).delete();
          }
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }
};
