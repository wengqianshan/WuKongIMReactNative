import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';

// 设备信息
export const deviceInfo = () => {
  const { isDevice, brand, modelName, osName, osVersion } = Device;
  return {
    isDevice,
    brand,
    modelName,
    osName,
    osVersion,
  };
};

// 应用信息
export const appInfo = () => {
  const {
    applicationName: name,
    nativeApplicationVersion: version,
    nativeBuildVersion: buildVersion,
  } = Application;
  return {
    name,
    version,
    buildVersion,
  };
};

// 获取设备唯一ID
export const getUniqueId = async () => {
  if (Platform.OS === 'android') {
    return Application.androidId;
  } else {
    let deviceId = await SecureStore.getItemAsync('deviceId');

    if (!deviceId) {
      deviceId = uuid.v4();
      await SecureStore.setItemAsync('deviceId', deviceId);
    }
    return deviceId;
  }
};

// 打开浏览器
export const openBrowser = async (url) => {
  await WebBrowser.openBrowserAsync(url);
};

// Toast
export const setToastTheme = (theme) => {
  Notifier.$theme = theme;
};
export const toast = (title, options) => {
  const theme = Notifier.$theme;
  Notifier.showNotification({
    title: title,
    // description: '描述内容',
    Component: NotifierComponents.Alert,
    // duration: 0,
    containerStyle: {
      paddingBottom: 12,
      paddingTop: Platform.OS === 'android' ? 24 : 0,
      backgroundColor: theme.color.primary,
    },
    componentProps: {
      backgroundColor: 'transparent',
      textColor: theme.color.on_primary,
      titleStyle: {
        fontSize: 18,
      },
      descriptionStyle: {},
    },
    ...options,
  });
};

// url追加主题变量
export const markUrl = (url, theme) => {
  const [purl, hash = ''] = url.split('#');
  const [href = '', search = ''] = purl.split('?');

  const colorSchema = `colorSchema=${
    theme?.color?.isDarkBackground ? 'dark' : 'light'
  }`;
  const $url = `${href}?${colorSchema}${search ? '&' + search : ''}${
    hash ? '#' + hash : ''
  }`;
  return $url;
};
