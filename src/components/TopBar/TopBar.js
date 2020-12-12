import React from 'react'
import { Button, Dialog, IconButton, TextField, Menu, MenuItem } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';

export default function TopBar(props) {
    const [folderDialogOpen, setFolderDialogOpen] = React.useState(false);
    const [text, setText] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [graphDialogOpen, setGraphDialogOpen] = React.useState(false)

    const handleCreateFolderOpen = () => {
        setFolderDialogOpen(true)
    }

    const handleCreateFolderClose = () => {
        setFolderDialogOpen(false)
    }

    const handleCreateFolderSubmit = () => {
        setFolderDialogOpen(false)
        props.onSubmit(text, "folder")
    }


    const onTextChange = (e) => {
        setText(e.target.value)
    }

    const handleDropdownOpen = (e)=>{
        setAnchorEl(e.currentTarget)
    }

    const handleDropdownClose = (e)=>{
        if(e.target.getAttribute("datakey") === "newFolder"){
            if(props.addDisabled){
                alert("Sorry, cannot create folder in a folder (yet).")
                setAnchorEl(null)
                return;
            }
            handleCreateFolderOpen()
        }else if(e.target.getAttribute("datakey") === "newGraph"){
            handleCreateGraphOpen()
        }
        setAnchorEl(null)
    }

    const handleCreateGraphOpen = () => {
        setGraphDialogOpen(true)
    }

    const handleCreateGraphClose = () =>{
        setGraphDialogOpen(false)
    }

    const handleCreateGraphSubmit = () => {
        setGraphDialogOpen(false)
        props.onSubmit(text, "graph")
    }

    return (
        <div className='top-bar'>
            <IconButton onClick={props.onBack} disabled={props.backDisabled} >
                <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            <IconButton onClick={props.onRefresh}>
                <RefreshIcon />
            </IconButton>
            <IconButton id="addButton" onClick={handleDropdownOpen}>
                <AddIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
                <MenuItem onClick={handleDropdownClose} dataKey='newFolder'>New Folder</MenuItem>
                <MenuItem onClick={handleDropdownClose} dataKey='newGraph'>New Graph</MenuItem>
            </Menu>

            <Dialog open={folderDialogOpen} onClose={handleCreateFolderClose} >
                <DialogTitle id="form-dialog-tilte">New Folder</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter name for new folder
                    </DialogContentText>
                    <TextField autoFocus fullWidth margin="dense" id="foldername" onChange={onTextChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateFolderClose} color="primary">Cancel</Button>
                    <Button onClick={handleCreateFolderSubmit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={graphDialogOpen} onClose={handleCreateGraphClose}>
                <DialogTitle id="form-dialog-tilte">New graph</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter name for new graph
                    </DialogContentText>
                    <TextField autoFocus fullWidth margin="dense" id="foldername" onChange={onTextChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateGraphClose} color="primary">Cancel</Button>
                    <Button onClick={handleCreateGraphSubmit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}