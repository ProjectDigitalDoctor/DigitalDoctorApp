import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import AppointmentRepository from '../../api/appointmentRepository';
import AppointmentModel from '../../api/models/appointment';
import apiClient from '../../api/anonymousClient';

type AppointmentsProps = {
  navigation: any;
};

type AppointmentsState = {
  appointments: AppointmentModel[];
  isFetching: boolean;
};

class Appointments extends Component<AppointmentsProps, AppointmentsState> {
  constructor(props: AppointmentsProps) {
    super(props);
    this.state = {
      appointments: [],
      isFetching: false,
    };
  }

  loadAppointments = () => {
    this.setState({isFetching: true});
    let repo = new AppointmentRepository(apiClient);
    repo
      .getAllAppointments()
      .then((appointments) => this.setState({appointments, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load appointments: ${error}`);
        ToastAndroid.show('Failed to load appointments!', ToastAndroid.LONG);
      });
  };

  componentDidMount() {
    this.loadAppointments();
  }

  _onAppointmentPress = (appointment: AppointmentModel) => {
    this.props.navigation.navigate('InDoctorAppointment', {appointmentID: appointment.id});
  };

  render() {
    const appointmentElement = ({item}: {item: AppointmentModel}) => (
      <TouchableOpacity onPress={() => this._onAppointmentPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.reason}</Text>
          <Text style={styles.details}>{item.timestamp}</Text>
          <Text>
            with {item.doctor.firstName} {item.doctor.lastName} ({item.doctor.profession})
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.appointments}
          renderItem={appointmentElement}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.loadAppointments}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}

export default Appointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: 'lightgray',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  details: {
    fontSize: 15,
  },
});
