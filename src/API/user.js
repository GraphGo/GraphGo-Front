import {db, auth} from "./db"

class User {
    constructor(email, user_since, files){
        this.email = email
        this.files = files
        this.user_since = user_since
    }

    toString(){
        return this.email
    }
}

const userConverter = {
    toFirestore: function(user) {
        return {
            email: user.email,
            files: user.files,
            user_since: user.user_since
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options)
        return new User(data.email, data.user_since, data.files)
    }
}

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        db.collection('user').get("email",'==',email).then(querysnapshot => {
            if(querysnapshot.docs.length == 0){
                reject("No user with this email found")
            }
            resolve(querysnapshot.docs[0].data())
        })
    })
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

export { saveUserToDB, signUp, login, getUser }