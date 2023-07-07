import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { HOST } from './constant';

// 原子数据

// 用户信息 {uid, token}
export const user = atom({
  key: '$.user',
  default: null,
});

// 服务器信息
export const host = atom({
  key: '$.host',
  default: HOST,
});

// 会话列表
export const conversations = atom({
  key: '$.conversations',
  default: [],
});

// 当前频道，用来标记是否需要通知，进入频道时设置，离开时置空 必选字段:{channelId, channelType}
export const channel = atom({
  key: '$.channel',
  default: null,
});

// 当前未读消息总数
export const unread = atom({
  key: '$.unread',
  default: null,
});
