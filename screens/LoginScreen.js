import { StyleSheet,TouchableWithoutFeedback, Keyboard, Text, View, KeyboardAvoidingView,TextInput ,TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import { useState, useEffect} from 'react';
import { auth, firestore } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Platform } from 'react-native-web';

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home", {email: user.email})
            }
        })
        return unsubscribe
    },[])

    const handleSignUp = () =>{
        navigation.replace("Register")
    }

    const handleSignIn = async () =>{
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            const email = user.email;
          console.log('Login with '+ email);
        })
        .catch(error => {
            if (error.code === 'auth/internal-error') {
                console.log('Please enter your email or password');
                Alert.alert(
                    "Error",
                    'Please enter your email or password',
                  );
            }
        
            if (error.code === 'auth/wrong-password') {
                console.log('Wrong password');
                Alert.alert(
                    "Error",
                    'Wrong password',
                  );
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                Alert.alert(
                    "Error",
                    'Invalid Email',
                  );
            }

            if (error.code === 'auth/user-not-found') {
                console.log('user-not-found');
                Alert.alert(
                    "Error",
                    'Please Sign up',
                  );
            }

          console.error(error);
        });


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
                    style={styles.button}
                    onPress={handleSignIn}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={[styles.button, styles.buttonOutline]}
                    onPress={handleSignUp}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  )
}

export default LoginScreen

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