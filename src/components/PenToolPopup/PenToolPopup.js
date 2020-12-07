import React, { Component } from "react";
import classes from "./PenToolPopup.module.css";
import { CirclePicker } from 'react-color'
import StrokeWidthSlider from "../StrokeWidthSlider/StrokeWidthSlider"
import SmartObjsContext from '../../contexts/SmartObjsContext.js';

class PenToolPopup extends Component {

  handleColorChange = (color) => {
    this.setState({ background: color.hex });
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.strokeStyle = color.hex;
    if (this.context && this.context.smartObjStyle){
      this.context.smartObjStyle.color = color.hex;
    }
    
  };

  handleSliderInput = (val) =>{
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.lineWidth = val;
}

  render() {
    return (
      this.props.show ? 
      (<div className={classes.PenToolPopup} onClick={this.props.clicked}>
        <div className={classes.ColorPicker}>
          <CirclePicker
          //  color={ this.state.strokeColor }
           onChangeComplete={ this.handleColorChange }
         />
        </div>
        <div className={classes.StrokeWidthSlider}>
        <StrokeWidthSlider handler={this.handleSliderInput}/>
        </div>
       
      </div>) : null
    );
  }

}

PenToolPopup.contextType = SmartObjsContext;
export default PenToolPopup;