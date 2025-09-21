import React from 'react';
import {View, Text, StyleSheet, TextInputProps} from 'react-native';
import StyledTextInput from '../atoms/StyledTextInput';

interface FormTextInputProps extends TextInputProps {
  error?: string;
  touched?: boolean;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  error,
  touched,
  ...props
}) => {
  const hasError = !!(error && touched);
  return (
    <View style={styles.fieldContainer}>
      <StyledTextInput hasError={hasError} {...props} />
      <View style={styles.errorContainer}>
        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 8,
  },
  errorContainer: {
    height: 20,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default React.memo(FormTextInput);
