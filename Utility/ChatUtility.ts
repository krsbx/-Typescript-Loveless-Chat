import { Dispatch, SetStateAction } from 'react';
import {
  MessageContext,
  UserInformations,
  ChatMember,
  NotificationContent,
} from '../Component/DataInterface';
import { CreateBlob } from '../Utility/Utility';
import { auth, database, timestamp, storage } from '../Component/FirebaseSDK';
import { sendPushNotification } from '../Component/NotificationsSDK';

export const SendChat = async (
  chatName: string,
  Chat: string,
  Media: string,
  currentMode: string,
  id: string,
  SetChat: Dispatch<SetStateAction<string>>,
  SetMedia: Dispatch<SetStateAction<string>>
) => {
  if (Chat === '' && Media === '') return;

  try {
    const NewMessage: MessageContext = {
      Nickname: auth.currentUser?.displayName as string,
      Email: auth.currentUser?.email as string,
      Message: Chat,
      Media: Media,
      Profile: auth.currentUser?.photoURL as string,
      timestamp: timestamp,
    };

    const ChatRef = database
      .collection('Database')
      .doc('Chats')
      .collection(currentMode)
      .doc(id);

    const NewMessages = await ChatRef.collection('message').add(NewMessage);

    if (Media) {
      const MediaRef = storage
        .ref(`Messages`)
        .child(currentMode)
        .child(id)
        .child(`${NewMessages.id}.jpg`);

      await MediaRef.put(await CreateBlob(Media));

      const MediaUrl = await MediaRef.getDownloadURL();

      await ChatRef.collection('message').doc(NewMessages.id).update({
        picture: MediaUrl,
      });
    }

    const Member: ChatMember = (await ChatRef.get()).data() as ChatMember;

    Member['member'].forEach(async (UID) => {
      if (UID !== auth.currentUser?.uid) {
        const UserRef = database
          .collection('Database')
          .doc('Users')
          .collection(UID)
          .doc('Informations');

        const UserInformations: UserInformations = (
          await UserRef.get()
        ).data() as UserInformations;

        if (UserInformations['Token']) {
          const Notifications: NotificationContent = {
            to: UserInformations['Token'],
            sound: 'default',
            title: chatName,
            body: `${auth.currentUser?.displayName} : ${Chat}`,
            data: {
              id: id,
              chatName: chatName,
              currentMode: currentMode,
            },
          };

          sendPushNotification(Notifications);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }

  SetChat('');
  SetMedia('');
};
