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
import InDoctorAppointment from './app/views/patient/InDoctorAppointment';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="TabScreen" component={TabScreen} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen
          name="InDoctorAppointment"
          component={InDoctorAppointment}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
