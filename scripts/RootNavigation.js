// RootNavigation.js

import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function reset(params) {
  if (navigationRef.isReady()) {
    navigationRef.reset(params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

// add other navigation functions that you need and export them

/**
 * useage
 *
 // any js module
import * as RootNavigation from './path/to/RootNavigation.js';

// ...

RootNavigation.navigate('ChatScreen', { userName: 'Lucy' });
 */
