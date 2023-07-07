import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../providers/Auth';
import { useTheme } from '../../providers/Theme';
import Block from '../Block';
import BlockItem from '../BlockItem';

const UserCard = () => {
  const theme = useTheme();
  const { user, host } = useAuth();

  return (
    <Block
      style={[
        styles.container,
        {
          backgroundColor: theme.color.container,
        },
      ]}
    >
      <BlockItem
        title='服务器'
        content={
          <Text
            style={[
              styles.text,
              {
                color: theme.color.text,
              },
            ]}
          >
            {host}
          </Text>
        }
      />
      <BlockItem
        title='UID'
        content={
          <Text
            style={[
              styles.text,
              {
                color: theme.color.text,
              },
            ]}
          >
            {user?.uid}
          </Text>
        }
        showBorder={false}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  text: {},
});

export default UserCard;
