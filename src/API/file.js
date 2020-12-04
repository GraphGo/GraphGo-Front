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
        db.collection('file').doc(fileId).get().then(querysnapshot => {
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
            db.collection('file').add({smartObjects:smartObj.map((obj) => {return Object.assign({}, obj)}), img: img, last_modified: new Date(), name: name, root: root, config:{width: width, height: height}, type: "graph"})
            .then(docRef => {
                return docRef.id
            })
            .then(fileID=>{
                console.log("UID: ",uid)
                db.collection('user').doc(uid).update({files: FieldValue.arrayUnion({id: fileID, type: "graph"})})
                resolve(fileID)
            }).catch(e => {reject(e)})
        } else {
            console.log(docID);
            // save to exisitng graph
            db.collection('file').doc(docID).update({smartObjects:smartObj.map((obj) => {return Object.assign({}, obj)}),img: img, last_modified: new Date()}).then(res=> {
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
            data.id = docID;
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
    getAllFiles, getFileById,createFolder, saveCanvas, loadCanvas
}