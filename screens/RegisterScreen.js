import { StyleSheet,TouchableWithoutFeedback, Keyboard, Text, View, KeyboardAvoidingView,TextInput ,TouchableOpacity} from 'react-native'
import React from 'react'
import { useState, useEffect} from 'react';
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/core';

const RegisterScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const navigation = useNavigation();

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home", {email: user.email})
            }
        })

        return unsubscribe
    },[])

    const handleSignUp = () =>{
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            user.updateProfile({
                displayName: username,
            });
            const email = user.email;
          console.log('Register Email:  '+ email);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            Alert.alert(
                "Error",
                'Email already in use',
              );
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Alert.alert(
                "Error",
                'Invalid Email',
              );
          }
      
          console.error(error);
        });

        firestore
        .collection('Users')
        .doc(email)
        .set({
            username: username,
            email: email,
            password: password
        })
        .then((res) => {
            console.log('User ' +res.username+ ' added!');
        });
    }

    const handleSignIn = () =>{
        navigation.replace("Login")
    }

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? "padding" : 'height'}
            >
                <View style={styles.inputSection}>
                    <TextInput
                        style={styles.inputField}
                        placeholder='Username'
                        value={username}
                        onChangeText={text => {setUsername(text)}}
                    />

                    <TextInput
                        style={styles.inputField}
                        placeholder='Email'
                        value={email}
                        onChangeText={text => {setEmail(text)}}
                    />

                    <TextInput
                        style={styles.inputField}
                        placeholder='Password'
                        value={password}
                        onChangeText={text => {setPassword(text)}}
                        secureTextEntry
                    />
                </View>

                <View style={styles.buttonSection}>
                    <TouchableOpacity 
                    style={[styles.button]}
                    onPress={handleSignUp}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={[styles.button, styles.buttonOutline]}
                    onPress={handleSignIn}
                    >
                        <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
                </View>

                
                
            </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputSection:{
        width: '80%',
        alignItems: 'center',
    },
    inputField:{
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginVertical: 5,
        fontSize: 16,
    },
    buttonSection:{
        width: "80%",
    },
    button:{
        width: "60%",
        backgroundColor: '#1b6464',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 2,
        alignSelf: 'center',
        borderRadius: 10,
    },
    buttonText:{
        color: 'white', 
        textAlign: 'center',
        fontSize: 16,
    },
    buttonOutline:{
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: "rgb(27,100,100)"

    },
    buttonOutlineText:{
        color: '#1b6464', 
        textAlign: 'center',
        fontSize: 16,
    }
})