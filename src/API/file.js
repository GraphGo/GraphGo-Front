import {db, auth, FieldValue } from './db'
import { getUser } from './user'


class File {
    constructor(name, type, root, img, last_modified, structures){
        this.name = name
        this.type = type
        this.root = root
        this.img = img
        this.last_modified = last_modified
        this.structures = structures
    }
}

class Structure {
    constructor(graph, type, recognized_values, bounding_box, canvas_size){
        this.graph = graph
        this.type = type
        this.recognized_values = recognized_values
        this.bounding_box = bounding_box
        this.canvas_size = canvas_size
    }
}

class Folder {
    constructor(name, type, files,  last_modified = new Date(), num_files=files.length){
        this.name = name
        this.files = files
        this.last_modified = last_modified
        this.num_files = num_files
        this.type = type
    }
}

const FileConverter = {
    toFirestore: function(file) {
        return {
            name:file.name,
            type: file.type,
            root: file.root,
            img: file.img,
            last_modified: file.last_modified,
            structures: file.structures,
            id: file.id
        }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options)
        return new File(data.name, data.type, data.root, data.img, data.last_modified, data.structures)
    }
}

const FolderConverter = {
    toFirestore: function(folder) {
        return {
            name: folder.name,
            num_files: folder.num_files,
            last_modified: folder.last_modified,
            files: folder.files,
            type: folder.type,
        }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options)
        return new Folder(data.name, data.type, data.files, data.last_modified, data.num_files)
    }
}


const getAllFiles = (email) => {
    return new Promise((resolve, reject) => {
        getUser(email).then(querysnapshot => {  
            var promises = []
            // for each id, get File/Folder object from database
            querysnapshot.files.forEach(item => {
                var collection;
                // add converter
                if(item.type === 'folder'){
                    collection = db.collection('folder')
                } else if (item.type === 'graph'){
                    collection = db.collection('file')
                }
                promises.push(collection.doc(item.id).get().then(querysnapshot => {
                    var data = querysnapshot.data()
                    data.id = item.id
                    return data
                }))
            })
            resolve(Promise.all(promises))
        }).catch(e=>reject(e))   
    })
}

const getFileById = (fileId) => {
    return new Promise((resolve, reject) => {
        db.collection('file').withConverter(FileConverter).get('id','==',fileId).then(querysnapshot => {
            if(querysnapshot.docs.length == 0) reject('No file with this id found')
            console.log(querysnapshot.docs[0].data())
            resolve(querysnapshot.docs[0].data())
        })
    })
}

const addFileTodb = (uid, file) => {
    console.log(uid)
    return new Promise((resolve, reject) => {
        db.collection("file").doc().set({
            files: file.files,
            type: file.type,
            owner: file.ownerID,
            data: file.data
        }).then(()=>{
            //need to update user's file pointers as well
            //db.collection("user").doc(uid).
            resolve("added")
    }).catch((error)=>{reject(error)})
    })
}

const modifyFile = (fileId, file) => {
    return new Promise((resolve,reject)=>{
        db.collection("user").doc(fileId).update(file).then(()=>{resolve("file modified")
    }).catch((error)=>{reject(error)})
    })
}

const createFolder = (name, email) => {
    return new Promise((resolve, reject) => {
        db.collection("user").get('email','==', email).then(querysnapshot => {
            if (querysnapshot.empty){
                reject("User does not exist")
            }
            var doc = querysnapshot.docs[0]
            return db.collection('user').doc(doc.id)
        }).then(userRef => {
            console.log(name)
            db.collection('folder').add({files: [], last_modified: new Date().getTime(), name: name, num_files: 0, type: 'folder'})
                .then(docRef => {
                    userRef.update({files: FieldValue.arrayUnion({id: docRef.id, type:"folder"})})
                    resolve("Success")
                })
        })

    })
}


export {
    getAllFiles, addFileTodb, modifyFile, getFileById,createFolder, Folder, File, Structure
}