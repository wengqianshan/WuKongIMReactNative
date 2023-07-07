import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import {
  ModalProvider as Provider,
  createModalStack,
} from 'react-native-modalfy';

import ContactAdd from '../../components/modals/ContactAdd';
import GroupAdd from '../../components/modals/GroupAdd';
import Alert from '../../components/modals/Alert';

const modalConfig = { ContactAdd, GroupAdd, Alert };
const animate = (animatedValue, toValue, callback) => {
  Animated.spring(animatedValue, {
    toValue,
    damping: 10,
    mass: 0.35,
    stiffness: 100,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    useNativeDriver: true,
  }).start(() => callback?.());
};
const { width, height } = Dimensions.get('screen');
const defaultOptions = {
  backdropOpacity: 0.8,
  animationIn: animate,
  animationOut: animate,
  transitionOptions: (animatedValue) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0.9],
    }),
    transform: [
      // { perspective: 2000 },
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [height / 1.5, 0, -height / 1.5],
          extrapolate: 'clamp',
        }),
      },
      // {
      //   rotateY: animatedValue.interpolate({
      //     inputRange: [0, 1, 2],
      //     outputRange: ['90deg', '0deg', '-90deg'],
      //     extrapolate: 'clamp',
      //   }),
      // },
      // {
      //   scale: animatedValue.interpolate({
      //     inputRange: [0, 1, 2],
      //     outputRange: [1.2, 1, 0.9],
      //     extrapolate: 'clamp',
      //   }),
      // },
    ],
  }),
  animateInConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 450,
  },
  animateOutConfig: {
    easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
    duration: 450,
  },
};

const stack = createModalStack(modalConfig, defaultOptions);

const ModalProvider = ({ children }) => {
  return <Provider stack={stack}>{children}</Provider>;
};

export default ModalProvider;
