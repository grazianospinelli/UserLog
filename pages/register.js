import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,TextInput,TouchableOpacity,
  ImageBackground
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import md5 from 'md5';
import firebase from 'react-native-firebase';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IP from '../config/IP';
import Validate from '../components/validate.js'



export default class register extends Component {
	
	constructor(props){
		super(props)
		this.state={
			userName:'',
			userEmail:'', 
			userPassword:'',
			checkPassword:'',
			userToken:'',
			emailWarn:'',
			passWarn:'',
			checkWarn:''
		}
		
	}
	
	static navigationOptions= ({navigation}) =>({
			title: 'Register',
			headerTintColor: 'white',
			// navBarHidden: true,
			headerStyle: {backgroundColor: 'transparent'},
			// headerLeft:
			// <HeaderBarItem to='InfoScreen' title='App info' />,	
			headerRight:	
			<TouchableOpacity
				onPress={() => navigation.navigate('Home')}
				style={{margin:10,backgroundColor:'#f24f32',padding:10}}>
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
				
		const {userName,userEmail,userToken,userPassword,checkPassword} = this.state;
		
		const emailWarn = Validate('email', this.state.userEmail)
		const passWarn = Validate('password', this.state.userPassword)

		this.setState({
			emailWarn: emailWarn,
			passWarn: passWarn
		})
		
		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
		
  		if (!emailWarn && !passWarn) {
				
			fetch(`${IP}/register.php`, {
				method: 'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					name: userName,
					email: upperEmail,
					password: md5Password
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
					email: upperEmail})
				})
			.then((response) => response.json())
			.then((responseData) => {alert(responseData); this.props.navigation.navigate("Home");})
			.catch((err) => { alert(err); });
		}   
		
	}
	
  	render() {
			return (
				

				<ImageBackground 
					source={require('../components/images/waiter_back.jpg')}
					style={styles.backgroundImage}
            	>

				<View style={styles.container}>

						<View style={styles.inputForm}>	
						<Icon style={styles.searchIcon} name="user" size={20} color='transparent'/>				
						<TextInput
							placeholder="Enter Name"
							style={{borderRadius: 25, width:180}}	
							underlineColorAndroid="transparent"
							onChangeText= {userName => this.setState({userName})}							
						/>
						</View>
						
						<Text>{}</Text>
					
						<View style={styles.inputForm}>
						<Icon style={styles.searchIcon} name="envelope" size={20} color={this.state.emailWarn ? 'red' : 'transparent'}  />		
						<TextInput
							placeholder="Enter Email"
							style={{borderRadius: 25, width:180}}
							onChangeText={userEmail => { userEmail.trim(); this.setState({userEmail})}}
							onBlur={() => { warn = Validate('email', this.state.userEmail); this.setState({emailWarn: warn})}}
						/>
						</View>
			
						<Text style={{color:'red'}}>{this.state.emailWarn}</Text>
						
						<View style={styles.inputForm}>	
						<Icon style={styles.searchIcon} name="lock" size={20} color={this.state.passWarn ? 'red' : 'transparent'} />
						<TextInput
							placeholder="Enter Password"
							secureTextEntry={true}
							style={{borderRadius: 25, width:180}}
							onChangeText={userPassword => { userPassword.trim(); this.setState({userPassword})}}
							onBlur={() => { warn = Validate('password', this.state.userPassword); this.setState({passWarn: warn})}}
						/>
						</View>

						<Text style={{color:'red'}}>{this.state.passWarn}</Text>

						<TouchableOpacity
							onPress={this.userRegister}
							style={{borderRadius: 25, width:250, margin: 50, padding:15, backgroundColor:'#f24f32', alignItems:'center'}}>
							<Text style={{color:'#fff'}}>Signup</Text>						
						</TouchableOpacity>
					
				

				

				</View>
			
				
				</ImageBackground>
		
			);
    }
}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// backgroundColor: '#F5FCFF',
	},

	backgroundImage: {
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},

	inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		//backgroundColor: 'transparent',
		width:250,
		margin:1,
		borderRadius: 25, 
		//borderWidth:1,
		//borderColor: 'gray',
		backgroundColor: 'rgba(255,255,255,0.4)',
	},

	searchIcon: {
		padding: 10,
		margin: 5,
	},	

  
});

AppRegistry.registerComponent('register', () => register);
