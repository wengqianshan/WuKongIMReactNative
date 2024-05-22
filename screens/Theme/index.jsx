import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';

import { useI18n } from '../../providers/I18n';
import { useTheme } from '../../providers/Theme';

import Page from '../../components/Page';
import Shim from '../../components/Shim';
import Surface from '../../components/Surface';

const Theme = ({ navigation }) => {

  const { theme } = useTheme();
  const i18n = useI18n();
  const {
    current: currentTheme,
    setCurrent: setCurrentTheme,
    defaults: defaultTheme,
    reset: resetTheme,
  } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t('$theme.title'),
    });
    return () => {};
  }, [theme]);

  return (
    <Page style={styles.container} scroll>
      <View style={styles.body}>
        {defaultTheme.map((item, index) => {
          const active =
            (currentTheme && item.name === currentTheme.name) ||
            (!currentTheme && !item.values);
          const isDefault = !item.values;
          const title = i18n.t(item.name, { defaultValue: item.title });
          const backgroundColor = active
            ? theme.color.primary
            : theme.color.container;
          return (
            <Surface
              key={item.name}
              style={[styles.item, { backgroundColor: backgroundColor }]}
              onPress={() => {
                if (active) {
                  return;
                }
                if (isDefault) {
                  resetTheme();
                } else {
                  setCurrentTheme(item);
                }
              }}
              level={1}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: active
                    ? theme.color.on_primary
                    : theme.color.on_container,
                }}
              >
                {title}
              </Text>
              {active && (
                <Ionicons
                  name='checkmark'
                  size={32}
                  color={theme.color.on_primary}
                  style={styles.checked}
                />
              )}
            </Surface>
          );
        })}
        <Shim position='bottom' />
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {},
  body: {
    paddingTop: 16,
  },
  item: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checked: {
    position: 'absolute',
    right: 8,
  },
});

export default Theme;
