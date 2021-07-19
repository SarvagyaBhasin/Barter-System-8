import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import DonateScreen from '../Screens/DonateScreen';
import RecieverDetailsScreen  from '../Screens/ReceiverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  BookDonateList : {
    screen : DonateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  },

},
  {
    initialRouteName: 'BookDonateList'
  }
);