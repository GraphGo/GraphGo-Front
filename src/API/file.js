import {db, auth} from './db'
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
    constructor(name, files, last_modified = new Date(), num_files=files.length){
        this.name = name
        this.files = files
        this.last_modified = last_modified
        this.num_files = num_files
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
            structures: file.structures
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
            type: folder.type
        }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options)
        return new Folder(data.name, data.files, data.last_modified, data.num_files)
    }
}


const getAllFiles = (email) => {
    return new Promise((resolve, reject) => {
        getUser(email).then(querysnapshot => {
            var queryResult = []
            // for each id, get File/Folder object from database
            querysnapshot.files.forEach(item => {
                var collection;
                // add converter
                if(item.type === 'folder'){
                    collection = db.collection('folder').withConverter(FolderConverter)
                } else if (item.type === 'graph'){
                    collection = db.collection('file').withConverter(FileConverter)
                }
                collection.doc(item.id).get().then(querysnapshot => {
                    queryResult.push(querysnapshot.data())
                })
            })
            // FIXME: queryResult can be printed out with length 2
            // but when I directly print queryResult.length it's 0
            console.log(queryResult)
            resolve(queryResult)
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


export {
    getAllFiles, addFileTodb, modifyFile, getFileById
}