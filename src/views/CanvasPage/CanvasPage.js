import React from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
import styled from "styled-components";
import DrawArea from "../DrawArea/DrawArea";
import AnimationLayer from "../AnimationLayer/AnimationLayer";

const CanvasPage = () => {
  return (
    <div>
      <Header canvasPage={true}/>
      <ToolBar />
      {/* <DrawingArea src="./demo.html"></DrawingArea> */}
      {/* <AnimationLayer /> */}{/* Commented out for testing. TODO: uncomment */}
      <DrawArea />
    </div>
  );
};

export default CanvasPage;
