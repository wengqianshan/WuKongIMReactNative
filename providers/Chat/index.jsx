import React, { useEffect, useState, createContext, useContext } from 'react';
import { ConnectStatus } from 'wukongimjssdk/lib/connect_manager';
import { WKSDK } from 'wukongimjssdk/lib/sdk';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getAddr } from '../../scripts/api';
import Empty from '../../components/Empty';
import { useAuth } from '../Auth';
import { useSound } from '../Sound';
import * as state from '../../scripts/state';

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
  const setUnread = useSetRecoilState(state.unread);
  const conversations = useRecoilValue(state.conversations);

  const { user, host, logout } = useAuth();
  const { play } = useSound();

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
      (status, reasonCode) => {
        console.log('连接状态: ', status);
        if (status === ConnectStatus.Connected) {
          // console.log('连接成功');
        } else {
          // console.log('连接失败', reasonCode); //  reasonCode: 2表示认证失败（uid或token错误）
        }
        setStatus(status);
      }
    );
    // 监听消息
    WKSDK.shared().chatManager.addMessageListener((message) => {
      setMessage(message);
    });
    // 监听最近会话
    WKSDK.shared().conversationManager.addConversationListener(
      (conversation, action) => {
        if (conversation.lastMessage.fromUID !== user.uid) {
          // 播放音乐
          play();
        }
        setConversation({
          conversation,
          action,
        });
      }
    );
  };
  const disconnect = async () => {
    // console.log('断开连接 >>>>>>>>>>');
    WKSDK.shared().connectManager.disconnect();
  };

  useEffect(() => {
    if (!host || !user) {
      return;
    }
    connect(user);
    return () => {
      disconnect();
    };
  }, [host, user]);

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
