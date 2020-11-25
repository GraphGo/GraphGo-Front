import React from 'react'
import { Button, Dialog, IconButton, TextField } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh'
import AddIcon from '@material-ui/icons/Add';

export default function TopBar(props) {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState("");


    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        props.onSubmit(text)
    }

    const onTextChange = (e) => {
        setText(e.target.value)
    }

    return (
        <div className='top-bar'>
            <IconButton onClick={props.onRefresh}>
                <RefreshIcon />
            </IconButton>
            <IconButton onClick={handleClickOpen}>
                <AddIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle id="form-dialog-tilte">New Folder</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter name for new folder
                    </DialogContentText>
                    <TextField autoFocus fullWidth margin="dense" id="foldername" onChange={onTextChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleClose} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}