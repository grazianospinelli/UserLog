import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,TouchableOpacity,TextInput,Button,Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import md5 from 'md5';
import IP from '../config/IP';
import Validate from '../components/validate.js'
import { StackNavigator } from 'react-navigation';


export default class login extends Component {
	
	constructor(props){
		super(props)
		this.state={
			userEmail:'',
			userPassword:'',
			userToken:'',
			emailWarn:'',
			passWarn:''
		}
	}
	
	static navigationOptions = ({navigation}) =>({
		  title: 'Login',	
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
        	alert(fcmToken);
        	this.setState({userToken: fcmToken});
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        	if (fcmToken) {this.setState({userToken: fcmToken})}
        })

    }


	

	login = () =>{
		
		const {userEmail,userToken,userPassword} = this.state;
		const emailWarn = Validate('email', this.state.userEmail)
		const passWarn = Validate('password', this.state.userPassword)
		
		this.setState({
			emailWarn: emailWarn,
			passWarn: passWarn
		})

		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
	  
  		if (!emailWarn && !passWarn) {
		
		
			fetch(`${IP}/login.php`,{
				method:'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					// we will pass our input data to server
					email: upperEmail,
					password: md5Password,
					token: userToken
				})
				
			})
			.then((response) => response.json())
			.then((responseJson)=>{
				if(responseJson == "ok"){
					// redirect to profile page
					alert("Successfully Login");
					//salva token in locale e remoto


					this.props.navigation.navigate("Profile");
				}else{
					alert("Wrong Login Details");
				}
			})
			.catch((error)=>{
			console.error(error)
			});

			
		}
				
		Keyboard.dismiss();
	}
	
  render() {
    return (
	<View style={styles.container}>    
		
		
		<TextInput
			placeholder="Enter Email"
			style={{width:200, 
				margin:20,
				borderWidth: 1,
				borderColor: this.state.emailWarn ? 'red' : 'gray'}}
			onChangeText={userEmail => { userEmail.trim(); this.setState({userEmail})}}
			onBlur={() => { warn = Validate('email', this.state.userEmail); this.setState({emailWarn: warn})}}
		/>
		
		<Text style={{margin:5,color:'red'}}>{this.state.emailWarn}</Text>

		<TextInput
			placeholder="Enter Password"
			secureTextEntry={true}
			style={{width:200, 
				margin:20,
				borderWidth: 1,
				borderColor: this.state.passWarn ? 'red' : 'gray'}}			
			onChangeText={userPassword => { userPassword.trim(); this.setState({userPassword})}}
			onBlur={() => { warn = Validate('password', this.state.userPassword); console.log(warn); this.setState({passWarn: warn})}}
		/>

		<Text style={{margin:5,color:'red'}}>{this.state.passWarn}</Text>

		<TouchableOpacity
			onPress={this.login}
			style={{width:200,padding:10,backgroundColor:'magenta',alignItems:'center'}}>
			<Text style={{color:'white'}}>Login</Text>
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
	  
  	

});

AppRegistry.registerComponent('login', () => login);
