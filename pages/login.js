import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,TouchableOpacity,TextInput,Button,Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import { sha256 } from 'react-native-sha256';
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
		const {userEmail,userPassword,userToken,emailWarn,passWarn} = this.state;
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(userEmail==""){
			//alert("Please enter Email address");
		  this.setState({emailWarn:'Please enter Email address'})
			
		}
		
		else if(reg.test(userEmail) === false)
		{
		//alert("Email is Not Correct");
		this.setState({emailWarn:'Email is Not Correct'})
		return false;
		}

		else if(userPassword==""){
			this.setState({passWarn:'Please enter password'})
		}
		else{
		
			fetch('http://192.106.234.90/data1/FcmExample/login.php',{
				method:'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					// we will pass our input data to server
					email: userEmail,
					password: userPassword,
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
			borderColor: this.state.passWarn ? 'gray' : 'red'}}
		autoCapitalize='characters'
		onChangeText={userEmail => this.setState({userEmail.trim()})}
		/>
		

		
		<Text style={{margin:5,color:'red'}}>{this.state.emailWarn}</Text>

		<TextInput
		placeholder="Enter Password"
		secureTextEntry={true}
		style={{width:200, 
				margin:20,
				borderWidth: 1,
				borderColor: this.state.passWarn ? 'gray' : 'red'}}
		
		onChangeText= {userPassword => sha256(userPassword.trim()).
			then(userPassword => {this.setState({userPassword});})}
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
