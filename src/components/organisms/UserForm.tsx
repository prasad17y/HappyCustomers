import React from 'react';
import {View, Text, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {FilterTab, Role} from '../../types/types';
import {Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import TabsGroup from '../molecules/TabsGroup';
import Button from '../atoms/Button';
import FormTextInput from '../molecules/FormTextInput';

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
    .transform(value => (value === '' ? undefined : value))
    .email('Please enter a valid email address.')
    .nullable(),
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

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  fullName: string;
}

interface UserFormProps {
  initialValues: UserFormValues;
  onSubmit: (
    values: UserFormValues,
    helpers: FormikHelpers<UserFormValues>,
  ) => void | Promise<any>;
  submitButtonText: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
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
          <View style={styles.form}>
            <FormTextInput
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              placeholder="First Name"
              error={errors.firstName || errors.fullName}
              touched={touched.firstName}
            />

            <FormTextInput
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              placeholder="Last Name"
              error={errors.lastName || errors.fullName}
              touched={touched.lastName}
            />

            <FormTextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              touched={touched.email}
            />

            <Text style={styles.label}>User Role</Text>
            <TabsGroup
              tabs={
                [
                  {key: 'admin', title: 'Admin', role: Role.ADMIN},
                  {key: 'manager', title: 'Manager', role: Role.MANAGER},
                ] as FilterTab[]
              }
              selectedIndex={values.role === Role.ADMIN ? 0 : 1}
              onTabPress={(tab: FilterTab) => {
                Keyboard.dismiss();
                setFieldValue('role', tab.role);
              }}
              style={styles.tabsGroup}
            />
          </View>
          <View style={styles.footer}>
            <Button style={styles.submitButton} onPress={() => handleSubmit()}>
              <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            </Button>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    marginTop: 16,
  },
  tabsGroup: {
    backgroundColor: '#f0f2f5',
    borderRadius: 22,
    height: 44,
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

export default React.memo(UserForm);
