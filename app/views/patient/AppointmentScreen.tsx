import React, {Component} from 'react';
import {Button, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {Table, Rows} from 'react-native-table-component';
import AppointmentModel from '../../api/models/appointment';
import 'intl';
import 'intl/locale-data/jsonp/de-DE';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppointmentRepository from '../../api/appointmentRepository';
import apiClient from '../../api/authenticatedClient';

interface AppointmentScreenState {
  appointment: AppointmentModel;
  now: Date;
}

interface AppointmentScreenProps {
  navigation: any;
  route: any; // this.props.route.params.appointmentID;
}

class AppointmentScreen extends Component<AppointmentScreenProps, AppointmentScreenState> {
  interval!: NodeJS.Timeout;
  repo: AppointmentRepository;

  constructor(props: AppointmentScreenProps) {
    super(props);
    this.state = {
      appointment: props.route.params.appointment,
      now: new Date(),
    };
    this.repo = new AppointmentRepository(apiClient);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.state.appointment.reason,
      headerRight: () => (
        <Icon.Button name="delete" size={25} backgroundColor="#32a852" onPress={this._deleteAppointment} />
      ),
    });
    this.interval = setInterval(() => this.setState({now: new Date()}), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _goBack = () => this.props.navigation.goBack();

  _joinAppointment = () =>
    this.props.navigation.push('AppointmentVideoChatScreen', {appointmentID: this.state.appointment.id});

  _deleteAppointment = () => {
    if (new Date() > new Date(this.state.appointment.timestamp)) {
      ToastAndroid.show('Angefangene oder alte Termin können nicht gelöscht werden!', ToastAndroid.LONG);
      return;
    }

    this.repo
      .deleteAppointment(this.state.appointment.id)
      .then(() => this.props.navigation.navigate('Appointments', {refresh: true}))
      .catch((error) => ToastAndroid.show('Löschen des Termins fehlgeschlagen', ToastAndroid.LONG));
  };

  render = () => {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormat = new Intl.DateTimeFormat('de-DE', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const date = new Date(this.state.appointment.timestamp);

    const tableData = [
      ['Arzt:', `${this.state.appointment.doctor.firstName} ${this.state.appointment.doctor.lastName}`],
      ['Fachgebiet:', `${this.state.appointment.doctor.profession}`],
      ['Datum:', `${dateFormat.format(date)}`],
      ['Uhrzeit:', `${timeFormat.format(date)}`],
      ['Dauer:', `${this.state.appointment.duration} Minuten`],
    ];

    const videoAllowStartDate = new Date(date);
    videoAllowStartDate.setMinutes(videoAllowStartDate.getMinutes() - 10);

    const videoAllowEndDate = new Date(date);
    videoAllowEndDate.setMinutes(videoAllowEndDate.getMinutes() + this.state.appointment.duration + 120);

    return (
      <View style={styles.content}>
        <Table style={styles.table}>
          <Rows data={tableData} textStyle={styles.rowText} style={styles.row} />
        </Table>
        {this.state.now < videoAllowStartDate && (
          <Text style={styles.cantJoinText}>Termin kann erst 10 Minuten früher betreten werden!</Text>
        )}
        {this.state.now > videoAllowEndDate && (
          <Text style={styles.cantJoinText}>Termin ist in der Vergangenheit!</Text>
        )}
        {this.state.now > videoAllowStartDate && this.state.now < videoAllowEndDate && (
          <Button title="Termin beitreten!" onPress={this._joinAppointment} color="#3083DC" />
        )}
      </View>
    );
  };
}

export default AppointmentScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#32a852',
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
  cantJoinText: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 17,
  },
});
