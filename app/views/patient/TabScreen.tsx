import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './Home';
import FindDoctor from './FindDoctor';
import PrescriptionsList from './PrescriptionsList';
import AppointmentList from './AppointmentList';

const HomeStack = createStackNavigator();
const FindDoctorStack = createStackNavigator();
const PrescriptionsOverviewStack = createStackNavigator();
const AppointmentsStack = createStackNavigator();

const HomeStackView = ({navigation}: {navigation: any}) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const FindDoctorStackView = ({navigation}: {navigation: any}) => {
  return (
    <FindDoctorStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <FindDoctorStack.Screen
        name="FindDoctor"
        component={FindDoctor}
        options={{
          title: 'FindDoctor',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
    </FindDoctorStack.Navigator>
  );
};

const PrescriptionsListStackView = ({navigation}: {navigation: any}) => {
  return (
    <PrescriptionsOverviewStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <PrescriptionsOverviewStack.Screen
        name="Prescriptions"
        component={PrescriptionsList}
        options={{
          title: 'Prescriptions',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
    </PrescriptionsOverviewStack.Navigator>
  );
};

const AppointmentListStackView = ({navigation}: {navigation: any}) => {
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <AppointmentsStack.Screen
        name="Appointments"
        component={AppointmentList}
        options={{
          title: 'Appointments',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
    </AppointmentsStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#32a852',
        inactiveTintColor: '#d3d3d3',
        activeBackgroundColor: '#fff',
        inactiveBackgroundColor: '#fff',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackView}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FindDoctor"
        component={FindDoctorStackView}
        options={{
          tabBarLabel: 'Doctors',
          tabBarIcon: ({color, size}) => <Fontisto name="doctor" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PrescriptionsList"
        component={PrescriptionsListStackView}
        options={{
          tabBarLabel: 'Prescriptions',
          tabBarIcon: ({color, size}) => <FontAwesome5 name="prescription-bottle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AppointmentList"
        component={AppointmentListStackView}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: ({color, size}) => <MaterialIcons name="event" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
