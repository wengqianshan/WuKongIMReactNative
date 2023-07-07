import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { goBack } from '../../scripts/RootNavigation';
import { useTheme } from '../../providers/Theme';
import { useI18n } from '../../providers/I18n';

import Btn from '../Button';
import Shim from '../Shim';

const Empty = (props) => {
  const i18n = useI18n();
  const {
    style = {},
    children,
    type,
    icon = 'search',
    title = i18n.t('messages.empty_title'),
    subtitle,
    showback,
    headerShim = true,
    footerShim = true,
    inTab = false,
    refreshing = false,
    onRefresh = undefined,
    buttons = [],
  } = props;

  let $buttons = [];
  if (showback) {
    $buttons.push({
      text: i18n.t('goback'),
      handler: () => {
        goBack();
      },
      props: {
        type: 'secondary',
        block: false,
      },
    });
  }
  if (buttons && buttons.length) {
    $buttons = [...$buttons, ...buttons];
  }

  const theme = useTheme();

  const $icon =
    typeof icon === 'object' ? (
      icon
    ) : typeof icon === 'string' ? (
      <Ionicons name={icon} size={40} color={theme.color.text_light} />
    ) : null;

  const enableScroll = !!onRefresh;

  const Container = enableScroll ? ScrollView : View;
  const innerProps = enableScroll
    ? {
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.color.text}
          />
        ),
        contentContainerStyle: {
          flex: 1,
        },
      }
    : {
        style: {
          flex: 1,
          justifyContent: 'center',
        },
      };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.color.background },
        style,
      ]}
    >
      <Container {...innerProps}>
        {headerShim && <Shim position='top' />}
        {children || (
          <Fragment>
            <View style={styles.body}>
              {$icon}
              {title && (
                <Text style={{ ...styles.title, color: theme.color.text }}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text
                  style={{ ...styles.subtitle, color: theme.color.text_light }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            <View style={styles.buttons}>
              {$buttons.map((item, index) => {
                return (
                  <Btn
                    key={index}
                    text={item.text}
                    onPress={item.handler}
                    style={{
                      ...styles.button,
                      ...item.style,
                    }}
                    {...item.props}
                  />
                );
              })}
            </View>
          </Fragment>
        )}
        {footerShim && <Shim position={inTab ? 'tab' : 'bottom'} />}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  icon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 14,
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 12,
  },
  button: {
    marginHorizontal: 8,
  },
});

export default Empty;
