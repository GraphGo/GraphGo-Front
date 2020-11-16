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
    }]
  }

  render() {
    return (
      <Container style={{"height": `${window.innerWidth / 3}px`}}>
        {this.state.animationContainers.map(config => {
          return (
            <div style={{
              "width": `${config.width}px`,
              "height": `${config.height}px`,
              "top": `${config.top}px`,
              "left": `${config.left}px`,
              "position": "absolute"
            }}>
              <AnimationContainer key={config.key}/>
            </div>
            
          );
        })}
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
  z-index: -2;
  top: 83.2px;
  left: 0;
  background-color: grey;
  opacity: 0.5;
`;

export default AnimationLayer;