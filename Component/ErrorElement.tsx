import React from 'react';
import { StyleSheet, Text } from 'react-native';
// import * as Animatable from 'react-native-animatable';

const ErrorElement = ({ children }: any) => {
  return (
    // <Animatable.View animation="shake" duration={1250}>
    <Text style={styles.errors}>{children}</Text>
    // </Animatable.View>
  );
};

export default ErrorElement;

const styles = StyleSheet.create({
  errors: {
    color: 'red',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});
