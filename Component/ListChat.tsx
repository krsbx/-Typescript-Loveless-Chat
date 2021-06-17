import React, { useState, useEffect } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, database } from './FirebaseSDK';
import { UseMode } from '../Component/ModeContext';
import { MessageContext } from '../Component/DataInterface';

type ToPass = {
  id: string;
  chatName: string;
  chatMode: string;
  enterChat: CallableFunction;
  SetVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ListChat = ({
  id,
  chatName,
  chatMode,
  enterChat,
  SetVisible,
}: ToPass) => {
  const [Chat, SetChat] = useState<MessageContext[]>([]);

  const { SetVisibleTab } = UseMode();

  useEffect(() => {
    const unsubscribe = database
      .collection('Database')
      .doc('Chats')
      .collection(chatMode)
      .doc(id)
      .collection('message')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((snap) =>
        SetChat(snap.docs.map((doc) => doc.data() as MessageContext))
      );

    return unsubscribe;
  }, [id]);

  const LastChat = () => {
    if (Chat[0]) {
      return `${Chat[0].Nickname} : ${Chat[0].message}`;
    } else {
      return '';
    }
  };

  return (
    <ListItem
      bottomDivider
      onPress={() => {
        enterChat(id, chatName, chatMode);
        SetVisible(false);
        SetVisibleTab(false);
      }}
    >
      <Avatar
        source={{
          uri: Chat?.[0]?.profile,
        }}
        rounded
        size="medium"
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {chatMode == 'Groups'
            ? chatName
            : chatName.replace(
                new RegExp('\\b' + auth.currentUser?.displayName + '\\b'),
                'Me'
              )}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {LastChat()}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ListChat;
