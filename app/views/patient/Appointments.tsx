import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';

const Appointments = ({navigation}: {navigation: any}) => {
    return (
        <View style={styles.container}>
            <Text>Appointments</Text>
        </View>
    );
};

export default Appointments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});