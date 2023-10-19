import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../../providers/Theme';

const Block = (props) => {
  const {
    style,
    children,
    title,
    titleStyle = {},
    transparent = false,
  } = props;

  const {theme} = useTheme();

  const $props = {
    backgroundColor: transparent ? 'transparent' : theme.color.container,
  };

  return (
    <>
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: theme.color.text_light,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      <View style={[styles.container, $props, style]}>{children}</View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Block;
