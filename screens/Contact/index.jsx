import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Ionicons } from '@expo/vector-icons';
import { uniqBy } from 'lodash';
import { FlashList } from '@shopify/flash-list';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Page from '../../components/Page';
import Shim from '../../components/Shim';
import { useTheme } from '../../providers/Theme';
import BlockItem from '../../components/BlockItem';
import { navigate } from '../../scripts/RootNavigation';
import { useAuth } from '../../providers/Auth';

const Contact = ({ navigation }) => {
  const theme = useTheme();

  const { user } = useAuth();
  const { openModal } = useModal();

  const [users, setUsers] = useState([]);

  const items = users.filter((item) => item.uid !== user.uid);

  const handleAdd = () => {
    return openModal('ContactAdd', {
      callback: (uid) => {
        if (!uid) {
          return;
        }
        setUsers((prev) => {
          const d = uniqBy(
            [
              ...prev,
              {
                uid,
              },
            ],
            (item) => item.uid
          );
          return d;
        });
      },
    });
  };

  const handleClear = async () => {
    await AsyncStorage.removeItem('@contact');
    setUsers([]);
  };

  useEffect(() => {
    navigation.setOptions({
      title: '联系人',
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
          <Pressable onPress={handleAdd} hitSlop={20}>
            <Ionicons
              name='add-outline'
              size={24}
              color={theme.color.primary}
            />
          </Pressable>
        );
      },
    });
    return () => {};
  }, [theme]);

  const handlePress = (item) => {
    navigate('Chat', { ...item, channelId: item.uid });
  };

  useEffect(() => {
    if (!users || users.length < 1) {
      return;
    }
    const fn = async () => {
      await AsyncStorage.setItem('@contact', JSON.stringify(users));
    };
    fn();
    return () => {};
  }, [users]);

  useEffect(() => {
    const fn = async () => {
      const val = await AsyncStorage.getItem('@contact');
      if (!val) {
        return;
      }
      setUsers(JSON.parse(val));
    };
    fn();
    return () => {};
  }, []);

  return (
    <Page>
      <FlashList
        estimatedItemSize={70}
        data={items}
        renderItem={({ item, index }) => {
          return (
            <BlockItem
              style={{ height: 64 }}
              title={item.uid}
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

export default Contact;
