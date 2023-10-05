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
import 'dayjs/locale/zh-cn';

import { useI18n } from '../../providers/I18n';
import { useTheme } from '../../providers/Theme';
import Page from '../../components/Page';
import { useChat } from '../../providers/Chat';
import {
  conversationUnread,
  getChannelMessages,
} from '../../scripts/api';
import { useAuth } from '../../providers/Auth';
import { goBack } from '../../scripts/RootNavigation';

const isAndroid = Platform.OS === 'android';

export default function Chat(props) {
  const { navigation, route } = props;
  const { channelId, channelType: $channelType = 1 } = route.params || {};
  const channelType = Number($channelType);

  const $ref = useRef();
  const { user } = useAuth();
  const { sdk, message, setChannel, setConversations } = useChat();
  const i18n = useI18n();
  const theme = useTheme();

  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      title: `${channelId}${channelType === 2 ? '(群聊)' : ''}`,
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
    // console.log('获取频道消息', JSON.stringify(res));
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
    setChannel({
      channelId,
      channelType,
    });
    makeUnread();
    getMsgList();
    return () => {
      setChannel(null);
    };
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
