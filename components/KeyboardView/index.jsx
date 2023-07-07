import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const KeyboardView = (props) => {
  const { children, style, innerStyle, bottom } = props;

  let headerHeight = 0;
  try {
    headerHeight = useHeaderHeight();
  } catch (error) {
    // console.log(error);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container]}
      keyboardVerticalOffset={bottom === undefined ? headerHeight : bottom}
    >
      <View style={[styles.inner, style]}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});

export default KeyboardView;
