import React, { useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  Modal,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from './FirebaseSDK';
import { Formik } from 'formik';
import * as yup from 'yup';
import ErrorElement from '../Component/ErrorElement';
import firebase from 'firebase';
import { UseMode } from '../Component/ModeContext';

type ToPass = {
  Visible: boolean;
  SetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  DeleteAccounts: CallableFunction;
};

const ReloginElement = ({ Visible, SetVisible, DeleteAccounts }: ToPass) => {
  const { SetVisibleTab } = UseMode();

  const LoginSchema = yup.object().shape({
    Password: yup.string().required().min(6),
  });

  const Login = async (Password: string) => {
    try {
      const Email = auth.currentUser?.email as string;

      await auth.currentUser?.reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(Email, Password)
      );
      DeleteAccounts();
    } catch (error) {
      console.error(error);
    }

    SetVisible(false);
  };

  useEffect(() => {
    if (Visible) {
      SetVisibleTab(false);
    }
  }, [Visible]);

  return (
    <Modal visible={Visible} animationType="fade" transparent={true}>
      <KeyboardAvoidingView style={styles.container}>
        <Formik
          initialValues={{
            Password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            Login(values['Password']);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
          }: any) => (
            <View style={styles.viewContainer}>
              <Text>Password</Text>
              <Input
                placeholder="Passwords"
                onChangeText={handleChange('Password')}
                value={values['Password']}
                secureTextEntry
                style={styles.inputs}
                leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
                onSubmitEditing={handleSubmit}
                containerStyle={styles.inputContainer}
              />
              {errors['Password'] && (
                <ErrorElement>{errors['Password']}</ErrorElement>
              )}
              <Button
                title="Delete Accounts!"
                type="outline"
                onPress={handleSubmit}
                containerStyle={styles.button}
                titleStyle={styles.danger}
              />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReloginElement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    width: 300,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    padding: 5,
  },
  danger: {
    color: 'red',
    fontWeight: '500',
  },
  inputs: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
});
