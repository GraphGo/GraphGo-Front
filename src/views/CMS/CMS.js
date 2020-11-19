import React from "react";
import Header from "../../components/Header/Header";
import { Grid, Button } from '@material-ui/core'
import { getAllFiles, getFileById } from '../../API/file'
import FolderItem from '../../components/FolderItem/FolderItem'
import FileItem from '../../components/FileItem/FileItem'

class CMS extends React.Component {
    constructor(props) {
        super(props) 
        this.files = [] // all files, reload using loadData
        this.fileItems = []
        this.currentFolder = null // current path
        this.loadData = this.loadData.bind(this)
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
            this.files = res
            console.log(res)
        }).catch(e => console.error(e))
        this.renderFiles()
    }

    onFolderClick() {
        console.log("Clicked")
    }

    renderFiles(){
        if(!this.currentFolder){
            this.fileItems = this.files.map(item => {
                console.log(item)
                if(item.type === 'folder'){
                    return (
                        <Grid item xs={2}>
                            <FolderItem name={item.name} />
                        </Grid>
                    )
                }else if (item.type === 'graph'){
                    return (
                        <Grid item xs={2}>
                            <FileItem name={item.name}></FileItem>
                        </Grid>
                    )
                }
            })
        }
    }


    render() {
        const gridStyle = {
            'marginTop': '35px'
        }

        return (
            <>
                <Header />
                <div className="main-page">
                    <Button variant='contained' color='secondary' onClick={() => this.loadData()}>Refresh</Button>
                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        {this.fileItems}
                    </Grid>
                </div>
            </>
        )
    }
}

export default CMS;