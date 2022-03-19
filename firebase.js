// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8MBEOji_iTVgNFaWLdjw2_NQv5cefOZ4",
  authDomain: "reactfirebaseauth-5011a.firebaseapp.com",
  projectId: "reactfirebaseauth-5011a",
  storageBucket: "reactfirebaseauth-5011a.appspot.com",
  messagingSenderId: "472575138049",
  appId: "1:472575138049:web:6a30011a0a22cf82bc6300"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export{ auth, firestore };