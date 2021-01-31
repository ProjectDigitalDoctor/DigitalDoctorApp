import React, {Component} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Table, Rows} from 'react-native-table-component';
import 'intl';
import 'intl/locale-data/jsonp/de-DE';
import PrescriptionModel from '../../api/models/prescription';

interface PrescriptionScreenState {
  prescription: PrescriptionModel;
}

interface PrescriptionScreenProps {
  navigation: any;
  route: any; // this.props.route.params.appointmentID;
}

class PrescriptionScreen extends Component<PrescriptionScreenProps, PrescriptionScreenState> {
  constructor(props: PrescriptionScreenProps) {
    super(props);
    this.state = {
      prescription: props.route.params.prescription,
    };
  }

  componentDidMount() {}

  _goBack = () => this.props.navigation.goBack();

  render = () => {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const tableData = [
      ['Ausgestellt am:', `${dateFormat.format(new Date(this.state.prescription.dateOfIssue))}`],
      ['Gültig bis:', `${dateFormat.format(new Date(this.state.prescription.validUntil))}`],
      ['Ausgestellt von:', `${this.state.prescription.doctor.firstName} ${this.state.prescription.doctor.lastName}`],
      ['PZN:', `${this.state.prescription.drug.pzn}`],
      ['Hersteller:', `${this.state.prescription.drug.manufacturer.name}`],
      ['Nebenwirkungen:', `${this.state.prescription.drug.sideEffects}`],
      ['Art der Einnahme:', `${this.state.prescription.drug.usage}`],
      ['Einnahmehäufigkeit:', `${this.state.prescription.usageDescription}`],
      ['', ''],
      ['Eingelöst', 'Nein'],
    ];

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={this._goBack} />
          <Appbar.Content title={this.state.prescription.drug.name} />
        </Appbar.Header>
        <View style={styles.content}>
          <Table style={styles.table}>
            <Rows data={tableData} textStyle={styles.rowText} style={styles.row} />
          </Table>
          <Button title="Redeem now" onPress={() => {}} color="#3083DC" />
        </View>
      </View>
    );
  };
}

export default PrescriptionScreen;

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
