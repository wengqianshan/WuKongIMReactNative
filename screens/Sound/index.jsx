import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';

import Page from '../../components/Page';
import Block from '../../components/Block';
import BlockItem from '../../components/BlockItem';
import { useTheme } from '../../providers/Theme';
import { useSound } from '../../providers/Sound';

const Sound = ({ navigation }) => {
  const {theme} = useTheme();
  const { sounds, play, current, setCurrent, enabled, setEnabled } = useSound();

  useEffect(() => {
    navigation.setOptions({
      title: '消息提示',
    });
    return () => {};
  }, []);

  return (
    <Page>
      <Block>
        <BlockItem
          title='开启'
          content={
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: 16,
              }}
            >
              <Switch value={enabled} onValueChange={setEnabled} />
            </View>
          }
          showBorder={enabled}
        />
        {enabled && (
          <View style={styles.options}>
            {sounds.map((item, index) => {
              const isActive = item.name === current;
              return (
                <Pressable
                  style={[
                    styles.option,
                    {
                      backgroundColor: isActive ? theme.color.background : null,
                    },
                  ]}
                  key={index}
                  onPress={() => {
                    play(item.name);
                    setCurrent(item.name);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: theme.color.text,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Block>
    </Page>
  );
};

const styles = StyleSheet.create({
  options: {
    padding: 16,
  },
  option: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Sound;
