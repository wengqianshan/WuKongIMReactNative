import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../providers/Theme';

const Button = (props) => {
  const {
    text,
    block = true,
    style = {},
    arrow = false,
    color, // text color
    loading,
    onPress = () => {},
    size = 'medium', // large medium(default) small
    type = 'primary', // primary secondary text link
  } = props;
  let { icon } = props;

  const [pressed, setPressed] = useState(false);

  const theme = useTheme();

  const pressIn = () => {
    setPressed(true);
  };
  const pressOut = () => {
    setPressed(false);
  };

  // 背景色
  const bgMap = {
    primary: theme.color.primary,
    secondary: theme.color.tertiary,
    default: 'transparent',
  };
  const bgColor = bgMap[type];

  // 文本颜色
  const textMap = {
    primary: theme.color.on_primary,
    secondary: theme.color.on_tertiary,
    text: theme.color.on_container_a50,
    link: '#68f',
    default: '#000',
  };
  const textColor = color || textMap[type];

  // icon
  const iconSizeMap = {
    large: 36,
    small: 18,
    default: 20,
  };
  const iconSize = iconSizeMap[size] || iconSizeMap.default;
  const iconStyleMap = {
    large: {
      marginLeft: 8,
    },
    small: {
      marginLeft: 4,
    },
    default: {
      marginLeft: 8,
    },
  };
  const iconStyle = iconStyleMap[size] || iconStyleMap.default;
  if (arrow) {
    icon = 'play';
  }
  const $icon =
    typeof icon === 'string' ? (
      <Ionicons
        name={icon}
        size={iconSize}
        color={textColor}
        style={iconStyle}
      />
    ) : (
      icon
    );

  return (
    <Pressable
      style={[
        styles.container,
        styles[`container-${size}`],
        styles[`container-${type}`],
        pressed && styles.pressed,
        pressed && styles[`pressed-${type}`],
        {
          alignSelf: block ? 'auto' : 'flex-start',
          backgroundColor: bgColor,
          ...style,
        },
      ]}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Text style={[styles.text, styles[`text-${size}`], { color: textColor }]}>
        {text}
      </Text>
      {$icon}
      {loading && (
        <ActivityIndicator
          size='small'
          color={textColor}
          style={{ marginLeft: 12, ...styles[`color-${type}`] }}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 48,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
  'container-large': {},
  'container-medium': {},
  'container-small': {
    height: 32,
    paddingHorizontal: 12,
  },

  'container-primary': {},
  'container-secondary': {
  },
  'container-text': {
    backgroundColor: 'transparent',
  },
  'container-link': {
    backgroundColor: 'transparent',
  },

  pressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: 17,
    // color: '#000',
  },

  'text-large': {},
  'text-medium': {},
  'text-small': {
    fontSize: 14,
  },
});

export default Button;
