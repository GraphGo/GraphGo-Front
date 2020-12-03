import React, { Component } from "react";
import classes from "./SpeedSlider.module.css";

class SpeedSlider extends Component {

    state = {
        speed: 1, 
    };

    handleInput = (e) =>{
        if (this.props.handler){
            this.props.handler(e.target.value);
        }
        this.setState({speed: e.target.value})
    }

    render(){
        return (
            <div className={classes.slidecontainer}>
                <input type="range" min="0.5" max="3" step="0.25" value={this.state.speed} className={classes.slider} id="strokeWidthInput" onChange={this.handleInput}/>
                <p>Speed: <span id="demo">{this.state.speed}</span></p>
            </div>
      );
    }
}

export default SpeedSlider;