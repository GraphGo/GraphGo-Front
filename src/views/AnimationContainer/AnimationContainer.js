import React, { Component } from 'react';
import _ from 'lodash'
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
    this.sleep = this.sleep.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById("animationCanvas"+this.props.smartObject.index);
    this.canvas.width = this.props.smartObject.width;
    this.canvas.height = this.props.smartObject.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "60px Arial";
    this.draw(this.arr);
    this.insertionSort();
  }

  // this function is used to synchronously draw the elements
  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  // this function is used to animate the updated array
  animate(arr) {
    window.setTimeout(function(arr) {this.sleep(3);this.draw(arr);}.bind(this), 3000, arr);
  }

  // this function is used to draw an array
  draw(arr) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText('\[', 0, 100);
    let i = 0;
    // draw every element in arr
    for (i = 0; i < arr.length; i++) {
      this.ctx.fillText(arr[i].value, arr[i].x, arr[i].y);
    }
    this.ctx.fillText('\]', arr.length * 75 + 75, 100);
  }

  // this function is update the array with animation
  // @param oriIdx: the original index of an element
  // @param newIdx: the new index of this element
  updateWithAnimation(oriIdx, newIdx) {
    // move element up
    while (this.arr[oriIdx].y != 40) {
      this.arr[oriIdx].y -= this.arr[oriIdx].speed.y;
      this.animate(_.cloneDeep(this.arr));
    }
    // choose which way to move by determining the positions of idxs
    if (oriIdx < newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        this.arr[oriIdx].x += this.arr[oriIdx].speed.x;
        this.animate(_.cloneDeep(this.arr));
      }
      let xPos = this.arr[oriIdx + 1].x;
      let newXPos = this.arr[oriIdx + 1].x - 75;
      // move the piece in between to left
      while (xPos != newXPos) {
        let i = 1;
        for (i = 1; i <= newIdx - oriIdx; i++) {
          this.arr[oriIdx + i].x -= this.arr[oriIdx + i].speed.x;
        }
        xPos -= this.arr[oriIdx + 1].speed.x;
        this.animate(_.cloneDeep(this.arr));
      }
    }
    else if (oriIdx > newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        this.arr[oriIdx].x -= this.arr[oriIdx].speed.x;
        this.animate(_.cloneDeep(this.arr));
      }

      let xPos = this.arr[newIdx + 1].x;
      let newXPos = xPos + 75;
      // move the piece in between to right
      while (xPos != newXPos) {
        var i = 0;
        for (i = 0; i < oriIdx - newIdx; i++) {
          this.arr[newIdx + i].x += this.arr[newIdx + i].speed.x;
        }
        xPos += this.arr[newIdx].speed.x;
        this.animate(_.cloneDeep(this.arr));
      }
    }
    // move element down
    while (this.arr[oriIdx].y != 100) {
      this.arr[oriIdx].y += this.arr[oriIdx].speed.y;
      this.animate(_.cloneDeep(this.arr));
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

  render() {
    return (
      <div style={{"position":"absolute", "top":`${this.props.smartObject.top}px`, "left":`${this.props.smartObject.left}px`, "zIndex":"1"}}>
      <canvas id={"animationCanvas"+this.props.smartObject.index}></canvas>
      </div>
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

export default AnimationContainer;