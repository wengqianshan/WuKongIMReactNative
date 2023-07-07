import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useTheme } from '../../providers/Theme';

const Index = (props) => {
  const { children, style = {}, onPress, level = 0, pressable = true } = props;

  const [pressed, setPressed] = useState(false);
  const theme = useTheme();

  const pressIn = () => {
    if (!pressable) {
      return;
    }
    setPressed(true);
  };
  const pressOut = () => {
    setPressed(false);
  };

  const shadowStyle = {
    shadowColor: 'rgba(0,0,0,.5)',
    shadowRadius: (level + 1) * 4,
    shadowOpacity: pressed ? (level + 1) * 0.2 : level * 0.2,
  };

  return (
    <Pressable
      style={[
        styles.container,
        shadowStyle,
        {
          backgroundColor: theme.color.container,
        },
        style,
      ]}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default Index;
