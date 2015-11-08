# simple-verlet-physics

```javascript
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
  collisions: false,
  boundingBox: {
    x: {left: -window.innerWidth/2, right: window.innerWidth/2},
    y: {top: -window.innerHeight/2, bottom: window.innerHeight/2}
  }
})
```
Call update within an animation frame to coninuasly update its position

```javascript
ball.update(masses)
```
