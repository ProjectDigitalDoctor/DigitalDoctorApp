import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const Appointments = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>Appointments</Text>
      <Button
        title="Enter appointment"
        onPress={() => navigation.navigate('InDoctorAppointment')}
      />
    </View>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
