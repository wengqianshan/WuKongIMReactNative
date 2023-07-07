import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

const prefix = Linking.createURL('/');

export default {
  prefixes: [prefix],
  config: {
    initialRouteName: 'Home',
    screens: {
      About: 'about',
      Home: {
        path: 'home',
        screens: {
          HomeIndex: 'index',
          HomeContact: 'contact',
          HomeGroup: 'group',
          HomeSetting: 'setting',
        },
      },
      Chat: 'chat',
      WebPage: {
        path: ':url',
        parse: {
          url: (v) => {
            const url = decodeURIComponent(v);
            const reg = new RegExp(
              '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
              'i'
            );
            if (!reg.test(url)) {
              return 'https://fanka.fuhaojianshen.com/';
            }
            return url;
          },
        },
      },
    },
  },
  // https://docs.expo.dev/versions/latest/sdk/notifications/#handling-push-notifications-with-react-navigation
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    const $url = response?.notification?.request?.content?.data?.url;

    return $url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSub = Linking.addEventListener('url', onReceiveURL);

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response?.notification?.request?.content?.data?.url;

        // Any custom logic to see whether the URL needs to be handled
        // console.log(url, 'linking subscribe ////////');

        // Let React Navigation handle the URL
        listener(url);
      }
    );

    return () => {
      // Clean up the event listeners
      // Linking.removeEventListener('url', onReceiveURL);
      linkingSub.remove();
      subscription.remove();
    };
  },
};
