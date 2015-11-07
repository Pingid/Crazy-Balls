// Dependancies
var Kefir = require('Kefir');

// Objects
var Ball = require('./objects/ball');
console.log();

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
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
})

var balls = [ball1, ball2, ball3];

var masses = [ball1, ball2, ball3];
function generateBalls(num, ctx){
  for(j=0; j<num; j++){
    console.log("hello")
    var i = Ball.create({
      id: j,
      ctx: ctx,
      elasticity: 0.99,
      radius: Math.random()*1+30,
      // velocity: {x: Math.random()*2, y: Math.random()*0.1},
      position: {x: Math.random()*500-250, y: Math.random()*500-250},
      boundingBox: {
        x: {left: -window.innerWidth/2, right: window.innerWidth/2},
        y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
      }
    })
    balls.push(i);
    masses.push(i);
  }
}
generateBalls(0, ctx)
// ball2.update();
function update () {
  setInterval(function () {
    ctx.clearRect(-window.innerWidth/2,-window.innerHeight/2,window.innerWidth,window.innerHeight);
    balls.forEach(function(ball){
      ball.update(masses);
      // mousePoint.draw();
    })
  }, 15);
}
update();
// var count = 0
// for(i=0; i<1; i++){
//     setTimeout(function(){
//       console.log("-------------------FRAME " + count + "-----------------------")
//       count++
//       balls.forEach(function(ball){
//         ball.update(masses);
//       })
//     }, 300)
// };

// balls.forEach(function(ball){
//   ball.update(masses);
// })
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

  // scrolls.onValue(function (e) {cube.size += e; });
}
ballInteract(canvas);


// function cubeInteract (container){
//   var startPoint = [0,0];
//   var mouseDowns = Kefir.fromEvents(container, 'mousedown');
//   var mouseMoves = Kefir.fromEvents(container, 'mousemove');
//   var mouseUps = Kefir.fromEvents(container, 'mouseup');
// 	var scrolls = Kefir.stream(function (emitter) {
// 	  function emitScrollY () {
// 	    emitter.emit(window.scrollY);
// 	  }
// 	  emitScrollY ();
// 	  window.addEventListener('scroll', emitScrollY);
// 	  return function () {
// 	    window.removeEventListener('scroll', emitScrollY);
// 	  };

// 	}).toProperty ();
//   var moves = mouseDowns.flatMap(function() {
//     return mouseMoves.takeUntilBy(mouseUps);
//   });
//   mouseDowns.onValue(function (e) { startPoint = [e.pageX,e.pageY]; run = true; });
//   moves.onValue(function (e){
//     rotation = [(startPoint[1]-e.pageY)*0.0001, (startPoint[0]-e.pageX)*0.0001,0];
//   });
//   mouseUps.onValue(function () {run = false; });

//   // scrolls.onValue(function (e) {cube.size += e; });
// }
// cubeInteract(canvas);
