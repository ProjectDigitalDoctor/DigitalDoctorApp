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
import {NavigationContainer} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import TabScreen from './app/views/patient/TabScreen';
import DrawerContent from './app/views/patient/DrawerContent';
import StartScreen from './app/views/patient/StartScreen';
import LoginScreen from './app/views/patient/LoginScreen';
import SettingsScreen from './app/views/patient/SettingsScreen';
import RegisterScreen from './app/views/patient/RegisterScreen';

const DrawerNav = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNav.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="Start">
        <DrawerNav.Screen name="Start" component={StartScreen} />
        <DrawerNav.Screen name="Login" component={LoginScreen} />
        <DrawerNav.Screen name="Register" component={RegisterScreen} />
        <DrawerNav.Screen name="Settings" component={SettingsScreen} />
        <DrawerNav.Screen name="TabScreen" component={TabScreen} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

export default App;
