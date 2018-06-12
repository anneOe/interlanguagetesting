var bgcolor;
var button;
var slider;
var input;


function setup(){
  canvas = createCanvas(400,400);
  bgcolor = color(51);
  nameP = createP('your name!');
  
  nameP.mouseOver(overpara);
  nameP.mouseOut(outpara);
  
  
  button = createButton('go');
  button.mousePressed(changeColor);
  
  
  slider = createSlider(10,100,20);
  input = createInput('type your name ');
  input.changed(update);

  
  
  // 當移動鼠標時候的效果
  
  
}


function update(){
  nameP.html(input.value());
}

function overpara(){
  nameP.html('your mouse is over me!');
}

function outpara(){
  nameP.html('your mouse out! out!  ');
  
}
function changeColor(){
  bgcolor  = color(random(255));
  
  
}

function draw(){
  background(bgcolor);
  fill(127,129,225);
  stroke(0);
  ellipse(300,200,slider.value(),slider.value());
  //ellipse(100,100,50,50);
  text(input.value(),200,500);
}