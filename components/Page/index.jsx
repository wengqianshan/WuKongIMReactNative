import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { useTheme } from '../../providers/Theme';

const Page = (props) => {
  const {
    children,
    style,
    scroll = false,
    onRefresh,
    refreshing = false,
    ...otherProps
  } = props;

  const theme = useTheme();

  const Container = scroll ? ScrollView : View;

  const $props = {
    ...otherProps,
  };

  // 滚动页面
  if (onRefresh) {
    $props.refreshControl = (
      <RefreshControl
        tintColor={theme.color.text}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: theme.color.background },
        style,
      ]}
      showsVerticalScrollIndicator={false}
      {...$props}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
