import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function GestureProvider({children}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {children}
    </GestureHandlerRootView>
  );
}