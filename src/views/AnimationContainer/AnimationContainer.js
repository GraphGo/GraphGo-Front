import React, { Component } from 'react';
import styled from 'styled-components';

class AnimationContainer extends Component {
  constructor(props) {
    super(props);
    let array = [];
    let i = 0;
    let inputArray = props.smartObject.data;
    for (i = 0; i < inputArray.length; i++) {
      array.push({ value: inputArray[i], x: (i + 1) * 15, y: 15, speed: { x: 1, y: 1 } })
    }
    this.state = {
      arr: array
    }
  }
  componentDidMount() {
    // const canvas = document.getElementById("myCanvas");
    // const ctx = canvas.getContext("2d");
    // ctx.font = "20px Georgia";
    // ctx.fillText('\[', 0, 15);
    // // draw every element in arr
    // for (i = 0; i < this.state.arr.length; i++){
    //   object = this.state.arr[i];
    //   ctx.fillText(object.value, object.x, object.y);
    // }
    // ctx.fillText('\]', this.state.arr[this.state.arr.length-1] + 15, 15);
  }

  // used to move an element up

  render() {
    return (
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
    );
  }
}

export default AnimationContainer;