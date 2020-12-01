import React, { Component } from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
import styled from "styled-components";
import DrawArea from "../DrawArea/DrawArea";
import {saveCanvas, loadCanvas} from '../../API/file'
import AnimationLayer from "../AnimationLayer/AnimationLayer";
class CanvasPage extends Component {

  constructor(props) {
    super(props);
    this.drawAreaRef = React.createRef();
    this.handleSaveGraph = this.handleSaveGraph.bind(this)
  }

/**
 * Calls backend function to store graph to firebase
 */
  handleSaveGraph() {
    const canvas = document.getElementById('myCanvas');
    const img = canvas.toDataURL('img/png');
    const currentDrawRef = this.drawAreaRef.current;
    const data = {
      img: img,
      smartObjects: currentDrawRef.state.smartObjects,
      width: canvas.width(),
      height: canvas.height(),
      userID: this.props.savedData.uid
    }
  }

  componentDidMount() {
    if (this.props.isLoggedIn === true) {
      this.setState({isLoggedIn: true});
    }
  }

  componentWillUnmount() {

  }

  Login() {

  }

  Register() {

  }

  render() {
    return (
      <div>
        {/* imitate redux store yea */}
        <ReduxStore id="redux-store" tool="pen"></ReduxStore>
        <Header canvasPage={true} />

        <div id="firebaseui-auth-container" style={{
          width:"200 px",
          height:"200px",
          position:'absolute',
          top:"100px",
          right:"10%",
          zIndex:"999",
          fontSize:"70%",
          padding:"15px",
          border:"1px"
        }}></div>
        <div id="loader" ></div>
        <ToolBar />
        {/* <DrawingArea src="./demo.html"></DrawingArea> */}
        {/* <AnimationLayer /> */}{/* Commented out for testing. TODO: uncomment */}
        <DrawArea savedData={this.props.data} ref={this.drawAreaRef} />
      </div>
    );
  }
}

const ReduxStore = styled.div`
  ${'' /* display: none; */}
`;

export default CanvasPage;
