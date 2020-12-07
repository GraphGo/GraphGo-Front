import React, { Component } from "react";
import classes from "./FontSizeSlider.module.css";
// import styled from 'styled-components';

class FontSizeSlider extends Component {

    state = {
        fontSize: 50,
    };

    handleInput = (e) =>{
        if (this.props.handler){
            this.props.handler(e.target.value);
        }
        this.setState({fontSize: e.target.value})
    }

    render(){

        return (
            <div className={classes.slidecontainer}>
                <input type="range" min="20" max="80" value={this.state.fontSize} className={classes.slider} id="strokeWidthInput" onChange={this.handleInput}/>
        <p>Font Size: <span id="demo">{this.state.fontSize}</span></p>
            </div>
      );
    }
}

export default FontSizeSlider;