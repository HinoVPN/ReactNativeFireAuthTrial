import { StyleSheet, Platform, TextInput,Image,Text, View, TouchableOpacity, SafeAreaView,ScrollView,KeyboardAvoidingView,TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import firebase from 'firebase/compat/app';
import { auth, firestore } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import {Ionicons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);


    useLayoutEffect(()=>{
        navigation.setOptions({
            title: route.params.chatName,
            headerBackTitle: 'Chats',
            headerStyle: {backgroundColor: '#1B6464',},
            headerTitleStyle: {color: "white"},
            headerTintColor: 'white',
            headerTitleAlign: 'center',
        })
    })

    const sendMessage = ()=> {
        if (input.length == 0 ){

        } else{ 
            Keyboard.dismiss();
            firestore.collection('Chats').doc(route.params.id).collection("messages").add({
                timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            });
            setInput('')
        }
        
    }

    useLayoutEffect(()=>{
        const unsubscribe = firestore
        .collection('Chats')
        .doc(route.params.id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot => setMessages(
            snapshot.docs.map(doc=>({
                id: doc.id,
                data: doc.data()
            }))
        )))
        return unsubscribe
    }, [route])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? "padding" : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 110}
        >
        <>
            <ScrollView contentContainerStyle={{paddingTop: 5}} style={styles.messageSection}>
                {messages.map(({id, data})=>{
                    if (data.email === auth.currentUser.email){
                        return (
                            <View key={id} style={styles.reciever}>
                                <Text style={styles.recieverText}>{data.message}</Text>
                            </View>
                        )
                    }else{
                        return(               
                            <View key={id} style={styles.sender}>
                                <Text style={styles.senderName}>{data.displayName}</Text>
                                <Text style={styles.senderText}>{data.message}</Text>
                            </View>
                        )
                    }

                })}


            </ScrollView>
            <View style={styles.footer}>
                    <TextInput
                    style={styles.textInput}
                    placeholder='Message Here...'
                    value={input}
                    onChangeText={text=> setInput(text)}
                />
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                    <Ionicons name="send" size={24} color="#1B6464"/>
                </TouchableOpacity>
            </View>
        </>
        </KeyboardAvoidingView>

    </SafeAreaView>
</TouchableWithoutFeedback>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    reciever:{
        padding:15,
        backgroundColor: '#ccc',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    sender:{
        paddingHorizontal:15,
        paddingVertical: 10,
        backgroundColor: '#1B6464',
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    senderName:{
        paddingRight:10,
        fontSize: 10 ,
        marginBottom: 5,
        color: 'white'
    },
    senderText:{
        color: 'white',
        fontWeight: '500',
        marginBottom: 5
    },
    recieverText:{
        color: 'black',
        fontWeight: '500',
        marginBottom: 5
    },
    footer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: 'transparent',
        backgroundColor: '#ececec',
        borderWidth: 1,
        padding: 10,
        color: 'grey',
        borderRadius: 30
    },
    messageSection:{
        paddingVertical: 10
    }
})