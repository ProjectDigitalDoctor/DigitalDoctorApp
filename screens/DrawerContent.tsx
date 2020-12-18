import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerItem } from '@react-navigation/drawer';

const DrawerContent = () => {
    return(
        <View>
            <Drawer.Section>
                <DrawerItem
                    icon={({color,size}) => (
                        <Icon
                        name="account-settings"
                        color={color}
                        size={size}
                        />
                    )} 
                    label="Settings"
                    onPress={() => {}}
                />
                <DrawerItem
                    icon={({color,size}) => (
                        <Icon
                        name="exit-to-app"
                        color={color}
                        size={size}
                        />
                    )} 
                    label="Sign out"
                    onPress={() => {}}
                />
            </Drawer.Section>
        </View>
    );
 }

 export default DrawerContent;
