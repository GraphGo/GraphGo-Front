import React from 'react'
import fileSVG from '../../assets/icons/file.svg'
import classes from '../FolderItem/FolderItem.module.css'


const FileItem = props => {
    return (
        <div className="fileItem" onClick={props.folderClick} datakey={props.datakey} >
            <img className="fileImg" src={fileSVG} datakey={props.datakey} />
            <h5 className="fileTitle" datakey={props.datakey}>{props.name}</h5>
        </div>
    )
}

export default FileItem