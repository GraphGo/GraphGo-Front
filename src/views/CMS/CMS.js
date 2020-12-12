import React from "react";
import Header from "../../components/Header/Header";
import { Grid, Menu, MenuItem, Dialog, Button,TextField } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getAllFiles, createFolder, loadCanvas, saveCanvas, deleteFolder, deleteFile, rename } from '../../API/file'
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
            currentFolder: "", // id of current route ,
            rightClickAnchorEl: null,
            deleteDialogOpen: false,
            renameDialogOpen: false,
            renameText: "",
            actionSelectedType: "",
            actionSelectedID:""
        };
        this.loadData = this.loadData.bind(this)
        this.onCreatePopupConfirm = this.onCreatePopupConfirm.bind(this)
        this.onFolderClick = this.onFolderClick.bind(this)
        this.onFileClick = this.onFileClick.bind(this)
        this.onBack = this.onBack.bind(this)
        this.setRightClickAnchorEl = this.setRightClickAnchorEl.bind(this)
        this.handleRightClickClose = this.handleRightClickClose.bind(this)
        this.onRenameTextChange = this.onRenameTextChange.bind(this)
        this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
        this.onRenameConfirm = this.onRenameConfirm.bind(this)
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
            var fileItems = []
            res.forEach(item => {
                if (item.type === 'folder') {
                    files.push({ id: item.id, name: item.name, type: item.type, files: item.files, last_modified: item.last_modified, num_files: item.num_files })
                    fileItems.push({ id: item.id, name: item.name, type: item.type, files: item.files, last_modified: item.last_modified, num_files: item.num_files })
                } else if (item.type === 'graph') {
                    files.push({ id: item.id, name: item.name, type: item.type, root: item.root, last_modified: item.last_modified, img: item.img })
                }
            })
            this.setState({ files: files })
            this.enterFolder(this.state.currentFolder)
        }).catch(e => console.error(e))
    }

    enterFolder(id) {
        console.log("Entering folder: "+id)
        if (id === "") {
            var fileItems = []
            this.state.files.forEach(item => {
                if(item.root === "" || item.type === 'folder'){
                    fileItems.push(item)
                }
            })
            this.setState({ fileItems: fileItems, currentFolder: "" })
            return
        }
        var items = [];
        for (var i = 0; i < this.state.files.length; i++) {
            var item = this.state.files[i]
            if (item.type === "folder") continue
            if (item.root === id) {
                items.push(item)
            }
        }
        if (!items) return
        else this.setState({ fileItems: items,  currentFolder: id })
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
            createFolder(name, sessionStorage.getItem("userID")).then(() => {
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

    setRightClickAnchorEl(e) {
        if(e){
            e.preventDefault()
            this.setState({rightClickAnchorEl: e.currentTarget})
        }
        else
            this.setState({rightClickAnchorEl: null})
    }

    handleRightClickClose(e){
        if(!e) {
            this.setState({rightClickAnchorEl: null})
            return;
        }
        if(e.target.getAttribute("actionname") === "delete"){
            this.setState({deleteDialogOpen: true, 
                actionSelectedType: this.state.rightClickAnchorEl.getAttribute("datatype"),
            actionSelectedID: this.state.rightClickAnchorEl.getAttribute("datakey")})
        }else if (e.target.getAttribute("actionname") === "rename"){
            // rename
            this.setState({renameDialogOpen: true,
                actionSelectedType: this.state.rightClickAnchorEl.getAttribute("datatype"),
                actionSelectedID: this.state.rightClickAnchorEl.getAttribute("datakey")})
        }
        this.setRightClickAnchorEl(null)
    }

    onRenameTextChange(e){
        this.setState({renameText: e.target.value})
    }

    onRenameConfirm(){
        var targetType = this.state.actionSelectedType
        var targetID = this.state.actionSelectedID
        var name = this.state.renameText
        for(var i = 0 ; i < this.state.files.length; i++){
            var item = this.state.files[i]
            if(item.name === name){
                if(targetType === item.type || (targetType==='file' && item.type === 'graph')){
                    alert("File "+name + " already exists!")
                    this.setState({renameDialogOpen: false, renameText: ""})
                    return;
                }
            }
        }
        rename(sessionStorage.getItem("userEmail"), targetID, targetType, name).catch(e => alert(e))
        this.setState({renameDialogOpen: false, renameText: ""})
        this.loadData()
    }

    onDeleteConfirm(){
        var targetType = this.state.actionSelectedType
        var targetID = this.state.actionSelectedID
        if(targetType === "folder"){
            deleteFolder(sessionStorage.getItem("userEmail"), targetID).catch(e=>console.log(e))
        } else if (targetType === "file"){
            deleteFile(sessionStorage.getItem("userEmail"), targetID).catch(e=> console.log(e))
        }
        this.setState({deleteDialogOpen: false})
        this.loadData()
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

                    <Menu anchorEl={this.state.rightClickAnchorEl} 
                        open={Boolean(this.state.rightClickAnchorEl)} 
                        onClose={this.handleRightClickClose}
                        variant='menu'>
                        <MenuItem onClick={this.handleRightClickClose} actionname="delete">Delete</MenuItem>
                        <MenuItem onClick={this.handleRightClickClose} actionname="rename">Rename</MenuItem>
                    </Menu>

                    <Dialog open={this.state.deleteDialogOpen} onClose={()=>this.setState({deleteDialogOpen: false})} >
                        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this file?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>this.setState({deleteDialogOpen: false})} color="primary">Cancel</Button>
                            <Button onClick={this.onDeleteConfirm} color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.renameDialogOpen} onClose={()=>this.setState({renameDialogOpen: false})} >
                        <DialogTitle id="form-dialog-title">Rename</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Enter a new name for file
                            </DialogContentText>
                            <TextField autoFocus fullWidth margin="dense" id="foldername" onChange={this.onRenameTextChange} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>this.setState({renameDialogOpen: false})} color="primary">Cancel</Button>
                            <Button onClick={this.onRenameConfirm} color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>

                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        {this.state.fileItems.map(item => {
                            if (item.type === 'folder') {
                                return (
                                    <Grid item xs={2} key={item.id} datakey={item.id} 
                                        datatype="folder" onClick={this.onFolderClick} onContextMenu={this.setRightClickAnchorEl}>
                                        <FolderItem name={item.name} datakey={item.id} />
                                    </Grid>
                                )
                            } else if (item.type === 'graph') {
                                return (
                                    <Grid item xs={2} key={item.id} datakey={item.id} 
                                        datatype="file" onClick={this.onFileClick} onContextMenu={this.setRightClickAnchorEl}>
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