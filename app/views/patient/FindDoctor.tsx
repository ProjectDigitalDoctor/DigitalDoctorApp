import React, {Component} from 'react';
import {TextInput, Button, View, StyleSheet, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';

type FindDoctorProps = {
  navigation: any;
};

class FindDoctor extends Component<FindDoctorProps> {

  constructor(props: FindDoctorProps) {
    super(props);
  }

  state = {
    profession: 'Allgemeinmediziner',
    city: '',
  }

  _goBack = () => this.props.navigation.goBack();

  _onFindDoctorSearch = (profession:any, city:any) => {
    this.props.navigation.push('DoctorList', {profession: profession, city: city});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Picker
            selectedValue={this.state.profession}
            style={{width: '100%'}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({profession: itemValue})
            }>
            <Picker.Item label="Allgemeinmediziner" value="allgemeinmediziner" />
            <Picker.Item label="HNO" value="hno" />
          </Picker>
          <Text style={styles.item}>Suchgebiet</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
            onChangeText={(text) => {this.setState({city:text})}}
            value={this.state.city}
            autoCompleteType = {'postal-code'}
          />
          <Button title="Suche Arzt" onPress={() => this._onFindDoctorSearch(this.state.profession, this.state.city)} />
        </View>
      </View>
    );
  }
}

export default FindDoctor;

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
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 25,
  },
  list: {
    flex: 1,
  },
  item: {
    marginTop: 8,
  },
  title: {
    fontSize: 20,
  },
  details: {
    fontSize: 13,
  },
});