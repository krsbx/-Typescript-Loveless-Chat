import { ChatInformations } from '../Component/DataInterface';
import { auth, database } from '../Component/FirebaseSDK';

//Create New Chat Entry in Group Sections
//  Each creations => 1 Member (Users who created the groups)
export const CreateChat = async (ChatName: string, navigation: any) => {
  const UID = auth.currentUser?.uid as string;

  const NewChat: ChatInformations = {
    chatName: ChatName,
    member: [UID],
  };

  try {
    const CreatedChat = await database
      .collection('Database')
      .doc('Chats')
      .collection('Groups')
      .add(NewChat);

    if (CreatedChat) navigation.goBack();
  } catch (error) {
    console.error(error);
  }
};
