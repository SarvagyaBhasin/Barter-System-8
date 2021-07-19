import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Image} from 'react-native'
import DonateScreen from '../Screens/DonateScreen'
import RequestScreen from '../Screens/RequestScreen'
import { AppStackNavigator } from './AppStackNavigator';

export const AppTabNavigator=createBottomTabNavigator({
    DonateBooks:{screen:AppStackNavigator,
    navigationOptions:{tabBarIcon:<Image source={require("../assets/download.png")} style={{width:20, height:20}}></Image>,
    tabBarLabel:"donate objects"}},
    RequestBooks:{screen:RequestScreen,
        navigationOptions:{tabBarIcon:<Image source={require("../assets/download.png")} style={{width:20, height:20}}></Image>,
        tabBarLabel:"request objects"}}
});
