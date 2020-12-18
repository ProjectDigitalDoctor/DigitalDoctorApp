import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const PrescriptionsOverview = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>Prescriptions Overview</Text>
    </View>
  );
};

export default PrescriptionsOverview;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
});