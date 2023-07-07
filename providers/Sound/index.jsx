import React, { useEffect, useState, createContext, useContext } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

import du from '../../assets/du.mp3';
import hw from '../../assets/hw.mp3';
import qq from '../../assets/qq.mp3';
import wx from '../../assets/wx.mp3';
import msn from '../../assets/msn.mp3';
import yi from '../../assets/yi.mp3';

const sounds = [
  {
    label: '叮咚',
    name: 'du',
    source: du,
  },
  {
    label: '某为',
    name: 'hw',
    source: hw,
  },
  {
    label: '某Q',
    name: 'qq',
    source: qq,
  },
  {
    label: '某信',
    name: 'wx',
    source: wx,
  },
  {
    label: 'MSN',
    name: 'msn',
    source: msn,
  },
  {
    label: '咦 短消息',
    name: 'yi',
    source: yi,
  },
];

const KEY = '@sound';
// {
//   enabled: true,
//   name: '',
// }

const Context = createContext();

const Sound = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState();
  const [enabled, setEnabled] = useState(false);
  const [current, setCurrent] = useState(sounds[0].name);
  const [key, setKey] = useState(0);

  const $play = async (name) => {
    if (!enabled) {
      console.log('未开启声音提示');
      return;
    }
    const item = sounds.find((item) => item.name === (name || current));
    const { sound } = await Audio.Sound.createAsync(item.source);
    setSound(sound);

    await sound.playAsync();
  };

  useEffect(() => {
    if (key < 1) {
      return;
    }
    $play();
    return () => {};
  }, [key]);

  const play = (name) => {
    if (name) {
      return $play(name);
    }
    setKey((curr) => curr + 1);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const fn = async () => {
      await AsyncStorage.setItem(
        KEY,
        JSON.stringify({ enabled, name: current })
      );
    };
    fn();
    return () => {};
  }, [enabled, current, ready]);

  useEffect(() => {
    const fn = async () => {
      const txt = await AsyncStorage.getItem(KEY);
      if (txt) {
        const obj = JSON.parse(txt);
        setEnabled(obj.enabled);
        setCurrent(obj.name);
      }
      setReady(true);
    };
    fn();
    return () => {};
  }, []);

  return (
    <Context.Provider
      value={{
        sounds,
        play,
        current,
        setCurrent,
        enabled,
        setEnabled,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Sound;

export const useSound = () => {
  const context = useContext(Context);
  return context;
};
