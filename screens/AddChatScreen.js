import { StyleSheet, Image,Text, TextInput, View, TouchableOpacity, SafeAreaView,ScrollView } from 'react-native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import { auth, firestore } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';

const AddChatScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const [input, setInput] = useState('');

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Add a new chat',
            headerBackTitle: 'Chats',
            headerStyle: {backgroundColor: '#1B6464',},
            headerTitleStyle: {color: "white"},
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            
        })
    })

    const createChat = async () => {
        await firestore.collection("Chats").add({
            chatName: input
        }).then((val)=> {
            navigation.goBack()
        }).catch(error => alert(error));
    }
    
  return (
    <View style={styles.container}>
        <TextInput
            style={styles.searchBar}
            placeholder='Enter a chat name'
            value={input}
            onChangeText={text=> setInput(text)}
        />
        <TouchableOpacity 
            style={styles.button}
            onPress={createChat}
            >
                <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
    searchBar:{
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        width: '80%',
        alignSelf: 'center'
    },
    button:{
        width: "60%",
        backgroundColor: '#1b6464',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 10,
    },
    buttonText:{
        color: 'white', 
        textAlign: 'center',
        fontSize: 16,
    },
})