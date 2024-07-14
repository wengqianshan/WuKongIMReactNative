import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Page from '../../components/Page';
import camelCase from 'camelcase';
import API from 'wukongapi';
import Block from '../../components/Block';
import Button from '../../components/Button';
import { useTheme } from '../../providers/Theme';
import { useAuth } from '../../providers/Auth';

const ApiItem = (props) => {
  const { navigation, route } = props;
  const { name } = route.params || {};

  const {theme} = useTheme();
  const { host } = useAuth();

  const [api, setApi] = useState();
  const [params, setParams] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);

  const $name = camelCase(name.substring(1).replace(/\//g, '_'));

  const send = async () => {
    try {
      const body = params && JSON.parse(params);
      setLoading(true);
      const res = await api[$name](body);
      setLoading(false);
      setResponse(JSON.stringify(res, null, 4));
    } catch (error) {
      setResponse(error.message);
    }
  };

  useEffect(() => {
    if (!host) {
      return;
    }
    const ins = new API(host);
    setApi(ins);
    return () => {};
  }, [host]);

  return (
    <Page scroll>
      <Text
        style={{
          color: theme.color.text,
          marginHorizontal: 16,
          marginTop: 16,
        }}
      >
        API: {name}
      </Text>
      <Block
        title='入参'
        style={{
          padding: 12,
        }}
      >
        <TextInput
          multiline
          style={{
            // height: 80,
            minHeight: 80,
            color: theme.color.text,
          }}
          onChangeText={setParams}
        />
      </Block>
      <Button
        text='发送'
        loading={loading}
        style={{
          marginHorizontal: 16,
        }}
        onPress={send}
      />
      {response && (
        <Block style={{ padding: 16 }}>
          <Text
            style={{
              color: theme.color.text,
            }}
            selectable
          >
            {response}
          </Text>
        </Block>
      )}
    </Page>
  );
};

const styles = StyleSheet.create({});

export default ApiItem;
