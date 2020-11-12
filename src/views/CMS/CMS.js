import React from "react";
import Header from "../../components/Header/Header";
import { Grid } from '@material-ui/core'
import { File, getAllFiles } from '../../API/file'
import FolderItem from '../../components/FolderItem/FolderItem'
import FileItem from '../../components/FileItem/FileItem'

class CMS extends React.Component {
    constructor(props) {
        super(props) 
        this.files = [] // all files, reload using loadData
        this.currentFolder = null // current path
        this.onFolderClick.bind(this)
    }

    componentDidMount(){
        // TODO: use user email from Context
        this.loadData()
    }

    componentWillUnmount() {

    }

    loadData(){
        getAllFiles("liuhanshu2000@gmail.com").then(res => {
            this.files = res
        }).catch(e => console.error(e))
    }

    onFolderClick() {
        console.log("Clicked")
    }


    render() {
        const gridStyle = {
            "margin-top": '35px'
        };

        return (
            <>
                <Header />
                <div className="main-page">
                    <Grid style={gridStyle} container direction='row' justify='flex-start' alignItems='flex-start'>
                        <Grid style={gridStyle} item xs={2}>
                            <FolderItem name="new folder" folderClick={this.onFolderClick} />
                        </Grid>
                        <Grid style={gridStyle} item xs={2}>
                            <FileItem name='folder 2' />
                        </Grid>
                        <Grid style={gridStyle} item xs={2}>
                            <FolderItem name="new folder" />
                        </Grid>
                        <Grid style={gridStyle}item xs={2}>
                            <FolderItem name="new folder" />
                        </Grid>
                        <Grid style={gridStyle}item xs={2}>
                            <FolderItem name="Folder with a really really long name and everything and really really long name so long" />
                        </Grid>
                        <Grid style={gridStyle}item xs={2}>
                            <FolderItem name="new folder" />
                        </Grid>
                    </Grid>
                </div>
            </>
        )
    }
}

export default CMS;