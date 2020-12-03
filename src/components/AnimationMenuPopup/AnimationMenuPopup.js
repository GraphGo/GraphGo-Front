import React, { Component } from "react";
import classes from "./AnimationMenuPopup.module.css";
import { CirclePicker } from 'react-color'
import StrokeWidthSlider from "../StrokeWidthSlider/StrokeWidthSlider"
import SmartObjsContext from '../../contexts/SmartObjsContext.js';
import SpeedSlider from "../../components/SpeedSlider/SpeedSlider";

class AnimationMenuPopup extends Component {
  constructor(props){
    super(props);
    this.state = {
      show: true, // TODO: set initial to false, true if right-click on a smart object
      onPreviewMenu: false,
    }
  }


  handleColorChange = (color) => {
    this.context.setSmartObjStyle({color: color.hex, strokeWidth: this.context.smartObjStyle.strokeWidth});
  };

  handleStrokeWidthChange = (val) => {
    console.log(val);
    console.log(val/3*90, Math.round(val/3*90/100)*100);
    
    this.context.setSmartObjStyle({color: this.context.smartObjStyle.color, strokeWidth: Math.round(val/3*90/100)*100});
  }
  
  handleCloseMenu = () => {
    this.setState({
      show: false
    });
  }

  handlePreivewBtnClicked = () => {
    this.setState({
      onPreviewMenu: true
    });
  }

  handleConfirmBtnClicked = () => {
    this.setState({
      onPreviewMenu: false
    });
  }

  toggleLoop = (e) => {
    // TODO: implement looping.
    console.log(e.target.checked);
  }

  handleSpeedChange = (speed) => {
    // TODO: implement animation speed.

  }

  render() {
    return (
      (this.state.show) ? 
      ( (!this.state.onPreviewMenu) ? <div className={classes.AnimationMenuPopup} onClick={this.props.clicked}>
        <button className={classes.closeBtn} onClick={this.handleCloseMenu}>
          X
        </button>
        <section>
          <h3>
              Stroke Color
          </h3>
          <div className={classes.ColorPicker}>
            <CirclePicker
            // className={classes.ColorPicker}
            //  color={ this.state.strokeColor }
             onChangeComplete={ this.handleColorChange }
           />
          </div>
        </section>
        <section>
          <h3>
            Stroke Width
          </h3>
          <div className={classes.StrokeWidthSlider}>
            <StrokeWidthSlider handler={ this.handleStrokeWidthChange }/>
          </div>
        </section>
        <section>
            <h3>Data Structure</h3>
            <button className={classes.dataStructureBtn}>Array</button>
        </section>
        <section>
          <h3>Animation Type</h3>
          <div className={classes.animationType}>
					  <select id="contactVia" name="cars">
					  		<option value="volvo" onClick={this.handleAnimationType}>Bubble Sort</option>
					  		<option value="saab">Bubble Sort</option>
                {/* <span class="focus"></span> */}

					  </select>
          </div>
        </section> 
        <button className={classes.previewBtn} onClick={this.handlePreivewBtnClicked}>PREVIEW</button>
        <button className={classes.revertBtn}>REVERT</button>  
      </div> :
      <div className={classes.AnimationMenuPopup}>
        <button className={classes.closeBtn} onClick={this.handleCloseMenu}>
          X
        </button>
        <section className={classes.previewWindow}>
          Animation Preview
        </section>
        <section>
          <h3>Speed</h3>
          <SpeedSlider/>
        </section>
        <section style={{display:"inline-flex", position:"absolute", left:"0"}}>
          <h3>Loop</h3>
          <input id="loopCheckbox" type="checkbox" name="loop" onChange={this.toggleLoop}/>
        </section>
        <button className={classes.revertBtn} onClick={this.handleConfirmBtnClicked}>CONFIRM</button>
      </div> ) : null
    );
  }

}
AnimationMenuPopup.contextType = SmartObjsContext;
export default AnimationMenuPopup;