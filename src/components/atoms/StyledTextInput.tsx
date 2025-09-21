import React from 'react';
import {TextInput, StyleSheet, View, TextInputProps} from 'react-native';

interface StyledTextInputProps extends TextInputProps {
  hasError?: boolean;
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  hasError,
  style,
  ...props
}) => {
  return (
    <View style={[styles.inputContainer, hasError && styles.inputError]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#a0a0a0"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#191a1a',
  },
  inputError: {
    borderBottomColor: 'red',
  },
});

export default React.memo(StyledTextInput);
