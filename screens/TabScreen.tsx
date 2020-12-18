import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#32a852',
        inactiveTintColor: '#d3d3d3',
        activeBackgroundColor:'#fff',
        inactiveBackgroundColor:'#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Detail',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DetailsB"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'DetailB',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabScreen;

const HomeStackScreen = ({navigation}: {navigation: any}) => {
  return (
    <HomeStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold'
        }
      }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
          title:'Overview',
          headerLeft: () => (
            <Icon.Button name="ios-menu" size = {25} 
            backgroundColor="#32a852" onPress={() => {navigation.openDrawer()}} ></Icon.Button>
          )
      }} />
    </HomeStack.Navigator>
  )
};

const DetailsStackScreen = ({navigation}: {navigation: any}) => {
  return (
    <DetailsStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852'
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold'
        }
      }}>
      <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
        title:'Details',
        headerLeft: () => (
          <Icon.Button name="ios-menu" size = {25} 
          backgroundColor="#32a852" onPress={() => {navigation.openDrawer()}} ></Icon.Button>
        )
      }} />
    </DetailsStack.Navigator>
  )
};