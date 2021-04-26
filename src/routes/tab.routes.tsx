import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlantSelection } from '../pages/PlantSelection';

import colors from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { MyPlants } from '../pages/MyPlants';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    return (
        <AppTab.Navigator
            tabBarOptions={{
                activeTintColor: colors.green,
                inactiveTintColor: colors.heading,
                labelPosition: 'beside-icon',
                style: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: 88
                }
            }}>
                <AppTab.Screen 
                    name= "New Plant"
                    component={PlantSelection}
                    options={{
                        tabBarIcon: (({size, color}) => (
                            <MaterialIcons 
                                name="add-circle-outline"
                                size={size}
                                color={color}
                            />
                        ))
                    }}
                />
                <AppTab.Screen 
                    name= "My Plants"
                    component={MyPlants}
                    options={{
                        tabBarIcon: (({size, color}) => (
                            <MaterialIcons 
                                name="format-list-bulleted"
                                size={size}
                                color={color}
                            />
                        ))
                    }}
                />
        </AppTab.Navigator>
    )
}

export default AuthRoutes;