import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { ContactsEntry } from './ScreensInterface';

const ContactElement = ({
  profile,
  Nickname,
  UID,
  createChat,
}: ContactsEntry) => {
  return (
    <ListItem bottomDivider onPress={() => createChat(UID, Nickname)}>
      <Avatar source={{ uri: profile }} rounded size="medium" />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {Nickname}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default ContactElement;

const styles = StyleSheet.create({});
