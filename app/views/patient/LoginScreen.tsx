import React from 'react';
import {View, Text, StyleSheet, Image, Button, ToastAndroid} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {login} from '../../api/client';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [username, onChangeUsername] = React.useState('hubertus.maier');
  const [password, onChangePassword] = React.useState('password123');

  const onLogin = async () => {
    const res = await login({username, password});
    if (res) {
      navigation.navigate('TabScreen');
    } else {
      ToastAndroid.show('Login fehlgeschlagen!', ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
      <Text style={styles.header}>DigitalDoctor Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeUsername(text)}
        value={username}
        autoCompleteType={'username'}
        autoCapitalize={'none'}
        textContentType={'username'}
        placeholder={'Nutzername'}
        underlineColorAndroid={'#32a852'}
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangePassword(text)}
        value={password}
        autoCompleteType={'password'}
        textContentType={'password'}
        secureTextEntry={true}
        placeholder={'Passwort'}
        underlineColorAndroid={'#32a852'}
      />
      <View style={styles.buttonView}>
        <Button title="Login" onPress={onLogin} color="#3083DC" />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32a852',
  },
  logo: {
    width: 150,
    height: 150,
  },
  input: {
    marginTop: 20,
    height: 45,
    width: 300,
  },
  buttonView: {
    marginTop: 20,
    width: 150,
  },
});
