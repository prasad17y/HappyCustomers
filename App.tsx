import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import client from './src/apollo/client';
import {store, persistor} from './src/redux/store';
import Toast from 'react-native-toast-message';
import {DevSettings, LogBox, NativeModules} from 'react-native';
import GlobalToastManager from './src/components/organisms/GlobalToastManager';

if (DevSettings && NativeModules?.DevSettings?.setIsDebuggingRemotely) {
  DevSettings.addMenuItem('Debug JS Remotely', () => {
    try {
      NativeModules?.DevSettings?.setIsDebuggingRemotely(true);
    } catch (error) {
      console.warn('Failed to enable remote debugging:', error);
    }
  });
}

LogBox.ignoreLogs(['go.apollo.dev']);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ApolloProvider client={client}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ApolloProvider>
        </SafeAreaProvider>
      </PersistGate>
      <GlobalToastManager />
      <Toast />
    </Provider>
  );
};

export default App;
