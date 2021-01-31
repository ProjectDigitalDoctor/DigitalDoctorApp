import React, {Component} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Table, Rows} from 'react-native-table-component';
import AppointmentModel from '../../api/models/appointment';
import 'intl';
import 'intl/locale-data/jsonp/en-GB';

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

  componentDidMount() {
    this.props.navigation.setOptions({title: this.state.appointment.reason});
  }

  _goBack = () => this.props.navigation.goBack();

  _joinAppointment = () =>
    this.props.navigation.push('AppointmentVideoChatScreen', {appointmentID: this.state.appointment.id});

  render = () => {
    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormat = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const date = new Date(this.state.appointment.timestamp);

    const tableData = [
      ['Doctor:', `${this.state.appointment.doctor.firstName} ${this.state.appointment.doctor.lastName}`],
      ['Profession:', `${this.state.appointment.doctor.profession}`],
      ['Date:', `${dateFormat.format(date)}`],
      ['Time:', `${timeFormat.format(date)}`],
      ['Duration:', `${this.state.appointment.duration} minutes`],
    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Table style={styles.table}>
            <Rows data={tableData} textStyle={styles.rowText} style={styles.row} />
          </Table>
          <Button title="Join Appointment!" onPress={this._joinAppointment} color="#3083DC" />
        </View>
      </View>
    );
  };
}

export default AppointmentScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#32a852',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 25,
  },
  table: {
    marginBottom: 30,
  },
  row: {
    marginBottom: 5,
  },
  rowText: {
    fontSize: 18,
  },
});
