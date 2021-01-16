import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const InDoctorAppointment = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>In Doctor Appointment</Text>
    </View>
  );
};

export default InDoctorAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
