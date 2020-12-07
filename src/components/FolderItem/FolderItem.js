import React from 'react'
import folderSVG from '../../assets/icons/folder2.svg'

const FolderItem = props => {
    return (
        <div className="folderItem" datakey={props.datakey}>
            <img className="fileImg" src={folderSVG} datakey={props.datakey}/>
            <h5 className="fileTitle" datakey={props.datakey}>{props.name}</h5>
        </div>
    )
}

export default FolderItem