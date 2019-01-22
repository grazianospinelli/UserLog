import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,Button,TextInput,TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { sha256 } from 'react-native-sha256';
import firebase from 'react-native-firebase';
import IP from '../config/IP';


export default class register extends Component {
	
	constructor(props){
		super(props)
		this.state={
			userName:'',
			userEmail:'', 
			userPassword:'',
			userToken:''
		}
	}
	
	static navigationOptions= ({navigation}) =>({
		  title: 'Register',	
		  headerRight:	
		  <TouchableOpacity
			onPress={() => navigation.navigate('Home')}
			style={{margin:10,backgroundColor:'orange',padding:10}}>
			<Text style={{color:'#ffffff'}}>Home</Text>
		  </TouchableOpacity>
		
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

        const fcmToken = await firebase.messaging().getToken()
        if (fcmToken) {
        	this.setState({userToken: fcmToken})
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        	if (fcmToken) {this.setState({userToken: fcmToken})}
        })
        
    }


	userRegister = () =>{
		//alert('ok'); // version 0.48
		
		const {userName} = this.state;
		const {userEmail} = this.state;
		const {userPassword} = this.state;
		const {userToken} = this.state;
		
		
		
		fetch(`${IP}/register.php`, {
			method: 'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				name: userName,
				email: userEmail,
				password: userPassword
			})
			
		})
		.then((response) => response.json())
		.then((responseJson) => {alert(responseJson);})
		.catch((error) => {alert(error);});

		fetch(`${IP}/RegisterDevice.php`, {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({
              	token: userToken,
              	email: userEmail})
            })
        .then((response) => response.json())
        .then((responseData) => { alert(responseData); })
        .catch((err) => { alert(err); });
                       
	}
	
  	render() {
			return (
				<View style={styles.container}>
							
				
					<TextInput
						placeholder="Enter Name"
						style={{width:250,margin:10, borderColor:"#333", borderWidth:1}}	
						underlineColorAndroid="transparent"
						onChangeText= {userName => this.setState({userName})}
							// Tentativo di azzeramento del campo dopo il submit
							// value={this.state.userName ? null : this.state.userName} 
							// onSubmitEditing={ () => {this.setState({userName:""}) } } 
					/>
					
					<TextInput
						placeholder="Enter Email"
						style={{width:250,margin:10, borderColor:"#333", borderWidth:1}}	
						underlineColorAndroid="transparent"
						autoCapitalize = 'characters'
						onChangeText= {userEmail => this.setState({userEmail})}
					/>
					
					<TextInput
						placeholder="Enter Password"
						style={{width:250,margin:10, borderColor:"#333", borderWidth:1}}	
						underlineColorAndroid="transparent"
						onChangeText= {userPassword => sha256(userPassword).
							then(userPassword => {this.setState({userPassword});})}
					/>
					
					<TouchableOpacity
						onPress={this.userRegister}
						style={{width:250,padding:10, backgroundColor:'magenta', alignItems:'center'}}>
						<Text style={{color:'#fff'}}>Signup</Text>
					</TouchableOpacity>
					
					
				</View>
		
			);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('register', () => register);
