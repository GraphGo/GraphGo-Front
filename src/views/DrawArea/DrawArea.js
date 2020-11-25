import react, { Component } from 'react';
import styled from 'styled-components';
import $ from "jquery";
import * as tf from '@tensorflow/tfjs';
import "./DrawArea.css";
import AnimationLayer from "../AnimationLayer/AnimationLayer"
import SmartObject from "./SmartObject"
import * as cv from "opencv.js"
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
    function sortBboxLeftToRight(a, b){
      if (a['x']<b['x']){
          return -1;
      }
      else{
          return 1;
      }
  }

  function getSortedBboxes(imageData){
    var src = cv.matFromImageData(imageData);
    //var cvs = document.getElementById("myCanvas");
    //var src = cv.imread('myCanvas');
    //var src = context.getImageData(bboxes[i].x+x1, bboxes[i].y+y1, bboxes[i].width, bboxes[i].height);
    //console.log(src.rows, src.cols)
    
    
    // var rect = new cv.Rect(0,0,1440,480);
    // src = src.roi(rect);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 10, 255, cv.THRESH_BINARY);
    var ksize = new cv.Size(3, 3);
    cv.GaussianBlur(src, src, ksize, 0)
    cv.Canny(src, src, 30,150)
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    var pred_rois = []
    for (let i = 0; i < contours.size(); ++i) {
      pred_rois.push(cv.boundingRect(contours.get(i)));
    }
    pred_rois.sort(sortBboxLeftToRight)
    //psuedo non-max suppression based purely on iou
    var suppressed_rois = []
    suppressed_rois.push(pred_rois[0])
    for (let i = 1; i < pred_rois.length; ++i) {
      var last_roi = suppressed_rois[suppressed_rois.length-1]
      if (pred_rois[i].x > last_roi.x+last_roi.width){
        suppressed_rois.push(pred_rois[i])
      }
    }
    return suppressed_rois
  }

  function predict_(imageData){
    if (window.model){
      var bboxes = getSortedBboxes(imageData);
      // var canvas = document.getElementById(canvas_id);
      // var context = canvas.getContext('2d');
      var input1 = cv.matFromImageData(imageData);;
      var model;
      
      var pred_arr = []
      for (let i = 0; i < bboxes.length; ++i) {
        // var input = context.getImageData(bboxes[i].x+x1, bboxes[i].y+y1, bboxes[i].width, bboxes[i].height);
        // input = cv.matFromImageData(input);
        
        // console.log(bboxes[i].x,bboxes[i].y,bboxes[i].width,bboxes[i].height)
        // console.log(input1.rows, input1.cols)
        var rect = new cv.Rect(bboxes[i].x,bboxes[i].y,bboxes[i].width,bboxes[i].height);
        var input = input1.roi(rect)
        cv.cvtColor(input, input, cv.COLOR_RGBA2GRAY, 0);
        
        if (bboxes[i].width>bboxes[i].height){
          var height = Math.floor(20*bboxes[i].height/bboxes[i].width);
          cv.resize(input, input, new cv.Size(20, height), 0, 0, cv.INTER_CUBIC);
          var pad_top = Math.floor((28-height)/2);
          cv.copyMakeBorder(input, input, pad_top, 28-pad_top-height, 4,4,cv.BORDER_CONSTANT,new cv.Scalar(0))
        }
        else{
          var width = Math.floor(20*bboxes[i].width/bboxes[i].height);
          var pad_left = Math.floor((28-width)/2);
          cv.resize(input, input, new cv.Size(width, 20), 0, 0, cv.INTER_CUBIC);
          cv.copyMakeBorder(input, input, 4,4,pad_left, 28-pad_left-width,cv.BORDER_CONSTANT,new cv.Scalar(0))
        }
        cv.threshold(input, input, 10, 255, cv.THRESH_BINARY);
        
        //cv.imshow()
        var tensor = []
        for (let i = 0; i<28;++i){
          var tensor_row = []
          for (let j = 0; j<28;++j){
            tensor_row.push(input.data[i*28+j])
          }
          tensor.push(tensor_row)
        }
        
        tensor = tf.tensor(tensor).div(255)
        // mat = cv.matFromArray(28, 28, cv.CV_8U, tensor.dataSync());
        // cv.imshow('myCanvas', mat);
        // tensor = tensor.div(255)
        window.model.predict([tensor.reshape([1, 28, 28, 1])]).array().then(function(scores){
            scores = scores[0];
            var predicted = scores.indexOf(Math.max(...scores));
            pred_arr.push(predicted)
            console.log(pred_arr)
          });
        }
      }
      return {array:pred_arr, bboxes: bboxes}
    }

    Array.prototype.max = function () {
      return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
      return Math.min.apply(null, this);
    };

    // sample call to create new smart object in animation layer
    let newSmartObject = new SmartObject([1, 2, 3, 4], 100, 100, 300, 200,0);
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
          //context.setLineDash([5, 15]);
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
          break;
      }  
    }, false);

    canvas.addEventListener('mouseup', function () {
      let toolType = document.getElementById("redux-store").getAttribute("tool");
      switch (toolType) {
        case "pen":
          var canvas = document.getElementById("myCanvas");
          //   $('#number').html('<img id="spinner" src="spinner.gif"/>');
          canvas.removeEventListener('mousemove', onPaint, false);
          //   var img = new Image();
          //   img.onload = function() {
          //context.drawImage(canvas, 0, 0, 28, 28);
          
          var context = canvas.getContext('2d');
          var imageData = context.getImageData(0 , 0, 1440, 480);
          predict_(imageData);
          //   };
          //   img.src = canvas.toDataURL('image/png');
          break;
        case "lasso":
          // reset the lasso area
          canvas.removeEventListener('mousemove', onPaint, false);
          let lassoBox = document.getElementById("lasso-box");
          lassoBox.style.width = 0 + "px";
          lassoBox.style.height = 0 + "px";
          lassoBox.style.display = "none";

          context.rect(Math.min(mouse.x, lasso_x), Math.min(mouse.y, lasso_y), Math.abs(mouse.x - lasso_x), Math.abs(mouse.y - lasso_y));
          let originalStyle = context.strokeStyle;
          context.setLineDash([5, 3])
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

    tf.loadLayersModel('https://raw.githubusercontent.com/Rabona17/tfjs_models/main/model/model.json').then(function (model) {
      window.model = model;
      console.log('ready');
    });


    // var predict = function (input) {
    //   if (window.model) {
    //     window.model.predict([input.reshape([1, 28, 28, 1])]).array().then(function (scores) {
    //       scores = scores[0];
    //       let predicted = scores.indexOf(Math.max(...scores));
    //       if (place_holder) {
    //         predicted = 1;
    //       }
    //       //$('#number').html(predicted.toString()+','+predicted.toString());

    //       if (same_object) {
    //         predicted_arr[predicted_arr.length - 1] = predicted;
    //       } else {
    //         predicted_arr[predicted_arr.length] = predicted
    //       }

    //       console.log(predicted_arr)

    //     });
    //   } else {
    //     // The model takes a bit to load, if we are too fast, wait

    //     setTimeout(function () { predict(input) }, 50);
    //   }
    // }

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