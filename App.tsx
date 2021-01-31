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
import Settings from './app/views/patient/Settings';

const DrawerNav = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNav.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <DrawerNav.Screen name="TabScreen" component={TabScreen} />
        <DrawerNav.Screen name="Settings" component={Settings} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

export default App;
