import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FindDoctor = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>Find Doctor</Text>
    </View>
  );
};

export default FindDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
