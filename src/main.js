var Kefir = require('Kefir');
var Ball = require('./objects/ball');
var Cube = require('./objects/3dCube');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.translate(window.innerWidth/2, window.innerHeight/2);

function generateBalls(num, ctx){
  for(j=0; j<num; j++){
    var ball = Ball.create({
      id: j,
      ctx: ctx,
      elasticity: 0.99,
      collisions: false,
      radius: Math.random()*0+5,
      fillColor: "#" + (Math.random()*0xFFF<<0),
      velocity: {x: 0, y: 0},
      position: {x: Math.random()*500-250, y: Math.random()*500-250},
      boundingBox: {
        x: {left: -window.innerWidth/2, right: window.innerWidth/2},
        y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
      }
    })
    balls.push(ball);
    // masses.push(ball);
  }
}

function clickBall(container){
  startPoint = {};
  var mouseDowns = Kefir.fromEvents(container, 'mousedown');
  var mouseMoves = Kefir.fromEvents(container, 'mousemove');
  var mouseUps = Kefir.fromEvents(container, 'mouseup');
  mouseDowns.onValue(function(e){
    startPoint = {x: e.pageX, y: e.pageY};
  })
  mouseUps.onValue(function(e){
    var radius = Math.sqrt( Math.pow(startPoint.x - e.pageX, 2) + Math.pow(startPoint.y - e.pageY, 2) ) != 0 ? Math.sqrt( Math.pow(startPoint.x - e.pageX, 2) + Math.pow(startPoint.y - e.pageY, 2) ) : 5
    var ball = Ball.create({
      id: balls.length + 1,
      ctx: ctx,
      elasticity: 0.7,
      collisions: false,
      lineWidth: 0.5,
      radius: radius,
      fillColor: "#" + (Math.random()*0xFFF<<0),
      velocity: {x: 0, y: 0},
      // globalAcc: {x: 0, y: 0.0981},
      massInteract: true,
      position: {x: e.pageX - window.innerWidth/2, y: e.pageY - window.innerHeight/2},
      boundingBox: {
        x: {left: -window.innerWidth/2, right: window.innerWidth/2},
        y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
      }
    })
    balls.push(ball);
    masses.push(ball);
    startPoint = {};
  })
}
var balls = [];
var masses = [];

clickBall(canvas)
generateBalls(0, ctx)

function animate() {
  window.requestAnimationFrame(animate)
  ctx.clearRect(-window.innerWidth/2,-window.innerHeight/2,window.innerWidth,window.innerHeight);
  balls.forEach(function(ball){
    ball.update(masses);
  })
}
window.requestAnimationFrame(animate)
