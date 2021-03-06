import React from 'react';
import styled from 'styled-components';
import AnimationContainer from "../AnimationContainer/AnimationContainer.js"

class AnimationLayer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={{"height": "95%"}}>
        { 
        this.props.smartObjects.length != 0 ?
        this.props.smartObjects.map((config, i) => {
          return (
            <div key={config.index.toString()} style={{
              "width": `${config.width}px`,
              "height": `${config.height}px`,
              "top": `${config.top}px`,
              "left": `${config.left}px`,
              "position": "absolute",
              "alignItems":"center"
            }}>
              <AnimationContainer smartObject={config} index={i} removeSmartObject={this.props.removeSmartObject}/>
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