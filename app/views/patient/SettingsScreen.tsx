import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Switch} from 'react-native';

const SettingsScreen = ({navigation}: {navigation: any}) => {
  const [isFirstEnabled, setIsFirstEnabled] = useState(true);
  const [isSecondEnabled, setIsSecondEnabled] = useState(false);
  const [isThirdEnabled, setIsThirdEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Einstellungen</Text>
      <View style={styles.row}>
        <Text style={styles.setting}>Fitnessdaten freischalten: </Text>
        <Switch
          trackColor={{false: '#767577', true: '#16cc46'}}
          thumbColor={isFirstEnabled ? '#32a852' : '#f4f3f4'}
          onValueChange={(state: boolean) => setIsFirstEnabled(state)}
          value={isFirstEnabled}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.setting}>Noch mehr gemockte Einstellungen: </Text>
        <Switch
          trackColor={{false: '#767577', true: '#16cc46'}}
          thumbColor={isSecondEnabled ? '#32a852' : '#f4f3f4'}
          onValueChange={(state: boolean) => setIsSecondEnabled(state)}
          value={isSecondEnabled}
        />
      </View>
      {isSecondEnabled && (
        <View style={styles.row}>
          <Text style={styles.setting}>🎉🎈🥳 </Text>
          <Switch
            trackColor={{false: '#767577', true: '#16cc46'}}
            thumbColor={isThirdEnabled ? '#32a852' : '#f4f3f4'}
            onValueChange={(state: boolean) => setIsThirdEnabled(state)}
            value={isThirdEnabled}
          />
        </View>
      )}
      <View style={styles.buttonView}>
        <Button title="Go back" onPress={navigation.goBack} color="#3083DC" />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'lightgrey',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32a852',
    marginVertical: 30,
  },
  buttonView: {
    marginTop: 20,
    width: 160,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 45,
    width: 320,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setting: {
    fontSize: 16,
  },
});
