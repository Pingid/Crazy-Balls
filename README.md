# simple-verlet-physics

```
var ball = Ball.create({
  globalAcc: {x: 0, y: 0.01 },
  id: 03,
  ctx: ctx,
  radius: 30,
  mass: 30,
  velocity: {x: 1, y: .1},
  position: {x: -0, y: -80},
  elasticity: 0.9,
  surfaceResistance: 1,
  lineWidth: 0,
  fillColor: '#FFFFFF',
  lineColor: '#000000',
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
})
```
* globalAcc = fixed forces from environment
* id = unique id for each ball
* ctx = canvas context
* boundingBox = Set where collision with walls happen

* masses array of masses that exert force on the ball;

* ball.update(masses)
