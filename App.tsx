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
import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import TabScreen from './screens/TabScreen';
import DrawerContent from './screens/DrawerContent';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent/>}>
        <Drawer.Screen name="Home" component={TabScreen} />
        {/*<Drawer.Screen name="Details" component={DetailsStackScreen} />*/}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
