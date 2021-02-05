import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const SettingsScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
