import React, {Component} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Table, Rows} from 'react-native-table-component';
import 'intl';
import 'intl/locale-data/jsonp/en-GB';
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
    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const tableData = [
      ['Issued On:', `${dateFormat.format(new Date(this.state.prescription.dateOfIssue))}`],
      ['Valid Until:', `${dateFormat.format(new Date(this.state.prescription.validUntil))}`],
      ['Issued By:', `${this.state.prescription.doctor.firstName} ${this.state.prescription.doctor.lastName}`],
      ['PZN:', `${this.state.prescription.drug.pzn}`],
      ['Manufacturer:', `${this.state.prescription.drug.manufacturer.name}`],
      ['Side Effects:', `${this.state.prescription.drug.sideEffects}`],
      ['Usage:', `${this.state.prescription.drug.usage}`],
      ['Usage Description:', `${this.state.prescription.usageDescription}`],
      ['', ''],
      ['Redeemend', 'No'],
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
