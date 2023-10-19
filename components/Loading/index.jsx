import React from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';

import { useI18n } from '../../providers/I18n';
import { useTheme } from '../../providers/Theme';

import Empty from '../Empty';

const Loading = (props) => {
  const i18n = useI18n();
  const { style, message = i18n.t('loading'), block, oprops = {} } = props;

  const {theme} = useTheme();

  return (
    <Empty style={[styles.container, style]} {...oprops}>
      <ActivityIndicator size='small' color={theme.color.text} />
      <Text style={{ ...styles.message, color: theme.color.text }}>
        {message}
      </Text>
    </Empty>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
  },
});

export default Loading;
