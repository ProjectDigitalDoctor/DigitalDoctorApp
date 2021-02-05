import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {isLoggedIn} from '../../api/client';

const StartScreen = ({navigation}: {navigation: any}) => {
  isLoggedIn().then((res) => {
    if (res) {
      navigation.navigate('TabScreen');
    } else {
      navigation.navigate('Login');
    }
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#32a852" />
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
});
