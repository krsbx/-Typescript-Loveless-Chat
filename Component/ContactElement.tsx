import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

type ToPass = {
  profile: string;
  Nickname: string;
  UID: string;
  createChat: CallableFunction;
};

const ContactElement = ({ profile, Nickname, UID, createChat }: ToPass) => {
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
