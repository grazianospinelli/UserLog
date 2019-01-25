import React, { Component } from 'react';
import { AppRegistry,View,Text,StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';

export default class home extends Component{

	static navigationOptions= ({navigation}) =>({
			title: 'Welcome',	
	});  

	componentDidMount = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }

        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            if (notification.body!==undefined) {
                alert(notification.body);
            } else {
                var seen = [];
                alert(JSON.stringify(notification.data, function(key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                }));
            }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
        }

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');

        // Create the channel
        firebase.notifications().android.createChannel(channel);

        firebase.messaging().subscribeToTopic('news1');

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log('get Message');
            console.log(notification);
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
            firebase.notifications()
                .displayNotification(notification);
            // if (Platform.OS === 'android') {
            //
            //     const localNotification = new firebase.notifications.Notification({
            //         sound: 'default',
            //         show_in_foreground: true,
            //         show_in_background: true
            //     })
            //         .setNotificationId(notification.notificationId)
            //         .setTitle(notification.title)
            //         .setSubtitle(notification.subtitle)
            //         .setBody(notification.body)
            //         .setData(notification.data)
            //         .android.setChannelId('test-channel') // e.g. the id you chose above
            //         .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
            //         .android.setColor('#000000') // you can set a color here
            //         .android.setPriority(firebase.notifications.Android.Priority.High);
            //
            //     firebase.notifications()
            //         .displayNotification(localNotification)
            //         .catch(err => console.error(err));
            //
            // } else if (Platform.OS === 'ios') {
            //
            //     const localNotification = new firebase.notifications.Notification()
            //         .setNotificationId(notification.notificationId)
            //         .setTitle(notification.title)
            //         .setSubtitle(notification.subtitle)
            //         .setBody(notification.body)
            //         .setData(notification.data)
            //         .ios.setBadge(notification.ios.badge);
            //
            //     firebase.notifications()
            //         .displayNotification(localNotification)
            //         .catch(err => console.error(err));
            //
            // }
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            // const notification = new firebase.notifications.Notification({
            //     sound: 'default',
            //     show_in_foreground: true,
            //     show_in_background: true
            // })
            //     .setNotificationId(notificationOpen.notification.notificationId)
            //     .setTitle(notificationOpen.notification.title)
            //     .setSubtitle(notificationOpen.notification.subtitle)
            //     .setBody(notificationOpen.notification.body)
            //     .setData(notificationOpen.notification.data)
            //     .android.setChannelId('test-channel') // e.g. the id you chose above
            //     .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
            //     .android.setColor('#000000') // you can set a color here
            //     .android.setPriority(firebase.notifications.Android.Priority.High);
            if (notification.body!==undefined) {
                alert(notification.body);
                // var seen = [];
                // alert(JSON.stringify(notification.data, function(key, val) {
                //     if (val != null && typeof val == "object") {
                //         if (seen.indexOf(val) >= 0) {
                //             return;
                //         }
                //         seen.push(val);
                //     }
                //     return val;
                // }));
            } else {
                var seen = [];
                alert(JSON.stringify(notification.data, function(key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                }));
            }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
        });
    }

    componentWillUnmount() {
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }

	render(){
		const { navigate } = this.props.navigation;
		return(
			<View style={styles.container}>	
		
				<Text style={styles.pageName}>profile</Text>
		

			</View>
		);
	}
}


const styles = StyleSheet.create({
	container:{
		display:'flex',alignItems:'center',
		justifyContent:'center'
	},

	pageName:{
		margin:10,fontWeight:'bold',
		color:'#000', textAlign:'center'
	},

	
});


AppRegistry.registerComponent('profile', () => profile);
