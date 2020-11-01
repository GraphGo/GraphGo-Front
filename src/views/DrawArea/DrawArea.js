import react, {Component} from 'react';
import styled from 'styled-components';
import $ from "jquery";
import * as tf from '@tensorflow/tfjs';
import "./DrawArea.css";

class DrawArea extends Component {
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
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };

    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };
    
    
    $('#paint').css({'width': '100%'});
    $('#number').css({'width': '100px', 'font-size': '60px'});
    $('#clear').css({'font-size': '35px'});
    

    var cw = $('#paint').width();
    $('#paint').css({'height': cw/3 + 'px'});

    cw = $('#number').width();
    $('#number').css({'height': cw + 'px'});

    // From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var compuetedStyle = getComputedStyle(document.getElementById('paint'));
    canvas.width = parseInt(compuetedStyle.getPropertyValue('width'));
    canvas.height = parseInt(compuetedStyle.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var arr_x = []
    var arr_y = []
    var local_arr_x = []
    var local_arr_y = []
    var old_bbox = []
    var predicted_arr = []
    var same_object = false;
    canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      
    }, false);

    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'red';

    canvas.addEventListener('mousedown', function(e) {
      
      if (arr_x.length!=0 & arr_y.length!=0){
        if (mouse.x - arr_x.max()< 30){
            same_object = true;
            console.log('Same object')
        }
        else{
            same_object = false;
            arr_x=[];
            arr_y=[];
        }
      }
      
      
      context.moveTo(mouse.x, mouse.y);
      context.beginPath();
      canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
    //   $('#number').html('<img id="spinner" src="spinner.gif"/>');
      
        canvas.removeEventListener('mousemove', onPaint, false);
    //   var img = new Image();
    //   img.onload = function() {
        //context.drawImage(canvas, 0, 0, 28, 28);
        
        let data = context.getImageData(arr_x.min()-5, arr_y.min()-5,arr_x.max()-arr_x.min()+15,arr_y.max()-arr_y.min()+15);
        context.putImageData(data, 0, 0);
        let img = tf.browser.fromPixels(data, 1).resizeBilinear([28,28]);
        
        // var input = [];
        // for(var i = 0; i < data.length; i += 4) {
        //     input.push(data[i + 2] / 255);
        // }
        predict(img);

    //   };
    //   img.src = canvas.toDataURL('image/png');
    }, false);

    var onPaint = function() {
      arr_x.push(mouse.x)
      arr_y.push(mouse.y)
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    };

    tf.loadLayersModel('https://raw.githubusercontent.com/carlos-aguayo/carlos-aguayo.github.io/master/model/model.json').then(function(model) {
      window.model = model;
    });
    

    var predict = function(input) {
      if (window.model) {
        window.model.predict([input.reshape([1, 28, 28, 1])]).array().then(function(scores){
          scores = scores[0];
          let predicted = scores.indexOf(Math.max(...scores));
          //$('#number').html(predicted.toString()+','+predicted.toString());
          //Data structure 没调好所以prediction还没实现
          if (same_object){
              predicted_arr[predicted_arr.length-1] = predicted;
            }else{
                predicted_arr[predicted_arr.length] = predicted
            }
            
          console.log(predicted_arr)
        });
      } else {
        // The model takes a bit to load, if we are too fast, wait
        
        setTimeout(function(){predict(input)}, 50);
      }
    }

    $('#clear').click(function(){
      context.clearRect(0, 0, canvas.width, canvas.height);
      mouse = {x: 0, y: 0};
      arr_x = []
      arr_y = []
      local_arr_x = []
      local_arr_y = []
      old_bbox = []
      predicted_arr = []
      same_object = false;
    //   $('#number').html('');
    });
  }

  render () {
    return (
      <Container>
        <div id="paint">
          <canvas id="myCanvas"></canvas>
        </div>
        <div id="predicted">
          <button id="clear">Clear</button>
        </div>
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