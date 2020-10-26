import React from "react";
import Header from "../../components/Header/Header";
import ToolBar from "../../components/ToolBar/ToolBar";
import classes from "./CanvasPage.module.css";
const CanvasPage = () => {
  return (
    <div>
      <Header canvasPage={true} />
      <ToolBar />
    </div>
  );
};

export default CanvasPage;
