import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../redux/hooks';
import {addUserRequest} from '../redux/users/actions';
import UserForm, {UserFormValues} from '../components/organisms/UserForm';
import {FormikHelpers} from 'formik';
import {Role} from '../types/types';
import Button from '../components/atoms/Button';

const AddUserScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const initialValues: UserFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: Role.MANAGER,
    fullName: '',
  };

  const handleSubmit = (
    values: UserFormValues,
    helpers: FormikHelpers<UserFormValues>,
  ) => {
    dispatch(
      addUserRequest({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim() || null,
        role: values.role,
      }),
    );
    helpers.setSubmitting(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardAvoiding}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Button
              style={styles.closeButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Button>
          </View>

          <Text style={styles.headerTitle}>New User</Text>

          <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitButtonText="Create User"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#0b5ac2',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#191a1a',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default AddUserScreen;
