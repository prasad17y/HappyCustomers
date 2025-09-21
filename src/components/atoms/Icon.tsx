import React from 'react';
import {
  Image,
  StyleSheet,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';

interface IconProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

const Icon: React.FC<IconProps> = ({source, style}) => {
  return <Image source={source} style={[styles.icon, style]} />;
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default React.memo(Icon);
