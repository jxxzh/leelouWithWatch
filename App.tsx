/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { sendMessage, watchEvents, getIsPaired, getIsWatchAppInstalled } from 'react-native-watch-connectivity';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isPaired, setIsPaired] = useState(false);
  const [isWatchAppInstalled, setIsWatchAppInstalled] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    const init = async () => {
      const isPair = await getIsPaired();
      const isWatchAppInstall = await getIsWatchAppInstalled();

      setIsPaired(isPair);
      setIsWatchAppInstalled(isWatchAppInstall);
    };
    init();
    const unsubscribe = watchEvents.on('message', (e) => {
      console.log(e);
      Alert.alert('Message Received', `Action: ${e.action} \nData: ${JSON.stringify(e.data)}`);
      switch (e.action) {
        case 'login':
          handleLogin();
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function handleLogin() {
    sendMessage({
      action: 'logged',
      data: {
        user: {
          userId: '123',
        },
        emergencyContacts: ['17261169754'],
      },
    });
  }

  function handleLogout() {
    sendMessage({
      action: 'logout',
    });
  }

  function triggerSOS() {
    sendMessage({
      action: 'trigger_sos',
      data: 140.0,
    });
  }

  function getHistory() {
    sendMessage({
      action: 'get_history',
    });
  }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 100,
        }}>
          <Text>Is Paired: {isPaired ? 'Yes' : 'No'}</Text>
          <Text>Is Watch App Installed: {isWatchAppInstalled ? 'Yes' : 'No'}</Text>
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'blue',
              borderRadius: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={getHistory}
          >
            <Text>Get History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'green',
              borderRadius: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleLogin}
          >
            <Text>Send Logged Msg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'yellow',
              borderRadius: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleLogout}
          >
            <Text>Send Logout Msg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'red',
              borderRadius: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={triggerSOS}
          >
            <Text>Trigger SOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default App;
