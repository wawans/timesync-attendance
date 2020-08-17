/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// Screens
import MainScreen from './src/navigation/MainScreen';
import SettingScreen from './src/navigation/SettingScreen';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRoutename="Main">
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
