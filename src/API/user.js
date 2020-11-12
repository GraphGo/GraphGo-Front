const { query } = require('express');
const firebase = require('firebase/app')
require('firebase/firestore')
import {db, auth} from "./db"

class User {
    constructor(email, username, files){
        this.email = email
        this.username = username
        this.files = files
        this.user_since = new Date()
    }

    toString(){
        return this.email
    }
}

const saveUserToDB = (user) => {
    return new Promise((resolve, reject)=>{
        db.collection("user").doc().set({
            email: user.email,
            files: user.files,
            user_since: user.user_since,
            
        }).then(()=>{resolve("user added")
    }).catch((error)=>{reject(error)})
    })
}

const login = (email, password) => {
    try {
        auth.signInWithEmailAndPassword(email,
            password);
    }
    catch(error) {
        alert(error)
    }
}

const signUp = (email, password) => {
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

export { saveUserToDB, signUp, login }