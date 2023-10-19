import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Animated,
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
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useTheme } from '../../providers/Theme';
import Page from '../../components/Page';
import BlockItem from '../../components/BlockItem';
import { navigate } from '../../scripts/RootNavigation';
import Shim from '../../components/Shim';
import { useChat } from '../../providers/Chat';
import { conversationDelete, conversationSync } from '../../scripts/api';
import { useAuth } from '../../providers/Auth';
import Button from '../../components/Button';

const Conversation = ({ navigation }) => {
  const {theme} = useTheme();
  const { user } = useAuth();
  const {
    status,
    conversation,
    conversations,
    setConversations,
    channel: activeChannel,
  } = useChat();

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

  const handleDelete = async (item) => {
    const { channelId, channelType } = item;
    await conversationDelete({
      uid: user.uid,
      channel_id: channelId,
      channel_type: channelType,
    });
    setConversations((curr) =>
      curr.filter((item) => item.channelId !== channelId)
    );
  };

  // 同步会话
  const syncConversation = async (isRefresh) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const res = await conversationSync({
      uid: user.uid,
    });
    // console.log('同步最近会话', JSON.stringify(res));
    isRefresh ? setRefreshing(false) : setLoading(false);
    const data = res.map((item) => {
      const { channel_id, channel_type, unread, recents } = item;
      const $recent = recents[0];
      const uid = $recent?.from_uid;
      const payload = $recent
        ? JSON.parse(Buffer.from($recent.payload, 'base64').toString('utf-8'))
        : null;
      return {
        ...item,
        title: channel_id,
        channelId: channel_id,
        channelType: channel_type,
        recent: {
          uid,
          text: payload?.content,
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
    let $unread = unread;

    setConversations((vals) => {
      // if (action === 0) {
      //   // 新增
      //   $unread = 1;
      // } else if (action === 1) {
      //   // 修改
      //   const exist = vals.find((item) => item.channelId === channelID);
      //   $unread = exist.unread + 1;
      // }

      // 暂时不能依赖action的数据，因为目前会话的数据源是通过 api 获取的，会出现 app 重启后监听的会话消息 action 为0；后续考虑通过定义数据源的方式加载数据
      const exist = vals.find((item) => item.channelId === channelID);
      if (exist) {
        $unread = exist.unread + 1;
      } else {
        $unread = 1;
      }
      // 当前频道忽略未读数
      if (activeChannel?.channelId === channelID) {
        $unread = 0;
      }

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
            unread: $unread,
          },
          ...vals,
        ],
        (item) => item.channelId
      );
      return values;
    });
    return () => {};
  }, [conversation]);

  const keyExtractor = useCallback((item, i) => `${i}-${item.channelId}`, []);

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
        keyExtractor={keyExtractor}
        extraData={theme}
        renderItem={({ item, index }) => {
          const { recent, timestamp } = item;
          const time = dayjs(timestamp * 1000).format('HH:mm');
          const isGroup = item.channelType === 2;
          return (
            <Swipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              renderRightActions={(progress) => {
                const trans = progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                });
                return (
                  <View
                    style={{
                      width: 100,
                      flexDirection: 'row',
                      marginBottom: 1,
                    }}
                  >
                    <Animated.View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        backgroundColor: theme.color.error,
                        transform: [
                          {
                            translateX: trans,
                          },
                        ],
                      }}
                    >
                      <Button
                        // size='small'
                        text='删除'
                        onPress={() => {
                          handleDelete(item);
                        }}
                        style={{
                          flex: 1,
                          borderRadius: 0,
                          backgroundColor: theme.color.error,
                        }}
                      />
                    </Animated.View>
                  </View>
                );
              }}
            >
              <BlockItem
                showArrow={false}
                style={{
                  backgroundColor: theme.color.container,
                }}
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
            </Swipeable>
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
