import {db, FieldValue } from './db'
import { getUser } from './user'

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
                            files.push({id: data.files[i].id})
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
        db.collection('file').doc(fileId).get().then(querysnapshot => {
            if(querysnapshot.docs.length == 0) reject('No file with this id found')
            resolve(querysnapshot.docs[0].data())
        })
    })
}
// base64 img, smart obj, width, height
const saveCanvas = (img, smartObj, width, height, name, uid, docID="", root="") => {
    return new Promise((resolve, reject) => {
        // create new graph, return id
        if(docID === ""){
            db.collection('file').add({smartObjects:smartObj.map((obj) => {return Object.assign({}, obj)}), img: img, last_modified: new Date(), name: name, root: root, config:{width: width, height: height}, type: "graph"})
            .then(docRef => {
                return docRef.id
            })
            .then(fileID=>{
                db.collection('user').doc(uid).update({files: FieldValue.arrayUnion({id: fileID, type: "graph"})})
                if(root){
                    db.collection('folder').doc(root).update({files: FieldValue.arrayUnion({id: fileID})})
                }
                resolve(fileID)
            }).catch(e => {reject(e)})
        } else {
            // save to exisitng graph
            db.collection('file').doc(docID).update({smartObjects:smartObj.map((obj) => {return Object.assign({}, obj)}),img: img, last_modified: new Date()}).then(res=> {
                resolve(res)
            }).catch(e => {reject(e)})
        }

    })
}

const loadCanvas = (docID) => {
    return new Promise((resolve, reject) => {
        db.collection('file').doc(docID).get().then(querysnapshot => {
            var data = querysnapshot.data()
            delete data.owner
            data.id = docID;
            resolve(data)
        }).catch(e => {reject(e)})
    })
}

const createFolder = (name, uid) => {
    return new Promise((resolve, reject) => {
        db.collection('folder').add({files: [], last_modified: new Date(), name: name, num_files: 0, type: 'folder'})
        .then(docRef => {
            db.collection('user').doc(uid).update({files: FieldValue.arrayUnion({id: docRef.id, type:"folder"})})
            resolve("Success")
        }).catch(e => reject(e))

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

const deleteFile = (email, fileID) => {
    return new Promise((resolve, reject) => {
        db.collection("user").where("email", "==", email).get().then(querysnapshot => {
            if(querysnapshot.empty) reject("user does not exist")
            var userRef = db.collection('user').doc(querysnapshot.docs[0].id)
            userRef.update({files: FieldValue.arrayRemove({id: fileID,type: "graph"})})
        }).then(()=>{
            db.collection('file').doc(fileID).delete().then(res=> resolve(res)).catch(e=>reject(e))
        })
    })
}

const rename = (email, id, type, name) => {
    return new Promise((resolve, reject) => {
        db.collection('user').where('email','==',email).get().then(querysnapshot => {
            if(querysnapshot.empty) reject("user does not exist")
        }).then(() => {
            // check sibling files for duplicate name
            if(type === "file"){
                // for file, check its root folder
                db.collection('file').doc(id).get().then(docSnapshot => {
                    return docSnapshot.data().root
                }).then(rootFolderID => {
                    if(!rootFolderID) return;
                    // get snapshot for root folder
                    db.collection('folder').doc(rootFolderID).get().then(docSnapshot => {
                        // loop through files in folder, check duplicate name
                        var files = docSnapshot.data().files
                        var filePromises = []
                        for(var file in files){
                            filePromises.push(db.collection('file').doc(file.id).get())
                        }
                        Promise.all(filePromises).then(docSnapshots => {
                            for(var doc in docSnapshots){
                                if(doc.data().name === name){
                                    reject("File "+name+" already exists")
                                }
                            }
                        })
                    })
                })
            } 
        }).then(() => {
            // update folder or file name
            db.collection(type).doc(id).update({name: name}).catch(e=>reject(e))
            resolve()
        })
    })
} 


export {
    getAllFiles, getFileById,createFolder, saveCanvas, loadCanvas, deleteFolder, deleteFile, rename
}