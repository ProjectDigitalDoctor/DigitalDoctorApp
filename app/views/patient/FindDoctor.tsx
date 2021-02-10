import React, {Component} from 'react';
import {TextInput, Button, View, StyleSheet, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

type FindDoctorProps = {
  navigation: any;
};

function roundTimeQuarterHour(time: Date): Date {
  var timeToReturn = new Date(time);

  timeToReturn.setMilliseconds(Math.ceil(timeToReturn.getMilliseconds() / 1000) * 1000);
  timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15);

  return timeToReturn;
}

class FindDoctor extends Component<FindDoctorProps> {
  constructor(props: FindDoctorProps) {
    super(props);
  }

  state = {
    profession: 'Allgemeinmediziner',
    city: '',
    citySearchIsFocused: false,
    appointmentDate: new Date(),
  };

  _goBack = () => this.props.navigation.goBack();

  _onFindDoctorSearch = (profession: string, city: string, appointmentDate: String) => {
    this.props.navigation.push('DoctorList', {profession: profession, city: city, appointmentDate: appointmentDate});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Picker
            selectedValue={this.state.profession}
            style={{width: '100%'}}
            onValueChange={(itemValue) => this.setState({profession: itemValue})}>
            <Picker.Item label="Allgemeinmediziner" value="allgemeinmediziner" />
            <Picker.Item label="HNO" value="hno" />
          </Picker>
          <Text style={styles.item}>Suchgebiet (Stadt/Dorf)</Text>
          <TextInput
            style={{height: 40, marginVertical: 10}}
            placeholder={'z.B.: Hintertupfingen oder Mühlheim'}
            onChangeText={(text) => {
              this.setState({city: text});
            }}
            value={this.state.city}
            autoCompleteType={'postal-code'}
            textContentType={'addressCity'}
            underlineColorAndroid={'#32a852'}
          />
          <DatePicker
            date={this.state.appointmentDate}
            onDateChange={(date) => this.setState({appointmentDate: date})}
            androidVariant="nativeAndroid"
            locale="de-DE"
            is24hourSource="locale"
          />
          <Button
            title="Suche Arzt"
            onPress={() =>
              this._onFindDoctorSearch(
                this.state.profession,
                this.state.city,
                roundTimeQuarterHour(this.state.appointmentDate).toISOString(),
              )
            }
          />
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
