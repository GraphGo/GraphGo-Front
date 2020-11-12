import React from 'react'
import folderSVG from '../../assets/folder-svg.svg'

const FolderItem = props => {
    return (
        <div className="folderItem" onClick={props.folderClick}>
            <img className="fileImg" src={folderSVG} />
            <h5 className="fileTitle">{props.name}</h5>
        </div>
    )
}

export default FolderItem