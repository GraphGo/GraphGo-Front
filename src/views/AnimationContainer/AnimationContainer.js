import React, { Component } from 'react';
import styled from 'styled-components';

class AnimationContainer extends Component {
  constructor(props) {
    super(props);
    this.arr = [];
    let i = 0;
    let inputArray = props.smartObject.data;
    var canvas = document.getElementById("myCanvas");
    canvas.width = props.smartObject.width;
    canvas.height = props.smartObject.height;
    var ctx = canvas.getContext("2d");
    ctx.font = "10px Georgia";
    for (i = 0; i < inputArray.length; i++) {
      this.arr.push({
        value: inputArray[i],
        x: (i + 1) * 15,
        y: 15,
        speed: {
          x: 0.5,
          y: 0.5
        }
      })
    }
  }

  componentDidMount() {
    this.draw();
  }

  componentWillMount() {
    this.insertionSort();
  }

  // this function is used to animate the updated array
  animate() {
    requestAnimationFrame(this.draw);
  }

  // this function is used to draw an array
  draw() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText('\[', 0, 15);
    var i = 0;
    // draw every element in arr
    for (i = 0; i < this.arr.length; i++) {
      ctx.fillText(this.arr[i].value, this.arr[i].x, this.arr[i].y);
    }
    ctx.fillText('\]', this.arr[this.arr.length - 1].x + 15, 15);
  }

  // this function is update the array with animation
  // @param oriIdx: the original index of an element
  // @param newIdx: the new index of this element
  updateWithAnimation(oriIdx, newIdx) {
    // move element up
    while (this.arr[oriIdx].y != 0) {
      this.arr[oriIdx].y -= this.arr[oriIdx].speed.y;
      this.animate();
    }
    // choose which way to move by determining the positions of idxs
    if (oriIdx < newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x + 15) {
        this.arr[oriIdx].x += this.arr[oriIdx].speed.x;
        this.animate();
      }

      var xPos = this.arr[oriIdx + 1].x;
      var newXPos = xPos - 15;
      // move the piece in between to left
      while (xPos != newXPos) {
        var i = 1;
        for (i = 1; i <= newIdx - oriIdx; i++) {
          this.arr[oriIdx + i].x -= this.arr[oriIdx + i].speed.x;
        }
        xPos -= this.arr[oriIdx + 1].speed.x;
        this.animate();
      }
    }
    else if (oriIdx > newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        this.arr[oriIdx].x -= this.arr[oriIdx].speed.x;
        this.animate();
      }

      var xPos = this.arr[newIdx + 1].x;
      var newXPos = xPos + 15;
      // move the piece in between to right
      while (xPos != newXPos) {
        var i = 0;
        for (i = 0; i < oriIdx - newIdx; i++) {
          this.arr[newIdx + i].x += this.arr[newIdx + i].speed.x;
        }
        xPos += this.arr[newIdx].speed.x;
        this.animate();
      }
    }
    // move element down
    while (this.arr[oriIdx].y != 15) {
      this.arr[oriIdx].y += this.arr[oriIdx].speed.y;
      this.animate();
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
    var i = 1;
    var key = null;
    var j = 0;  
    for (i = 1; i < this.arr.length; i++) {  
      key = this.arr[i].value;  
      j = i - 1;  
  
      /* Move elements of arr[0..i-1], that are  
      greater than key, to one position ahead  
      of their current position */
      while (j >= 0 && this.arr[j].value > key) {  
        j = j - 1;  
      }  
      this.updateWithAnimation(i, j);
    }
  }

  render() {
    return (
      <canvas id="animationCanvas"></canvas>
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