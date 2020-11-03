import db from './db'

class File {
    constructor(files, type, ownerID, data){
        this.files = files
        this.type = type
        this.ownerID = ownerID
        this.data = data
    }
}

const fileConverter = {
    toFireStore: (file) => {
        return {
            files: file.files,
            type: file.type,
            ownerID: file.ownerID,
            data: file.data
        }
    },
    fromFireStore: (snapshot, options) => {
        const data = snapshot.data(options)
        return new File(data.files, data.type, data.ownerID, data.data)
    }
}

const getAllFiles = (email) => {
    console.log(email)
    return new Promise((resolve, reject) => {
        db.collection('user').where("email","==",email).get().then(querysnapshot => {
            var ownerID = querysnapshot.docs[0].id
            db.collection("file").where("owner","==",ownerID).get().then((querysnapshot) => {
                if(querysnapshot.empty) {
                    reject("Not Found")
                }
                var result = []
                // console.log(querysnapshot.docs[0])
                querysnapshot.forEach(doc => {
                    result.push(doc.data())
                })
                resolve(result)
            }).catch(e => reject(e)) 
        })    
    })
}
export {
    getAllFiles, File
}