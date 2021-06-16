import React from 'react';
import { StyleSheet, SafeAreaView, View, ViewStyle } from 'react-native';

type ToPass = {
  children: any;
  visible: boolean;
  style: ViewStyle;
};

const PopUpMenu = ({ children, visible, style }: ToPass) => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      borderRadius: 5,
      display: visible == false ? 'none' : 'flex',
    },
  });

  return (
    <SafeAreaView style={[styles.container, style]}>
      <View>{children}</View>
    </SafeAreaView>
  );
};

export default PopUpMenu;
