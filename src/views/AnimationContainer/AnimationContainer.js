import React, { Component } from 'react';
import SmartObjsContext from '../../contexts/SmartObjsContext.js';

class AnimationContainer extends Component {
  constructor(props) {
    super(props);
    this.arr = [];
    this.props = props;
    let i = 0;
    let inputArray = props.smartObject.data;
    for (i = 0; i < inputArray.length; i++) {
      this.arr.push({
        value: inputArray[i],
        x: (i + 1) * 75,
        y: 100,
        speed: {
          x: 0.5,
          y: 0.5
        }
      })
    }
    this.draw = this.draw.bind(this);
    this.animate = this.animate.bind(this);
    this.updateWithAnimation = this.updateWithAnimation.bind(this);
    this.insertionSort = this.insertionSort.bind(this);
  }

  // Re-draw when React Context gets updated
  componentDidUpdate(){
    
    if (this.context && this.context.smartObjStyle){
      // console.log(this.context, this.context.smartObjStyle);
      if (this.props.index == this.context.smartObjSelected){
        console.log("Change", this.context.smartObjSelected, "th Smart Object property.")
        this.canvas = document.getElementById("animationCanvas"+this.props.smartObject.index);
        this.canvas.width = this.props.smartObject.width;
        this.canvas.height = this.props.smartObject.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = this.context.smartObjStyle.color;
        this.textSize = this.context.smartObjStyle.fontSize;
        this.ctx.font = this.context.smartObjStyle.fontSize + "px Arial";
    
        // draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText('[', 0, 100);
        for (let i = 0; i < this.arr.length; i++) {
          this.ctx.fillText(this.arr[i].value, this.arr[i].x, this.arr[i].y);
        }
        this.ctx.fillText(']', this.arr.length * 75 + 75, 100);
    
        if (this.context.replay){
          this.context.setReplay(false);
          let loops = this.context.loopingAnimation ? 10 : 1;
          for (let i = 0; i < loops; i++){
            this.arr = [];
            for (let i = 0; i < this.props.smartObject.data.length; i++) {
              this.arr.push({
                value: this.props.smartObject.data[i],
                x: (i + 1) * 75,
                y: 100,
                speed: {
                  x: 0.5,
                  y: 0.5
                }
              })
            }
            // draw
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillText('[', 0, 100);
            for (let i = 0; i < this.arr.length; i++) {
              this.ctx.fillText(this.arr[i].value, this.arr[i].x, this.arr[i].y);
            }
            this.ctx.fillText(']', this.arr.length * 75 + 75, 100);
            this.insertionSort();
          }
          
        }

        
        
        if(this.context.revert){
          this.context.setRevert(false);
          if (window.confirm("Are you sure you want to remove this animation?")) {
            this.props.removeSmartObject(this.props.smartObject.index);
            this.context.setShowAnimationMenu(false);
          }
        }
      }  
    }
}

  componentDidMount() {

    this.canvas = document.getElementById("animationCanvas"+this.props.smartObject.index);
    this.canvas.width = this.props.smartObject.width;
    this.canvas.height = this.props.smartObject.height;
    this.ctx = this.canvas.getContext("2d");
    this.textSize = 50;
    this.ctx.font = this.textSize + "px Arial";

    // draw the array
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText('[', 0, 100);
    let i = 0;
    // draw every element in arr
    for (i = 0; i < this.arr.length; i++) {
      this.ctx.fillText(this.arr[i].value, this.arr[i].x, this.arr[i].y);
    }
    this.ctx.fillText(']', this.arr.length * 75 + 75, 100);

    this.insertionSort();
  }

  // this function is used to animate the updated array
  animate(arr) {
    window.setTimeout(this.draw, 10, arr);
  }

  // this function is used to redraw an element in an array
  draw(arr) {
    let i = 0;
    for (i = 0; i < arr.length; i++){
      this.ctx.clearRect(
        arr[i][1], 
        arr[i][2] - this.textSize, 
        this.textSize * 1.2, 
        this.textSize * 1.2
      );
      this.ctx.fillText(arr[i][0], arr[i][3], arr[i][4]);
    }
  }

  // this function is update the array with animation
  // @param oriIdx: the original index of an element
  // @param newIdx: the new index of this element
  updateWithAnimation(oriIdx, newIdx) {
    let oriX, oriY, newX, newY, value, inputArr;
    // move element up
    while (this.arr[oriIdx].y != 50) {
      value = this.arr[oriIdx].value;
      oriX = this.arr[oriIdx].x;
      oriY = this.arr[oriIdx].y;
      this.arr[oriIdx].y -= this.arr[oriIdx].speed.y;
      newX = this.arr[oriIdx].x;
      newY = this.arr[oriIdx].y;
      inputArr = [[value, oriX, oriY, newX, newY]];
      //this.animate(_.cloneDeep(this.arr));
      this.animate(inputArr);
    }
    // choose which way to move by determining the positions of idxs
    if (oriIdx < newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        value = this.arr[oriIdx].value;
        oriX = this.arr[oriIdx].x;
        oriY = this.arr[oriIdx].y;
        this.arr[oriIdx].x += this.arr[oriIdx].speed.x;
        newX = this.arr[oriIdx].x;
        newY = this.arr[oriIdx].y;
        inputArr = [[value, oriX, oriY, newX, newY]];
        //this.animate(_.cloneDeep(this.arr));
        this.animate(inputArr);
      }
      let xPos = this.arr[oriIdx + 1].x;
      let newXPos = this.arr[oriIdx + 1].x - 75;
      // move the piece in between to left
      while (xPos != newXPos) {
        inputArr = [];
        let i = 1;
        for (i = 1; i <= newIdx - oriIdx; i++) {
          value = this.arr[oriIdx + i].value;
          oriX = this.arr[oriIdx + i].x;
          oriY = this.arr[oriIdx + i].y;
          this.arr[oriIdx + i].x -= this.arr[oriIdx + i].speed.x;
          newX = this.arr[oriIdx + i].x;
          newY = this.arr[oriIdx + i].y;
          inputArr.push([value, oriX, oriY, newX, newY]);
        }
        xPos -= this.arr[oriIdx + 1].speed.x;
        //this.animate(_.cloneDeep(this.arr));
        this.animate(inputArr);
      }
    }
    else if (oriIdx > newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        value = this.arr[oriIdx].value;
        oriX = this.arr[oriIdx].x;
        oriY = this.arr[oriIdx].y;
        this.arr[oriIdx].x -= this.arr[oriIdx].speed.x;
        newX = this.arr[oriIdx].x;
        newY = this.arr[oriIdx].y;
        inputArr = [[value, oriX, oriY, newX, newY]];
        //this.animate(_.cloneDeep(this.arr));
        this.animate(inputArr);
      }

      let xPos = this.arr[newIdx + 1].x;
      let newXPos = xPos + 75;
      // move the piece in between to right
      while (xPos != newXPos) {
        inputArr = [];
        var i = 0;
        for (i = 0; i < oriIdx - newIdx; i++) {
          value = this.arr[newIdx + i].value;
          oriX = this.arr[newIdx + i].x;
          oriY = this.arr[newIdx + i].y;
          this.arr[newIdx + i].x += this.arr[newIdx + i].speed.x;
          newX = this.arr[newIdx + i].x;
          newY = this.arr[newIdx + i].y;
          inputArr.push([value, oriX, oriY, newX, newY]);
        }
        xPos += this.arr[newIdx].speed.x;
        //this.animate(_.cloneDeep(this.arr));
        this.animate(inputArr); 
      }
    }
    // move element down
    while (this.arr[oriIdx].y != 100) {
      value = this.arr[oriIdx].value;
      oriX = this.arr[oriIdx].x;
      oriY = this.arr[oriIdx].y;
      this.arr[oriIdx].y += this.arr[oriIdx].speed.y;
      newX = this.arr[oriIdx].x;
      newY = this.arr[oriIdx].y;
      inputArr = [[value, oriX, oriY, newX, newY]];
      //this.animate(_.cloneDeep(this.arr));
      this.animate(inputArr);
    }

    // update the array move the element in the array
    if (oriIdx < newIdx) {
      this.arr.splice(newIdx + 1, 0, this.arr[oriIdx]);
      this.arr.splice(oriIdx, 1);
    }
    else {
      this.arr.splice(newIdx, 0, this.arr[oriIdx]);
      this.arr.splice(oriIdx + 1, 1);
    }
  }

  insertionSort() {
    let i = 1;
    let key = null;
    let j = 0; 
    for (i = 1; i < this.arr.length; i++) 
    {  
        key = this.arr[i].value;  
        j = i - 1;  
  
        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        while (j >= 0 && this.arr[j].value > key) 
        {  
          this.updateWithAnimation(j + 1, j);
          j = j - 1;  
        }
    } 
  }

  handleRightClick = (e) => {
    e.preventDefault();
    this.context.setShowAnimationMenu(true);
  }

  render() {
    return (
       <canvas id={"animationCanvas"+this.props.smartObject.index} onClick={() => {
         if (window.confirm("Are you sure you want to remove this animation?")) {
            this.props.removeSmartObject(this.props.smartObject.index);
         }
       }} onContextMenu={this.handleRightClick} style={{border: '3px dotted'}}></canvas>
     /*  <div style={{
        "width": "100%",
        "height": "100%",
        "background-color": "white",
        "display": "table-row",
        "position":"fixed",
        "z-index":"999"
      }} onClick={window.alert("You have clicked on smart object")}>
        <div style={{ "font-size": "50px", "display": "table-cell", "padding": "30px" }}>
          {"["}
        </div>
        {this.state.arr.map(element => {
          return (
            <div style={{ "font-size": "50px", "display": "table-cell", "padding": "30px" }}>
              {element.value}
            </div>
          );
        })}
        <div style={{ "font-size": "50px", "display": "table-cell", "padding": "30px" }}>
          {"]"}
          </div>
        </div> */
    );
  }
}
AnimationContainer.contextType = SmartObjsContext;
export default AnimationContainer;