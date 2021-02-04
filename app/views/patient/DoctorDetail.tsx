import React, {Component} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {Table, Rows} from 'react-native-table-component';
import DoctorModel from '../../api/models/doctor';

interface DoctorDetailProps {
  navigation: any;
  route: any;
};

interface DoctorDetailState {
  doctor: DoctorModel;
  appointmentDate: string;
};

class DoctorDetail extends Component<DoctorDetailProps, DoctorDetailState> {

  constructor(props: DoctorDetailProps) {
    super(props);
    this.state = {
      doctor: props.route.params.doctor,
      appointmentDate: props.route.params.appointmentDate,
    }
  }

  _goBack = () => this.props.navigation.goBack();

  render() {
    let address = this.state.doctor.address;
    const tableData = [
      ['Profession:', `${this.state.doctor.profession}`],
      ['Name:', `${this.state.doctor.lastName, this.state.doctor.firstName}`],
      ['Adresse:', `${address.street} ${address.houseNumber}, ${address.zipCode} ${address.city}`],
      ['Termin:', `${this.state.appointmentDate}`],
    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Table style={styles.table}>
            <Rows data={tableData} textStyle={styles.rowText} style={styles.row} />
          </Table>
          <Button title="Termin ausmachen" onPress={() => {}} color="#3083DC" />
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
});
