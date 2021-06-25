import { auth, database } from '../Component/FirebaseSDK';
import { ListUser, FriendInformations } from '../Component/DataInterface';

//One time calls each logins
export const ContactsCleaner = async () => {
  //All User Ref
  const UserRef = database.collection('Database').doc('Users');
  const UserData: ListUser = (await UserRef.get()).data() as ListUser;

  if (UserData['UID'] !== undefined) {
    const UID: string = auth.currentUser?.uid as string;

    //User Contacts Ref
    const ContactsRef = database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    const ContactsData = await ContactsRef.get({
      source: 'server',
    });

    ContactsData.docs.map(async (doc) => {
      const Data: FriendInformations = doc.data() as FriendInformations;

      if (Data['UID']) {
        const UserID: string = Data['UID'];

        if (Object.values(UserData['UID']).indexOf(UserID) == -1) {
          await ContactsRef.doc(doc.id).delete();
        }
      }
    });
  }
};
