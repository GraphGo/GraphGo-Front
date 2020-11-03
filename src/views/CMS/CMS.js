import React from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import { File, getAllFiles } from '../../API/file'

class CMS extends React.Component {
    constructor(props) {
        super(props)
        this.files = []
    }

    componentDidMount(){
        getAllFiles("liuhanshu2000@gmail.com").then(res => {
            this.files = res
        }).catch(e => console.error(e))
    }

    render() {
        return (
            <>
                <Header />
            </>
        )
    }
}