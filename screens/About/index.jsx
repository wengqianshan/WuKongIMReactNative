import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Page from '../../components/Page';
import { useTheme } from '../../providers/Theme';
import { appInfo } from '../../scripts/utils';
import icon from '../../assets/icon.png';

const { name, version, buildVersion } = appInfo();

const About = ({ navigation }) => {
  const theme = useTheme();
  useEffect(() => {
    navigation.setOptions({
      title: '关于',
    });
    return () => {};
  }, []);
  return (
    <Page>
      <View style={styles.body}>
        <View style={styles.info}>
          <Image style={styles.icon} source={icon} />
          <Text style={{ ...styles.name, color: theme.color.text }}>
            {name}
          </Text>
          <Text style={{ ...styles.text, color: theme.color.text_light }}>
            版本: {version}({buildVersion})
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </Page>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 16,
  },
  name: {
    fontSize: 16,
  },
  text: {
    marginTop: 4,
  },
});

export default About;
