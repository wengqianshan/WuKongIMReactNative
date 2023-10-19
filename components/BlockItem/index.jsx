import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../providers/Theme';

/**
 *
<BlockItem
  icon=""
  title=""
  body={null}
/>
 */
const BlockItem = (props) => {
  const {
    style,
    titleTextStyle,
    icon,
    iconColor,
    title,
    content,
    onPress,
    onIconPress,
    showArrow,
    showBorder = true,
    vAlign = 'center', // center top
    vertical = false, // title和内容垂直布局
  } = props;

  const {theme} = useTheme();
  const [pressed, setPressed] = useState(false);

  const pressIn = () => {
    if (!onPress) {
      return;
    }
    setPressed(true);
  };
  const pressOut = () => {
    setPressed(false);
  };

  const $showArrow = showArrow === undefined ? !!onPress : showArrow;

  const borderStyle = showBorder
    ? {
        borderBottomWidth: 1,
        borderBottomColor: theme.color.background,
      }
    : {};

  const $content =
    typeof content === 'string' ? (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={[
            styles.contentText,
            {
              color: theme.color.text,
            },
          ]}
        >
          {content}
        </Text>
      </View>
    ) : (
      content
    );

  const backgroundColor = pressed
    ? theme.color.container_a50
    : theme.color.container;

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
    >
      {icon && (
        <Pressable
          style={[
            styles.iconContainer,
            vAlign === 'top' && styles.iconContainerTop,
          ]}
          onPress={onIconPress}
          pointerEvents={onIconPress ? 'auto' : 'none'}
        >
          <Ionicons
            name={icon}
            size={24}
            style={[styles.icon]}
            color={iconColor || theme.color.primary}
          />
        </Pressable>
      )}
      <View
        style={[styles.body, borderStyle, vAlign === 'top' && styles.bodyTop, vertical && styles.bodyVertical]}
      >
        {title && (
          <View style={styles.title}>
            <Text
              style={[
                styles.titleText,
                {
                  color: theme.color.text_light,
                },
                titleTextStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
        <View style={styles.content}>{$content}</View>
        {$showArrow && (
          <View style={styles.arrow}>
            <Ionicons
              name='chevron-forward'
              size={24}
              color={theme.color.on_container_a25}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  iconContainer: {
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 8,
  },
  iconContainerTop: {
    alignSelf: 'flex-start',
  },
  icon: {},
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyTop: {
    alignItems: 'flex-start',
  },
  bodyVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: {
    marginRight: 8,
    paddingVertical: 12,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    height: 48,
    justifyContent: 'center',
    marginRight: 8,
  },
});

export default BlockItem;
