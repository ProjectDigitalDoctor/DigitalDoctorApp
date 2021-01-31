import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import AppointmentRepository from '../../api/appointmentRepository';
import AppointmentModel from '../../api/models/appointment';
import apiClient from '../../api/anonymousClient';

type AppointmentListProps = {
  navigation: any;
};

type AppointmentListState = {
  appointments: AppointmentModel[];
  isFetching: boolean;
};

class AppointmentList extends Component<AppointmentListProps, AppointmentListState> {
  repo: AppointmentRepository = new AppointmentRepository(apiClient);

  constructor(props: AppointmentListProps) {
    super(props);
    this.state = {
      appointments: [],
      isFetching: false,
    };
    this.repo
      .loadCachedAppointments()
      .then((appointments) => this.setState({appointments}))
      .catch((error) => console.error(`failed to load cached appointments: ${error}`));
  }

  loadAppointments = () => {
    this.setState({isFetching: true});
    this.repo
      .getAllAppointments()
      .then((appointments) => this.setState({appointments, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load appointments: ${error}`);
        ToastAndroid.show('Laden der Termine fehlgeschlagen!', ToastAndroid.LONG);
        this.setState({isFetching: false});
      });
  };

  componentDidMount() {
    this.loadAppointments();
  }

  _onAppointmentPress = (appointment: AppointmentModel) => {
    this.props.navigation.push('AppointmentScreen', {appointment: appointment});
  };

  render() {
    const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const appointmentElement = ({item}: {item: AppointmentModel}) => (
      <TouchableOpacity onPress={() => this._onAppointmentPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.reason}</Text>
          <Text style={styles.details}>{dateTimeFormat.format(new Date(item.timestamp))}</Text>
          <Text style={styles.details}>
            {item.doctor.firstName} {item.doctor.lastName} ({item.doctor.profession})
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

export default AppointmentList;

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
    fontSize: 14,
  },
});
