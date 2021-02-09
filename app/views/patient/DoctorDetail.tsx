import React, {Component} from 'react';
import {Button, View, StyleSheet, Text, TextInput, ToastAndroid} from 'react-native';
import {Table, Rows} from 'react-native-table-component';
import AppointmentRepository, {RequestAppointment} from '../../api/appointmentRepository';
import DoctorModel from '../../api/models/doctor';
import PatientRepository from '../../api/patientRepository';

interface DoctorDetailProps {
  navigation: any;
  route: any;
}

interface DoctorDetailState {
  doctor: DoctorModel;
  appointmentDate: string;
  duration: number;
  reason: string;
}

function getJavaTimestamp(date: Date): string {
  // TODO: Figure out why this timezone stuff does not work as expected
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 1);

  const iso = adjustedDate.toISOString();

  const tSplit = iso.split('T');
  return `${tSplit[0]} ${tSplit[1].split('.')[0]}`;
}

class DoctorDetail extends Component<DoctorDetailProps, DoctorDetailState> {
  patientRepo: PatientRepository = new PatientRepository();
  repo: AppointmentRepository = new AppointmentRepository();

  constructor(props: DoctorDetailProps) {
    super(props);
    this.state = {
      doctor: props.route.params.doctor,
      appointmentDate: props.route.params.appointmentDate,
      duration: 30,
      reason: '',
    };
  }

  _bookAppointment = async () => {
    try {
      // TEMPORARY AS APPOINTMENT ENDPOINT IS UNPROTECTED
      // => NEED TO GET CURRENT PATIENT ID AND INCLUDE IT IN THE REQUEST
      const patient = await this.patientRepo.getLoggedInPatient();

      const date = new Date(this.state.appointmentDate);
      const requestAppointment: RequestAppointment = {
        patientID: patient.id!,
        doctorID: this.state.doctor.id,
        reason: this.state.reason,
        timestamp: getJavaTimestamp(date),
        duration: this.state.duration,
      };

      await this.repo.createAppointment(requestAppointment);

      ToastAndroid.show('Termin erfolgreich vereinbart!', ToastAndroid.LONG);
      this.props.navigation.popToTop();
    } catch (error) {
      console.error('failed to create appointment', error);
      ToastAndroid.show('Anlegen des Termins fehlgeschlagen!', ToastAndroid.LONG);
    }
  };

  render() {
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
    const date = new Date(this.state.appointmentDate);
    const address = this.state.doctor.address;

    const tableData = [
      ['Profession:', `${this.state.doctor.profession}`],
      ['Name:', `${(this.state.doctor.lastName, this.state.doctor.firstName)}`],
      ['Adresse:', `${address.street} ${address.houseNumber}, ${address.zipCode} ${address.city}`],
      ['Datum:', `${dateFormat.format(date)}`],
      ['Uhrzeit:', `${timeFormat.format(date)}`],
      ['Dauer: ', `${this.state.duration} Minuten`],
    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.reasonLabel}>Grund für den Termin</Text>
          <TextInput
            style={styles.reasonInput}
            onChangeText={(text) => this.setState({reason: text})}
            value={this.state.reason}
            placeholder={'Bitte einen Grund angeben'}
            underlineColorAndroid={'#32a852'}
          />
          <Table style={styles.table}>
            <Rows data={tableData} textStyle={styles.rowText} style={styles.row} />
          </Table>
          <Button title="Termin vereinbaren" onPress={this._bookAppointment} color="#3083DC" />
        </View>
      </View>
    );
  }
}

export default DoctorDetail;

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
  reasonLabel: {
    fontSize: 18,
  },
  reasonInput: {
    height: 40,
    marginTop: 5,
    marginBottom: 15,
  },
});
