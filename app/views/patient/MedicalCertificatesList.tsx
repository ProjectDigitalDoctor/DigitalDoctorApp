import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid, TouchableOpacity, FlatList} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MedicalCertificateModel from '../../api/models/medicalCertificate';
import MedicalCertificateRepository from '../../api/medicalCertificateRepository';

type MedicalCertificatesListProps = {
  navigation: any;
  route: any;
};

type MedicalCertificatesListState = {
  certificates: MedicalCertificateModel[];
  selectedCertificate?: MedicalCertificateModel;
  isFetching: boolean;
  showOutdated: boolean;
};

class MedicalCertificatesList extends Component<MedicalCertificatesListProps, MedicalCertificatesListState> {
  repo: MedicalCertificateRepository = new MedicalCertificateRepository();

  constructor(props: MedicalCertificatesListProps) {
    super(props);
    this.state = {
      certificates: [],
      isFetching: false,
      showOutdated: false,
    };
    this.repo
      .loadCachedMedicalCertificates()
      .then((certificates) => this.setState({certificates}))
      .catch((error) => console.error(`failed to load cached certitificates: ${error}`));
  }

  loadCertificates = () => {
    this.setState({isFetching: true});
    this.repo
      .getAllMedicalCertificates()
      .then((certificates) => this.setState({certificates, isFetching: false}))
      .catch((error) => {
        console.error(`failed to load certificates: ${error}`);
        ToastAndroid.show('Laden der Krankschreibungen fehlgeschlagen!', ToastAndroid.LONG);
        this.setState({isFetching: false});
      });
  };

  componentDidMount() {
    this.loadCertificates();
    this.props.navigation.setOptions({
      headerRight: () => (
        <FontAwesome5.Button
          name="archive"
          backgroundColor="#32a852"
          onPress={() => this.setState({showOutdated: !this.state.showOutdated, selectedCertificate: undefined})}
        />
      ),
    });
  }

  _onCertificatePress = (certificate: MedicalCertificateModel) => {
    this.setState({selectedCertificate: certificate});
  };

  render() {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let filteredCertificates: MedicalCertificateModel[];
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    if (!this.state.showOutdated) {
      filteredCertificates = this.state.certificates.filter((certificate) => new Date(certificate.validUntil) > today);
    } else {
      filteredCertificates = this.state.certificates.filter((certificate) => new Date(certificate.validUntil) < today);
    }
    filteredCertificates.sort((a, b) => Date.parse(b.validUntil) - Date.parse(a.validUntil));

    let selectedCertificate = this.state.selectedCertificate;
    if (!selectedCertificate && filteredCertificates.length > 0) {
      selectedCertificate = filteredCertificates[0];
    }

    const certificateElement = ({item}: {item: MedicalCertificateModel}) => (
      <TouchableOpacity onPress={() => this._onCertificatePress(item)}>
        <View style={item.id === selectedCertificate?.id ? styles.selectedItem : styles.item}>
          <Text style={styles.title}>Gültig bis {dateFormat.format(new Date(item.validUntil))}</Text>
          <Text style={styles.details}>
            Ausgestellt von {item.doctor.firstName} {item.doctor.lastName}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        {selectedCertificate && (
          <View style={styles.certBox}>
            <Text>{selectedCertificate.reason}</Text>
            <Text>
              - {selectedCertificate.doctor.firstName} {selectedCertificate.doctor.lastName} (
              {dateFormat.format(new Date(selectedCertificate.dateOfIssue))})
            </Text>
          </View>
        )}
        {!this.state.showOutdated && <Text style={styles.header}>Aktuelle</Text>}
        {this.state.showOutdated && <Text style={styles.header}>Abgelaufene</Text>}
        {filteredCertificates.length === 0 && <Text style={styles.info}>Keine Krankschreibungen gefunden.</Text>}
        <FlatList
          style={styles.list}
          data={filteredCertificates}
          renderItem={certificateElement}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.loadCertificates}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}

export default MedicalCertificatesList;

const styles = StyleSheet.create({
  header: {
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
  selectedItem: {
    backgroundColor: 'lightblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  details: {
    fontSize: 12,
  },
  certBox: {
    flex: 1,
    flexGrow: 0.3,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f2ead3',
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 2,
    padding: 20,
  },
  info: {
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 10,
  },
});
