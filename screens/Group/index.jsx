import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Ionicons } from '@expo/vector-icons';
import { uniqBy } from 'lodash';
import { FlashList } from '@shopify/flash-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers;

import Page from '../../components/Page';
import Shim from '../../components/Shim';
import { useTheme } from '../../providers/Theme';
import BlockItem from '../../components/BlockItem';
import { navigate } from '../../scripts/RootNavigation';
import { useAuth } from '../../providers/Auth';
import { addChannel, addSub } from '../../scripts/api';

const KEY = '@group';

const actions = {
  create: async (params) => {
    return await addChannel(params);
  },
  join: async (params) => {
    return await addSub(params);
  },
};

const Group = ({ navigation }) => {
  const {theme} = useTheme();

  const { user } = useAuth();
  const { openModal } = useModal();

  const [items, setItems] = useState([]);

  // 保存数据
  const handleSave = async (values) => {
    if (!values) {
      return;
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(values));
  };

  // action: create/join
  const handleAdd = (action) => {
    return openModal('GroupAdd', {
      action,
      callback: async (gid) => {
        console.log(gid, '群id');
        if (!gid) {
          return;
        }
        const res = await actions[action]({
          channel_id: gid,
          subscribers: [user.uid],
        });

        setItems((prev) => {
          const d = uniqBy(
            [
              ...prev,
              {
                id: gid,
              },
            ],
            (item) => item.id
          );
          return d;
        });
      },
    });
  };

  const handleClear = async () => {
    await AsyncStorage.removeItem(KEY);
    setItems([]);
  };

  useEffect(() => {
    navigation.setOptions({
      title: '群聊',
      headerLeft: () => {
        return (
          <Pressable onPress={handleClear} hitSlop={20}>
            <Ionicons
              name='trash-outline'
              size={20}
              color={theme.color.primary}
            />
          </Pressable>
        );
      },
      headerRight: () => {
        return (
          <Menu
            renderer={Popover}
            rendererProps={{
              anchorStyle: {
                backgroundColor: theme.color.secondary,
              },
              placement: 'bottom',
            }}
          >
            <MenuTrigger customStyles={triggerStyles}>
              <Ionicons
                name='add-outline'
                size={24}
                color={theme.color.primary}
              />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor: theme.color.secondary,
                  padding: 4,
                  borderRadius: 6,
                },
              }}
            >
              <MenuOption
                onSelect={() => handleAdd('create')}
                customStyles={{
                  optionWrapper: {
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                  },
                }}
              >
                <Text style={{ color: theme.color.text, fontSize: 16 }}>
                  创建群聊
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => handleAdd('join')}
                customStyles={{
                  optionWrapper: {
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                  },
                }}
              >
                <Text style={{ color: theme.color.text, fontSize: 16 }}>
                  加入群聊
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        );
      },
    });
    return () => {};
  }, [theme]);

  const handlePress = (item) => {
    navigate('Chat', { ...item, channelId: item.id, channelType: 2 });
  };

  useEffect(() => {
    if (!items || items.length < 1) {
      return;
    }
    const fn = async () => {
      await AsyncStorage.setItem(KEY, JSON.stringify(items));
    };
    fn();
    return () => {};
  }, [items]);

  useEffect(() => {
    const fn = async () => {
      const val = await AsyncStorage.getItem(KEY);
      if (!val) {
        return;
      }
      setItems(JSON.parse(val));
    };
    fn();
    return () => {};
  }, []);

  return (
    <Page scroll>
      <FlashList
        estimatedItemSize={70}
        data={items}
        renderItem={({ item, index }) => {
          return (
            <BlockItem
              style={{ height: 64 }}
              title={item.id}
              showBorder={!(index === items.length - 1)}
              onPress={() => {
                handlePress(item);
              }}
            />
          );
        }}
        ListHeaderComponent={() => {
          return <Shim position='header' />;
        }}
        ListFooterComponent={() => {
          return <Shim position='tab' />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </Page>
  );
};

const styles = StyleSheet.create({});

export default Group;

// 以下是菜单组件的样式配置参考

const triggerStyles = {
  triggerText: {
    // color: 'white',
  },
  triggerOuterWrapper: {},
  triggerWrapper: {},
  triggerTouchable: {},
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'green',
    padding: 5,
  },
  optionsWrapper: {
    backgroundColor: 'purple',
  },
  optionWrapper: {
    backgroundColor: 'yellow',
    margin: 5,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'brown',
  },
};

const optionStyles = {
  optionTouchable: {
    underlayColor: 'red',
    activeOpacity: 40,
  },
  optionWrapper: {
    backgroundColor: 'pink',
    margin: 5,
  },
  optionText: {
    color: 'black',
  },
};
