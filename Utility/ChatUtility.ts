import { Dispatch, SetStateAction } from 'react';
import {
  MessageContext,
  UserInformations,
  ChatMember,
  NotificationContent,
  DocsObjects,
} from '../Component/DataInterface';
import { CreateBlob } from '../Utility/Utility';
import { auth, database, timestamp, storage } from '../Component/FirebaseSDK';
import { sendPushNotification } from '../Component/NotificationsSDK';
import { DocsInfo } from '../Component/DataInterface';

export const SendChat = async (
  chatName: string,
  Chat: string,
  Media: string,
  Docs: DocsObjects,
  currentMode: string,
  id: string,
  SetChat: Dispatch<SetStateAction<string>>,
  SetMedia: Dispatch<SetStateAction<string>>,
  SetDocs: Dispatch<SetStateAction<DocsObjects>>
) => {
  if (Chat === '' && Media === '' && Docs['uri'] === undefined) return;

  try {
    const NewMessage: MessageContext = {
      Nickname: auth.currentUser?.displayName as string,
      Email: auth.currentUser?.email as string,
      Message: Chat,
      Media: Media,
      Docs: {
        Name: '',
        URI: '',
      },
      Profile: auth.currentUser?.photoURL as string,
      timestamp: timestamp,
    };

    const ChatRef = database
      .collection('Database')
      .doc('Chats')
      .collection(currentMode)
      .doc(id);

    const NewMessages = await ChatRef.collection('message').add(NewMessage);

    let MediaUrl = '';
    let DocsUrl: DocsInfo = {
      Name: '',
      URI: '',
    };

    if (Media) {
      const MediaExtensions = Media.split('.').pop();

      const MediaRef = storage
        .ref(`Messages`)
        .child(currentMode)
        .child(id)
        .child(`${NewMessages.id}.${MediaExtensions}`);

      await MediaRef.put(await CreateBlob(Media));

      MediaUrl = await MediaRef.getDownloadURL();
    }

    if (Docs['uri'] !== undefined) {
      const DocsExtensions = Docs.name?.split('.').pop();

      const DocsRef = storage
        .ref(`Messages`)
        .child(currentMode)
        .child(id)
        .child(`${NewMessages.id}.${DocsExtensions}`);

      await DocsRef.put(await CreateBlob(Docs.uri as string));

      DocsUrl = {
        Name: Docs.name as string,
        URI: await DocsRef.getDownloadURL(),
      };
    }

    await ChatRef.collection('message').doc(NewMessages.id).update({
      Media: MediaUrl,
      Docs: DocsUrl,
    });

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
  SetDocs({});
};
