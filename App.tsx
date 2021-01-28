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
import AppointmentVideoChatScreen from './app/views/patient/AppointmentVideoChatScreen';
import AppointmentScreen from './app/views/patient/AppointmentScreen';
import {createStackNavigator} from '@react-navigation/stack';

const RootNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <RootNav.Navigator screenOptions={{headerShown: false}}>
        <RootNav.Screen name="Drawer" component={Drawer} />
        <RootNav.Screen name="AppointmentVideoChatScreen" component={AppointmentVideoChatScreen} />
        <RootNav.Screen name="AppointmentScreen" component={AppointmentScreen} />
      </RootNav.Navigator>
    </NavigationContainer>
  );
};

const Drawer = () => {
  return (
    <DrawerNav.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <DrawerNav.Screen name="TabScreen" component={TabScreen} />
      <DrawerNav.Screen name="Settings" component={Settings} />
    </DrawerNav.Navigator>
  );
};

export default App;
