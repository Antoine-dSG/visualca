
$(document).ready(function () {
  // Set size of canvas to 80% of browser window size
  const canvas = document.getElementById("canvas");
  if (window.innerWidth <= window.innerHeight) {
    canvas.width = window.innerWidth*0.8;
    canvas.height = canvas.width;
  }
  else {
    canvas.height = window.innerHeight* 0.9;
    canvas.width = canvas.height;
  }

  // Run function to draw fan
  draw_fan(); 
});

///////////////////////////////////
// Make the parameter box draggable
dragElement(document.getElementById("parameters"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
// End of dragging code
///////////////////////


//////////////
// Slider code
var slider_scale = document.getElementById("fan_scale");
var output = document.getElementById("slider-value");
output.innerHTML = slider_scale.value; 

// Update the current slider value (each time you drag the slider handle)
slider_scale.oninput = function() {
  output.innerHTML = this.value;
}

var slider_cste_b = document.getElementById("constant-b");
var output_cste_b = document.getElementById("slider-value-cste-b");
output_cste_b.innerHTML = slider_cste_b.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider_cste_b.oninput = function() {
  output_cste_b.innerHTML = this.value;
}

var slider_cste_c = document.getElementById("constant-c");
var output_cste_c = document.getElementById("slider-value-cste-c");
output_cste_c.innerHTML = slider_cste_c.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider_cste_c.oninput = function() {
  output_cste_c.innerHTML = this.value;
}

var dVec_scale = document.getElementById("denominatorCount");
var output_dVec = document.getElementById("slider-value-denom-count");
output_dVec.innerHTML = dVec_scale.value; 

// Update the current slider value (each time you drag the slider handle)
dVec_scale.oninput = function() {
  output_dVec.innerHTML = this.value;
}
// End of slider code
/////////////////////

/////////////////////////////////////
// Compute extremal ray slopes, when bc > 3
function extr_ray_slopes(b,c) {
  vect = [];
  t = b*c/2 - 1;
  var u = t + Math.sqrt(t*t - 1);
  var y_1 = c/(1+u);
  var y_2 = (1/b)*(1+u);
  
  vect = [y_1,y_2];
  return vect
}
// End of extremal ray slopes 
/////////////////////////////



function draw_fan() {
// Setting up the canvas
const canvas = document.getElementById("canvas");
const fan = canvas.getContext("2d");
// Clearing any previous canvas
fan.clearRect(0, 0, canvas.width, canvas.height);
// Drawing the coordinate axes
fan.beginPath();
// NS coordinate axis
fan.moveTo(canvas.width / 2,canvas.height*0.1);
fan.lineTo(canvas.width / 2,canvas.height*0.9);
// EW coordinate axis
fan.moveTo(canvas.width*0.1,canvas.height/2);
fan.lineTo(canvas.width*0.9,canvas.height/2);
fan.lineWidth = 2;
fan.strokeStyle = "black";
fan.stroke();
// Drawing the origin 
fan.beginPath();
fan.arc(canvas.width / 2,canvas.height/2, 3, 0, 2*(Math.PI));
fan.fill();

const b = document.getElementById('constant-b').value;
const c = document.getElementById('constant-c').value;
const scale = document.getElementById('fan_scale').value;
const dVectCheck = document.getElementById("d-vecCheckbox").checked;
const extr_rays = document.getElementById('extremal-ray-checkbox').checked;
const grid_lines = document.getElementById('grid-checkbox').checked;
const m = document.getElementById("denominatorCount").value;

// Drawing grid lines
if (grid_lines == true) {
  // Make the grid scale slidebar visible
  document.getElementById("gridScaleBox").style.visibility = "visible";
  // Specifying the colour and thickness of the grid lines
  fan.strokeStyle= "rgba(0,0,0,0.5)"
  fan.lineWidth = 0.5;

  for (let i = 1; i <= canvas.width*0.8/(2*scale); i++) {
    fan.beginPath();
    fan.moveTo(canvas.width/2 + scale*i, canvas.height*0.1);
    fan.lineTo(canvas.width/2 + scale*i, canvas.height*0.9);
    fan.moveTo(canvas.width/2 - scale*i, canvas.height*0.1);
    fan.lineTo(canvas.width/2 - scale*i, canvas.height*0.9);
    fan.moveTo(canvas.width*0.1, canvas.height/2 + scale*i);
    fan.lineTo(canvas.width*0.9, canvas.height/2 + scale*i);
    fan.moveTo(canvas.width*0.1, canvas.height/2 - scale*i);
    fan.lineTo(canvas.width*0.9, canvas.height/2 - scale*i);
    fan.stroke();
  }
}
else {
  document.getElementById("gridScaleBox").style.visibility = "collapse";
}

// Drawing d-vectors
if (dVectCheck == true) {
  document.getElementById("dvecScaleBox").style.visibility = "visible";
  document.getElementById("exRayBox").style.visibility = "visible";
  // Compute the Chebyshev polynomials up to m.
  var ChebPoly = Chebyshev(m,b,c);
  var D1, D2, D1_neg, D2_neg;

  // Compute the d-vector slopes up to m > 0.
  k = 0;
  while (k <= m) {
    if (k%2 == 1) {
      // Compute the d-vector for m > 0
      n=(k-1)/2;
      D1 = b*ChebPoly[n+1];
      D2 = ChebPoly[n+1]+ChebPoly[n];
      

      // Compute the d-vector for m < 0
      n=(k-1)/2;
      D1_neg = ChebPoly[n+1]+ChebPoly[n];
      D2_neg = c*ChebPoly[n+1];
    }
    else {
      // Compute the d-vector for m > 0
      if (k == 0) {
        
        }
      else {
        n=k/2;
      D1 = ChebPoly[n+1]+ChebPoly[n];
      D2 = c*ChebPoly[n];
      }
      
      

      // Compute the d-vector for m < 0
      n=k/2;
      D1_neg = b*ChebPoly[n];
      D2_neg = ChebPoly[n+1]+ChebPoly[n];
    }
    SlopeToRay(D2/D1, "black");
    SlopeToRay(D2_neg/D1_neg, "black");
    k = k+1;
  } 
}

else {
  document.getElementById("dvecScaleBox").style.visibility = "collapse";
  document.getElementById("exRayBox").style.visibility = "collapse";
}

// Drawing extremal rays. Only available if the "Show d-vectors" 
// is checked, and if bc > 3
if (dVectCheck == true && extr_rays == true && b*c > 3) {
  const extr_ray_slope = extr_ray_slopes(b,c);
  SlopeToRay(extr_ray_slope[0], "red"); 
  SlopeToRay(extr_ray_slope[1], "red"); 
}
}
// End of draw_fan
//////////////////


// Clear canvas button 
//////////////////////
function clear_canvas() {
  draw_fan();
}
// End of clear canvas button 
/////////////////////////////

///////////////////////////////////////////////////////
// Drawing coordinate points on fan depending on clicks
canvas.addEventListener('click', (event) => {
  // draw_fan();
  // Setting up the canvas
  const canvas = document.getElementById("canvas");
  const fan = canvas.getContext("2d");
  const scale = document.getElementById('fan_scale').value;
  // Check whether mouse click is inside circle
  const dx = (event.offsetX-canvas.width/2)/scale;
  const dx_round = Math.round(dx);
  const dy = (event.offsetY-canvas.height/2)/scale;
  const dy_round = Math.round(dy);
  if (Math.abs(dx-dx_round) < 0.25 && Math.abs(dy-dy_round) < 0.25) {
    fan.beginPath();
    fan.arc(canvas.width/2 + dx_round*scale, canvas.height/2 + dy_round*scale, 3, 0, Math.PI * 2);
    fan.fillStyle = "black";
    fan.fillText("(" + dx_round + "," + -1* dy_round + ")",canvas.width/2 + dx_round*scale + 5,canvas.height/2 + dy_round*scale - 5);
    fan.fill();
  }
}
);
// End of coordinate points drawing
///////////////////////////////////


// Calculate Chebyshev polynomials
//////////////////////////////////
function Chebyshev(m,b,c) {
  var t = b*c - 2;
  var k = 2;
  var ChebPoly = [0,1];
  while (k <= m) {
    x = ChebPoly[k-2];
    y = ChebPoly[k-1];
    ChebPoly.push(t*y-x);
    k = k+1;
  }
  return ChebPoly;
}
// End of Chebyshev polynomials
///////////////////////////////


// Draw ray from slope
////////////////////////
function SlopeToRay(slope, colour) {
  const canvas = document.getElementById("canvas");
  const fan = canvas.getContext("2d");
  // Draw a ray from the origin and with a fixed slope.
  if (slope <= 1) {
    fan.beginPath();
    fan.moveTo(canvas.width / 2,canvas.height/2);
    fan.lineTo(canvas.width*0.9, canvas.height/2 - canvas.width*0.4*slope);
    fan.strokeStyle= colour;
    fan.lineWidth = 2;
    fan.stroke();
    fan.strokeStyle= "rgba(0,0,0)";
    fan.lineWidth = 1;
  }
  else {
    fan.beginPath();
    fan.moveTo(canvas.width / 2,canvas.height/2);
    fan.lineTo(canvas.width / 2 + canvas.height*0.4/slope,canvas.height*0.1);
    fan.strokeStyle= colour;
    fan.lineWidth = 2;
    fan.stroke();
    fan.strokeStyle= "rgba(0,0,0)";
    fan.lineWidth = 1;
  }
}
// End of draw ray from slope
///////////////////////////////

// Take screenshot of canvas 
////////////////////////////
function downloadCanvas() {
  const canvas = document.getElementById("canvas");
  var anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("d_vector_fan/png");
  anchor.download = "d_vector_fan.PNG";
  anchor.click();
}

// 
///////////
function increase() {
  var dVec_scale = document.getElementById("denominatorCount");
  var n = parseInt(dVec_scale.value);
  dVec_scale.value = n+1;
  var output_dVec = document.getElementById("slider-value-denom-count");
  output_dVec.innerHTML = dVec_scale.value;
  draw_fan();
}

function decrease() {
  var dVec_scale = document.getElementById("denominatorCount");
  var n = parseInt(dVec_scale.value);
  if (n >= 0) {
    dVec_scale.value = n-1;
  }
  var output_dVec = document.getElementById("slider-value-denom-count");
  output_dVec.innerHTML = dVec_scale.value;
  draw_fan();
}


