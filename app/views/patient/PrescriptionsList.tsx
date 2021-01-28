import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid, TouchableOpacity, FlatList} from 'react-native';
import PrescriptionModel from '../../api/models/prescription';
import PrescriptionRepository from '../../api/prescriptionRepository';
import apiClient from '../../api/anonymousClient';

type PrescriptionListProps = {
  navigation: any;
};

type PrescriptionListState = {
  prescriptions: PrescriptionModel[];
  isFetching: boolean;
};

class PrescriptionsList extends Component<PrescriptionListProps, PrescriptionListState> {
  constructor(props: PrescriptionListProps) {
    super(props);
    this.state = {
      prescriptions: [],
      isFetching: false,
    };
  }

  loadPrescriptions = () => {
    this.setState({isFetching: true});
    let repo = new PrescriptionRepository(apiClient);
    repo
      .getAllPrescriptions()
      .then((prescriptions) => this.setState({prescriptions, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load prescriptions: ${error}`);
        ToastAndroid.show('Failed to load prescriptions!', ToastAndroid.LONG);
      });
  };

  componentDidMount() {
    this.loadPrescriptions();
  }

  _onPrescriptionPress = (prescription: PrescriptionModel) => {
    this.props.navigation.push('PrescriptionScreen', {prescription: prescription});
  };

  render() {
    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const prescriptionElement = ({item}: {item: PrescriptionModel}) => (
      <TouchableOpacity onPress={() => this._onPrescriptionPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.drug.name}</Text>
          <Text style={styles.details}>
            Issued {dateFormat.format(new Date(item.dateOfIssue))} by {item.doctor.firstName} {item.doctor.lastName}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.prescriptions}
          renderItem={prescriptionElement}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.loadPrescriptions}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}

export default PrescriptionsList;

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
    fontSize: 13,
  },
});
