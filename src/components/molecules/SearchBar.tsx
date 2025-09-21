import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Icon from '../atoms/Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  style?: StyleProp<ViewStyle>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  debounceDelay = 0,
  style,
}) => {
  const [internalText, setInternalText] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInternalText(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setInternalText(text);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (debounceDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        onChangeText(text);
      }, debounceDelay);
    } else {
      onChangeText(text);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Icon source={require('../../assets/search.png')} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={internalText}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});

export default React.memo(SearchBar);
