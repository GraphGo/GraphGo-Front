import { Button, Dialog, TextField, DialogContent, DialogActions, DialogTitle, DialogContentText } from "@material-ui/core"
import { useState } from "react"

/**
 * Renders save graph prompt when new graph is being saved
 * @param {*} props 
 */
export default function SaveDialog(props) {

    const [text, setText] = useState("");
    const handleClose = () => {
        props.closeDialog();
    }

    const handleSubmit = () => {
        if (text === "") {
            alert("Name the file before saving it");
        } else {
            handleClose();
            props.saveGraph(text);
        }

    }

    const onTextChange = (e) => {
        setText(e.target.value)
    }
    return (
        <Dialog open={props.open} onClose={handleClose} >
            <DialogTitle id="form-dialog-tilte">New File</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter name for new graph file
            </DialogContentText>
                <TextField autoFocus fullWidth margin="dense" id="foldername" onChange={onTextChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}