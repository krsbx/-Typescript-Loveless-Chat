import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';

type ToPass = {
  sender: boolean;
  Nickname: string;
  message: string;
  profile: string;
};

const ChatElement = ({ sender, Nickname, message, profile }: ToPass) => {
  const styler = sender === true ? styles.sender : styles.receiver;

  const toSend = (
    <View style={styler}>
      <Text
        style={{
          alignSelf: 'flex-end',
          color: 'white',
          fontWeight: 'bold',
          paddingBottom: 10,
          marginRight: 5,
        }}
      >
        {Nickname}
      </Text>
      <Text style={{ alignSelf: 'flex-end', color: 'white', marginRight: 5 }}>
        {message}
      </Text>
      <View
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-5%',
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 3,
        }}
      >
        <Avatar rounded size="small" source={{ uri: profile }} />
      </View>
    </View>
  );

  const toRec = (
    <View style={styler}>
      <Text
        style={{
          alignSelf: 'flex-start',
          color: '#464646',
          fontWeight: 'bold',
          paddingBottom: 10,
          marginLeft: 5,
        }}
      >
        {Nickname}
      </Text>
      <Text
        style={{ alignSelf: 'flex-start', color: '#464646', marginLeft: 5 }}
      >
        {message}
      </Text>
      <View
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 3,
        }}
      >
        <Avatar rounded size="small" source={{ uri: profile }} />
      </View>
    </View>
  );

  return sender ? toSend : toRec;
};

export default ChatElement;

const styles = StyleSheet.create({
  receiver: {
    padding: 15,
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    borderRadius: 25,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    minWidth: '50%',
    maxWidth: '80%',
    position: 'relative',
  },
  recHead: {
    color: 'white',
    backgroundColor: 'grey',
  },
  sendHead: {
    alignSelf: 'flex-end',
  },
  sender: {
    padding: 15,
    backgroundColor: '#2B68E6',
    alignSelf: 'flex-end',
    borderRadius: 25,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
    minWidth: '50%',
    maxWidth: '80%',
    position: 'relative',
  },
});