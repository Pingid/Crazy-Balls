var Mass = require('./shapes');
var Utils = require('../utils/utils');

var Ball = Mass.create({
  position: {x: 0, y: 0},
  velocity: {x: 0, y: 0},
  radius: 40,
  mass: 40,
  elasticity: 0.9,
  surfaceResistance: 1,
  lineWidth: 0,
  fillColor: '#FFFFFF',
  lineColor: '#000000',
  fixed: false,
  collisions: false,
  setBounding: function(){
    this.height = this.radius;
    this.width = this.radius;
    this.mass = this.radius * 0.1
  },
  resolvePosition: function(){
    // console.log(this.acceleration);
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

  	this.position.x += this.velocity.x;
  	this.position.y += this.velocity.y;
  },
  gravitationalPull: function(object, number){
    var dist = Utils.distance(this, object)
    var ang = Utils.angle(this, object);
    var G = 1/number;
    var force = G * this.mass * object.mass /Math.sqrt(dist);
    // console.log([this.id, dist, ang, G, force]);
    // console.log([,ang,force,this.mass])
    return {
      x: Math.cos(ang) * force / this.mass,
      y: Math.sin(ang) * force / this.mass
    }
  },
  resolveAcceleration: function(objects){
    var forces = {x: 0, y: 0};
    that = this;
    var totalMass = objects.map(function(object){ return object.mass })
      .reduce(function(prev, curr) { return prev + curr });
    objects.forEach(function(object){
      if(object.id !== that.id){
        var objectForces = that.gravitationalPull(object, totalMass)
        forces = {
          x: forces.x + objectForces.x,
          y: forces.y + objectForces.y
        }
      }
    })
    this.acceleration = {
      x: forces.x + this.globalAcc.x,
      y: forces.y + this.globalAcc.y
    }
    // console.log([that.id, that.acceleration]);
  },
  detectCollision: function(a, b){
    var distance = Utils.distance(a, b)
    return (distance <= a.radius + b.radius);
  },
  resolveCollisionVecter: function(a,  b){
    var angleBetween = this.getAngleBetween(a, b);

    // Velocity vecter
    var velA = this.getVelocitie(a);
    var velB = this.getVelocitie(b);

    // Velocity vecter angle
    var angleA = this.getVelocitieAngle(a);
    var angleB = this.getVelocitieAngle(b);


    var rotateVelAX = velA * Math.cos(angleA - angleBetween);
    var rotateVelAY = velA * Math.sin(angleA - angleBetween);
    var rotateVelBX = velB * Math.cos(angleB - angleBetween);
    var rotateVelBY = velB * Math.sin(angleB - angleBetween);

    var finalVelocityAX = ((a.mass - b.mass) * rotateVelAX + (b.mass + b.mass) * rotateVelBX) / (a.mass + b.mass);
    var finalVelocityBX = ((a.mass + a.mass) * rotateVelAX + (b.mass - a.mass) * rotateVelBX) / (a.mass + b.mass);

    a.position = {
      x: a.position.x - a.velocity.x,
      y: a.position.y - a.velocity.y
    }
    // b.position = {
    //   x: b.position.x - b.velocity.x,
    //   y: b.position.y - b.velocity.y
    // }
    a.velocity = {
      x: a.elasticity * Math.cos(angleBetween) * finalVelocityAX + Math.cos(angleBetween + Math.PI/2) * rotateVelAY * a.elasticity,
      y: a.elasticity * Math.sin(angleBetween) * finalVelocityAX + Math.sin(angleBetween + Math.PI/2) * rotateVelAY * a.elasticity
    }
    // b.velocity = {
    //   x: b.elasticity * Math.cos(angleBetween) * finalVelocityBX + Math.cos(angleBetween + Math.PI/2) * rotateVelBY * b.elasticity,
    //   y: b.elasticity * Math.sin(angleBetween) * finalVelocityBX + Math.sin(angleBetween + Math.PI/2) * rotateVelBY * b.elasticity
    // }
  },
  resolveCollision: function(objects){
    var that = this;
    objects.forEach(function(object){
      if(that.id != object.id){
        if(that.detectCollision(that, object)){

          // that.fillColor = "#" + (Math.random()*0xFFF<<0);

          that.resolveCollisionVecter(that, object)
        }
      }
    })
  },
  draw: function(){
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fill();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.stroke();
    this.ctx.closePath();
  },
  update: function(objects){
    this.setBounding();
    // this.resolveCollisionBalls(objects);
    this.resolveAcceleration(objects);
  	this.resolvePosition();
    this.collisions ? this.resolveCollision(objects) : null;
  	this.rebound();
  	this.draw();
  }
})

module.exports = Ball;
