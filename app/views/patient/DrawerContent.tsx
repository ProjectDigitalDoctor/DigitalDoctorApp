import React from 'react';
import {View} from 'react-native';
import {Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerItem} from '@react-navigation/drawer';
import {logout} from '../../api/client';

function DrawerContent(props: any) {
  return (
    <View>
      <Drawer.Section>
        <DrawerItem
          icon={({color, size}) => <Icon name="account-settings" color={color} size={size} />}
          label="Einstellungen"
          onPress={() => {
            props.navigation.navigate('Settings');
          }}
        />
        <DrawerItem
          icon={({color, size}) => <Icon name="exit-to-app" color={color} size={size} />}
          label="Abmelden"
          onPress={() => logout().then(() => props.navigation.navigate('Login'))}
        />
      </Drawer.Section>
    </View>
  );
}

export default DrawerContent;
