import React from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
import styled from "styled-components";

const CanvasPage = () => {
  return (
    <div>
      <Header canvasPage={true}/>
      <ToolBar />
      <DrawingArea src="./demo.html"></DrawingArea>
    </div>
  );
};

const DrawingArea = styled.iframe`
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 90vh;
  box-sizing: border-box;
`;

export default CanvasPage;
