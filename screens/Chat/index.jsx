import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import {
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Channel, ChannelTypePerson, MessageText } from 'wukongimjssdk/lib/sdk';
import { Buffer } from 'buffer';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import 'dayjs/locale/zh-cn';

import { useI18n } from '../../providers/I18n';
import { useTheme } from '../../providers/Theme';
import Page from '../../components/Page';
import { useChat } from '../../providers/Chat';
import {
  conversationDelete,
  conversationUnread,
  getChannelMessages,
} from '../../scripts/api';
import * as state from '../../scripts/state';
import { useAuth } from '../../providers/Auth';
import { goBack } from '../../scripts/RootNavigation';

const isAndroid = Platform.OS === 'android';

export default function Chat(props) {
  const { navigation, route } = props;
  const { channelId, channelType: $channelType = 1 } = route.params || {};
  const channelType = Number($channelType);

  const $ref = useRef();
  const { user } = useAuth();
  const { sdk, message } = useChat();
  const i18n = useI18n();
  const theme = useTheme();

  const setConversations = useSetRecoilState(state.conversations);
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();

  const handleDelete = async () => {
    await conversationDelete({
      uid: user.uid,
      channel_id: channelId,
      channel_type: channelType,
    });
    setConversations((curr) =>
      curr.filter((item) => item.channelId !== channelId)
    );
    goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${channelId}${channelType === 2 ? '(群聊)' : ''}`,
      headerRight: () => {
        return (
          <Pressable hitSlop={20} onPress={handleDelete}>
            <Ionicons
              name='trash-outline'
              size={24}
              color={theme.color.primary}
            />
          </Pressable>
        );
      },
      // headerBackgroundContainerStyle: {
      //   backgroundColor: isAndroid ? theme.color.background : 'transparent',
      // },
      // headerStyle: {
      //   backgroundColor: isAndroid ? theme.color.background : 'transparent',
      // },
      // headerTransparent: true,
      // headerBackground: () => (
      //   <BlurView
      //     tint={theme.color.isDarkBackground ? 'dark' : 'light'}
      //     intensity={50}
      //     style={StyleSheet.absoluteFill}
      //   />
      // ),
    });
    return () => {};
  }, [channelId, theme]);

  const getMsgList = async () => {
    const res = await getChannelMessages({
      login_uid: user.uid,
      channel_id: channelId,
      channel_type: channelType,
    });
    // console.log(res, '获取频道消息');
    const data = res.messages?.map((message) => {
      const payload = JSON.parse(
        Buffer.from(message.payload, 'base64').toString('utf-8')
      );
      return {
        _id: message.message_id,
        text: payload.content,
        createdAt: new Date(message.timestamp * 1000),
        user: {
          _id: message.from_uid,
          name: message.from_uid,
        },
      };
    });

    setMessages(data.reverse());
  };

  useEffect(() => {
    if (!message) {
      return;
    }
    if (message.channel.channelID !== channelId) {
      console.log('其他频道消息');
      return;
    }

    const msg = {
      _id: message.clientMsgNo,
      text: message.content.text,
      createdAt: new Date(message.timestamp * 1000),
      user: {
        _id: message.fromUID,
        name: message.fromUID,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [msg])
    );
    return () => {};
  }, [message]);

  const makeUnread = async () => {
    const res = await conversationUnread({
      uid: user.uid,
      channel_id: channelId,
      channel_type: channelType,
      unread: 0,
    });
    if (res.status !== 200) {
      return;
    }
    setConversations((prev) => {
      const res = prev.map((item) => {
        if (item.channelId === channelId && item.channelType === channelType) {
          return {
            ...item,
            unread: 0,
          };
        } else {
          return item;
        }
      });
      return res;
    });
  };

  useEffect(() => {
    makeUnread();
    getMsgList();
    return () => {};
  }, []);

  // 发消息
  const send = async (message) => {
    const text = new MessageText(message);
    const channel = new Channel(channelId, channelType);
    await sdk.shared().chatManager.send(text, channel);
  };

  const onSend = useCallback((messages = []) => {
    send(messages[0].text);
  }, []);

  return (
    <Page style={styles.container}>
      <GiftedChat
        messageContainerRef={$ref}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
        }}
        placeholder='请输入内容'
        locale='zh-cn'
        timeFormat='HH:mm'
        dateFormat='MM月DD日'
        renderUsernameOnMessage={true}
        scrollToBottom={true}
        scrollToBottomComponent={() => {
          return (
            <Ionicons
              name='chevron-down-outline'
              size={20}
              color={theme.color.text}
            />
          );
        }}
        scrollToBottomStyle={{
          backgroundColor: theme.color.container_a25,
        }}
        minComposerHeight={40}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: theme.color.container,
                paddingRight: 10,
                alignItems: 'center',
                borderTopColor: theme.color.container_a75,
                flexDirection: 'column',
              }}
            />
          );
        }}
        renderComposer={(props) => {
          return (
            <Composer
              {...props}
              textInputProps={{
                selectionColor: theme.color.text,
              }}
              textInputStyle={{
                flex: 1,
                backgroundColor: theme.color.background,
                color: theme.color.text,
                fontSize: 16,
                fontWeight: '500',
                lineHeight: 20,
                paddingHorizontal: 8,
                paddingTop: 10,
                paddingBottom: 10,
                verticalAlign: 'middle',
                borderRadius: 6,
              }}
            />
          );
        }}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              label='发送'
              textStyle={{
                color: theme.color.primary,
              }}
            />
          );
        }}
      />
      <View
        style={{
          height: insets.bottom,
          backgroundColor: theme.color.container,
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {},
});
