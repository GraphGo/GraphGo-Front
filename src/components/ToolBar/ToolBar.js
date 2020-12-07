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
import eraserIcon from "../../assets/icons/eraser.svg";
import eraserDarkIcon from "../../assets/icons/eraser-dark.svg";
import PenToolPopup from "../PenToolPopup/PenToolPopup";
import OutsideClickHandler from "../hoc/OutsideClickHandler/OutsideClickHandler"
import classes from "./ToolBar.module.css";
import SaveDialog from "./SaveDialog"

const tools = {
  pen: [penIcon, penDarkIcon],
  hand: [handIcon, handDarkIcon],
  lasso: [lassoIcon, lassoDarkIcon],
  eraser: [eraserIcon, eraserDarkIcon],
};

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toolSelected: null,
      showPenMenu: false,
      open : false,
      text : ""
    };
    this.handleSave = this.handleSave.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  componentDidUpdate() {
    // update icons
    Object.keys(tools).forEach((key) => {
      if (this.state.toolSelected === key) {
        const updatedIcon = tools[key][1];
        document.getElementById(key).setAttribute("src", updatedIcon);
      } else {
        const updatedIcon = tools[key][0];
        document.getElementById(key).setAttribute("src", updatedIcon);
      }
    });
  }

  handleToolSelected = (toolName) => {
    this.setState({ toolSelected: toolName, showPenMenu: true });
  };

  handlePenMenuClosed = () => {
    this.setState({ showPenMenu: false })
  }

  closeDialog() {
    this.setState({open: false});
  } 
  /**
   * Handler for saving graph file
   */
  handleSave() {
    if (this.props.docID) {
      this.props.handleSaveGraph("", this.props.docID)
    } else {
      this.setState({open: true});
    }
  }


  render() {
    return (
      <div className={classes.ToolBar}>
        <button title="Pen" onClick={() => {
          this.handleToolSelected("pen");
          document.getElementById("redux-store").setAttribute("tool", "pen");
          // make the animation layer lower than the canvas
          document.getElementById("myCanvas").style.zIndex = "4";
          document.getElementById("eraser-box").style.display = "none";
        }
        }>
          <img id="pen" src={penIcon} alt="pen" />
        </button>
        <OutsideClickHandler handler={this.handlePenMenuClosed} showPenMenu={this.state.showPenMenu}>
          <PenToolPopup show={this.state.toolSelected === "pen" && this.state.showPenMenu} />
        </OutsideClickHandler>
        <button title="Hand" onClick={() => {
          this.handleToolSelected("hand");
          document.getElementById("redux-store").setAttribute("tool", "hand");
          // make the animation layer lower than the canvas
          document.getElementById("myCanvas").style.zIndex = "2";
          document.getElementById("animation-layer").style.pointerEvents = "unset";
          document.getElementById("eraser-box").style.display = "none";
        }}>
          <img id="hand" src={handIcon} alt="hand tool"/>
        </button>
        <button title="Lasso Tool" onClick={() => {
          this.handleToolSelected("lasso");
          document.getElementById("redux-store").setAttribute("tool", "lasso");
          // make the animation layer higher than the canvas
          document.getElementById("myCanvas").style.zIndex = "2";
          document.getElementById("animation-layer").style.pointerEvents = "none";
          document.getElementById("eraser-box").style.display = "none";
        }}>
          <img id="lasso" src={lassoIcon} alt="lasso tool"/>
        </button>
        <button title="Eraser" onClick={() => {
          this.handleToolSelected("eraser");
          document.getElementById("redux-store").setAttribute("tool", "eraser");
          // make the animation layer lower than the canvas
          document.getElementById("myCanvas").style.zIndex = "4";

          document.getElementById("eraser-box").style.display = "block";
        }
        }>
          <img id="eraser" src={eraserIcon} alt="eraser" />
        </button>
        <button title="Undo" id="undo-button">
          <img id="undo" src={undoIcon} alt="undo" />
        </button>
        <button title="Redo" id="redo-button">
          <img id="redo" src={redoIcon} alt="redo" />
        </button>
        <button title="Save">
          <img id="save" onClick={this.handleSave} src={saveIcon} alt="save" />
        </button>
        <SaveDialog open={this.state.open} closeDialog={this.closeDialog} saveGraph={this.props.handleSaveGraph} />
      </div>
    );
  }
}

export default ToolBar;
