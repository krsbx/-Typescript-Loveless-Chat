import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

type ToPass = {
  AddRemove: CallableFunction;
  Nickname: string;
  Profile: string;
  UID: string;
};

const MemberElement = ({ AddRemove, Nickname, Profile, UID }: ToPass) => {
  const [Selected, SetSelected] = useState(false);
  return (
    <ListItem
      bottomDivider
      onPress={() => {
        AddRemove(Selected, UID);
        SetSelected((Selected) => !Selected);
      }}
    >
      <Avatar source={{ uri: Profile }} rounded size="medium" />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {Nickname}
        </ListItem.Title>
      </ListItem.Content>
      {Selected ? (
        <FontAwesome name="check-circle" size={20} color="black" />
      ) : (
        <MaterialIcons name="radio-button-unchecked" size={20} color="black" />
      )}
    </ListItem>
  );
};

export default MemberElement;

const styles = StyleSheet.create({});
