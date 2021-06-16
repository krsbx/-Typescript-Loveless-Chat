import React, { useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Input } from 'react-native-elements';

type ToPass = {
  placeholder?: string;
  SetValue?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  leftIconContainerStyle?: ViewStyle;
  rightIconContainerStyle?: ViewStyle;
  style?: TextStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

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
}: ToPass) => {
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
