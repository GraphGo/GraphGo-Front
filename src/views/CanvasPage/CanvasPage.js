import React, {Component} from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
import styled from "styled-components";
import DrawArea from "../DrawArea/DrawArea";

import AnimationLayer from "../AnimationLayer/AnimationLayer";
class CanvasPage extends Component {

  constructor(props) {
    super(props); 
  }
  render() {
    return (
      <div>
        {/* imitate redux store yea */}
        <ReduxStore id="redux-store" tool="pen"></ReduxStore>
        <Header canvasPage={true} />
        <ToolBar />
        {/* <DrawingArea src="./demo.html"></DrawingArea> */}
        {/* <AnimationLayer /> */}{/* Commented out for testing. TODO: uncomment */}
        <DrawArea savedData={this.props.data}/>
      </div>
    );
  }
}

const ReduxStore = styled.div`
  ${'' /* display: none; */}
`;

export default CanvasPage;
