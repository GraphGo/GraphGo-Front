import React, { Component } from "react";
import classes from "./AnimationMenuPopup.module.css";
import { CirclePicker } from 'react-color';
// import StrokeWidthSlider from "../StrokeWidthSlider/StrokeWidthSlider"
import SmartObjsContext from '../../contexts/SmartObjsContext.js';
import SpeedSlider from "../../components/SpeedSlider/SpeedSlider";
import FontSizeSlider from "../../components/FontSizeSlider/FontSizeSlider";

export const INSERSION_SORT = 'insertionSort';
export const SELECTION_SORT = 'selectionSort';
export const BUBBLE_SORT = 'bubbleSort';

class AnimationMenuPopup extends Component {
  constructor(props){
    super(props);
    this.state = {
      show: true, // TODO: set initial to false, true if right-click on a smart object
      onPreviewMenu: false,
    }
  }


  handleColorChange = (color) => {
    if (this.context && this.context.smartObjStyle){
      this.context.setSmartObjStyle({color: color.hex, fontSize: this.context.smartObjStyle.fontSize});
    }
    
  };

  handleFontSizeChange = (val) => {
    if (this.context && this.context.smartObjStyle){
      this.context.setSmartObjStyle({color: this.context.smartObjStyle.color, fontSize: val});
    }
  }
  
  handleCloseMenu = () => {
    this.setState({
      show: false
    });
    this.context.setShowAnimationMenu(false);
  }

  handleClickPlay = () => {
    // this.setState({
    //   onPreviewMenu: true
    // });
    this.context.setReplay(true);
  }

  handleClickRevert = () => {
    this.context.setRevert(true);
  }

  handleConfirmBtnClicked = () => {
    this.setState({
      onPreviewMenu: false
    });
  }

  toggleLoop = (e) => {
    // TODO: implement looping.
    this.context.setLoopingAnimation(e.target.checked);
  }

  handleSpeedChange = (speed) => {
    // TODO: implement animation speed.
    this.context.setAnimationSpeed(speed)
  }

  handleChangeSortType = (e) => {
    this.context.setSortType(e.target.value)
    console.log("context sort type setting to: ", e.target.value)
  }

  render() {
    return (
      (this.context.showAnimationMenu) ? 
      ( 
        // (!this.state.onPreviewMenu) ? 
      <div className={classes.AnimationMenuPopup} onClick={this.props.clicked}>
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
            Font Size
          </h3>
          <div className={classes.StrokeWidthSlider}>
            <FontSizeSlider handler={ this.handleFontSizeChange }/>
          </div>
        </section>
        <section>
            <h3>Data Structure</h3>
            <button className={classes.dataStructureBtn}>Array</button>
        </section>
        <section>
          <h3>Animation Type</h3>
          <div className={classes.animationType}>
					  <select id="contactVia" name="cars" onChange={this.handleChangeSortType}>
					  		<option value={INSERSION_SORT}>Insertion Sort</option>
                <option value={SELECTION_SORT}>Selection Sort</option>
					  		<option value={BUBBLE_SORT}>Bubble Sort</option>
                {/* <span class="focus"></span> */}
					  </select>
          </div>
        </section> 
        <section>
          <h3>Speed</h3>
          <div className={classes.SpeedSlider}>
            <SpeedSlider handler={this.handleSpeedChange}/>
          </div>
        </section>
        <section>
          <div className={classes.loop}>
          <h3>Loop</h3>
          <input id="loopCheckbox" type="checkbox" name="loop" onChange={this.toggleLoop}/>
          </div>
        </section>
        <button title="Play the animation" className={classes.previewBtn} onClick={this.handleClickPlay}>PLAY</button>
        <button title="Delete this smart object" className={classes.revertBtn} onClick={this.handleClickRevert}>DELETE</button>  
      </div> 
      // :
      // <div className={classes.AnimationMenuPopup}>
      //   <button className={classes.closeBtn} onClick={this.handleCloseMenu}>
      //     X
      //   </button>
      //   <section className={classes.previewWindow}>
      //     Animation Preview
      //   </section>
      //   <section>
      //     <h3>Speed</h3>
      //     <SpeedSlider/>
      //   </section>
      //   <section >
      //     <h3>Loop</h3>
      //     <input id="loopCheckbox" type="checkbox" name="loop" onChange={this.toggleLoop}/>
      //   </section>
      //   <button className={classes.revertBtn} onClick={this.handleConfirmBtnClicked}>CONFIRM</button>
      // </div>
      ) : null
    );
  }

}
AnimationMenuPopup.contextType = SmartObjsContext;
export default AnimationMenuPopup;