import React from 'react';
import { StatusBar } from 'expo-status-bar';

import Router from './Router';
import { useTheme } from './providers/Theme';
import { useAuth } from './providers/Auth';

const Boot = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const routeName = user ? 'Home' : 'Login';

  // TODO: 启动屏控制
  const handleReady = async () => {};

  return (
    <>
      <Router
        initialRouteName={routeName}
        logined={!!user}
        onReady={handleReady}
      />
      <StatusBar style={theme.color.isDarkBackground ? 'light' : 'dark'} />
    </>
  );
};

export default Boot;
