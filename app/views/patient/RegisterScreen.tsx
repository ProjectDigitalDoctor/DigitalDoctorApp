import React from 'react';
import {View, Text, StyleSheet, Image, Button, ToastAndroid} from 'react-native';
import {ScrollView, TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {login} from '../../api/client';
import PatientModel from '../../api/models/patient';
import PatientRepository from '../../api/patientRepository';

const RegisterScreen = ({navigation}: {navigation: any}) => {
  const rep: PatientRepository = new PatientRepository(true);

  const [firstName, onChangeFirstName] = React.useState('Sarah');
  const [lastName, onChangeLastName] = React.useState('Müller');
  const [username, onChangeUsername] = React.useState('sarah.mueller');
  const [password, onChangePassword] = React.useState('password123');
  const [homeStreet, onChangeHomeStreet] = React.useState('Prager Str.');
  const [homeHouseNumber, onChangeHomeHouseNumber] = React.useState('77');
  const [homeZipCode, onChangeHomeZipCode] = React.useState('82247');
  const [homeCity, onChangeHomeCity] = React.useState('Fürstenfeldbruck');
  const [workName, onChangeWorkName] = React.useState('Realty Depot');
  const [workMail, onChangeWorkMail] = React.useState('info@realty-depot.de');
  const [insuranceNumber, onChangeInsuranceNumber] = React.useState('AOK');
  const [insuranceName, onChangeInsuranceName] = React.useState('2184382332');

  const onLogin = async () => {
    navigation.navigate('Login');
  };

  const onRegister = async () => {
    const newPatient: PatientModel = {
      firstName,
      lastName,
      username,
      password,
      address: {
        street: homeStreet,
        houseNumber: homeHouseNumber,
        zipCode: homeZipCode,
        city: homeCity,
      },
      workplace: {
        name: workName,
        mailAddress: workMail,
      },
      insuranceCard: {
        insuranceNumber,
        insurance: {
          name: insuranceName,
        },
      },
    };

    try {
      await rep.registerPatient(newPatient);
      const res = await login({username, password});
      if (res) {
        navigation.reset({
          index: 0,
          routes: [{name: 'TabScreen'}],
        });
      } else {
        ToastAndroid.show('Login nach Registrierung fehlgeschlagen!', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Failed to regiter new patient: ', error);
      ToastAndroid.show('Registrierung fehlgeschlagen!', ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
      <Text style={styles.header}>DigitalDoctor Registrierung</Text>
      <Text style={styles.sectionHeader}>Persönliche Daten</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeFirstName}
        value={firstName}
        autoCompleteType={'name'}
        autoCapitalize={'none'}
        textContentType={'givenName'}
        placeholder={'Vorname'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeLastName}
        value={lastName}
        autoCompleteType={'name'}
        autoCapitalize={'none'}
        textContentType={'familyName'}
        placeholder={'Nachname'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        autoCompleteType={'username'}
        autoCapitalize={'none'}
        textContentType={'username'}
        placeholder={'Nutzername'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        autoCompleteType={'password'}
        textContentType={'password'}
        secureTextEntry={true}
        placeholder={'Passwort'}
        underlineColorAndroid={'#32a852'}
      />
      <Text style={styles.sectionHeader}>Adresse</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.rowInputLarge}
          onChangeText={onChangeHomeStreet}
          value={homeStreet}
          autoCompleteType={'street-address'}
          autoCapitalize={'none'}
          textContentType={'streetAddressLine1'}
          placeholder={'Straße'}
          underlineColorAndroid={'#32a852'}
        />
        <TextInput
          style={styles.rowInputSmall}
          onChangeText={onChangeHomeHouseNumber}
          value={homeHouseNumber}
          autoCapitalize={'none'}
          placeholder={'Nr.'}
          underlineColorAndroid={'#32a852'}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.rowInputMedium}
          onChangeText={onChangeHomeZipCode}
          value={homeZipCode}
          autoCompleteType={'postal-code'}
          autoCapitalize={'none'}
          textContentType={'postalCode'}
          placeholder={'PLZ'}
          underlineColorAndroid={'#32a852'}
        />
        <TextInput
          style={styles.rowInputMediumLarge}
          onChangeText={onChangeHomeCity}
          value={homeCity}
          autoCapitalize={'none'}
          textContentType={'addressCity'}
          placeholder={'Stadt'}
          underlineColorAndroid={'#32a852'}
        />
      </View>
      <Text style={styles.sectionHeader}>Arbeitgeber</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeWorkName}
        value={workName}
        autoCapitalize={'none'}
        placeholder={'Name'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeWorkMail}
        value={workMail}
        autoCompleteType={'email'}
        textContentType={'emailAddress'}
        placeholder={'Email Adresse'}
        underlineColorAndroid={'#32a852'}
      />
      <Text style={styles.sectionHeader}>Versicherung</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeInsuranceName}
        value={insuranceName}
        autoCapitalize={'none'}
        placeholder={'Name'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeInsuranceNumber}
        value={insuranceNumber}
        placeholder={'Versicherungsnummer'}
        underlineColorAndroid={'#32a852'}
      />
      <View style={styles.buttonView}>
        <Button title="Registrieren" onPress={onRegister} color="#3083DC" />
      </View>
      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.register}>Jetzt Einloggen!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32a852',
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 90,
  },
  input: {
    height: 45,
    width: 300,
  },
  buttonView: {
    marginTop: 20,
    width: 150,
  },
  register: {
    marginTop: 30,
    color: '#3083DC',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    maxHeight: 45,
    width: 300,
  },
  rowInputLarge: {
    width: 250,
    height: 45,
  },
  rowInputSmall: {
    width: 50,
    height: 45,
  },
  rowInputMedium: {
    width: 100,
    height: 45,
  },
  rowInputMediumLarge: {
    width: 200,
    height: 45,
  },
  sectionHeader: {
    fontSize: 12,
    width: 310,
    marginBottom: -5,
    color: '#4f5250',
  },
});
