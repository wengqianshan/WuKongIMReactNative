import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useModal } from 'react-native-modalfy';

import * as state from '../../scripts/state';
import { getAuth } from '../../scripts/api';

const Context = createContext({});

export default function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState();
  const [user, setUser] = useRecoilState(state.user);
  const [host, setHost] = useRecoilState(state.host);
  const { openModal } = useModal();

  // 登录 {tid, token}
  const login = async (params) => {
    setLoading(true);
    const res = await getAuth(params);
    setLoading(false);

    if (!res || res.status !== 200) {
      openModal('Alert', {
        title: '出错了',
        message: JSON.stringify(res),
      });
      return;
    }

    await AsyncStorage.setItem('@user', JSON.stringify(params));
    setUser(params);
  };

  // 登出
  const logout = async () => {
    await AsyncStorage.removeItem('@user');
    setUser(null);
  };

  // 设置host，后续考虑放其他地方处理
  const setHostFn = async (val) => {
    if (!val) {
      return;
    }
    await AsyncStorage.setItem('@host', val);
    setHost(val);
  };

  useEffect(() => {
    // 读取登录态
    const fn = async () => {
      const $host = await AsyncStorage.getItem('@host');
      const $user = await AsyncStorage.getItem('@user');
      if ($host) {
        setHost($host);
      }
      if ($user) {
        setUser(JSON.parse($user));
      }
      setReady(true);
    };
    fn();
    return () => {};
  }, []);

  // 读取登录态没有结束之前等待
  if (!ready) {
    return;
  }

  return (
    <Context.Provider
      value={{
        loading,
        user,
        setUser,
        host,
        setHost: setHostFn,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Context);
  return context;
};
