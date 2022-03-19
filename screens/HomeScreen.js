import { StyleSheet, Image,Text, View, TouchableOpacity, SafeAreaView,ScrollView } from 'react-native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import { auth, firestore } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import CustomListItem from './components/CustomListItem';
import {Ionicons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';

const HomeScreen = () => {
    const [chats, setChats] = useState([]);
    
    const navigation = useNavigation();
    const route = useRoute();

    const {email} = route.params;
    const [username, setUsername] = useState("");

    useEffect(()=>{
        const unsubscribe = firestore.collection('Chats').onSnapshot(snap => (
            setChats(snap.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })))
        ))

        return unsubscribe;
    },[])

    useEffect(async ()=>{
        console.log('The email is '+ email)
        await firestore.collection('Users')
                        .doc(email)
                        .get()
                        .then(documentSnapshot => {
                        console.log('User exists: ', documentSnapshot.exists);
                    
                        if (documentSnapshot.exists) {
                            console.log('User data: ', documentSnapshot.data());
                            const user = documentSnapshot.data()
                            setUsername(user.username)
                        }
                        });
    },[])

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => {
            console.log('User signed out!');
            navigation.replace("Login");
        });
    }

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id,
            chatName,
        })
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'HINO',
            headerStyle: {backgroundColor: '#1B6464',},
            headerTitleStyle: {color: "white"},
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft:()=>(
                <View style={{marginLeft: 0}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={handleSignOut}>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                            uri: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg',
                            }}
                        />
                    </TouchableOpacity>
                    
                </View>
            ),
            headerRight: ()=>(
                <View style={{flexDirection: 'row', width: 80, justifyContent: 'space-between'}}>
                    <TouchableOpacity>
                        <FontAwesome5 name="camera" size={24} color={'#ddd'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> navigation.navigate("AddChat")}>
                        <FontAwesome5 name="pen" size={24} color={'#ddd'} />
                    </TouchableOpacity>
                </View>
            ),
        })
    })
    
  return (
    <SafeAreaView>
        <ScrollView>
            {chats.map(({ id, data: { chatName } }) => (
                <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
            ))}

        </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    tinyLogo: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
})