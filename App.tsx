import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {enableScreens} from 'react-native-screens';
import {ApolloProvider} from '@apollo/client';
import client from './src/apollo/client';

enableScreens();

const App = () => {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </SafeAreaProvider>
  );
};

export default App;
