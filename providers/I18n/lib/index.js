import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '../translations/en.json';
import zhCN from '../translations/zh-CN.json';
import ja from '../translations/ja.json';

const translations = {
  ...zhCN,
  ...en,
  ...ja,
};
const i18n = new I18n(translations);

let defaultLocale = 'en';

if (/^zh/.test(Localization.locale)) {
  defaultLocale = 'zh-CN';
}

i18n.defaultLocale = defaultLocale;

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;
