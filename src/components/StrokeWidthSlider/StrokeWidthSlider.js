import React, { Component } from "react";
import classes from "./StrokeWidthSlider.module.css";
// import styled from 'styled-components';

class StrokeWidthSlider extends Component {

    state = {
        strokeWidth: 5,
        
    };

    handleInput = (e) =>{
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        context.lineWidth = e.target.value;
        this.setState({strokeWidth: e.target.value})
    }

    render(){
        // TODO: problem with Slider using styled.input - thumb not sliding smoothly. 
        // const StyledInput = styled.input`
        // -webkit-appearance: none;
        // width: 100%;
        // height: 10px;
        // border-radius: 5px;
        // background: #d3d3d3;
        // outline: none;
        // opacity: 0.7;
        // -webkit-transition: 0.2s;
        // transition: opacity 0.2s;

        // :hover {
        //     opacity: 1;
        //   }
          
        // ::-webkit-slider-thumb {
        //     -webkit-appearance: none;
        //     /* appearance: none; */
        //     width: ${this.state.strokeWidth}px;
        //     height: ${this.state.strokeWidth}px;
        //     border: 0;
        //     border-radius: 50%;
        //     background-color: white;
        //     /* background: url("contrasticon.png"); */
        //     cursor: pointer;
        //   }
          
        // ::-moz-range-thumb {
        //     width: ${this.state.strokeWidth}px;
        //     height: ${this.state.strokeWidth}px;
        //     border: 0;
        //     border-radius: 50%;
        //     background-color: white;
        //     /* background: url("contrasticon.png"); */
        //     cursor: pointer;
        // }`
        
        return (
            <div className={classes.slidecontainer}>
                <input type="range" min="1" max="30" value={this.state.strokeWidth} className={classes.slider} id="strokeWidthInput" onChange={this.handleInput}/>
        <p>Stroke Width: <span id="demo">{this.state.strokeWidth}</span></p>
            </div>
      );
    }
}

export default StrokeWidthSlider;