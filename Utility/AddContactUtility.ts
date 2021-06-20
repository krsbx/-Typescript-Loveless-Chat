import { Dispatch, SetStateAction } from 'react';
import { auth, database } from '../Component/FirebaseSDK';
import { FriendInformations, ListUser } from '../Component/DataInterface';

//Add other users informations to Contacts/Friends Sections
//  If no name/current user name => Dont proceed
export const AddContact = async (
  Name: string,
  SetRequest: Dispatch<SetStateAction<boolean>>,
  navigation: any
) => {
  if (Name === undefined) return;

  if (Name === auth.currentUser?.displayName) return;

  try {
    SetRequest(true);

    const UID: string = auth.currentUser?.uid as string;

    const userRef = database.collection('Database').doc('Users');

    const FriendsRef = userRef
      .collection(UID)
      .doc('Contacts')
      .collection('Friends');

    let Exist = false;

    const AllFriends = await FriendsRef.get();

    AllFriends.docs.forEach((doc) => {
      const Friends: FriendInformations = doc.data() as FriendInformations;

      //Check if the current input already exist
      //  If exists dont proceed
      if (Friends['UID'] && Friends['Nickname'] === Name) {
        Exist = true;
        return;
      }
    });

    if (Exist) {
      SetRequest(false);

      return;
    }

    //Get All user UID
    const userSnap: ListUser = (await userRef.get()).data() as ListUser;

    const data = userSnap['UID'];

    //If the users exists
    //  Add the users informations to Contact/Friends Sections
    if (data.hasOwnProperty(Name)) {
      const NewFriends: FriendInformations = {
        UID: data[Name] as string,
        Nickname: Name,
      };

      const CreatedContact = await database
        .collection('Database')
        .doc('Users')
        .collection(UID)
        .doc('Contacts')
        .collection('Friends')
        .add(NewFriends);

      if (CreatedContact) {
        navigation.goBack();
      }
    }
  } catch (error) {
    console.error(error);
  }

  SetRequest(false);
};
