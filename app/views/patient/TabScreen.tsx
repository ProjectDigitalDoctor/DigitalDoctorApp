import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import FindDoctor from './FindDoctor';
import PrescriptionsList from './PrescriptionsList';
import AppointmentList from './AppointmentList';
import PrescriptionScreen from './PrescriptionScreen';
import AppointmentScreen from './AppointmentScreen';
import AppointmentVideoChatScreen from './AppointmentVideoChatScreen';
import MedicalCertificatesList from './MedicalCertificatesList';
import DoctorDetail from './DoctorDetail';
import DoctorList from './DoctorList';

const FindDoctorStack = createStackNavigator();
const PrescriptionsOverviewStack = createStackNavigator();
const AppointmentsStack = createStackNavigator();
const MedicalCertificatesStack = createStackNavigator();

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
          title: 'Arztsuche',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={33}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
      <FindDoctorStack.Screen
        name="DoctorList"
        component={DoctorList}
        options={{
          title: 'Arztsuche',
          headerLeft: () => (
            <Icon.Button
              name="arrow-back"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
      <FindDoctorStack.Screen
        name="DoctorDetail"
        component={DoctorDetail}
        options={{
          title: 'Arztsuche',
          headerLeft: () => (
            <Icon.Button
              name="arrow-back"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.goBack();
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
          title: 'Rezepte',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={33}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
      <PrescriptionsOverviewStack.Screen name="PrescriptionScreen" component={PrescriptionScreen} />
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
          title: 'Termine',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={33}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
      <AppointmentsStack.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{
          headerLeft: () => (
            <Icon.Button
              name="arrow-back"
              size={25}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
      <AppointmentsStack.Screen
        name="AppointmentVideoChatScreen"
        component={AppointmentVideoChatScreen}
        options={{
          headerShown: false,
        }}
      />
    </AppointmentsStack.Navigator>
  );
};

const MedicalCertificatesListStackView = ({navigation}: {navigation: any}) => {
  return (
    <MedicalCertificatesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#32a852',
        },
        headerTintColor: '#fff',
        headerBackTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <MedicalCertificatesStack.Screen
        name="MedicalCertificates"
        component={MedicalCertificatesList}
        options={{
          title: 'Krankschreibungen',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={33}
              backgroundColor="#32a852"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
        }}
      />
    </MedicalCertificatesStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="AppointmentList"
      backBehavior="none"
      tabBarOptions={{
        activeTintColor: '#32a852',
        inactiveTintColor: '#d3d3d3',
        activeBackgroundColor: '#fff',
        inactiveBackgroundColor: '#fff',
      }}>
      <Tab.Screen
        name="AppointmentList"
        component={AppointmentListStackView}
        options={{
          tabBarLabel: 'Termine',
          tabBarIcon: ({color, size}) => <MaterialIcons name="event" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FindDoctor"
        component={FindDoctorStackView}
        options={{
          tabBarLabel: 'Arztsuche',
          tabBarIcon: ({color, size}) => <Fontisto name="doctor" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PrescriptionsList"
        component={PrescriptionsListStackView}
        options={{
          tabBarLabel: 'Rezepte',
          tabBarIcon: ({color, size}) => <FontAwesome5 name="prescription-bottle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MedicalCertificatesList"
        component={MedicalCertificatesListStackView}
        options={{
          tabBarLabel: 'Krankschreibungen',
          tabBarIcon: ({color, size}) => <FontAwesome5 name="file-medical" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
