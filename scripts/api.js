import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { HOST } from './constant';

/**
 * 请求基本方法
 * - url
 * - data 默认 {}
 * - method 默认 GET
 * - headers 默认 *
 * - needLogin 默认 false
 *
 */
const request = async function ({
  url: $url,
  data,
  method = 'GET',
  headers: $headers,
  needLogin = false,
  timeout = 10000,
}) {
  const headers = {
    'Content-Type': 'application/json',
    ...$headers,
  };

  if (needLogin) {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const options = {
    method,
    headers,
    signal: controller.signal,
  };
  let search = '';
  if (data) {
    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(data);
    } else {
      search = Object.keys(data)
        .map((item) => `${item}=${data[item]}`)
        .join('&');
    }
  }

  const host = (await AsyncStorage.getItem('@host')) || HOST;
  let url = `${host}${$url}?${search}`;
  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((error) => {
      console.log('[API Error] ', url, error);
      let errorMessage = '出错了';
      if (error.name === 'AbortError') {
        errorMessage = '连接超时';
      }
      return {
        success: false,
        errorMessage,
      };
    });
  clearTimeout(id);

  return response;
};

// ================ 基础 =================

// 获取连接地址
export async function getAddr() {
  const json = await request({
    url: '/route',
  });
  return json;
}

// ================ 用户 =================

// 登录
export async function getAuth(params = {}) {
  const defaults = {
    uid: null, // 第三方服务端的用户唯一uid
    token: null, // 第三方服务端的用户的token
    device_flag: 0, // 设备标识  0.app 1.web （相同用户相同设备标记的主设备登录会互相踢，从设备将共存）
    device_level: 1, // 设备等级 0.为从设备 1.为主设备
  };

  const data = {
    ...defaults,
    ...params,
  };
  const json = await request({
    url: '/user/token',
    data,
    method: 'POST',
  });
  // if (json.data?.token) {
  //   await AsyncStorage.setItem('@token', json.data.token);
  // }
  return json;
}

// 获取在线状态
export async function getOnlinestatus(data = ['110', '120', '119']) {
  const json = await request({
    url: '/user/onlinestatus',
    data,
    method: 'POST',
  });
  return json;
}

// 添加系统账号
export async function addSysUser(params = {}) {
  const defaults = {
    uids: [], // 需要加入系统账号的用户uid集合列表
  };
  const data = {
    ...defaults,
    ...params,
  };
  const json = await request({
    url: '/user/systemuids_add',
    data,
    method: 'POST',
  });
  return json;
}

// 移除系统账号
export async function removeSysUser(params = {}) {
  const defaults = {
    uids: [], // 需要加入系统账号的用户uid集合列表
  };
  const data = {
    ...defaults,
    ...params,
  };
  const json = await request({
    url: '/user/systemuids_remove',
    data,
    method: 'POST',
  });
  return json;
}

// 踢出登录
export async function kickOut(params = {}) {
  const defaults = {
    uid: null, // 需要踢出的用户uid
    device_flag: 1, // 需要踢出的设备标记 -1: 当前用户下所有设备 0： 当前用户下的app 1： 当前用户下的web 2： 当前用户下的pc
  };
  const data = {
    ...defaults,
    ...params,
  };
  const json = await request({
    url: '/user/device_quit',
    data,
    method: 'POST',
  });
  return json;
}

// ================ 频道 =================

// 添加频道
export async function addChannel(params = {}) {
  const defaults = {
    channel_id: null, // 频道的唯一ID，如果是群聊频道，建议使用群聊ID
    channel_type: 2, // 频道的类型 1.个人频道 2.群聊频道（个人与个人聊天不需要创建频道，系统将自动创建）
    large: 0, // 是否是超大群，0.否 1.是 （一般建议500成员以上设置为超大群，注意：超大群不会维护最近会话数据。）
    ban: 0, // 是否封禁此频道，0.否 1.是 （被封后 任何人都不能发消息，包括创建者）
    subscribers: [], // 订阅者集合
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/channel',
    data,
    method: 'POST',
  });
  return json;
}

// 删除频道
export async function removeChannel(params = {}) {
  const defaults = {
    channel_id: null, // 频道的唯一ID
    channel_type: 2, // 频道的类型 1.个人频道 2.群聊频道
  };
  const data = {
    ...defaults,
    ...params,
  };
  const json = await request({
    url: '/channel/delete',
    data,
    method: 'POST',
  });
  return json;
}

// 添加订阅者
export async function addSub(params = {}) {
  const defaults = {
    channel_id: null, // 频道的唯一ID
    channel_type: 2, // 频道的类型 1.个人频道 2.群聊频道
    reset: 0, // // 是否重置订阅者 （0.不重置 1.重置），选择重置，则删除旧的订阅者，选择不重置则保留旧的订阅者
    subscribers: [], // 订阅者集合
    temp_subscriber: 0, // 是否为临时频道 0.否 1.是 临时频道的订阅者将在下次重启后自动删除
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/channel/subscriber_add',
    data,
    method: 'POST',
  });
  return json;
}

// 移除订阅者
export async function removeSub(params = {}) {
  const defaults = {
    channel_id: null, // 频道的唯一ID
    channel_type: 2, // 频道的类型 1.个人频道 2.群聊频道
    subscribers: [], // 订阅者集合
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/channel/subscriber_remove',
    data,
    method: 'POST',
  });
  return json;
}

// ================ 消息 =================

// 发送消息
export async function send(params = {}) {
  const defaults = {
    header: {
      // 消息头
      no_persist: 0, // 是否不存储消息 0.存储 1.不存储
      red_dot: 1, // 是否显示红点计数，0.不显示 1.显示
      sync_once: 0, // 是否是写扩散，这里一般是0，只有cmd消息才是1
    },
    from_uid: null, // 发送者uid
    channel_id: null, // 接收频道ID 如果channel_type=1 channel_id为个人uid 如果channel_type=2 channel_id为群id
    channel_type: 2, // 接收频道类型  1.个人频道 2.群聊频道
    payload: 'xxxxx', // 消息内容，base64编码
    subscribers: [], // 订阅者 如果此字段有值，表示消息只发给指定的订阅者,没有值则发给频道内所有订阅者
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/message/send',
    data,
    method: 'POST',
  });
  return json;
}

// 批量发送消息
export async function sendBatch(params = {}) {
  const defaults = {
    header: {
      // 消息头
      no_persist: 0, // 是否不存储消息 0.存储 1.不存储
      red_dot: 1, // 是否显示红点计数，0.不显示 1.显示
      sync_once: 0, // 是否是写扩散，这里一般是0，只有cmd消息才是1
    },
    from_uid: null, // 发送者uid
    payload: 'xxxxx', // 消息内容，base64编码
    subscribers: [], // 接收者的uid，分批指定，每次建议 1000-10000之间，视系统情况而定
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/message/sendbatch',
    data,
    method: 'POST',
  });
  return json;
}

// 获取频道内消息
export async function getChannelMessages(params = {}) {
  const defaults = {
    login_uid: null, // 当前登录用户uid
    channel_id: null, //  频道ID
    channel_type: 2, // 频道类型
    start_message_seq: 0, // 开始消息列号（结果包含start_message_seq的消息）
    // end_message_seq: 0, // 结束消息列号（结果不包含end_message_seq的消息）
    limit: 100, // 消息数量限制
    pull_mode: 1, // 拉取模式 0:向下拉取 1:向上拉取
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/channel/messagesync',
    data,
    method: 'POST',
  });
  return json;
}

// ================ 会话 =================

// 同步会话
export async function conversationSync(params = {}) {
  const defaults = {
    uid: null, // 当前登录用户uid
    version: 0, //  当前客户端的会话最大版本号(从保存的结果里取最大的version，如果本地没有数据则传0)，
    last_msg_seqs: null, //   客户端所有频道会话的最后一条消息序列号拼接出来的同步串 格式： channelID:channelType:last_msg_seq|channelID:channelType:last_msg_seq
    msg_count: 20, // 每个会话获取最大的消息数量，一般为app点进去第一屏的数据
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/conversation/sync',
    data,
    method: 'POST',
  });
  return json;
}

// 删除会话
export async function conversationDelete(params = {}) {
  const defaults = {
    uid: null, // 当前登录用户uid
    channel_id: null, // 频道ID
    channel_type: 1, // 频道类型
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/conversations/delete',
    data,
    method: 'POST',
  });
  return json;
}

// 设置未读
export async function conversationUnread(params = {}) {
  const defaults = {
    uid: null, // 当前登录用户uid
    channel_id: null, // 频道ID
    channel_type: 1, // 频道类型
    unread: 0, // 未读消息数量
  };
  const data = {
    ...defaults,
    ...params,
  };

  const json = await request({
    url: '/conversations/setUnread',
    data,
    method: 'POST',
  });
  return json;
}
