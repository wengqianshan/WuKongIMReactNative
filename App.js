import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import { MenuProvider } from 'react-native-popup-menu';

import I18nProvider from './providers/I18n';
import ThemeProvider from './providers/Theme';
import ChatProvider from './providers/Chat';
import AuthProvider from './providers/Auth';
import ModalProvider from './providers/Modal';
import SoundProvider from './providers/Sound';
import Boot from './boot';

const providers = [
  RecoilRoot,
  SafeAreaProvider,
  I18nProvider,
  ThemeProvider,
  ModalProvider,
  MenuProvider,
  AuthProvider,
  SoundProvider,
  ChatProvider,
];
const root = providers.reverse().reduce((child, Parent) => {
  return <Parent children={child} />;
}, <Boot />);

export default function App() {
  return root;
}
