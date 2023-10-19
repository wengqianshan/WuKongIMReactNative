import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Page from '../../components/Page';
import API from 'wukongapi';
import { useTheme } from '../../providers/Theme';
import { FlashList } from '@shopify/flash-list';
import BlockItem from '../../components/BlockItem';
import { navigate } from '../../scripts/RootNavigation';
import Shim from '../../components/Shim';

const APIS = [
  '/route',
  '/route/batch',

  '/user/token',
  '/user/onlinestatus',
  '/user/systemuids_add',
  '/user/systemuids_remove',
  '/user/device_quit',

  '/channel',
  '/channel/delete',
  '/channel/subscriber_add',
  '/channel/subscriber_remove',
  '/channel/blacklist_add',
  '/channel/blacklist_remove',
  '/channel/blacklist_set',
  '/channel/whitelist_add',
  '/channel/whitelist_remove',
  '/channel/whitelist_set',

  '/message/send',
  '/message/sendbatch',
  '/channel/messagesync',
  '/message/sync',
  '/message/syncack',

  '/conversation/sync',
  '/conversations/setUnread',
  '/conversations/delete',
];

const Api = () => {
  const {theme} = useTheme();
  return (
    <Page>
      <FlashList
        estimatedItemSize={100}
        renderItem={({ item, index }) => {
          return (
            <BlockItem
              showArrow={false}
              content={
                <View
                  style={{ flex: 1, paddingVertical: 12, paddingRight: 16 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: theme.color.text,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              }
              showBorder={!(index === APIS.length - 1)}
              onPress={() => {
                navigate('ApiItem', { name: item });
              }}
            />
          );
        }}
        data={APIS}
        ListFooterComponent={() => {
          return <Shim position='bottom' />;
        }}
      />
    </Page>
  );
};

const styles = StyleSheet.create({});

export default Api;
