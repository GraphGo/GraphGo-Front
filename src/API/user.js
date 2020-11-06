const { query } = require('express');
const firebase = require('firebase/app')
require('firebase/firestore')
import {db, auth} from "./db"

class User{
    constructor(email, password, files){
        this.email = email
        this.password = password
        this.files = files
    }

    toString(){
        return this.email
    }
}

saveUserToDB = (user) => {
    return new Promise((res, rej)=>{
        db.collection("user").doc().set({
            email: user.email,
            files: user.files
        }).then(()=>{resolve("user added")
    }).catch((error)=>{reject(error)})
    })
}

login = (email, password) => {
    try {
        auth.signInWithEmailAndPassword(email,
            password);
    }
    catch(error) {
        alert(error)
    }
}

signUp = (email, password) => {
    try {
        auth.createUserWithEmailAndPassword(email,
            password);

        let user = new User(email, password, null)
        saveUserToDB(user)
    }
    catch(error) {
        alert(error)
    }
}