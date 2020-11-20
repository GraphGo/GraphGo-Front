import React, { Component } from "react";
import penIcon from "../../assets/icons/pencil.svg";
import penDarkIcon from "../../assets/icons/pencil-dark.svg";
import handIcon from "../../assets/icons/hand.svg";
import handDarkIcon from "../../assets/icons/hand-dark.svg";
import lassoIcon from "../../assets/icons/lasso.svg";
import lassoDarkIcon from "../../assets/icons/lasso-dark.svg";
import undoIcon from "../../assets/icons/undo.svg";
import undoDarkIcon from "../../assets/icons/undo-dark.svg";
import redoIcon from "../../assets/icons/redo.svg";
import redoDarkIcon from "../../assets/icons/redo-dark.svg";
import saveIcon from "../../assets/icons/save.svg";
import saveDarkIcon from "../../assets/icons/save-dark.svg";
import classes from "./ToolBar.module.css";

const tools = {
  pen: [penIcon, penDarkIcon],
  hand: [handIcon, handDarkIcon],
  lasso: [lassoIcon, lassoDarkIcon],
};

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toolSelected: "pen",
    };
  }
  componentDidUpdate() {
    // update icons
    Object.keys(tools).forEach((key) => {
      if (this.state.toolSelected == key) {
        console.log(key, tools[key]);
        const updatedIcon = tools[key][1];
        document.getElementById(key).setAttribute("src", updatedIcon);
      } else {
        const updatedIcon = tools[key][0];
        document.getElementById(key).setAttribute("src", updatedIcon);
      }
    });
  }

  handleToolSelected = (toolName) => {
    this.setState({ toolSelected: toolName });
  };

  render() {
    return (
      <div className={classes.ToolBar}>
        <button title="Pen" onClick={() => {
          this.handleToolSelected("pen");
          document.getElementById("redux-store").setAttribute("tool", "pen");
        }
        }>
          <img id="pen" src={penIcon} alt="pen" />
        </button>
        <button title="Hand" onClick={() => {
          this.handleToolSelected("hand");
          document.getElementById("redux-store").setAttribute("tool", "hand");
        }}>
          <img id="hand" src={handIcon} alt="hand tool" />
        </button>
        <button title="Lasso Tool" onClick={() => {
          this.handleToolSelected("lasso");
          document.getElementById("redux-store").setAttribute("tool", "lasso");
        }}>
          <img id="lasso" src={lassoIcon} alt="lasso tool" />
        </button>
        <button title="Undo">
          <img id="undo" src={undoIcon} alt="undo" />
        </button>
        <button title="Redo">
          <img id="redo" src={redoIcon} alt="redo" />
        </button>
        <button title="Save">
          <img id="save" src={saveIcon} alt="save" />
        </button>
      </div>
    );
  }
}

export default ToolBar;
