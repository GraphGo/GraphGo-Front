import firebase from 'firebase'

if(!firebase.apps.length){
    firebase.initializeApp({    
        apiKey: "AIzaSyBjhv7NmoxHRrnRTcxLku4GxjpZHX8uruU",
        authDomain: "graphgo-server.firebaseapp.com",
        databaseURL: "https://graphgo-server.firebaseio.com",
        projectId: "graphgo-server",
        storageBucket: "graphgo-server.appspot.com",
        messagingSenderId: "889570288959",
        appId: "1:889570288959:web:ff78fe291c468f39e51f8a",
        measurementId: "G-2SGHSDQ3DX"
    });
}
var db = firebase.firestore();
var auth = firebase.auth()
const FieldValue = firebase.firestore.FieldValue

export { db, auth, FieldValue};