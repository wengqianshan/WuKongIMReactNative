import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { navigationRef } from './scripts/RootNavigation';
import { useTheme } from './providers/Theme';
import { useI18n } from './providers/I18n';
import linking from './config/linking';

import BackBtn from './components/BackBtn';
import Chat from './screens/Chat';
import Conversation from './screens/Conversation';
import Login from './screens/Login';
import Contact from './screens/Contact';
import Group from './screens/Group';
import Setting from './screens/Setting';
import Sound from './screens/Sound';
import About from './screens/About';
import Api from './screens/Api';
import ApiItem from './screens/ApiItem';
import { useChat } from './providers/Chat';
import Theme from './screens/Theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const isAndroid = Platform.OS === 'android';

// 首页+tab
function HomeStack() {
  const { theme } = useTheme();
  const i18n = useI18n();
  const { unread } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerBackgroundContainerStyle: {
          backgroundColor: isAndroid ? theme.color.background : 'transparent',
        },
        headerLeftContainerStyle: {
          paddingLeft: 12,
        },
        headerRightContainerStyle: {
          paddingRight: 12,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 17,
          color: theme.color.text,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isAndroid ? theme.color.background : 'transparent',
          height: isAndroid ? 64 : 89,
          borderTopColor: theme.color.background,
        },
        tabBarItemStyle: {
          marginVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerTransparent: true,
        tabBarBackground: () => (
          <BlurView
            tint={theme.color.isDarkBackground ? 'dark' : 'light'}
            intensity={90}
            style={StyleSheet.absoluteFill}
          />
        ),
        headerBackground: () => (
          <BlurView
            tint={theme.color.isDarkBackground ? 'dark' : 'light'}
            intensity={50}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tab.Screen
        name='HomeIndex'
        component={Conversation}
        options={{
          animation: 'none',
          tabBarLabel: i18n.t('$tabs.1'),
          tabBarIcon: ({ focused, color, size }) => {
            const name = focused ? 'chatbubbles' : 'chatbubbles-outline';
            const $size = focused ? 28 : size;
            return <Ionicons name={name} size={$size} color={color} />;
          },
          tabBarBadge: unread,
        }}
      />
      <Tab.Screen
        name='HomeContact'
        component={Contact}
        initialParams={{ tab: true }}
        options={{
          tabBarLabel: i18n.t('$tabs.2'),
          tabBarIcon: ({ focused, color, size }) => {
            const name = focused ? 'person-circle' : 'person-circle-outline';
            const $size = focused ? 28 : size;
            return <Ionicons name={name} size={$size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name='HomeGroup'
        component={Group}
        initialParams={{ tab: true }}
        options={{
          tabBarLabel: i18n.t('$tabs.3'),
          tabBarIcon: ({ focused, color, size }) => {
            const name = focused ? 'people' : 'people-outline';
            const $size = focused ? 28 : size;
            return <Ionicons name={name} size={$size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name='HomeSetting'
        component={Setting}
        options={{
          tabBarLabel: i18n.t('$tabs.4'),
          tabBarIcon: ({ focused, color, size }) => {
            const name = focused ? 'cog' : 'cog-outline';
            const $size = focused ? 28 : size;
            return <Ionicons name={name} size={$size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

// 路由定义
const routes = [
  {
    name: 'Home',
    component: HomeStack,
    options: {
      headerShown: false,
      animation: 'none',
    },
    logined: true,
  },
  {
    name: 'Chat',
    component: Chat,
    logined: true,
  },
  {
    name: 'Login',
    component: Login,
    options: {
      headerShown: false,
      animation: 'none',
    },
    logined: false,
  },
  {
    name: 'Sound',
    component: Sound,
    logined: true,
  },
  {
    name: 'About',
    component: About,
    logined: true,
  },
  {
    name: 'Api',
    component: Api,
    logined: true,
    options: {
      title: 'API 列表',
    },
  },
  {
    name: 'ApiItem',
    component: ApiItem,
    logined: true,
    options: {
      title: '调试',
    },
  },
  {
    name: 'Theme',
    component: Theme,
  },
];

const Router = (props) => {
  const { onReady = () => {}, initialRouteName, logined = false } = props || {};

  const { theme } = useTheme();

  // 路由主题
  const navtheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.color.primary,
      border: theme.color.container,
      card: theme.color.secondary,
      text: theme.color.secondary,
    },
  };

  // 通用导航配置
  const stackConfig = {
    screenOptions: {
      headerStyle: {
        backgroundColor: theme.color.background,
      },
      headerTitleStyle: {
        color: theme.color.text,
        fontSize: 17,
      },
      headerShadowVisible: false,
      headerLeft: (props) => {
        return <BackBtn />;
      },
      headerBackVisible: false,
    },
    initialRouteName, // 区分不同场景
  };

  // 路由过滤(登录状态)
  const $routes = routes.filter(
    (item) => item.logined === undefined || item.logined === logined
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      theme={navtheme}
      linking={linking}
      onStateChange={(state) => {
        // TODO: 埋点
        // const current = getCurrentScreen(state);
        // console.log(current, '--------------');
        // current && log.visit(current.name, current.params);
        // 不上传页面参数
        // current && log.visit(current.name);
      }}
    >
      <Stack.Navigator {...stackConfig}>
        {$routes.map((route) => {
          return <Stack.Screen key={route.name} {...route} />;
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;

function getCurrentScreen(obj) {
  const { index, routes } = obj;
  const current = routes[index];
  if (current.state) {
    return getCurrentScreen(current.state);
  }
  // const { key, name, params, path } = current;
  return current;
}
