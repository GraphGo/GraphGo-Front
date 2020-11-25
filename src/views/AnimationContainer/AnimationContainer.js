import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash'
class AnimationContainer extends Component {
  constructor(props) {
    super(props);
    this.arr = [];
    let i = 0;
    console.log(props)
    let inputArray = this.props.smartObject.data;
    this.canvas = document.getElementById("animationCanvas");
    this.canvas.width = this.props.smartObject.width;
    this.canvas.height = this.props.smartObject.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "10px Georgia";
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
    this.draw = this.draw.bind(this);
    this.animate = this.animate.bind(this);
    this.updateWithAnimation = this.updateWithAnimation.bind(this);
    this.insertionSort = this.insertionSort.bind(this);
    this.sleep = this.sleep.bind(this);
  }

  componentDidMount() {
    this.draw(this.arr);
    this.insertionSort();
  }
  
  componentDidUpdate() {

  }
  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
  // this function is used to animate the updated array
  animate(arr) {
    //this.setState({state: this.state});
    window.setTimeout(function(arr) {this.sleep(15);this.draw(arr);}.bind(this), 3000, arr);
  }

  // this function is used to draw an array
  draw(arr) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText('\[', 0, 15);
    var i = 0;
    // draw every element in arr
    for (i = 0; i < arr.length; i++) {
      this.ctx.fillText(arr[i].value, arr[i].x, arr[i].y);
    }
    this.ctx.fillText('\]', this.arr.length * 15 + 15, 15);
  }

  // this function is update the array with animation
  // @param oriIdx: the original index of an element
  // @param newIdx: the new index of this element
  updateWithAnimation(oriIdx, newIdx) {
    // move element up
    while (this.arr[oriIdx].y != 0) {
        this.animate(_.cloneDeep(this.arr));
        
      this.arr[oriIdx].y -= this.arr[oriIdx].speed.y;

    }
    // choose which way to move by determining the positions of idxs
    if (oriIdx < newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        this.animate(_.cloneDeep(this.arr));
        this.arr[oriIdx].x += this.arr[oriIdx].speed.x;

      }
      var xPos = this.arr[oriIdx + 1].x;
      var newXPos = this.arr[oriIdx + 1].x - 15;
      // move the piece in between to left
      while (xPos != newXPos) {
        this.animate(_.cloneDeep(this.arr));
        var i = 1;
        for (i = 1; i <= newIdx - oriIdx; i++) {
          this.arr[oriIdx + i].x -= this.arr[oriIdx + i].speed.x;
        }
        xPos -= this.arr[oriIdx + 1].speed.x;

      }
    }
    else if (oriIdx > newIdx) {
      // move element to newIdx
      while (this.arr[oriIdx].x != this.arr[newIdx].x) {
        this.animate(_.cloneDeep(this.arr));
        this.arr[oriIdx].x -= this.arr[oriIdx].speed.x;

      }

      var xPos = this.arr[newIdx + 1].x;
      var newXPos = xPos + 15;
      // move the piece in between to right
      while (xPos != newXPos) {
        this.animate(_.cloneDeep(this.arr));
        var i = 0;
        for (i = 0; i < oriIdx - newIdx; i++) {
          this.arr[newIdx + i].x += this.arr[newIdx + i].speed.x;
        }
        xPos += this.arr[newIdx].speed.x;

      }
    }
    // move element down
    while (this.arr[oriIdx].y != 15) {
        this.animate(_.cloneDeep(this.arr));
      this.arr[oriIdx].y += this.arr[oriIdx].speed.y;

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
    for (i = 1; i < this.arr.length; i++) {  
      key = this.arr[i].value;  
      j = i - 1;  
  
      /* Move elements of arr[0..i-1], that are  
      greater than key, to one position ahead  
      of their current position */
      while (j > 0 && this.arr[j].value > key) {
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