import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { goBack } from '../../scripts/RootNavigation';
import { useTheme } from '../../providers/Theme';

const BackBtn = (props) => {
  // type: back close
  const { type = 'back' } = props;

  const {theme} = useTheme();

  return (
    <Pressable
      style={[
        styles.container,
        {
          // backgroundColor: theme.color.container,
        },
      ]}
      onPress={() => {
        return goBack();
      }}
    >
      <Ionicons
        name={type === 'close' ? 'close' : 'ios-chevron-back'}
        size={28}
        color={theme.color.primary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackBtn;
