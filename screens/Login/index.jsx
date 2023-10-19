import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../../providers/Theme';
import Page from '../../components/Page';
import Input from '../../components/Input';
import Block from '../../components/Block';
import BlockItem from '../../components/BlockItem';
import Button from '../../components/Button';
import Shim from '../../components/Shim';
import { useAuth } from '../../providers/Auth';

const Login = ({ navigation }) => {
  const {theme} = useTheme();
  const { login, host, setHost } = useAuth();

  const [currentUser, setCurrentUser] = useState({});
  const [currentHost, setCurrentHost] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: '登录',
      headerLeft: null,
    });
    return () => {};
  }, [theme]);

  const handleLogin = async () => {
    setLoading(true);
    await setHost(currentHost);
    await login(currentUser);
    setLoading(false);
  };

  return (
    <Page scroll keyboardShouldPersistTaps='handled'>
      <Shim position='top' />
      <Text
        style={{
          fontSize: 24,
          alignSelf: 'center',
          marginVertical: 64,
          color: theme.color.primary,
        }}
      >
        悟空IM
      </Text>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Block style={{ marginBottom: 24 }}>
          <BlockItem
            title='服务器'
            content={
              <View>
                <Input
                  icon={null}
                  label={null}
                  onChange={(val) => {
                    setCurrentHost(val);
                  }}
                  inputProps={{
                    defaultValue: host,
                  }}
                />
              </View>
            }
            showBorder={false}
          />
        </Block>
        <Block>
          <BlockItem
            title='UID'
            content={
              <View>
                <Input
                  icon={null}
                  label={null}
                  onChange={(val) => {
                    setCurrentUser({
                      ...currentUser,
                      uid: val,
                    });
                  }}
                  inputProps={
                    {
                      // keyboardType: 'number-pad',
                      // autoFocus: true,
                    }
                  }
                />
              </View>
            }
          />
          <BlockItem
            title='Token'
            content={
              <View>
                <Input
                  icon={null}
                  label={null}
                  onChange={(val) => {
                    setCurrentUser({
                      ...currentUser,
                      token: val,
                    });
                  }}
                  inputProps={
                    {
                      // keyboardType: 'number-pad',
                      // autoFocus: true,
                    }
                  }
                />
              </View>
            }
            showBorder={false}
          />
        </Block>

        <Button
          text='登录'
          style={{
            margin: 24,
          }}
          onPress={handleLogin}
          loading={loading}
        />
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({});

export default Login;
