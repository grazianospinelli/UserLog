/** @format */
import React, { Component } from 'react';
import {AppRegistry,View,Text,StyleSheet} from 'react-native';
import AppAndroid from './pages/app';
import {name as appName} from './app.json';
// import bgActions from './bgActions';

AppRegistry.registerComponent(appName, () => AppAndroid);

// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgActions);
