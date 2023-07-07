import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../providers/Theme';

const Input = (props) => {
  const {
    $ref,
    label = '邮箱',
    type = 'none',
    icon = 'ios-mail',
    style = {},
    inputProps = {},
    inputStyle = {},
    labelStyle = {},
    labelTextStyle,
    hideFocusLabel, // input聚焦时隐藏label
  } = props;

  const [focused, setFocus] = useState(false);
  const [value, setValue] = useState('');

  const theme = useTheme();

  const onFocus = () => {
    setFocus(true);
  };
  const onBlur = () => {
    setFocus(false);
  };
  const onChange = (text) => {
    setValue(text);
    props.onChange && props.onChange(text);
  };

  const active = focused || value.length;

  let Icon = (
    icon ? <Ionicons
      style={styles.icon}
      name={icon}
      size={24}
      color={active ? theme.color.primary : theme.color.text_light}
    /> : null
  );

  const labelColor = active ? theme.color.primary : theme.color.text_light;

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.color.container },
        style,
      ]}
    >
      {(!active || (active && !hideFocusLabel)) && (
        <View
          style={[styles.label, labelStyle, active && styles.labelFocused]}
          pointerEvents='none'
        >
          <Text
            style={[
              styles.labelText,
              labelTextStyle,
              active && styles.labelTextFocused,
              { color: labelColor },
            ]}
          >
            {label}
          </Text>
        </View>
      )}

      <View style={styles.input}>
        <TextInput
          ref={$ref}
          style={{
            ...styles.inputArea,
            color: theme.color.text,
            ...inputStyle,
          }}
          textContentType={type}
          secureTextEntry={type === 'password' ? true : false}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChange}
          spellCheck={false}
          autoCapitalize='none'
          keyboardAppearance={theme.color.isDarkBackground ? "dark": "light"}
          {...inputProps}
        />
        {Icon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    // borderBottomColor: '#2C2C2E',
    borderBottomWidth: 1,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    height: '100%',
    top: 0,
    zIndex: 1,
    justifyContent: 'center',
  },
  labelFocused: {
    height: 20,
    top: -20,
  },
  labelText: {
    fontSize: 17,
    // color: '#fff',
  },
  labelTextFocused: {
    fontSize: 11,
    // color: '#D0FD3E',
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputArea: {
    flex: 1,
    height: '100%',
    fontSize: 20,
    fontWeight: '500',
    // color: '#fff',
    marginVertical: 16,
  },
  icon: {
    marginLeft: 12,
  },
});

export default Input;
