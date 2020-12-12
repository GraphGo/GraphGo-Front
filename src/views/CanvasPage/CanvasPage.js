import React, { Component } from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import styled from "styled-components";
import DrawArea from "../../components/DrawArea/DrawArea";
import { saveCanvas} from '../../API/file'
import AnimationMenuPopup from "../../components/AnimationMenuPopup/AnimationMenuPopup";
import SmartObjsContext from '../../contexts/SmartObjsContext.js';

class CanvasPage extends Component {

  constructor(props) {
    super(props);
    this.drawAreaRef = React.createRef();
    this.handleSaveGraph = this.handleSaveGraph.bind(this);
    this.setShowAnimationMenu = this.setShowAnimationMenu.bind(this);
    this.setSmartObjSelected = this.setSmartObjSelected.bind(this);
    this.setSmartObjStyle = this.setSmartObjStyle.bind(this);
    this.setLoopingAnimation = this.setLoopingAnimation.bind(this);
    this.setReplay = this.setReplay.bind(this);
    this.setRevert = this.setRevert.bind(this);
    this.setAnimationSpeed = this.setAnimationSpeed.bind(this);
    this.setSortType = this.setSortType.bind(this)
  }
  state = {
    smartObjStyle:{color: 'black', fontSize: '50'},
    showAnimationMenu: false,
    smartObjSelected: 0,
    loopingAnimation: false,
    replay: false,
    revert: false,
    animationSpeed: 0.5,
    sortType: 'insertionSort' // insertion sort
  }

  setSmartObjStyle(newStyle) {
    this.setState({smartObjStyle: newStyle});
  }
  setShowAnimationMenu(val) {
    this.setState({showAnimationMenu:val});
  }
  setSmartObjSelected(val) {
    this.setState({smartObjSelected: val})
  }
  setLoopingAnimation(val){
    this.setState({loopingAnimation: val})
  }
  setReplay(val){
    this.setState({replay: val})
  }
  setRevert(val){
    this.setState({revert: val})
  }
  setAnimationSpeed(val){
    this.setState({animationSpeed: val})
  }
  setSortType(val){
    this.setState({sortType: val})
  }
  /**
   * Calls backend function to store graph to firebase
   */
  handleSaveGraph(text, id="") {
    let uid = sessionStorage.getItem("userID");
    if (uid) {
      const canvas = document.getElementById('myCanvas');
      const img = canvas.toDataURL('img/png');
      const currentDrawRef = this.drawAreaRef.current;
      const data = {
        img: img,
        smartObjects: currentDrawRef.state.smartObjects,
        width: canvas.width,
        height: canvas.height,
        userID: uid
      }
      console.log(data);
      saveCanvas(img, currentDrawRef.state.smartObjects, canvas.width, canvas.height, text, uid, id).then(alert("File Saved Successfully"))
    } else {
      alert("You must login to save a file");
    }
  }

  componentDidMount() {
    if (this.props.isLoggedIn === true) {
      this.setState({ isLoggedIn: true });
    }
    console.log(this.props);


  }


  render() {
    return (
      <div>
        {/* imitate redux store yea */}
        <ReduxStore id="redux-store" tool="pen"></ReduxStore>
        <Header canvasPage={true} graphName={this.props.location.state ?this.props.location.state.name:null}/>

        <div id="firebaseui-auth-container" style={{
          width: "200 px",
          height: "200px",
          position: 'absolute',
          top: "100px",
          right: "10%",
          zIndex: "999",
          fontSize: "70%",
          padding: "15px",
          border: "1px"
        }}></div>
        <div id="loader" ></div>
        
        
        <SmartObjsContext.Provider value={{ 
           ...this.state, 
           setSmartObjStyle: this.setSmartObjStyle, 
           setShowAnimationMenu:this.setShowAnimationMenu, 
           setSmartObjSelected:this.setSmartObjSelected,
           setLoopingAnimation: this.setLoopingAnimation,
           setReplay: this.setReplay,
           setRevert: this.setRevert,
           setAnimationSpeed: this.setAnimationSpeed,
           setSortType: this.setSortType }}>

          <AnimationMenuPopup show/>
          <DrawArea savedData={this.props.location.state} ref={this.drawAreaRef} />
          <ToolBar handleSaveGraph={this.handleSaveGraph} docID={this.props.location.state ?this.props.location.state.id:null}/>
        </SmartObjsContext.Provider>
      </div>
    );
  }
}


const ReduxStore = styled.div`
  ${''}
`;

export default CanvasPage;
