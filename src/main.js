// Dependancies
var Kefir = require('Kefir');
// Objects
var Ball = require('./objects/ball');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.translate(window.innerWidth/2, window.innerHeight/2);


var ball1 = Ball.create({
  id: 01,
  ctx: ctx,
  radius: 40,
  mass: 40,
  collisions: true,
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
});
var ball2 = Ball.create({
  id: 02,
  ctx: ctx,
  radius: 4,
  mass: 4,
  velocity: {x: 1, y: .1},
  position: {x: -80, y: -80},
  collisions: true,
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
})
var ball3 = Ball.create({
  globalAcc: {x: 0, y: 0.01 },
  id: 03,
  ctx: ctx,
  radius: 30,
  mass: 30,
  velocity: {x: 1, y: .1},
  position: {x: -0, y: -80},
  collisions: true,
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
})

// var balls = [ball1, ball2, ball3];
// var masses = [ball1, ball2, ball3];
var balls = [];
var masses = [];

function generateBalls(num, ctx){
  for(j=0; j<num; j++){
    var ball = Ball.create({
      id: j,
      ctx: ctx,
      elasticity: 0.99,
      collisions: false,
      radius: Math.random()*20+5,
      fillColor: "#" + (Math.random()*0xFFF<<0),
      velocity: {x: 0, y: 0},
      position: {x: Math.random()*500-250, y: Math.random()*500-250},
      boundingBox: {
        x: {left: -window.innerWidth/2, right: window.innerWidth/2},
        y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
      }
    })
    balls.push(ball);
    masses.push(ball);
  }
}
generateBalls(3, ctx)

function animate() {
  // ctx.clearRect(-window.innerWidth/2,-window.innerHeight/2,window.innerWidth,window.innerHeight);
  balls.forEach(function(ball){
    ball.update(masses);
  })
  window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)

function clickBall(container){
  startPoint = {};
  var mouseDowns = Kefir.fromEvents(container, 'mousedown');
  var mouseMoves = Kefir.fromEvents(container, 'mousemove');
  var mouseUps = Kefir.fromEvents(container, 'mouseup');
  mouseDowns.onValue(function(e){
    startPoint = {x: e.pageX, y: e.pageY};
    console.log(startPoint);
  })
  mouseUps.onValue(function(e){
    var radius = Math.sqrt( Math.pow(startPoint.x - e.pageX, 2) + Math.pow(startPoint.y - e.pageY, 2) ) != 0 ? Math.sqrt( Math.pow(startPoint.x - e.pageX, 2) + Math.pow(startPoint.y - e.pageY, 2) ) : 5
    var ball = Ball.create({
      id: balls.length + 1,
      ctx: ctx,
      elasticity: 0.99,
      collisions: false,
      radius: radius,
      fillColor: "#" + (Math.random()*0xFFF<<0),
      velocity: {x: 0, y: 0},
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
clickBall(canvas)

function ballInteract(container){
  var startPoint = [0,0];
  var run;
  var mouseDowns = Kefir.fromEvents(container, 'mousedown');
  var mouseMoves = Kefir.fromEvents(container, 'mousemove');
  var mouseUps = Kefir.fromEvents(container, 'mouseup');
  var moves = mouseDowns.flatMap(function() {
    return mouseMoves.takeUntilBy(mouseUps);
  });
  mouseDowns.onValue(function (e) {
    startPoint = [e.pageX,e.pageY];
    run = true;
  });
  moves.onValue(function (e){
    if(run){
      mousePoint.mousePosition = {x: e.pageX-window.innerWidth/2, y: e.pageY-window.innerHeight/2}
    }
  });
  mouseUps.onValue(function () {run = false; });
}
