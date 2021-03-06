import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import DoctorRepository from '../../api/doctorRepository';
import DoctorModel from '../../api/models/doctor';

interface DoctorListProps {
  navigation: any;
  route: any;
}

interface DoctorListState {
  doctors: DoctorModel[];
  isFetching: boolean;
  profession: string;
  city: string;
  appointmentDate: string;
}

class DoctorList extends Component<DoctorListProps, DoctorListState> {
  constructor(props: DoctorListProps) {
    super(props);
    this.state = {
      doctors: [],
      isFetching: false,
      profession: props.route.params.profession,
      city: props.route.params.city,
      appointmentDate: props.route.params.appointmentDate,
    };
  }

  loadDoctors = () => {
    this.setState({isFetching: true});
    let repo = new DoctorRepository();
    let filteredDoctors: DoctorModel[];
    repo
      .getAllDoctors()
      .then((doctors) => {
        filteredDoctors = doctors.filter(
          (doctor) =>
            doctor.profession.toUpperCase() === this.state.profession.toUpperCase() &&
            doctor.address.city.toUpperCase() === this.state.city.toUpperCase(),
        );
        this.setState({doctors: filteredDoctors, isFetching: false});
      })
      .catch((error) => {
        console.error(`failed to load doctors: ${error}`);
        ToastAndroid.show('Failed to load doctors!', ToastAndroid.LONG);
      });
  };

  componentDidMount() {
    this.loadDoctors();
  }

  _onDoctorPress = (doctor: DoctorModel) => {
    this.props.navigation.push('DoctorDetail', {doctor: doctor, appointmentDate: this.state.appointmentDate});
  };

  render() {
    const doctorElement = ({item}: {item: DoctorModel}) => (
      <TouchableOpacity onPress={() => this._onDoctorPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.details}>{item.profession}</Text>
          <Text style={styles.details}>
            {item.address.street} {item.address.houseNumber} , {item.address.zipCode} {item.address.city}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        {this.state.doctors.length === 0 && <Text style={styles.info}>Keine passenden Ärzte gefunden.</Text>}
        <FlatList
          style={styles.list}
          data={this.state.doctors}
          renderItem={doctorElement}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.loadDoctors}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}

export default DoctorList;

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
  info: {
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 10,
  },
});
