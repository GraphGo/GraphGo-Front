import React, {useState} from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
import styled from "styled-components";
import DrawArea from "../DrawArea/DrawArea";
import AnimationLayer from "../AnimationLayer/AnimationLayer";
import AnimationMenuPopup from "../../components/AnimationMenuPopup/AnimationMenuPopup";
import SmartObjsContext from '../../contexts/SmartObjsContext.js';

const CanvasPage = () => {
  const [smartObjStyle, setSmartObjStyle] = useState({color: 'black', strokeWidth: 'normal'})
  const [showAnimationMenu, setShowAnimationMenu] = useState(false);
  const [smartObjSelected, setSmartObjSelected] = useState(0);
  return (
    <div>
      {/* imitate redux store yea */}
      <ReduxStore id="redux-store" tool="pen"></ReduxStore>
      <Header canvasPage={true}/>
      <ToolBar />
      {/* <DrawingArea src="./demo.html"></DrawingArea> */}
      <SmartObjsContext.Provider value={{ smartObjStyle, showAnimationMenu, smartObjSelected, setSmartObjStyle, setShowAnimationMenu, setSmartObjSelected }}>
        <DrawArea />
        <AnimationMenuPopup show/>
      </SmartObjsContext.Provider>
    </div>
  );
};

const ReduxStore = styled.div`
  ${'' /* display: none; */}
`;

export default CanvasPage;
