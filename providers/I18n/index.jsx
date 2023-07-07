import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import i18n from './lib';

const Context = createContext();

/**
 * 国际化
 *
 * 使用方法
 * const i18n = useI18n();
 * {i18n.t('carbs')}
 * [current, setCurrent, defaults] = useI18nState();
 * setCurrent(item)
 * - 语言文件数据格式
 {
    name: 'en', // 标识
    title: 'English', // 显示名称
    builtIn: true, // 是否内置语言
    version: '20221027', // 版本号，用来动态更新比较
    // uri: '', // 语言文件地址，备用
    // values: {}, // 加载数据后合并，仅用在设置远程语言时
  },
 */
const defaults = [
  {
    name: 'zh-CN',
    title: '简体中文',
    builtIn: true,
    version: '20221027',
  },
  {
    name: 'en',
    title: 'English',
    builtIn: true,
    version: '20221027',
  },
  {
    name: 'ja',
    title: '日本語',
    builtIn: true,
    version: '20230515',
  },
];

const I18nProvider = ({ children }) => {
  const [current, setCurrent] = useState(
    defaults.find((item) => item.name === (i18n.defaultLocale || 'zh-CN'))
  );

  const setLocale = async (item) => {
    if (!item) {
      return;
    }
    i18n.locale = item.name;
    setCurrent(item);

    // dayjs多语言
    if (/^zh/.test(item.name)) {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }

    await AsyncStorage.setItem('@locale', JSON.stringify(item));
  };

  useEffect(() => {
    const init = async () => {
      try {
        let item = await AsyncStorage.getItem('@locale');
        if (!item) {
          return;
        }
        item = JSON.parse(item);
        if (item.values) {
          i18n.store(item.values);
        }
        setLocale(item);
      } catch (error) {}
    };
    init();
    return () => {};
  }, []);

  return (
    <Context.Provider
      value={{
        defaults,
        current,
        setLocale,
        i18n,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default I18nProvider;

export const useI18n = () => {
  const { i18n } = useContext(Context);
  return i18n;
};

export const useI18nState = () => {
  const { current, setLocale, defaults } = useContext(Context);

  return [current, setLocale, defaults];
};
