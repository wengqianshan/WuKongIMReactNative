import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Button from '../../Button';
import { useTheme } from '../../../providers/Theme';
import Block from '../../Block';

const Alert = ({ modal: { closeModal, params = {} } }) => {
  const { title, message } = params;

  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        {
          width,
        },
      ]}
    >
      <Block>
        {title && (
          <View
            style={[
              styles.title,
              {
                backgroundColor: theme.color.background,
              },
            ]}
          >
            <Text
              style={[
                styles.titleText,
                {
                  color: theme.color.on_background,
                },
              ]}
            >
              {title}
            </Text>
          </View>
        )}

        <View style={styles.message}>
          <Text
            style={[
              styles.messageText,
              {
                color: theme.color.text,
              },
            ]}
          >
            {message}
          </Text>
        </View>
        <View style={styles.btns}>
          <Button
            text='确定'
            style={{
              flex: 1,
              borderRadius: 0,
            }}
            onPress={closeModal}
          />
        </View>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
  },
  message: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  messageText: {},
  btns: {
    flexDirection: 'row',
    gap: 1,
  },
});

export default Alert;
