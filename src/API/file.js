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
            type: folder.type
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
                    if(item.type === "folder"){
                        var files = []
                        for(var i = 0; i < data.files.length ; i++){
                            var file = data.files[i]
                            file.get().then(querysnapshot => {
                                var data = querysnapshot.data()
                                data.id = file.id
                                files.push(data)
                            })
                        }
                        data.files = files
                    }
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
// base64 img, smart obj, width, height
const saveCanvas = (img, smartObj, width, height, name, uid, docID="", root="") => {
    return new Promise((resolve, reject) => {
        // create new graph, return id
        if(docID === ""){
            db.collection('file').add({img: img, last_modified: new Date(), name: name, root: root, config:{width: width, height: height}, type: "graph"})
            .then(docRef => {
                return docRef.id
            }).then(fileID => {
                db.collection('file').doc(fileID).update({structures: FieldValue.arrayUnion(smartObj)})
                return fileID
            }).then(fileID=>{
                db.collection('user').doc(uid).set({files: FieldValue.arrayUnion({id: fileID, type: "graph"})})
                resolve(fileID)
            }).catch(e => {reject(e)})
        } else {
            // save to exisitng graph
            db.collection('file').doc(docID).update({img: img, last_modified: new Date(), name: name, root: root, config: {width: width, height: height}}).then(res=> {
                resolve(res)
            }).catch(e => {reject(e)})
        }

    })
}

const loadCanvas = (docID) => {
    console.log(docID)
    return new Promise((resolve, reject) => {
        db.collection('file').doc(docID).get().then(querysnapshot => {
            var data = querysnapshot.data()
            delete data.owner
            resolve(data)
        }).catch(e => {reject(e)})
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
            db.collection('folder').add({files: [], last_modified: new Date(), name: name, num_files: 0, type: 'folder'})
                .then(docRef => {
                    userRef.update({files: FieldValue.arrayUnion({id: docRef.id, type:"folder"})})
                    resolve("Success")
                })
        })

    })
}

const deleteFolder = (email, folderID) => {
    return new Promise((resolve, reject) => {
        db.collection("user").get('email','==',email).then(querysnapshot => {
            if(querysnapshot.empty) reject("User does not exist")
            var doc = querysnapshot.docs[0]
            doc.update({files: FieldValue.arrayRemove({id: folderID, type: "folder"})})
        }).then(()=> {
            db.collection('folder').doc(folderID).delete().then(res => resolve(res)).catch(e => reject(e))
        })
    })
}


export {
    getAllFiles, getFileById,createFolder, saveCanvas, loadCanvas, Folder, File, Structure
}