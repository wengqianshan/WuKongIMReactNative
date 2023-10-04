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
