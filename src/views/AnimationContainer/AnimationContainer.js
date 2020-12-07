import React, { Component } from 'react';
import SmartObjsContext from '../../contexts/SmartObjsContext.js';

const LEFT = 0, 
      RIGHT = 1, 
      UP = 2, 
      DOWN = 3, 
      FONTSIZE = 50, 
      SPEED = 0.5, 
      X = 75, 
      Y = 100,
      Y_UP = 50,
      Y_UP_ADJ = 70,
      VALUE_IDX = 0,
      ORI_X_IDX = 1,
      ORI_Y_IDX = 2,
      NEW_X_IDX = 3,
      NEW_Y_IDX = 4,
      DELAYTIME = 5,
      HALF = 2;
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
        x: (i + 1) * X,
        y: Y,
        speed: {
          x: SPEED,
          y: SPEED
        }
      })
    }
    this.draw = this.draw.bind(this);
    this.move = this.move.bind(this);
    this.updateWithAnimation = this.updateWithAnimation.bind(this);
    this.swap = this.swap.bind(this);
    this.insertionSort = this.insertionSort.bind(this);
    this.selectionSort = this.selectionSort.bind(this);
    this.bubbleSort = this.bubbleSort.bind(this);
  }

  // Re-draw when React Context gets updated
  async componentDidUpdate(){
    
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
            await this.insertionSort();
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
    this.textSize = FONTSIZE;
    this.delay_time = DELAYTIME;
    this.ctx.font = this.textSize + "px Arial";
    this.ctx.fillStyle = this.context.smartObjStyle.color;

    // draw the array
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText('[', 0, Y);
    let i = 0;
    // draw every element in arr
    for (i = 0; i < this.arr.length; i++) {
      this.ctx.fillText(this.arr[i].value, this.arr[i].x, this.arr[i].y);
    }
    this.ctx.fillText(']', (this.arr.length + 1) * X, Y);

    //this.insertionSort();
    this.selectionSort();
    //this.bubbleSort();
  }

  // this function is used to asynchronously delay the animation frames
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // this function is used to redraw an element in an array
  draw(arr) {
    let i = 0;
    for (i = 0; i < arr.length; i++){
      this.ctx.clearRect(
        arr[i][ORI_X_IDX] - this.textSize / HALF, 
        arr[i][ORI_Y_IDX] - this.textSize, 
        this.textSize * 1.1, 
        this.textSize * 1.1
      );
      this.ctx.fillText(arr[i][VALUE_IDX],
                        arr[i][NEW_X_IDX],
                        arr[i][NEW_Y_IDX]);
    }
  }

  // this function is used to move an element
  move(idx, direction) {
    let value = this.arr[idx].value;
    let oriX = this.arr[idx].x;
    let oriY = this.arr[idx].y;
    switch(direction) {
      case UP:
        this.arr[idx].y -= this.arr[idx].speed.y;
        break;
      case DOWN:
        this.arr[idx].y += this.arr[idx].speed.y;
        break;
      case LEFT:
        this.arr[idx].x -= this.arr[idx].speed.x;
        break;
      case RIGHT:
        this.arr[idx].x += this.arr[idx].speed.x;
        break;
      default:
    }
    let newX = this.arr[idx].x;
    let newY = this.arr[idx].y;
    return [value, oriX, oriY, newX, newY];
  }

  // this function is update the array with animation
  // @param oriIdx: the original index of an element
  // @param newIdx: the new index of this element
  async updateWithAnimation(oriIdx, newIdx) {
    let inputArr;
    // move element up
    while (this.arr[oriIdx].y > Y_UP) {
      await this.delay(this.delay_time);
      this.draw([this.move(oriIdx, UP)]);
    }
    // choose which way to move by determining the positions of idxs
    if (oriIdx < newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x < this.arr[newIdx].x) {
        await this.delay(this.delay_time);
        this.draw([this.move(oriIdx, RIGHT)]);
      }

      let newXPos = this.arr[oriIdx + 1].x - X;
      // move the piece in between to left
      while (this.arr[oriIdx + 1].x > newXPos) {
        inputArr = [];
        let i = 1;
        for (i = 1; i <= newIdx - oriIdx; i++) {
          inputArr.push(this.move(oriIdx + i, LEFT));
        }
        await this.delay(this.delay_time);
        this.draw(inputArr);
      }
    }
    else if (oriIdx > newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x > this.arr[newIdx].x) {
        await this.delay(this.delay_time);
        this.draw([this.move(oriIdx, LEFT)]);
      }

      let newXPos = this.arr[newIdx].x + X;
      // move the piece in between to right
      while (this.arr[newIdx].x < newXPos) {
        inputArr = [];
        var i = 0;
        for (i = 0; i < oriIdx - newIdx; i++) {
          inputArr.push(this.move(newIdx + i, RIGHT));
        }
        await this.delay(this.delay_time);
        this.draw(inputArr); 
      }
    }
    // move element down
    while (this.arr[oriIdx].y < Y) {
      await this.delay(this.delay_time);
      this.draw([this.move(oriIdx, DOWN)]);
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

  // this function is swap two elements in the array
  // @param idx1: the index of the first element
  // @param idx2: the index of the second element
  async swap(idx1, idx2, adj) {
    if (idx1 > idx2) {
      let temp = idx1;
      idx1 = idx2;
      idx2 = temp;
    }
    let inputArr;
    let upY = Y_UP;
    if (adj){
      upY = Y_UP_ADJ;
    }
    // move elements up and down
    while (this.arr[idx1].y > upY) {
      inputArr = [];
      inputArr.push(this.move(idx1, UP));
      inputArr.push(this.move(idx2, DOWN));
      await this.delay(this.delay_time);
      this.draw(inputArr);
    }

    // move elements left and right
    let idx2X = this.arr[idx2].x;
    while (this.arr[idx1].x < idx2X) {
      inputArr = [];
      inputArr.push(this.move(idx1, RIGHT));
      inputArr.push(this.move(idx2, LEFT));
      await this.delay(this.delay_time);
      this.draw(inputArr);
    }

    // move elements up and down
    while (this.arr[idx1].y < Y) {
      inputArr = [];
      inputArr.push(this.move(idx1, DOWN));
      inputArr.push(this.move(idx2, UP));
      await this.delay(this.delay_time);
      this.draw(inputArr);
    }

    let temp = this.arr[idx1];
    this.arr[idx1] = this.arr[idx2];
    this.arr[idx2] = temp;
  }

  // this method is used to do the insertion sort for this.arr with animation
  async insertionSort() {
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
          await this.updateWithAnimation(j + 1, j);
          j = j - 1;  
        }
    } 
  }

  // this method is used to do the selection sort for this.arr with animation
  async selectionSort() {
    let i, j, min_idx;  
  
    // One by one move boundary of unsorted subarray  
    for (i = 0; i < this.arr.length - 1; i++)  
    {  
        // Find the minimum element in unsorted array  
        min_idx = i;  
        for (j = i + 1; j < this.arr.length; j++) {
          if (this.arr[j].value < this.arr[min_idx].value){
            min_idx = j;
          }
        }
  
        // Swap the found minimum element with the first element  
        if (i != min_idx) {
          if (Math.abs(i - min_idx) == 1){
            await this.swap(i, min_idx, true);
          }
          else {
            await this.swap(i, min_idx, false);  
          }
        }
    }  
  }

  // this method is used to do the bubble sort for this.arr with animation
  async bubbleSort() {
    let i, j;  
    for (i = 0; i < this.arr.length; i++){
      // Last i elements are already in place  
      for (j = 0; j < this.arr.length - i - 1; j++) {
          if (this.arr[j].value > this.arr[j+1].value){
              await this.swap(j, j + 1, true);
          }
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