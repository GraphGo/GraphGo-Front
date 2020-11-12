import React from 'react'
import fileSVG from '../../assets/file-svg.svg'
import classes from '../FolderItem/FolderItem.module.css'


const FileItem = props => {
    return (
        <div className="fileItem" onClick={props.folderClick}>
            <img className="fileImg" src={fileSVG} />
            <h5 className="fileTitle">{props.name}</h5>
        </div>
    )
}

export default FileItem