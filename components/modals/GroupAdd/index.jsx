import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../../../providers/Theme';
import Input from '../../Input';
import Button from '../../Button';
import Block from '../../Block';

const labels = {
  create: '创建',
  join: '加入'
};

const GroupAdd = ({ modal: { closeModal, getParam, params } }) => {
  // console.log(params);
  const { action } = params;
  const cb = getParam('callback', () => {});
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const [val, setValue] = useState('');

  const handleSubmit = () => {
    if (!val) {
      return;
    }
    cb(val);
    closeModal();
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
      <View
        style={[
          styles.container,
          {
            width,
            // backgroundColor: '#f00',
          },
        ]}
      >
        <Block>
          <Text
            style={[
              styles.title,
              {
                color: theme.color.text,
              },
            ]}
          >
            请输入群ID
          </Text>
          <View
            style={{
              marginHorizontal: 16,
            }}
          >
            <Input
              icon={null}
              label={null}
              style={{
                height: 40,
                paddingHorizontal: 10,
                backgroundColor: theme.color.background,
              }}
              onChange={setValue}
              inputProps={{
                textAlign: 'center',
                autoFocus: true,
                returnKeyType: 'done',
                onSubmitEditing: (e) => {
                  handleSubmit();
                },
              }}
            />
          </View>

          <View
            style={{
              margin: 16,
            }}
          >
            <Button text={labels[action]} onPress={handleSubmit} />
          </View>
        </Block>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default GroupAdd;
