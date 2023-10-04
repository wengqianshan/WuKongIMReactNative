import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { uniqBy } from 'lodash';
import { FlashList } from '@shopify/flash-list';
import { useHeaderHeight } from '@react-navigation/elements';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';

import { useTheme } from '../../providers/Theme';
import Page from '../../components/Page';
import BlockItem from '../../components/BlockItem';
import { navigate } from '../../scripts/RootNavigation';
import Shim from '../../components/Shim';
import { useChat } from '../../providers/Chat';
import { conversationSync } from '../../scripts/api';
import { useAuth } from '../../providers/Auth';

const Conversation = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { status, conversation, conversations, setConversations } = useChat();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const headerHeight = useHeaderHeight();

  const onRefresh = useCallback(async () => {
    syncConversation(true);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: '悟空IM',
    });
    return () => {};
  }, [theme]);

  const handlePress = (item) => {
    const { channelId, channelType } = item;
    navigate('Chat', {
      channelId,
      channelType,
    });
  };

  // 同步会话
  const syncConversation = async (isRefresh) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const res = await conversationSync({
      uid: user.uid,
    });
    isRefresh ? setRefreshing(false) : setLoading(false);
    const data = res.map((item) => {
      const { channel_id, channel_type, unread, recents } = item;
      const $recent = recents[0];
      const uid = $recent.from_uid;
      const payload = JSON.parse(
        Buffer.from($recent.payload, 'base64').toString('utf-8')
      );
      return {
        ...item,
        title: channel_id,
        channelId: channel_id,
        channelType: channel_type,
        recent: {
          uid,
          text: payload.content,
        },
      };
    });
    setConversations(data);
  };

  // 用户或连接状态更新时同步会话列表
  useEffect(() => {
    // 如果没有用户信息或者没有连接成功
    if (!user || status !== 1) {
      // TODO: 显示失败状态
      return;
    }
    syncConversation();
    return () => {};
  }, [user, status]);

  // 监听会话
  useEffect(() => {
    if (!conversation) {
      return;
    }
    const { conversation: $conversation, action } = conversation;
    const { unread, channel, lastMessage } = $conversation;
    const { channelID, channelType } = channel;
    const { messageID, messageSeq, clientMsgNo, fromUID, content, timestamp } =
      lastMessage;
    if (action === 0) {
      // 新增
    } else if (action === 1) {
      // 修改
    }
    
    setConversations(vals => {
      // 这里直接去重，其实需要仔细梳理 api 和 sdk 返回的数据结构以及各字段用法
      // 如果当前频道正在激活状态，unread置 0
      // 如果是其他频道，在原数量基础上 +1
      const values = uniqBy(
        [
          {
            ...$conversation,
            title: channelID,
            channelId: channelID,
            channelType: channelType,
            timestamp,
            recent: {
              uid: fromUID,
              text: content.text,
            },
          },
          ...vals,
        ],
        (item) => item.channelId
      );
      return values;
    });
    return () => {};
  }, [conversation]);

  return (
    <Page>
      {loading && (
        <View
          style={{
            backgroundColor: theme.color.background,
            position: 'absolute',
            top: headerHeight,
            zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 12,
            marginTop: 4,
            borderRadius: 16,
            alignSelf: 'center',
          }}
        >
          <ActivityIndicator size='small' color={theme.color.text} />
          <Text
            style={{ color: theme.color.text, fontSize: 12, marginLeft: 8 }}
          >
            收取中
          </Text>
        </View>
      )}
      <FlashList
        estimatedItemSize={70}
        renderItem={({ item, index }) => {
          const { recent, timestamp } = item;
          const time = dayjs(timestamp * 1000).format('HH:mm');
          const isGroup = item.channelType === 2;
          return (
            <BlockItem
              showArrow={false}
              content={
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingRight: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {item.unread > 0 && (
                      <View
                        style={{
                          backgroundColor: theme.color.error,
                          position: 'absolute',
                          right: 0,
                          bottom: -20,
                          borderRadius: 20,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.color.on_error,
                            fontSize: 12,
                          }}
                        >
                          {item.unread}
                        </Text>
                      </View>
                    )}

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: theme.color.text,
                      }}
                    >
                      {`${item.title}${isGroup ? '(群聊)' : ''}`}
                    </Text>
                    <Text style={{ color: theme.color.text_light }}>
                      {time}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ marginTop: 4, color: theme.color.text_light }}
                    >
                      {isGroup ? `${recent.uid}: ` : ''}
                      {recent.text}
                    </Text>
                  </View>
                </View>
              }
              showBorder={!(index === conversations.length - 1)}
              onPress={() => {
                handlePress(item);
              }}
            />
          );
        }}
        data={conversations}
        ListHeaderComponent={() => {
          return <Shim position='header' />;
        }}
        ListFooterComponent={() => {
          return <Shim position='tab' />;
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.color.on_background}
            progressViewOffset={headerHeight}
          />
        }
      />
    </Page>
  );
};

const styles = StyleSheet.create({});

export default Conversation;
