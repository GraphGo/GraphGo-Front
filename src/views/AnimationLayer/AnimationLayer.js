import React, { Component } from 'react';
import styled from 'styled-components';
import AnimationContainer from "../AnimationContainer/AnimationContainer.js"

class AnimationLayer extends React.Component {
  state = {
    // here is the state componenent to control all animation components in the animation layer
    animationContainers: [{
      key: 0,
      top: 100,
      left: 80,
      width: 100,
      height: 234,
      values: [1, 2, 3, 4]
    }]
  }
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <Container style={{"height": `${window.innerWidth / 3}px`}}>
        { 
        this.props.smartObjects.length != 0 ?
        this.props.smartObjects.map(config => {
          return (
            <div key={config.index.toString()} style={{
              "width": `${config.width}px`,
              "height": `${config.height}px`,
              "top": `${config.top}px`,
              "left": `${config.left}px`,
              "position": "absolute",
              "alignItems":"center"
            }}>
              <AnimationContainer smartObject={config} key={config.index.toString()} removeSmartObject={this.props.removeSmartObject}/>
            </div>
            
          );
        }) : <div></div>}
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;
  touch-action: none;
  font-family: "Roboto";
  position: absolute;
  z-index: 3;
  top: 83.2px;
  left: 0;
  background-color: white;
  opacity: 0.7;
`;

export default AnimationLayer;