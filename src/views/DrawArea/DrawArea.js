import react, { Component } from 'react';
import styled from 'styled-components';
import $ from "jquery";
import * as tf from '@tensorflow/tfjs';
import "./DrawArea.css";
import AnimationLayer from "../AnimationLayer/AnimationLayer"
import SmartObject from "./SmartObject"

class DrawArea extends Component {
  state = {
    animation_pos_top: 100, //the distance of the animation box to the top
    animation_pos_left: 100, // the distance of the animation box to the left
    animation_data: [1, 2, 3, 4],
    smartObjects: []
  }

  gtag() {
    window.dataLayer.push(arguments);
  }

  // function removeSmartObject(elementReference)
  // remove the animation container div corresponding



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

    // sample call to create new smart object in animation layer
    let newSmartObject = new SmartObject([4, 3, 2, 1], 200, 200, 1000, 300,0);
    this.setState(
      state => {
      const smartObjects = state.smartObjects.concat(newSmartObject);
      console.log(smartObjects);
      return {
        smartObjects: smartObjects
      };
    });


    $('#paint').css({ 'width': '100%' });
    $('#number').css({ 'width': '100px', 'font-size': '60px' });
    $('#clear').css({ 'font-size': '35px' });


    var cw = $('#paint').width();
    $('#paint').css({ 'height': cw / 3 + 'px' });

    cw = $('#number').width();
    $('#number').css({ 'height': cw + 'px' });

    // From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var compuetedStyle = getComputedStyle(document.getElementById('paint'));
    canvas.width = parseInt(compuetedStyle.getPropertyValue('width'));
    canvas.height = parseInt(compuetedStyle.getPropertyValue('height'));

    // the lasso popup container
    var lassoContainer = document.getElementById('lasso-container');
    lassoContainer.style.width = parseInt(compuetedStyle.getPropertyValue('width')) + "px";
    lassoContainer.style.height = parseInt(compuetedStyle.getPropertyValue('height')) + "px";


    var mouse = { x: 0, y: 0 };
    var arr_x = []
    var arr_y = []
    var old_arr_x = []
    var old_arr_y = []
    var old_bbox = []
    var predicted_arr = []
    var same_object = false;
    var input;
    var place_holder = false;
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

    canvas.addEventListener('mousedown', function (e) {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch(toolType) {
        case "pen":
          console.log(toolType);
          place_holder = false;
          if (arr_x.length != 0 & arr_y.length != 0) {
            if (mouse.x - arr_x.max() < 30) {
              same_object = true;
              console.log('Same object')
            }
            else {
              same_object = false;
              arr_x = [];
              arr_y = [];
            }
          }
          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          context.setLineDash([5, 15]);
          canvas.addEventListener('mousemove', onPaint, false);
          break;
        case "lasso":
          place_holder = false;
          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener('mousemove', onPaint, false);
          
          let lassoBox = document.getElementById("lasso-box");
          lasso_x = mouse.x;
          lasso_y = mouse.y;
          lassoBox.style.display = 'block';
          lassoBox.style.left = mouse.x + "px";
          lassoBox.style.top = 82 + mouse.y + "px";
          lassoBox.style.width = 0 + "px";
          lassoBox.style.height = 0 + "px";
          break;
      }  
    }, false);

    canvas.addEventListener('mouseup', function () {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch (toolType) {
        case "pen":
          //   $('#number').html('<img id="spinner" src="spinner.gif"/>');
          canvas.removeEventListener('mousemove', onPaint, false);
          //   var img = new Image();
          //   img.onload = function() {
          //context.drawImage(canvas, 0, 0, 28, 28);
          if (old_arr_x.length > 0) { context.clearRect(0, 0, old_arr_x.max() - old_arr_x.min() + 15, old_arr_y.max() - old_arr_y.min() + 15) }
          let data = context.getImageData(arr_x.min() - 5, arr_y.min() - 5, arr_x.max() - arr_x.min() + 15, arr_y.max() - arr_y.min() + 15);
          context.putImageData(data, 0, 0);
          let width = arr_y.max() - arr_y.min() + 15;
          if (width < 25) {
            place_holder = true;
          }
          input = context.getImageData(0, 0, (width < arr_y.max() - arr_y.min() + 15) ? (arr_y.max() - arr_y.min() + 15) : width, arr_y.max() - arr_y.min() + 15);
          old_arr_x = arr_x
          old_arr_y = arr_y
          let img = tf.browser.fromPixels(input, 1).resizeBilinear([28, 28]).div(255.0)//.mean(2).expandDims(2).expandDims().toFloat().div(255.0);
          // var input = [];
          // for(var i = 0; i < data.length; i += 4) {
          //     input.push(data[i + 2] / 255);
          // }
          predict(img);
          //   };
          //   img.src = canvas.toDataURL('image/png');
          break;
        case "lasso":
          // reset the lasso area
          canvas.removeEventListener('mousemove', onPaint, false);
          let lassoBox = document.getElementById("lasso-box");
          // lassoBox.style.width = 0 + "px";
          // lassoBox.style.height = 0 + "px";
          // lassoBox.style.display = "none";

          // context.rect(Math.min(mouse.x, lasso_x), Math.min(mouse.y, lasso_y), Math.abs(mouse.x - lasso_x), Math.abs(mouse.y - lasso_y));

          // open the lasso container and popup box
          let lassoContainer = document.getElementById("lasso-container");
          let lassoPopup = document.getElementById("lasso-popup");
          lassoContainer.style.display = "block";
          lassoPopup.style.display = "block";
          lassoPopup.style.left = Math.min(mouse.x, lasso_x) + "px";
          lassoPopup.style.top = Math.max(mouse.y, lasso_y) + 20 + "px";


          let originalStyle = context.strokeStyle;
          context.strokeStyle = "#a8b9c6";
          context.stroke();

          // reset selecting box position
          lasso_x = 0;
          lasso_y = 0;
          context.strokeStyle = originalStyle;
          break;
      }
    }, false);

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

    var onPaint = function () {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch (toolType) {
        case "pen":
          arr_x.push(mouse.x)
          arr_y.push(mouse.y)
          context.lineTo(mouse.x, mouse.y);
          context.stroke();
          break;
        case "lasso":
          let lassoBox = document.getElementById("lasso-box");
          
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
      }
    };

    tf.loadLayersModel('https://raw.githubusercontent.com/carlos-aguayo/carlos-aguayo.github.io/master/model/model.json').then(function (model) {
      window.model = model;
      console.log('ready');
    });


    var predict = function (input) {
      if (window.model) {
        window.model.predict([input.reshape([1, 28, 28, 1])]).array().then(function (scores) {
          scores = scores[0];
          let predicted = scores.indexOf(Math.max(...scores));
          if (place_holder) {
            predicted = 1;
          }
          //$('#number').html(predicted.toString()+','+predicted.toString());

          if (same_object) {
            predicted_arr[predicted_arr.length - 1] = predicted;
          } else {
            predicted_arr[predicted_arr.length] = predicted
          }

          console.log(predicted_arr)

        });
      } else {
        // The model takes a bit to load, if we are too fast, wait

        setTimeout(function () { predict(input) }, 50);
      }
    }

    $('#clear').click(function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
      mouse = { x: 0, y: 0 };
      arr_x = []
      arr_y = []
      let local_arr_x = []
      let local_arr_y = []
      old_bbox = []
      predicted_arr = []
      same_object = false;
      //   $('#number').html('');
    });
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
              color: "white",
              backgroundColor: "rgb(168, 185, 198)",
              borderRadius: "15px",
              cursor: "pointer",
              transition: "all 0.1s linear",
            }} onClick={() => {
              document.getElementById("lasso-container").style.display = "none";
              document.getElementById("lasso-popup").style.display = "none";
              let lassoBox = document.getElementById("lasso-box");
              lassoBox.style.display = "none";
              lassoBox.style.left = 0 + "px";
              lassoBox.style.top = 0 + "px";
              alert("Smart Object Created!")
            }}>Convert to Smart Object</div>
          </div>
        </div>
        <div id="paint">
          <canvas id="myCanvas"></canvas>
          <AnimationLayer smartObjects={this.state.smartObjects}  />
        </div>
        <div id="predicted">
          {/* <button id="clear">Clear</button> */}
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