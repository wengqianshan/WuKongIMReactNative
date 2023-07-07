import React, { createContext, useEffect, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import * as SystemUI from 'expo-system-ui';

import { palette } from './lib';

const Context = createContext();

/**
 * 换肤
 *
 * 使用方法
 * const theme = useTheme();
 * {theme.color.primary}
 * const [currentTheme, setCurrentTheme] = useThemeConfig();
 * setCurrentTheme(obj);
 */
const dark = {
  name: '$theme.dark',
  title: '深色主题',
  values: {
    color: {
      primary: '#1a74e2',
      secondary: '#6d8489',
      tertiary: '#455356',

      background: '#101010',
      container: '#1c2223',

      error: '#db3a34',
      success: '#8ac926',
    },
  },
};

const light = {
  name: '$theme.light',
  title: '浅色主题',
  values: {
    color: {
      primary: '#007AFF',
      secondary: '#6f96b3',
      tertiary: '#EDEDFF',

      background: '#EFEFF4',
      container: '#ffffff',

      error: '#db3a34',
      success: '#8ac926',
    },
  },
};

const schemes = {
  light,
  dark,
};

const setSystemBackground = (obj) => {
  SystemUI.setBackgroundColorAsync(obj.values?.color?.background);
};

const ThemeProvider = ({ children }) => {
  const [current, setCurrent] = useState();
  const [ready, setReady] = useState(false);

  // 获取系统主题
  const colorScheme = useColorScheme(); // dark light null
  const autoTheme = schemes[colorScheme || 'light'];

  const setTheme = async (val) => {
    if (!val || !_.isObject(val)) {
      return;
    }
    setCurrent(val);
    setSystemBackground(val);
    await AsyncStorage.setItem('@theme', JSON.stringify(val));
  };

  const resetTheme = async () => {
    setSystemBackground(autoTheme);
    setCurrent(null);
    await AsyncStorage.removeItem('@theme');
  };

  useEffect(() => {
    const init = async () => {
      // TODO: 主题远程同步

      // 获取默认主题
      const val = await AsyncStorage.getItem('@theme');
      if (val) {
        setTheme(JSON.parse(val));
      } else {
        resetTheme();
      }
      setReady(true);
    };
    init();
    return () => {};
  }, []);

  const { values } = current || {};

  let theme = { ...autoTheme.values };
  try {
    theme = {
      ...values,
      color: palette(values.color),
    };
  } catch (error) {
    theme = {
      ...theme,
      color: palette(theme.color),
    };
  }

  if (!ready) {
    return;
  }

  return (
    <Context.Provider
      value={{
        defaults: [light, dark],
        theme,
        current,
        setTheme,
        resetTheme,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const { theme } = useContext(Context);
  return theme;
};

export const useThemeConfig = () => {
  const { current, setTheme, defaults } = useContext(Context);

  return [current, setTheme, defaults];
};

export const useResetTheme = () => {
  const { resetTheme } = useContext(Context);
  return resetTheme;
};
