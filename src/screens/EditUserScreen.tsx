import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useAppDispatch} from '../redux/hooks';
import {updateUserRequest} from '../redux/users/actions';
import {ToastService} from '../services/ToastService';
import UserForm, {UserFormValues} from '../components/organisms/UserForm';
import {FormikHelpers} from 'formik';
import {RootStackParamList} from '../navigation/types';
import {database} from '../db';
import UserModel from '../db/models/UserModel';
import Button from '../components/atoms/Button';

type EditUserScreenRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

const EditUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditUserScreenRouteProp>();
  const dispatch = useAppDispatch();
  const {userId} = route.params;
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(
    null,
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await database.collections
          .get<UserModel>('users')
          .find(userId);
        const [firstName, ...lastNameParts] = user.name.split(' ');
        setInitialValues({
          firstName,
          lastName: lastNameParts.join(' '),
          email: user.email || '',
          role: user.role,
          fullName: user.name,
        });
      } catch (error) {
        ToastService.showError('Failed to load user data.');
        navigation.goBack();
      }
    };
    fetchUser();
  }, [userId, navigation]);

  const handleSubmit = (
    values: UserFormValues,
    helpers: FormikHelpers<UserFormValues>,
  ) => {
    dispatch(
      updateUserRequest({
        userId,
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

          <Text style={styles.headerTitle}>Edit User</Text>

          {initialValues ? (
            <UserForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitButtonText="Save Changes"
            />
          ) : (
            <View style={styles.centered}>
              <ActivityIndicator size="large" testID="activity-indicator" />
            </View>
          )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditUserScreen;
