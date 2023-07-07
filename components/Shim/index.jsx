import React from 'react';
import { Platform, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

/**
 *
 * height: 默认高度
 * position: 占位符位置，可选值: top bottom tab header
 */

const isAndroid = Platform.OS === 'android';

export default function Shim(props) {
  const { height = 0, position, style = {} } = props;

  let headerHeight = 0;
  try {
    headerHeight = useHeaderHeight();
  } catch (error) {
    // console.log(error, '//////////');
  }

  const insets = useSafeAreaInsets();

  let $height = height;

  switch (position) {
    case 'top':
      $height = insets.top;
      break;
    case 'bottom':
      $height = insets.bottom;
      if (isAndroid) {
        $height += 12;
      }
      break;
    case 'tab':
      try {
        $height = useBottomTabBarHeight();
        if (isAndroid) {
          $height += 12;
        }
      } catch (error) {
        // console.log(error);
      }
      break;
    case 'header':
      $height = headerHeight;
      break;
    default:
      break;
  }

  return <View style={{ height: $height, ...style }} />;
}
