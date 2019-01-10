import React, { Component } from 'react';
import {
  AppRegistry, View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';

import HomeScreen from './home';
import Login from './login';
import Register from './register';
import Profile from './profile';

const AppAndroid = createStackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: Login },
  Register: { screen: Register },
  Profile: { screen: Profile },

});

export default createAppContainer(AppAndroid);
