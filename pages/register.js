import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,TextInput,TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import md5 from 'md5';
import firebase from 'react-native-firebase';
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
				<View style={styles.container}>
							
				
					<TextInput
						placeholder="Enter Name"
						style={{width:200,margin:10, borderColor:"gray", borderWidth:1}}	
						underlineColorAndroid="transparent"
						onChangeText= {userName => this.setState({userName})}							
					/>
					
					<TextInput
						placeholder="Enter Email"
						style={{width:200, 
							margin:10,
							borderWidth: 1,
							borderColor: this.state.emailWarn ? 'red' : 'gray'}}
						onChangeText={userEmail => { userEmail.trim(); this.setState({userEmail})}}
						onBlur={() => { warn = Validate('email', this.state.userEmail); this.setState({emailWarn: warn})}}
					/>
		
					<Text style={{color:'red'}}>{this.state.emailWarn}</Text>
					
					<TextInput
						placeholder="Enter Password"
						secureTextEntry={true}
						style={{width:200, 
							margin:10,
							borderWidth: 1,
							borderColor: this.state.passWarn ? 'red' : 'gray'}}
						onChangeText={userPassword => { userPassword.trim(); this.setState({userPassword})}}
						onBlur={() => { warn = Validate('password', this.state.userPassword); console.log(warn); this.setState({passWarn: warn})}}
					/>

					<Text style={{color:'red'}}>{this.state.passWarn}</Text>

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
