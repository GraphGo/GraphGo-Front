import React from "react";
import Header from "../../components/Header/Header";
import { Grid, ButtonBase } from '@material-ui/core'
import { getAllFiles, createFolder } from '../../API/file'
import FolderItem from '../../components/FolderItem/FolderItem'
import FileItem from '../../components/FileItem/FileItem'
import TopBar from '../../components/TopBar/TopBar'

class CMS extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            files: [], // store all files
            fileItems:[], // store currently displayed files
            currentFolder: "" // id of current route 
        };
        this.loadData = this.loadData.bind(this)
        this.onCreateFolderPopupConfirm = this.onCreateFolderPopupConfirm.bind(this)
        this.onFolderClick = this.onFolderClick.bind(this)
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount(){
        // TODO: use user email from Context
        console.log("[CMS] --- Component loaded")
        this.loadData()
    }

    componentWillUnmount() {

    }

    loadTestData(){

    }   

    loadData(){
        console.log("[CMS] --- Reloading data")
        getAllFiles("liuhanshu2000@gmail.com").then(res => {
            var files = []
            res.forEach(item => {
                if(item.type === 'folder'){
                    files.push({id: item.id, name: item.name, type: item.type, files: item.files, last_modified: item.last_modified, num_files: item.num_files})
                } else if (item.type==='graph'){
                    files.push({id: item.id, name: item.name, type: item.type, root: item.root, last_modified: item.last_modified, img: item.img})
                }
            })
            this.setState({fileItems: files, files: files})
        }).catch(e => console.error(e))
    }

    enterFolder(id){
        if(id === ""){
            this.setState({fileItems: this.state.files, currentFolder: ""})
            return 
        }
        var root = {};
        for(var i = 0; i < this.state.files.length; i++){
            var item = this.state.files[i]
            if(item.type !== "folder") continue
            if (item.id === id){
                root = item
            }
        }
        if(!root) return
        else this.setState({fileItems: root.files, currentFolder: id})
    }

    onFolderClick(e) {
        var id=e.target.getAttribute("datakey")
        this.enterFolder(id)
    }

    onBack(){
        this.setState({currentFolder: ""})
        this.enterFolder("")
    }

    onCreateFolderPopupConfirm(folderName) {
        console.log("[CMS] --- Creating folder "+ folderName)
        createFolder(folderName, "liuhanshu2000@gmail.com").then(res=> {
            this.loadData()
        }).catch(e => {console.log(e)})
    }

    render() {
        const gridStyle = {
            'marginTop': '35px'
        }

        return (
            <>
                <Header />
                <div className="main-page">
                    <TopBar addDisabled={this.state.currentFolder !== ""} 
                    backDisabled={this.state.currentFolder === ""} 
                    onBack={this.onBack} onRefresh={this.loadData} 
                    onSubmit={this.onCreateFolderPopupConfirm} 
                    />

                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        {this.state.fileItems.map(item => {
                            if(item.type === 'folder'){
                                return (
                                    <Grid item xs={3} key={item.id} datakey={item.id} onClick={this.onFolderClick}>
                                        <FolderItem name={item.name} datakey={item.id} />
                                    </Grid>
                                )
                            }else if (item.type === 'graph'){
                                return (
                                    <Grid item xs={3} key={item.id} datakey={item.id} >
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