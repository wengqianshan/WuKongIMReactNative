import React, { useEffect, useState, createContext, useContext } from 'react';
import { ConnectStatus } from 'wukongimjssdk/lib/connect_manager';
import { WKSDK } from 'wukongimjssdk/lib/sdk';

import {
  conversationSync,
  getAddr,
  getChannelMessages,
} from '../../scripts/api';
import Empty from '../../components/Empty';
import { useAuth } from '../Auth';
import { useSound } from '../Sound';

const Context = createContext();

const ChatProvider = ({ children }) => {
  // 连接状态
  const [status, setStatus] = useState();
  // 错误
  const [error, setError] = useState();
  // 消息
  const [message, setMessage] = useState();
  // 会话
  const [conversation, setConversation] = useState();
  // 未读
  const [unread, setUnread] = useState(null);
  const [conversations, setConversations] = useState([]);

  // 当前频道
  const [channel, setChannel] = useState(null);

  const { user, host, logout } = useAuth();
  const { play } = useSound();

  const connectStatusListener = (status, reasonCode) => {
    console.log('连接状态: ', status);
    if (status === ConnectStatus.Connected) {
      // console.log('连接成功');
    } else {
      // console.log('连接失败', reasonCode); //  reasonCode: 2表示认证失败（uid或token错误）
    }
    setStatus(status);
  };
  const messageListener = (message) => {
    console.log('监听消息: ', JSON.stringify(message));
    setMessage(message);
  };
  const conversationListener = (conversation, action) => {
    // 0:add 1:update 2:remove
    console.log('监听最近会话: ', JSON.stringify(conversation), action);
    if (conversation.lastMessage.fromUID !== user.uid) {
      // 播放音乐
      play();
    }
    setConversation({
      conversation,
      action,
    });
  };

  const connect = async ({ uid, token }) => {
    setError(null);
    console.log('开始连接', uid, token);
    if (!uid || !token) {
      return setError(`uid或token不存在: [${uid}-${token}]`);
    }
    // 自动获取ws地址
    const addr = await getAddr();
    if (!addr?.ws_addr) {
      return setError(`无法连接到服务器: ${host}`);
    }
    WKSDK.shared().config.addr = addr.ws_addr;
    WKSDK.shared().config.uid = uid;
    WKSDK.shared().config.token = token;
    WKSDK.shared().connectManager.connect();
    // 监听连接状态
    WKSDK.shared().connectManager.addConnectStatusListener(
      connectStatusListener
    );
    // 监听消息
    WKSDK.shared().chatManager.addMessageListener(messageListener);
    // 监听最近会话
    WKSDK.shared().conversationManager.addConversationListener(
      conversationListener
    );
  };
  const disconnect = async () => {
    // console.log('断开连接 >>>>>>>>>>');
    WKSDK.shared().connectManager.removeConnectStatusListener(
      connectStatusListener
    );
    WKSDK.shared().chatManager.removeMessageListener(messageListener);
    WKSDK.shared().conversationManager.removeConversationListener(
      conversationListener
    );
    WKSDK.shared().connectManager.disconnect();
  };

  useEffect(() => {
    if (!host || !user) {
      return;
    }
    connect(user);
    initSources();
    return () => {
      disconnect();
    };
  }, [host, user]);

  // 设置数据源
  const initSources = async () => {
    // 最近会话
    // const conversations = await WKSDK.shared().conversationManager.sync({})
    // 提供最近会话同步的数据源
    WKSDK.shared().config.provider.syncConversationsCallback = async (args) => {
      console.log('最近会话数据源:', args);
      const conversations = await conversationSync(args);
      return conversations;
    };

    // 同步消息
    // const messages = await WKSDK.shared().chatManager.syncMessages(channel, opts)
    WKSDK.shared().config.provider.syncMessagesCallback = async (args) => {
      console.log('消息数据源:', args);
      // 后端提供的获取频道消息列表的接口数据 然后构建成 Message对象数组返回
      const { channelId, channelType, user } = args;
      const messages = await getChannelMessages({
        login_uid: user.uid,
        channel_id: channelId,
        channel_type: channelType,
      });
      // message.remoteExtra.extra = ...  //一些第三方数据可以放在这里
      return messages;
    };
  };

  // 更新未读消息数
  useEffect(() => {
    const count = conversations.reduce((prev, curr) => {
      return prev + curr.unread;
    }, 0);
    const val = count > 99 ? '99+' : count || null;
    setUnread(val);
    return () => {};
  }, [conversations]);

  if (user && error) {
    return (
      <Empty
        icon='alert-circle-outline'
        title={error}
        buttons={[
          {
            text: '重连',
            handler: () => {
              connect(user);
            },
          },
          {
            text: '退出',
            handler: () => {
              logout();
            },
            props: {
              style: {
                backgroundColor: '#f00',
                marginLeft: 12,
              },
            },
          },
        ]}
      />
    );
  }

  return (
    <Context.Provider
      value={{
        sdk: WKSDK,
        status,
        connect,
        disconnect,
        message,
        conversation,
        channel,
        setChannel,
        unread,
        setUnread,
        conversations,
        setConversations,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ChatProvider;

export const useChat = () => {
  const context = useContext(Context);
  return context;
};
