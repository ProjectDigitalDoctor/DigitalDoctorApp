import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import AppointmentModel from '../../api/models/appointment';

interface AppointmentScreenState {
  appointment: AppointmentModel;
}

interface AppointmentScreenProps {
  navigation: any;
  route: any; // this.props.route.params.appointmentID;
}

class AppointmentScreen extends Component<AppointmentScreenProps, AppointmentScreenState> {
  constructor(props: AppointmentScreenProps) {
    super(props);
    this.state = {
      appointment: props.route.params.appointment,
    };
  }

  componentDidMount() {}

  _goBack = () => this.props.navigation.goBack();

  _joinAppointment = () =>
    this.props.navigation.navigate('AppointmentVideoChatScreen', {appointmentID: this.state.appointment.id});

  render = () => {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={this._goBack} />
          <Appbar.Content title={this.state.appointment.reason} />
        </Appbar.Header>
        <View style={styles.content}>
          <Button title="Join Appointment!" onPress={this._joinAppointment} />
        </View>
      </View>
    );
  };
}

export default AppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
