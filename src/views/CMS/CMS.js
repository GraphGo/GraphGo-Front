import React from "react";
import Header from "../../components/Header/Header";
import { Grid } from '@material-ui/core'
import { getAllFiles, createFolder, loadCanvas, saveCanvas } from '../../API/file'
import FolderItem from '../../components/FolderItem/FolderItem'
import FileItem from '../../components/FileItem/FileItem'
import TopBar from '../../components/TopBar/TopBar'
//import {saveUserToDB, signUp, login, getUser} from '../../API/user'
import history from '../../utils/history'

class CMS extends React.Component {
    constructor(props) {
        // need to pass in props of the current user
        super(props) 
        this.state = {
            files: [], // store all files
            fileItems:[], // store currently displayed files
            currentFolder: "", // id of current route 
        };
        this.loadData = this.loadData.bind(this)
        this.onCreatePopupConfirm = this.onCreatePopupConfirm.bind(this)
        this.onFolderClick = this.onFolderClick.bind(this)
        this.onFileClick = this.onFileClick.bind(this)
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        // TODO: use user email from Context
        console.log("[CMS] --- Component loaded")
        this.loadData()
    }

    componentWillUnmount() {

    }

    loadTestData() {

    }

    loadData() {
        console.log("[CMS] --- Reloading data")
        var user = sessionStorage.getItem('userEmail')
        if(!user) return;
        console.log(user);
        getAllFiles(user).then(res => {
            var files = []
            res.forEach(item => {
                if (item.type === 'folder') {
                    files.push({ id: item.id, name: item.name, type: item.type, files: item.files, last_modified: item.last_modified, num_files: item.num_files })
                } else if (item.type === 'graph') {
                    files.push({ id: item.id, name: item.name, type: item.type, root: item.root, last_modified: item.last_modified, img: item.img })
                }
            })
            this.setState({ fileItems: files, files: files })
        }).catch(e => console.error(e))
    }

    enterFolder(id) {
        if (id === "") {
            this.setState({ fileItems: this.state.files, currentFolder: "" })
            return
        }
        var root = {};
        for (var i = 0; i < this.state.files.length; i++) {
            var item = this.state.files[i]
            if (item.type !== "folder") continue
            if (item.id === id) {
                root = item
            }
        }
        if (!root) return
        else this.setState({ fileItems: root.files, currentFolder: id })
    }

    onFolderClick(e) {
        var id = e.target.getAttribute("datakey")
        this.enterFolder(id)
    }

    onFileClick(e) {
        var id = e.target.getAttribute("datakey")
        loadCanvas(id).then(res => {
            console.log(res)
            history.push({pathname: '/', state: res})
        })
    }

    onBack() {
        this.setState({ currentFolder: "" })
        this.enterFolder("")
    }

    onCreatePopupConfirm(name, type) {
        if(type === "folder"){
            console.log("[CMS] --- Creating folder "+ name)
            createFolder(name, sessionStorage.getItem("userEmail")).then(() => { //Hardcoded name, need fix
                this.loadData()
            }).catch(e => { console.log(e) })
        } else if (type === "graph"){
            console.log("[CMS] --- Creating Graph "+name)
            saveCanvas("", [], 900, 1200, name, sessionStorage.getItem('userID'), "", this.state.currentFolder)
            .then(docID => {
                console.log("[CMS] --- Created with docID "+docID)
                loadCanvas(docID).then(res => {
                    history.push({pathname: '/' ,state: res})
                })
            })
            .catch(e => console.log(e))
        }

    }

    render() {
        const gridStyle = {
            'marginTop': '35px'
        }

        return (
            <>
                <Header />
                <div id="firebaseui-auth-container" style={{
                    width: "200 px",
                    height: "200px",
                    position: 'absolute',
                    top: "100px",
                    right: "10%",
                    zIndex: "999",
                    fontSize: "70%",
                    padding: "15px",
                    border: "1px"
                }}></div>
                <div id="loader" ></div>
                <div className="main-page">
                    <TopBar addDisabled={this.state.currentFolder !== ""}
                        backDisabled={this.state.currentFolder === ""}
                        onBack={this.onBack} onRefresh={this.loadData}
                        onSubmit={this.onCreatePopupConfirm}
                    />

                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        {this.state.fileItems.map(item => {
                            if (item.type === 'folder') {
                                return (
                                    <Grid item xs={3} key={item.id} datakey={item.id} onClick={this.onFolderClick}>
                                        <FolderItem name={item.name} datakey={item.id} />
                                    </Grid>
                                )
                            } else if (item.type === 'graph') {
                                return (
                                    <Grid item xs={3} key={item.id} datakey={item.id} onClick={this.onFileClick}>
                                        <FileItem name={item.name} datakey={item.id}></FileItem>
                                    </Grid>
                                )
                            }
                        })}
                    </Grid>
                </div>
            </>
        )
    }
}

export default CMS;