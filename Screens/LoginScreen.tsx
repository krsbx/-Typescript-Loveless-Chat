import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../Component/FirebaseSDK';
import { Formik } from 'formik';
import * as yup from 'yup';
import ErrorElement from '../Component/ErrorElement';

type LoginForm = {
  Email: string;
  Password: string;
};

const LoginScreen = ({ navigation }: any) => {
  const [Request, SetRequest] = useState(false);

  const EmailRef = useRef<TextInput>(null);

  const LoginSchema = yup.object().shape({
    Email: yup.string().email().required(),
    Password: yup.string().required().min(6),
  });

  useEffect(() => {
    EmailRef.current?.focus();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Tabs');
      }
    });

    return unsubscribe;
  }, []);

  const Login = async (Email: string, Password: string) => {
    SetRequest(true);

    try {
      await auth.signInWithEmailAndPassword(Email, Password);
    } catch (error) {
      console.error(error);
    }

    SetRequest(false);
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Formik
        initialValues={{
          Email: '',
          Password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={(values: LoginForm) => {
          Login(values['Email'], values['Password']);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }: any) => (
          <View style={styles.viewContainer}>
            <Input
              ref={EmailRef}
              placeholder="Emails"
              leftIcon={<MaterialIcons name="email" size={24} color="black" />}
              onChangeText={handleChange('Email')}
              value={values['Email']}
              style={styles.inputs}
              editable={!Request}
              containerStyle={styles.inputContainer}
            />
            {errors['Email'] && <ErrorElement>{errors['Email']}</ErrorElement>}
            <Input
              placeholder="Passwords"
              onChangeText={handleChange('Password')}
              value={values['Password']}
              secureTextEntry
              style={styles.inputs}
              leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
              onSubmitEditing={handleSubmit}
              editable={!Request}
              containerStyle={styles.inputContainer}
            />
            {errors['Password'] && (
              <ErrorElement>{errors['Password']}</ErrorElement>
            )}
            <Button
              title="Login"
              type="solid"
              onPress={handleSubmit}
              containerStyle={styles.button}
              disabled={Request}
            />
            <Button
              title="Register"
              type="outline"
              onPress={() => navigation.navigate('Register')}
              containerStyle={styles.button}
            />
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    width: 300,
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
  inputs: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
});
