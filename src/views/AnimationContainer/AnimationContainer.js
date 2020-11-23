import React, { Component } from 'react';
import styled from 'styled-components';

class AnimationContainer extends Component {
  constructor(props) {
    super(props);
    let array = [];
    let i = 0;
    let inputArray = props.smartObject.data;
    this.canvas = document.getElementById("myCanvas");
    this.canvas.width = prop.width;
    this.canvas.height = prop.height;
    this.ctx = canvas.getContext("2d");
    this.ctx.font = "10px Georgia";
    for (i = 0; i < inputArray.length; i++) {
      array.push({ 
        value: inputArray[i], 
        x: (i + 1) * 15, 
        y: 15, 
        speed: { 
          x: 0.5, 
          y: 0.5 
        } 
      })
    }
    this.state = {
      arr: array
    }
  }
  componentDidMount() {
    this.ctx.fillText('\[', 0, 15);
    // draw every element in arr
    for (i = 0; i < this.state.arr.length; i++){
      object = this.state.arr[i];
      ctx.fillText(object.value, object.x, object.y);
    }
    ctx.fillText('\]', this.state.arr[this.state.arr.length-1] + 15, 15);
  }

  // used to move an element up

  render() {
    /* return (
      <div style={{
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
        </div>
    ); */
  }
}

// this function is used to animate the updated array
function animate() {
  requestAnimationFrame(draw);
}

// this function is uded to draw an array
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText('\[', 0, 15);
  var i = 0;
  // draw every element in arr
  for (i = 0; i < this.state.arr.length; i++){
    object = arr[i];
    ctx.fillText(object.value, object.x, object.y);
  }
  ctx.fillText('\]', arr[arr.length-1] + 15, 15);
}

// this function is update the array with animation
// @param oriIdx: the original index of an element
// @param newIdx: the new index of this element
function updateWithAnimation(oriIdx, newIdx) {
  // move element up
  while (arr[oriIdx].y != 0) {
    arr[oriIdx].y -= arr[oriIdx].speed.y;
    animate();
  }
  // choose which way to move by determining the positions of idxs
  if (oriIdx < newIdx){
    // move element to newIdx
    while (arr[oriIdx].x != arr[newIdx].x + 15) {
      arr[oriIdx].x += arr[oriIdx].speed.x;
      animate();
    }

    var xPos = arr[oriIdx + 1].x;
    var newXPos = xPos - 15;
    // move the piece in between to left
    while (xPos != newXPos){
      var i = 1;
      for (i = 1; i <= newIdx - oldIdx; i++){
        arr[oriIdx + i].x -= arr[oriIdx + i].speed.x;
      }
      xPos -= arr[oriIdx + 1].speed.x;
      animate();
    }
  }
  else if (oriIdx > newIdx){
    // move element to newIdx
    while (arr[oriIdx].x != arr[newIdx].x) {
      arr[oriIdx].x -= arr[oriIdx].speed.x;
      animate();
    }

    var xPos = arr[newIdx + 1].x;
    var newXPos = xPos + 15;
    // move the piece in between to right
    while (xPos != newXPos){
      var i = 0;
      for (i = 0; i < oldIdx - newIdx; i++){
        arr[newIdx + i].x += arr[newIdx + i].speed.x;
      }
      xPos += arr[newIdx].speed.x;
      animate();
    }
  }
  // move element down
  while (arr[oriIdx].y != 15) {
    arr[oriIdx].y += arr[oriIdx].speed.y;
    animate();
  }

  // update the array move the element in the array
  arr.splice(newIdx + 1, 0, arr[oriIdx]);
  arr.splice(oriIdx, 1);
}

export default AnimationContainer;