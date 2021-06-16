import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

type ToPass = {
  SetMode: React.Dispatch<React.SetStateAction<boolean>>;
  SetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: any;
};

const HomePopUp = ({ SetMode, SetVisible, navigation }: ToPass) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          SetMode((Mode) => !Mode);
          SetVisible((Visible) => !Visible);
        }}
        style={styles.Options}
      >
        <FontAwesome name="object-group" size={20} color="black" />
        <Text style={styles.Informations}>Groups/Private</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Contacts');
          SetVisible((Visible) => !Visible);
        }}
        style={styles.Options}
      >
        <FontAwesome name="users" size={20} color="black" />
        <Text style={styles.Informations}>Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Add Chat');
          SetVisible((Visible) => !Visible);
        }}
        style={styles.Options}
      >
        <MaterialCommunityIcons name="comment-plus" size={20} color="black" />
        <Text style={styles.Informations}>Create Groups</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Add Contact');
          SetVisible((Visible) => !Visible);
        }}
        style={styles.Options}
      >
        <FontAwesome name="user-plus" size={20} color="black" />
        <Text style={styles.Informations}>Add Contacts</Text>
      </TouchableOpacity>
    </>
  );
};

export default HomePopUp;

const styles = StyleSheet.create({
  Informations: {
    marginLeft: 10,
  },
  danger: {
    color: 'red',
  },
  Options: {
    flexDirection: 'row',
    margin: 5,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
  },
});
