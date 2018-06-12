
var x0, x1, x2, x3, X0, X1, X2, X3, m0, m1,m2, m3, M0, M1,M2, M3;
var y0, y1, y2, y3, Y0, Y1, Y2, Y3, n0, n1,n2, n3, N0, N1, N2,  N3
var cx, cy, cd, cX ,cY,cD, mx,my,md,Mx,My,Md;

//N
var w1 , w2,  w3, w4;
var wb1, wb2, wb3, wb4;
var h1,h2;
var c1, c2,c3,c4;


function setup() {
  createCanvas(windowWidth,windowHeight);


}

function draw() {
  background(23,0,235);
  translate(350,0);
  var w = 400;
  var h = 600;
  var shaking= second();
  var s = random(-0.5,2)+ shaking;
  //display
  y0 = y3 = cy = h * 0.3 +random(-1,1) ;
  x0 = x1 = w * 0.2+random(-1,1) ;
  x2 = x3 = w* 0.8+random(-1,1) ; // i.e. 1 - 0.2 for symetry
  cx = w * 0.5+random(-1,1) ;
  cd = x3 - x1+random(-1,1) ;
 // oppsite
  Y0 = Y3 = cY = h *0.7+random(-1,1) ;
  X0 = X1 =w * 0.2+random(-1,1) ;
  X2 = X3 =w * 0.8+random(-1,1) ;
  cX = w* 0.5+random(-1,1)  ;
  cd = X3 -X1+random(-1,1)  ;
  // xiao yuan
  n0 = n3 = my = h * 0.3+random(-1,1) ;
  m0 = m1 = w * 0.4+random(-1,1) ;
  m2 = m3 = w  * 0.6+random(-1,1)  ; // i.e. 1 - 0.2 for symetry
  mx = w * 0.5+random(-1,1) ;
  md = m3 - m1+random(-1,1) ;
  // oppsite small
  N0 = N3 = My = h *0.7+random(-1,1) ;
  M0 = M1 = w * 0.4+random(-1,1) ;
  M2 = M3 =w * 0.6+random(-1,1) ;
  Mx = w * 0.5+random(-1,1) ;
  Md = M3 - M1 +random(-1,1) ;


  y1 = y2 = (183 + s*0.95) - 120+random(-1,1)  ;
   Y1 = Y2 = h - (183 + s*0.95) + 120+random(-1,1)  ;
   n1 = n2  = (183 + s*0.95) -  60+random(-1,1)  ;
   N1 = N2 = h - (183 + s*0.95) + 60+random(-1,1) ;


  beginShape();
  vertex(x0,y0 - s * 0.9);
  bezierVertex(x1, y1, x2, y2, x3, y3 - s * 0.9);
  vertex(x3,y3);
  vertex(m3,y3);
  //inside the circle
  bezierVertex(m2, n2, m1, n1, m0,n0 );
  vertex(m0,270);
  vertex(m0 + 2.6667 * s, 270);
  vertex(m0 + 2.6667 * s, 330);
  vertex(m0,330);
  vertex(M0,N0);
  bezierVertex(M1, N1, M2, N2, M3, N3);
  vertex(X3,Y3);
  vertex(X3,Y3 + s * 0.9);
  bezierVertex(X2, Y2, X1, Y1, X0, Y0 + s * 0.9);
  vertex(X0,Y0) ;
  vertex(x0,y0- s * 0.9);
  endShape();

  // N
  var r= random(-1,2);
  w1 = wb1= 400+r;
    w2 = 470+r;
    w3 = 470+r;
    w3 = 628+r;
    w4= wb4 =700+r;
    wb2 = 472+r;
    wb3 = 623+r;

    h1 = 100+r;
    h2 = 491+r;

    c1 = 472+r;
    c2 = 628+r;
    c3 = 238+r;
    c4 = 378+r;

      noFill()
      stroke(255);
      strokeWeight(2);
      beginShape();
      vertex(w1+random(-1,2),h1+random(-1,2));
      vertex(w2+random(-1,2),h1+random(-1,2));
      vertex(c2+random(-1,2),c4+random(-1,2));
      vertex(w3+random(-1,2),h1+random(-1,2));
      vertex(w4+random(-1,2),h1+random(-1,2));
      vertex(wb4+random(-1,2),h2+random(-1,2));
      vertex(wb3+random(-1,2),h2+random(-1,2));
      vertex(c1+random(-1,2),c3+random(-1,2));
      vertex(wb2+random(-1,2),h2+random(-1,2));
      vertex(wb1+random(-1,2),h2+random(-1,2));
      vertex(w1+random(-1,2),h1+random(-1,2));
      endShape();
      }
