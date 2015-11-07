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
