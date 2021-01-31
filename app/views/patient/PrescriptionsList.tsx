import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid, TouchableOpacity, FlatList} from 'react-native';
import PrescriptionModel from '../../api/models/prescription';
import PrescriptionRepository from '../../api/prescriptionRepository';
import apiClient from '../../api/anonymousClient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type PrescriptionListProps = {
  navigation: any;
};

type PrescriptionListState = {
  prescriptions: PrescriptionModel[];
  isFetching: boolean;
  showOutdated: boolean;
};

class PrescriptionsList extends Component<PrescriptionListProps, PrescriptionListState> {
  repo: PrescriptionRepository = new PrescriptionRepository(apiClient);

  constructor(props: PrescriptionListProps) {
    super(props);
    this.state = {
      prescriptions: [],
      isFetching: false,
      showOutdated: false,
    };
    this.repo
      .loadCachedPrescriptions()
      .then((prescriptions) => this.setState({prescriptions}))
      .catch((error) => console.error(`failed to load cached prescriptions: ${error}`));
  }

  loadPrescriptions = () => {
    this.setState({isFetching: true});
    let repo = new PrescriptionRepository(apiClient);
    repo
      .getAllPrescriptions()
      .then((prescriptions) => this.setState({prescriptions, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load prescriptions: ${error}`);
        ToastAndroid.show('Laden der Rezepte fehlgeschlagen!', ToastAndroid.LONG);
        this.setState({isFetching: false});
      });
  };

  componentDidMount() {
    this.loadPrescriptions();
    this.props.navigation.setOptions({
      headerRight: () => (
        <FontAwesome5.Button
          name="archive"
          backgroundColor="#32a852"
          onPress={() => this.setState({showOutdated: !this.state.showOutdated})}
        />
      ),
    });
  }

  _onPrescriptionPress = (prescription: PrescriptionModel) => {
    this.props.navigation.push('PrescriptionScreen', {prescription: prescription});
  };

  render() {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const prescriptionElement = ({item}: {item: PrescriptionModel}) => (
      <TouchableOpacity onPress={() => this._onPrescriptionPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.drug.name}</Text>
          <Text style={styles.details}>
            Ausgestellt am {dateFormat.format(new Date(item.dateOfIssue))} von {item.doctor.firstName}{' '}
            {item.doctor.lastName}
          </Text>
        </View>
      </TouchableOpacity>
    );

    let filteredPrescriptions: PrescriptionModel[];
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    if (!this.state.showOutdated) {
      filteredPrescriptions = this.state.prescriptions.filter(
        (prescription) => new Date(prescription.validUntil) > today,
      );
    } else {
      filteredPrescriptions = this.state.prescriptions.filter(
        (prescription) => new Date(prescription.validUntil) < today,
      );
    }

    return (
      <View style={styles.container}>
        {!this.state.showOutdated && <Text style={styles.info}>Aktuelle</Text>}
        {this.state.showOutdated && <Text style={styles.info}>Eingelößte & Abgelaufene</Text>}
        <FlatList
          style={styles.list}
          data={filteredPrescriptions}
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
  info: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
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