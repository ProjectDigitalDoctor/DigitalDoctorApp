import React, {Component} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid, ToastAndroid} from 'react-native';

const requestPermission = async (): Promise<boolean> => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);
  if (granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED) {
    console.log("Requesting permissions successful")
    return true;
  } else {
    console.log("Requesting permissions failed")
    return false;
  }
};

type InDoctorAppointmentState = {
  hasPermissions: boolean;
  navigation: any;
};

class InDoctorAppointment extends Component<{}, InDoctorAppointmentState> {
  componentDidMount() {
    requestPermission().then((gotPermission) => {
      if (gotPermission) {
        this.setState({
          hasPermissions: true
        });
      } else {
        ToastAndroid.show("Permissions required for appointment!", ToastAndroid.LONG);
        this.state.navigation.goBack();
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>In Doctor Appointment</Text>
      </View>
    );
  }
}

export default InDoctorAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
