import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { Image, Avatar } from 'react-native-elements';
import { ChatBubbles } from './ScreensInterface';

const ChatElement = ({
  sender,
  Nickname,
  Message,
  Profile,
  Media,
  Docs,
}: ChatBubbles) => {
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
      {Docs?.URI !== undefined && (
        <View>
          <Text onPress={() => Linking.openURL(Docs?.URI)}>{Docs?.Name}</Text>
        </View>
      )}
      {Media !== '' && (
        <Image source={{ uri: Media }} style={{ width: 200, height: 200 }} />
      )}
      {Message !== '' && (
        <Text style={{ alignSelf: 'flex-end', color: 'white', marginRight: 5 }}>
          {Message}
        </Text>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          right: -15,
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 3,
        }}
      >
        <Avatar rounded size="small" source={{ uri: Profile }} />
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
      {Media !== '' && (
        <Image source={{ uri: Media }} style={{ width: 200, height: 200 }} />
      )}
      {Message !== '' && (
        <Text
          style={{ alignSelf: 'flex-start', color: '#464646', marginLeft: 5 }}
        >
          {Message}
        </Text>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          left: -15,
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 3,
        }}
      >
        <Avatar rounded size="small" source={{ uri: Profile }} />
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
