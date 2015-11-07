var Mass = require('./shapes');

var Rectangle = Mass.create({
  position: {x: 0, y: 0},
  velocity: {x: 0, y: 0},
  elasticity: 0.5,
  surfaceResistance: 0.5,
  width: 100,
  height: 100,
  fillColor: '#FFFFFF',
  lineColor: '#000000',
  lineWidth: 0,
  draw: function(){
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();
    ctx.closePath();
  },
  update: function(){
  	this.resolvePosition();
    this.rebound();
  	this.draw();
  }
})

module.exports = Rectangle;
