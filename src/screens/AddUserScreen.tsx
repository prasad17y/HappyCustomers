import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Role} from '../types/types';
import {addUser} from '../db/actions';
import {Formik} from 'formik';
import * as yup from 'yup';
import FilterTabs from '../components/FilterTabs';
import {ToastService} from '../services/ToastService';

export const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z]*$/, 'Name can only contain letters.')
    .required('First Name is required.'),
  lastName: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z]*$/, 'Name can only contain letters.')
    .required('Last Name is required.'),
  email: yup
    .string()
    .trim()
    .test(
      'is-valid-or-empty',
      'Please enter a valid email address.',
      (value: any) => {
        // .email() allows "john@doe", hence we need this elaborate test
        if (value === '') {
          return true;
        }
        return value ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : true;
      },
    ),
  fullName: yup
    .string()
    .test(
      'max-length',
      'Full name cannot exceed 50 characters.',
      function (_value) {
        const {firstName = '', lastName = ''} = this.parent;
        return (firstName.trim() + ' ' + lastName.trim()).length <= 50;
      },
    ),
});

const AddUserScreen = () => {
  const navigation = useNavigation();
  const scrollPosition = React.useRef(new Animated.Value(1)).current;

  const handleSubmitCallback = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  }) => {
    try {
      await addUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim() || null,
        role: values.role,
      });
      ToastService.showSuccess('User created successfully!');
      navigation.goBack();
    } catch (error) {
      ToastService.showError('Could not create user.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            role: Role.MANAGER,
            fullName: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitCallback}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.headerTitle}>New User</Text>

              <View style={styles.form}>
                <View style={styles.fieldContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      placeholder="First Name"
                      placeholderTextColor="#a0a0a0"
                    />
                  </View>
                  <View style={styles.errorContainer}>
                    {errors.firstName && touched.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                    {errors.fullName && touched.firstName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      placeholder="Last Name"
                      placeholderTextColor="#a0a0a0"
                    />
                  </View>
                  <View style={styles.errorContainer}>
                    {errors.lastName && touched.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                    {errors.fullName && touched.lastName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder="Email"
                      placeholderTextColor="#a0a0a0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.errorContainer}>
                    {errors.email && touched.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.label}>User Role</Text>
                <FilterTabs
                  tabs={['Admin', 'Manager']}
                  selectedIndex={values.role === Role.ADMIN ? 0 : 1}
                  onTabPress={index => {
                    Keyboard.dismiss();
                    const role = index === 0 ? Role.ADMIN : Role.MANAGER;
                    setFieldValue('role', role);

                    Animated.spring(scrollPosition, {
                      toValue: index,
                      useNativeDriver: false,
                    }).start();
                  }}
                  scrollPosition={scrollPosition}
                  testID="add-user-screen"
                />
              </View>
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.submitButtonText}>Create User</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>
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
    flexGrow: 1,
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
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#191a1a',
  },
  errorContainer: {
    height: 35,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: '#0b5ac2',
    padding: 16,
    borderRadius: 22,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddUserScreen;
