(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Mass = require('./shapes');
var Utils = require('../utils/utils');
var Settings = require('../settings.js');

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
  setBounding: function(){
    this.height = this.radius;
    this.width = this.radius;
    this.mass = this.radius * 1
  },
  resolvePosition: function(){
    // console.log(this.acceleration);
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

  	this.position.x += this.velocity.x;
  	this.position.y += this.velocity.y;
  },
  gravitationalPull: function(object){
    var dist = Utils.distance(this, object)
    var ang = Utils.angle(this, object);
    var G = Settings.gravity/100;
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
    objects.forEach(function(object){
      if(object.id !== that.id){
        // console.log([object, that, object.id !== that.id])
        var objectForces = that.gravitationalPull(object)
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

    var velA = this.getVelocitie(a);
    var velB = this.getVelocitie(b);

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
    b.position = {
      x: b.position.x - b.velocity.x,
      y: b.position.y - b.velocity.y
    }
    a.velocity = {
      x: a.elasticity * Math.cos(angleBetween) * finalVelocityAX + Math.cos(angleBetween + Math.PI/2) * rotateVelAY * a.elasticity,
      y: a.elasticity * Math.sin(angleBetween) * finalVelocityAX + Math.sin(angleBetween + Math.PI/2) * rotateVelAY * a.elasticity
    }
    b.velocity = {
      x: b.elasticity * Math.cos(angleBetween) * finalVelocityBX + Math.cos(angleBetween + Math.PI/2) * rotateVelBY * b.elasticity,
      y: b.elasticity * Math.sin(angleBetween) * finalVelocityBX + Math.sin(angleBetween + Math.PI/2) * rotateVelBY * b.elasticity
    }
  },
  resolveCollisionVecter2: function(a,b){
    var diff = {
      x: a.position.x - b.position.x,
      y: a.position.y - b.position.y
    }
    var distance = this.distanceBetween(a,b);
    var diffDist = distance - (a.radius + b.radius)

    var depth = {
      x: diff.x * (diffDist / distance),
      y: diff.y * (diffDist / distance)
    }
    a.position = { x: depth.x * 0.5, y: depth.y * 0.5 };
    b.position = { x: depth.x * 0.5, y: depth.y * 0.5 };

    var pr1 = a.elasticity * (diff.x * a.velocity.x + diff.y * a.velocity.y) / (diff.x * diff.x + diff.y * diff.y);
    var pr2 = b.elasticity * (diff.x * b.velocity.x + diff.y * b.velocity.y) / (diff.x * diff.x + diff.y * diff.y);
    newVelocity = {
      a: {
        x: a.velocity.x + pr2 * diff.x - pr1 * diff.x,
        y: a.velocity.y + pr1 * diff.x - pr2 * diff.x
      },
      b: {
        x: a.velocity.x + pr2 * diff.y - pr1 * diff.y,
        y: a.velocity.y + pr1 * diff.y - pr2 * diff.y
      }
    }
    console.log({diff: diff, dist: distance, diffDist: diffDist, depth: depth, pr1: pr1, pr2: pr2, vel: newVelocity})
    a.velocity = {
      x: a.velocity.x + pr2 * diff.x - pr1 * diff.x,
      y: a.velocity.y + pr1 * diff.x - pr2 * diff.x
    }
    b.velocity = {
      x: a.velocity.x + pr2 * diff.y - pr1 * diff.y,
      y: a.velocity.y + pr1 * diff.y - pr2 * diff.y
    }

    // a.velocity.x += pr2 * diff.x - pr1 * diff.x;
    // a.velocity.y += pr1 * diff.x - pr2 * diff.x;
    // b.velocity.x += pr2 * diff.y - pr1 * diff.y;
    // b.velocity.y += pr1 * diff.y - pr2 * diff.y;
  },
  resolveCollision: function(objects){
    var that = this;
    objects.forEach(function(object){
      if(that.id != object.id){
        if(that.detectCollision(that, object)){

          that.fillColor = "#" + (Math.random()*0xFFF<<0);

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
    // this.resolveCollision(objects);
  	this.rebound();
  	this.draw();
  }
})

module.exports = Ball;

},{"../settings.js":3,"../utils/utils":4,"./shapes":2}],2:[function(require,module,exports){
var Utils = require('../utils/utils');
var Settings = require('../settings');

var Mass = {
  force: {x: 0, y: 0},
  acceleration: {x: 0, y: 0},
  globalAcc: {x: 0, y: 0 },
  boundingBox: {},
  objects: [],
  create: function(values){
    var instance = Object.create(this);
    Object.keys(values).forEach(function(key){
      instance[key] = values[key];
    })
    return instance;
  },
  distanceBetween: function(a, b) {
      return Math.sqrt(Math.pow(b.position.x - a.position.x, 2) + Math.pow(b.position.y - a.position.y, 2));
  },
  getVelocitie: function(object){
    return Math.sqrt(object.velocity.x * object.velocity.x + object.velocity.y * object.velocity.y);
  },
  getVelocitieAngle: function(object){
    return Math.atan2(object.velocity.y,object.velocity.x)
  },
  getAngleBetween: function(a, b){
    var diffx = a.position.x - b.position.x;
    var diffy = a.position.y - b.position.y;
    return Math.atan2(diffy,diffx);
  },
  rebound: function(){
    if(this.boundingBox.x.right){
      if(this.position.x + this.width > this.boundingBox.x.right){
        this.position.x = this.boundingBox.x.right - this.width;
        this.velocity.x *= -1 * this.elasticity;
      }
    }
    if(this.boundingBox.x.left){
      if(this.position.x < this.boundingBox.x.left){
        this.position.x = this.boundingBox.x.left;
        this.velocity.x *= -1 * this.elasticity;
      }
    }
    if(this.boundingBox.y.top){
      if(this.position.y < this.boundingBox.y.top){
        this.position.y = this.boundingBox.y.top;
        this.velocity.y *= -1 * this.elasticity;
      }
    }
    if(this.boundingBox.y.bottom){
      if(this.position.y + this.height > this.boundingBox.y.bottom){
        this.position.y = this.boundingBox.y.bottom - this.height;
        this.velocity.y *= -1 * this.elasticity;
      }
    }
  },
  detectRectCollission: function(a, b) {
      var dx = a.position.x - b.position.x;
      var dy = a.position.y - b.position.y;
      var w = a.width + b.width;
      return (dx * dx + dy * dy <= w * w)
  }
}

module.exports = Mass;

},{"../settings":3,"../utils/utils":4}],3:[function(require,module,exports){
module.exports = {
  gravity: 0.9
}

},{}],4:[function(require,module,exports){
module.exports = {
  distance: function(point1, point2) {
      return Math.sqrt(Math.pow(point2.position.x - point1.position.x, 2) + Math.pow(point2.position.y - point1.position.y, 2));
  },
  angle: function(point1, point2) {
      return Math.atan2(point2.position.y - point1.position.y, point2.position.x - point1.position.x);
  },
  Point: {
    position: {x: 0, y: 0},
    radius: 20,
    fillColor: '#FFFFFF',
    mousePosition: {x: 0, y: 0},
    create: function(values){
      var instance = Object.create(this);
      Object.keys(values).forEach(function(key){
        instance[key] = values[key];
      })
      return instance;
    },
    draw: function(){
      this.position = this.mousePosition;
      this.ctx.beginPath();
      this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}

},{}]},{},[1]);
