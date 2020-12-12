import { Component } from 'react';
import styled from 'styled-components';
import $ from "jquery";
import "./DrawArea.css";
import AnimationLayer from "../AnimationLayer/AnimationLayer";
import SmartObject from "./SmartObject";
import axios from "axios";

const recognitionURL = "http://138.68.245.67:5000/";

/**
 * Renders main canvas for drawing, handles drawing, 
 * smartobject creation, selection, and deletion.
 */
class DrawArea extends Component {
  currentEdit = {};
  doStack = [];
  redoStack = [];
  cPushArray = [];
  cPopArray = [];
  cStep = -1;
  offsetLeft = 0;
  offsetTop = 82;
  

  state = {

    smartObjects: [],
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    count: 0,
  }
  gtag() {
    window.dataLayer.push(arguments);
  }

  updateDatalayer = () => {
    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('config', 'G-H0NW5Z2MYC');
  }

  constructor(props) {
    super(props);

    this.updateDatalayer();
    this.gtag = this.gtag.bind(this);
  }


  componentDidMount() {

    Array.prototype.max = function () {
      return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
      return Math.min.apply(null, this);
    };

    // undo functionality
    document.getElementById("undo-button").addEventListener("click", () => {
      let canvas = document.getElementById('myCanvas');
      let context = canvas.getContext('2d');
      if (this.doStack.length > 0) {
        let last_edit = this.doStack.pop();
        this.redoStack.push(last_edit);
        var canvasPic;
        switch(last_edit.tool) {
          case "eraser":
            if (this.cPushArray.length > 0) {
              if (this.cPushArray.length === 1) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.cPopArray.push(this.cPushArray.pop());
              } else {
                this.cPopArray.push(this.cPushArray.pop());
                canvasPic = new Image();
                canvasPic.src = this.cPushArray[this.cPushArray.length - 1];
                canvasPic.onload = () => { 
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.drawImage(canvasPic, 0, 0); 
                }
              }
            }
            break;
          case "pen":
            if (this.cPushArray.length > 0) {
              if (this.cPushArray.length === 1) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.cPopArray.push(this.cPushArray.pop());
              } else {
                this.cPopArray.push(this.cPushArray.pop());
                canvasPic = new Image();
                canvasPic.src = this.cPushArray[this.cPushArray.length - 1];
                canvasPic.onload = () => { 
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.drawImage(canvasPic, 0, 0); 
                }
              }
              // console.log(this.cPushArray);
            }

            break;
          default:
            break;
        }
      }
    });

    document.getElementById("redo-button").addEventListener("click", () => {
      let canvas = document.getElementById('myCanvas');
      let context = canvas.getContext('2d');

      if (this.redoStack.length > 0) {
        let last_edit = this.redoStack.pop();
        this.doStack.push(last_edit);

        var last_one;
        var canvasPic;
        switch(last_edit.tool) {
          case "eraser":
            if (this.cPopArray.length > 0) {
              last_one = this.cPopArray.pop();
              this.cPushArray.push(last_one);
              canvasPic = new Image();
              canvasPic.src = this.cPushArray[this.cPushArray.length - 1];
              canvasPic.onload = () => { 
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(canvasPic, 0, 0); 
              }

            }
            break;
          case "pen":
            if (this.cPopArray.length > 0) {
              last_one = this.cPopArray.pop();
              this.cPushArray.push(last_one);
              canvasPic = new Image();
              canvasPic.src = this.cPushArray[this.cPushArray.length - 1];
              canvasPic.onload = () => { 
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(canvasPic, 0, 0); 
              }
              // console.log(this.cPushArray);
            }

            break;
          default:
            break;
        }
      }
    });

    // sample call to create new smart object in animation layer
    // let newSmartObject = new SmartObject([3,5,2,4,7,6], 100, 100, 600, 200,0);
    // this.setState(
    //   state => {
    //   const smartObjects = state.smartObjects.concat(newSmartObject);
    //   console.log(smartObjects);
    //   return {
    //     smartObjects: smartObjects
    //   };
    // });

    $('#paint').css({ 'width': '100%' });
    $('#number').css({ 'width': '100px', 'font-size': '60px' });
    $('#clear').css({ 'font-size': '35px' });


    var cw = $('#paint').width();
    $('#paint').css({ 'height': '95%' });

    cw = $('#number').width();
    $('#number').css({ 'height': cw + 'px' });

    // From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    // load image from saved data if passed in
    if (this.props.savedData) {
          const img = new Image();
          img.src = this.props.savedData.img;
          img.onload = function() {
            context.drawImage(img, 0, 0);
          }
          let smartObjects = []
          let count = 0;
          this.props.savedData.smartObjects.forEach((element) =>{
            smartObjects.push(new SmartObject(element.data, element.left, element.top,element.width,element.height, count));
            count += 1;
          });
          this.setState({smartObjects:smartObjects});
          


    }

    var compuetedStyle = getComputedStyle(document.getElementById('paint'));
    canvas.width = parseInt(compuetedStyle.getPropertyValue('width'));
    canvas.height = parseInt(compuetedStyle.getPropertyValue('height'));
  
    // the lasso popup container
    var lassoContainer = document.getElementById('lasso-container');
    lassoContainer.style.width = parseInt(compuetedStyle.getPropertyValue('width')) + "px";
    lassoContainer.style.height = parseInt(compuetedStyle.getPropertyValue('height')) + "px";


    var mouse = { x: 0, y: 0 };

    var lasso_x = 0;
    var lasso_y = 0;
    canvas.addEventListener('mousemove', function (e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;

    }, false);

    context.lineWidth = 7;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'red';

    window.addEventListener("mousemove", (e) => {
      let eraser_box = document.getElementById("eraser-box");
      let top = e.offsetY;
      let left = e.offsetX;
      let von_clausewitz = 65;
      let bismarck = 20;
      eraser_box.style.top = top + von_clausewitz + "px";
      eraser_box.style.left = left - bismarck + "px";
    });

    canvas.addEventListener('mousedown', (e) => {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch(toolType) {
        case "eraser":
          context.lineWidth = 25;
          context.lineJoin = 'round';
          context.lineCap = 'round';
          context.strokeStyle = 'white';

          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener('mousemove', onPaint, false);

          this.currentEdit = {tool: "eraser", strokeStyle: context.strokeStyle, points: []};
          break;
        case "pen":
          context.lineWidth = 7;
          if (context.strokeStyle === "white") {
            context.strokeStyle = 'red';
          }

          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener('mousemove', onPaint, false);

          this.currentEdit = {tool: "pen", strokeStyle: context.strokeStyle, points: []};
          break;
        case "lasso":
          mouse.x = e.pageX - this.offsetLeft;
          mouse.y = e.pageY - this.offsetTop;
    
          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener('mousemove', onPaint, false);
          
          var lassoBox = document.getElementById("lasso-box");

          lasso_x = mouse.x;
          lasso_y = mouse.y;
          lassoBox.style.display = 'block';
          lassoBox.style.left = mouse.x + "px";
          lassoBox.style.top = 82 + mouse.y + "px";
          break;
      }  
    }, false);

    canvas.addEventListener('mouseup', () => {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch (toolType) {
        case "eraser":
          canvas.removeEventListener('mousemove', onPaint, false);
          context.closePath();
          this.doStack.push({...this.currentEdit});
          this.currentEdit = {};

          this.cPushArray.push(document.getElementById('myCanvas').toDataURL());
          break;
        case "pen":
          canvas.removeEventListener('mousemove', onPaint, false);
          context.closePath();
          this.doStack.push({...this.currentEdit});
          this.currentEdit = {};

          this.cPushArray.push(document.getElementById('myCanvas').toDataURL());

  
          break;
        case "lasso":
          // reset the lasso area
          canvas.removeEventListener('mousemove', onPaint, false);
 
          var originalStyle = context.strokeStyle;
          context.setLineDash([5, 3])
          context.strokeStyle = "#a8b9c6";
          context.stroke();
          
          // open the lasso container and popup box
          var lassoContainer = document.getElementById("lasso-container");
          var lassoPopup = document.getElementById("lasso-popup");
          var lassoBox = document.getElementById("lasso-box");
          lassoContainer.style.display = "block";
          lassoPopup.style.display = "block";
          lassoPopup.style.left = Math.min(mouse.x, lasso_x) + "px";
          lassoPopup.style.top = Math.max(mouse.y, lasso_y) + 20 + "px";

          this.setState({
            top: Math.min(mouse.y, lasso_y),
            left: Math.min(mouse.x, lasso_x),
            width: Math.abs(mouse.x - lasso_x),
            height: Math.abs(mouse.y - lasso_y),
          })

          // reset selecting box position
          lasso_x = 0;
          lasso_y = 0;
          context.strokeStyle = originalStyle;
          break;
      }
    }, false);

    // Mapping touch events to mouse events
    canvas.addEventListener('touchstart', function (e) {
      var touch = e.touches[0];
      canvas.dispatchEvent(new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      }));
    }, false);
    canvas.addEventListener('touchend', function (e) {
      canvas.dispatchEvent(new MouseEvent('mouseup', {}));
    }, false);
    canvas.addEventListener('touchmove', function (e) {
      var touch = e.touches[0];
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      }));
    }, false);

    // Handler for onscreen drawing and selection box rendering
    var onPaint = () => {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch (toolType) {
        case "eraser":
          context.lineTo(mouse.x, mouse.y);
          context.stroke();

          this.currentEdit.points.push([mouse.x, mouse.y]);
          break;
        case "pen":

          context.lineTo(mouse.x, mouse.y);
          context.stroke();

          this.currentEdit.points.push([mouse.x, mouse.y]);
          break;
        case "lasso":
          var lassoBox = document.getElementById("lasso-box");


          // bottom right
          if (mouse.x >= lasso_x && mouse.y >= lasso_y) {
            lassoBox.style.width = (mouse.x - lasso_x) - 5 + "px";
            lassoBox.style.height = (mouse.y - lasso_y) - 5 + "px";
            // top right
          } else if (mouse.x >= lasso_x && mouse.y < lasso_y) {
            lassoBox.style.width = (mouse.x - lasso_x) - 5 + "px";
            lassoBox.style.height = (lasso_y - mouse.y) - 5 + "px";
            lassoBox.style.top = 82 + mouse.y + "px";
            // bottom left
          } else if (mouse.x < lasso_x && mouse.y >= lasso_y) {
            lassoBox.style.width = (lasso_x - mouse.x) - 5 + "px";
            lassoBox.style.height = (mouse.y - lasso_y) - 5 + "px";
            lassoBox.style.left = mouse.x + "px";
            // top left
          } else {
            lassoBox.style.width = (lasso_x - mouse.x) + "px";
            lassoBox.style.height = (lasso_y - mouse.y) + "px";
            lassoBox.style.top = 82 + mouse.y + 10 + "px";
            lassoBox.style.left = mouse.x + 10 + "px";
          }
          break;
      }
    };
  }

  // Handler for removing selected SmartObject
  removeSmartObject = (id) => {
    let smartObjects = [...this.state.smartObjects];
    let target_idx = 0;
    for (let i = 0; i < smartObjects.length; i++) {
      if (id === smartObjects[i].index) {
        target_idx = i;
        break;
      }
    }
    smartObjects.splice(target_idx, 1);
    this.setState({ smartObjects: smartObjects});
  }

  render() {
    return (
      <Container>
        <div id="lasso-container" style={{
          position: 'absolute',
          zIndex: "20",
          left: "0",
          top: "82.3px",
          display: "none"
        }} onClick={() => {
          document.getElementById("lasso-container").style.display = "none";
          document.getElementById("lasso-popup").style.display = "none";
          let lassoBox = document.getElementById("lasso-box");
          lassoBox.style.display = "none";
          lassoBox.style.left = 0 + "px";
          lassoBox.style.top = 0 + "px";
          lassoBox.style.width = 0 + "px";
          lassoBox.style.height = 0 + "px";
        }}>
          <div id="lasso-popup" style={{
            position: 'absolute', 
            zIndex: "30", 
            display: "none"
          }}>
            <div style={{
              color: "white",
              backgroundColor: "#a8b9c6",
              fontFamily: 'Roboto',
              padding: "10px 20px",
              borderRadius: "15px",
              cursor: "pointer",
              transition: "all 0.1s linear",
            }} onClick={(e) => {
              // create the smart object
              const top = this.state.top;
              const left = this.state.left;
              const width = this.state.width - 10;
              const height = this.state.height;
              const canvas = document.getElementById('myCanvas');

              var canvasData = canvas.toDataURL('image/png');
              axios.post(recognitionURL,{data:canvasData.replace("data:image/png;base64,",""), top: top, left:left, width:width, height:height}, {
                headers: {
                  'Content-Type':'application/json'
                }
              })
                .then(res => {
                  let newSmartObject = new SmartObject(res.data.result, left, top,  width, height, this.state.count);
                  this.setState(
                    state => {
                    const smartObjects = state.smartObjects.concat(newSmartObject);
                    return {
                      smartObjects: smartObjects
                    };
                  });
                }).catch(error => console.log(error));

              this.setState({count: this.state.count + 1});

              document.getElementById("lasso-container").style.display = "none";
              document.getElementById("lasso-popup").style.display = "none";
              let lassoBox = document.getElementById("lasso-box");
              lassoBox.style.display = "none";
              lassoBox.style.left = 0 + "px";
              lassoBox.style.top = 0 + "px";

            }}>Convert to Smart Object</div>
          </div>
        </div>
        <div id="paint">
          <canvas id="myCanvas" style={{
            position: "absolute",
            zIndex: "4",
            left: "0"
          }}></canvas>
          <div id="animation-layer">
            <AnimationLayer smartObjects={this.state.smartObjects} removeSmartObject={this.removeSmartObject}/>
          </div>
          
        </div>
        <div id="predicted">
        </div>
        <div id="lasso-box" style={{
          width: "10px",
          height: "20px",
          top: "-82px",
          left: "-100px",
          position: "absolute",
          zIndex: "10",
          border: "2px dotted #a8b9c6",
          boxSizing: "border-box"
        }}></div>
        <div id="eraser-box" style={{
          width: "40px",
          height: "40px",
          borderRadius: "30px",
          position: "absolute",
          zIndex: "5000",
          display: "none",
          left: "0",
          top: "0",
          border: "3px dotted black",
          pointerEvents: "none",
          opacity: "0.1",
          background: "grey"
        }}></div>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 90vh;
  box-sizing: border-box;
  touch-action: none;
  font-family: "Roboto";
`;

export default DrawArea; 