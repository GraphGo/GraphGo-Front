import React, { Component } from 'react';
import styled from 'styled-components';

class AnimationLayer extends React.Component {
  state = {
    animations: []
  }

  render() {
    return (
      <Container style={{"height": `${window.innerWidth / 3}px`}}>
        <AnimationContainer/>
      </Container>
    )
  }
}

const AnimationContainer = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
`;

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