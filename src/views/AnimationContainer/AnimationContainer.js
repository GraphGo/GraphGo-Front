import React, { Component } from 'react';
import styled from 'styled-components';

class AnimationContainer extends Component {
  constructor(inputArray) {
    super();
    let array = [];
    for (let i = 0; i < inputArray.length; i++) {
      array.append({value:inputArray[i], x:(i+1)*15, y:15, speed:{x:1, y:1}})
    }
    this.state = {
      arr: array
    }
  }
  componentDidMount() {
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");
    context.font = "20px Georgia";
    context.fillText('\[', 0, 15);
    // draw every element in arr
    for (let i = 0; i < this.state.arr.length; i++){
      const object = this.state.arr[i];
      context.fillText(object.value, object.x, object.y);
    }
    context.fillText('\]', this.state.arr[this.state.arr.length-1] + 15, 15);
  }

  // used to move an element up

  render() {
    return (
      <div style={{
        "width": "100%",
        "height": "100%",
        "background-color": "red",
      }}></div>
    );
  }
}

export default AnimationContainer;