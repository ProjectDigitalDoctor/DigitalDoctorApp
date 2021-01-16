import React from 'react';
import {View} from 'react-native';
import {Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerItem} from '@react-navigation/drawer';

function DrawerContent(props: any) {
  return (
    <View>
      <Drawer.Section>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="account-settings" color={color} size={size} />
          )}
          label="Settings"
          onPress={() => {
            props.navigation.navigate('Settings');
          }}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign out"
          onPress={() => {}}
        />
      </Drawer.Section>
    </View>
  );
}

export default DrawerContent;
