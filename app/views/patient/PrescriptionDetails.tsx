import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const PrescriptionDetails = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>Prescription Details</Text>
    </View>
  );
};

export default PrescriptionDetails;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
});