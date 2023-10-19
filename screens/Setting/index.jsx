import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

import Page from '../../components/Page';
import Shim from '../../components/Shim';
import { navigate } from '../../scripts/RootNavigation';
import { useTheme } from '../../providers/Theme';
import { useAuth } from '../../providers/Auth';
import UserCard from '../../components/UserCard';
import Block from '../../components/Block';
import BlockItem from '../../components/BlockItem';

const Setting = ({ navigation }) => {
  const {theme} = useTheme();

  const { logout } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      title: '设置',
      headerRight: () => {
        return (
          <Pressable onPress={logout}>
            <Text style={{ color: theme.color.primary }}>退出</Text>
          </Pressable>
        );
      },
    });
    return () => {};
  }, []);

  return (
    <Page scroll>
      <Shim position='header' />
      <UserCard />
      <Block transparent>
        <BlockItem
          title='调试API'
          showArrow
          showBorder={false}
          onPress={() => {
            navigate('Api');
          }}
        />
      </Block>
      <Block transparent>
        <BlockItem
          title='主题切换'
          showArrow
          onPress={() => {
            navigate('Theme');
          }}
        />
        <BlockItem
          title='消息提示'
          showArrow
          onPress={() => {
            navigate('Sound');
          }}
        />
        <BlockItem
          title='关于'
          showArrow
          showBorder={false}
          onPress={() => {
            navigate('About');
          }}
        />
      </Block>
      <Shim position='tab' />
    </Page>
  );
};

const styles = StyleSheet.create({});

export default Setting;
