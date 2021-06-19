import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { SearchBarParams } from './ScreensInterface';

const SearchBar = ({
  placeholder,
  SetValue,
  value,
  leftIcon,
  rightIcon,
  leftIconContainerStyle,
  rightIconContainerStyle,
  style,
  inputStyle,
  containerStyle,
}: SearchBarParams) => {
  const SearchBar = useRef<TextInput>(null);

  return (
    <Input
      ref={SearchBar}
      placeholder={placeholder}
      onChangeText={(text) => SetValue && SetValue(text)}
      value={value}
      leftIcon={
        <TouchableOpacity style={{ marginRight: 2 }}>
          {leftIcon}
        </TouchableOpacity>
      }
      rightIcon={
        value !== '' &&
        SearchBar.current?.isFocused() && (
          <TouchableOpacity onPress={() => SetValue && SetValue('')}>
            {rightIcon}
          </TouchableOpacity>
        )
      }
      style={style}
      inputStyle={[styles.inputStyle, inputStyle]}
      containerStyle={[styles.searchContainer, containerStyle]}
    />
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: { backgroundColor: '#fff', marginTop: 10 },
  inputStyle: { backgroundColor: '#ECECEC', color: 'black' },
});
