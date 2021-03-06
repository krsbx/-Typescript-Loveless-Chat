import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, database, storage } from '../../Component/FirebaseSDK';
import firebase from 'firebase';
import { MoreChat } from '../../Component/ScreensInterface';

const ChatPopUp = ({ SetVisible, navigation, params }: MoreChat) => {
  const DeleteChats = async () => {
    try {
      const ChatRef = database
        .collection('Database')
        .doc('Chats')
        .collection(params['currentMode'])
        .doc(params['id']);

      //Remove Chat Entrys
      (
        await ChatRef.collection('message').get({
          source: 'server',
        })
      ).docs.forEach(
        async (doc) => await ChatRef.collection('message').doc(doc.id).delete()
      );

      //Remove Chat Media
      const MediaRef = storage
        .ref(`Messages`)
        .child(params['currentMode'])
        .child(params['id']);

      await MediaRef.delete();

      //Remove Chat Data
      await ChatRef.delete();

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const ExitGroups = async () => {
    try {
      const GroupRef = database
        .collection('Database')
        .doc('Chats')
        .collection('Groups')
        .doc(params['id']);

      await GroupRef.update({
        member: firebase.firestore.FieldValue.arrayRemove(
          auth.currentUser?.uid as string
        ),
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {params['currentMode'] == 'Groups' && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            SetVisible((Visible) => !Visible);
            navigation.navigate('Add Member', {
              id: params.id,
            });
          }}
          style={styles.Options}
        >
          <FontAwesome name="user-plus" size={20} color="black" />
          <Text style={styles.Informations}>Add Member</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          SetVisible((Visible) => !Visible);
          DeleteChats();
        }}
        style={styles.Options}
      >
        <FontAwesome name="trash" size={20} color="red" />
        <Text style={[styles.Informations, styles.danger]}>
          Delete {params['currentMode'] == 'Groups' ? 'Groups' : 'Chats'}
        </Text>
      </TouchableOpacity>
      {params['currentMode'] == 'Groups' && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            SetVisible((Visible) => !Visible);
            ExitGroups();
          }}
          style={styles.Options}
        >
          <MaterialCommunityIcons name="exit-run" size={20} color="red" />
          <Text style={[styles.Informations, styles.danger]}>Exit Groups</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          SetVisible((Visible) => !Visible);
        }}
        style={styles.Options}
      >
        <MaterialCommunityIcons name="close" size={20} color="red" />
        <Text style={[styles.Informations, styles.danger]}>Close</Text>
      </TouchableOpacity>
    </>
  );
};

export default ChatPopUp;

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
