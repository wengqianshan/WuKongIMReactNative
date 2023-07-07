import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';

import { appInfo, deviceInfo, getUniqueId } from './utils';

let currentPageName;

export const send = async (event, params) => {
  if (__DEV__) {
    return console.log('埋点DEV ==> ', event, JSON.stringify(params));
  }
  const { osName, osVersion } = deviceInfo();
  const { name, version } = appInfo();
  const defaults = {
    os_name: osName,
    os_version: `${osName}@${osVersion}`,
    app_version: `${name}@${version}`,
  };
  const data = {
    ...defaults,
    ...params,
  };
  // console.log('日志: ', event, data);
  await analytics().logEvent(event, data);
};

/**
 * 日志初始化设置
 * @param {Boolean} logined 是否已登录
 * @returns
 */
export const init = async (logined) => {
  // console.log('日志系统初始化 ......', logined);
  const uid = await getUniqueId();
  // console.log(uid);
  await analytics().setUserId(uid);

  // Set User
  // await firebase.analytics().setUserId('123456789');
  // Remove User
  // await firebase.analytics().setUserId(null);
};

/**
 * 页面访问
 * @param {Object} params
 * - name: 页面名称
 */
export const visit = async (name, params = {}) => {
  currentPageName = name;
  await send(`${name}_visit`, {
    ...params,
  });
};

/**
 * 控件点击
 * @param {Object} params
 * - name: 控件名称
 */
export const click = async (name, params = {}, withPageName = true) => {
  let page = currentPageName && withPageName ? currentPageName : 'page';
  let eventName = `${page}_click`;
  await send(eventName, {
    label_name: name,
    ...params,
  });
};

/**
 * 控件曝光
 * @param {Object} params
 * - name: 控件名称
 */
export const expose = async (name, params = {}, withPageName = true) => {
  let page = currentPageName && withPageName ? currentPageName : 'page';
  let eventName = `${page}_expose`;
  await send(eventName, {
    label_name: name,
    ...params,
  });
};

/**
 * 页面事件
 * @param {Object} params
 * - name: 事件名称
 */
export const event = async (name, params = {}, withPageName = true) => {
  let page = currentPageName && withPageName ? currentPageName : 'page';
  let eventName = `${page}_event`;
  await send(eventName, {
    event_name: name,
    ...params,
  });
};

/**
 * 应用事件
 * @param {Object} params
 * - name: 事件名称  log.app(appState.current); // inactive background active
 */
export const app = async (name, params = {}, withPageName = true) => {
  let eventName = `APP_${name}`;
  let page = currentPageName && withPageName ? currentPageName : 'page';
  await send(eventName, {
    page_name: page,
    ...params,
  });
};
