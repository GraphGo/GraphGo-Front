import React from "react";
import Header from "../../components/Header/Header";
import { Grid, Button } from '@material-ui/core'
import { getAllFiles, createFolder } from '../../API/file'
import FolderItem from '../../components/FolderItem/FolderItem'
import FileItem from '../../components/FileItem/FileItem'

class CMS extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            files: [],
            currentFolder: null
        };
        this.loadData = this.loadData.bind(this)
        this.onCreateFolderPopupConfirm = this.onCreateFolderPopupConfirm.bind(this)
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
            this.setState({files: files})
        }).catch(e => console.error(e))
    }

    onFolderClick() {
        console.log("Clicked")
    }

    onCreateFolderPopupConfirm(event){
        console.log("[CMS] --- Creating folder "+ name)
        createFolder("Create test", "liuhanshu2000@gmail.com").then(res=> {
            console.log(res)
        }).catch( e => {console.log(e)})
        this.loadData()
    }

    fileItems(){
        return this.state.files.map(item => {
            if(item.type === 'folder'){
                return (
                    <Grid item xs={2} key={item.id}>
                        <FolderItem name={item.name} />
                    </Grid>
                )
            }else if (item.type === 'graph'){
                return (
                    <Grid item xs={2} key={item.id}>
                        <FileItem name={item.name}></FileItem>
                    </Grid>
                )
            }
        })
    }

    render() {
        const gridStyle = {
            'marginTop': '35px'
        }

        return (
            <>
                <Header />
                <div className="main-page">
                    <Button variant='contained' onClick={this.onCreateFolderPopupConfirm}>Create</Button>
                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        {this.state.files.map(item => {
                            if(item.type === 'folder'){
                                return (
                                    <Grid item xs={2} key={item.id}>
                                        <FolderItem name={item.name} />
                                    </Grid>
                                )
                            }else if (item.type === 'graph'){
                                return (
                                    <Grid item xs={2} key={item.id}>
                                        <FileItem name={item.name}></FileItem>
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