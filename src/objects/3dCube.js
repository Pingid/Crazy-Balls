var Cube = {
  rotation: {x: 2, y: 3, z: 1},
  squareRadius: Math.ceil(Math.pow((this.size/2)*(this.size/2)+(this.size/2)*(this.size/2), 0.5)),
  cubeRadius: Math.ceil(Math.pow(this.squareRadius*this.squareRadius+(this.size/2)*(this.size/2), 0.5)),
  logInfo: function(){
    console.log(this)
  },
  create: function(values){
    var instance = Object.create(this);
    Object.keys(values).forEach(function(key){
      instance[key] = values[key];
    })
    return instance;
  },
  generatePoints: function () {
    this.points = [
      {X: this.position.x-this.size/2, Y: this.position.y-this.size/2, Z: this.position.z-this.size/2},
      {X: this.position.x-this.size/2, Y: this.position.y-this.size/2, Z: this.position.z+this.size/2},
      {X: this.position.x-this.size/2, Y: this.position.y+this.size/2, Z: this.position.z-this.size/2},
      {X: this.position.x-this.size/2, Y: this.position.y+this.size/2, Z: this.position.z+this.size/2},
      {X: this.position.x+this.size/2, Y: this.position.y-this.size/2, Z: this.position.z-this.size/2},
      {X: this.position.x+this.size/2, Y: this.position.y-this.size/2, Z: this.position.z+this.size/2},
      {X: this.position.x+this.size/2, Y: this.position.y+this.size/2, Z: this.position.z-this.size/2},
      {X: this.position.x+this.size/2, Y: this.position.y+this.size/2, Z: this.position.z+this.size/2}
    ];
  },
  generateLines: function () {
    this.lines = [
      [this.points[0], this.points[1]],
      [this.points[1], this.points[3]],
      [this.points[3], this.points[2]],
      [this.points[2], this.points[0]],
      [this.points[4], this.points[5]],
      [this.points[5], this.points[7]],
      [this.points[7], this.points[6]],
      [this.points[6], this.points[4]],
      [this.points[0], this.points[4]],
      [this.points[1], this.points[5]],
      [this.points[2], this.points[6]],
      [this.points[3], this.points[7]],
    ];
  },
  rotate: function (axes, theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    this.points = this.points.map(function (point) {
      var x = point.X;
      var y = point.Y;
      var z = point.Z;
      if(axes === 'x'){
        return {X: x, Y: y*cosTheta-z*sinTheta, Z: z*cosTheta+y*sinTheta};
      }else if(axes === 'y'){
        return {X: x*cosTheta-z*sinTheta, Y: y, Z: z*cosTheta+x*sinTheta};
      }else if(axes === 'z'){
        return {X: x*cosTheta-y*sinTheta, Y: y*cosTheta+x*sinTheta, Z: z};
      }
    });
  },
  updateRotation: function () {
    this.rotate('x', this.rotation.x);
    this.rotate('y', this.rotation.y);
    this.rotate('z', this.rotation.z);
  },
  resize: function (amount) {
    this.size += amount;
  },
  draw: function () {
    for(var i in this.lines){
      console.log();
      this.ctx.beginPath();
      this.ctx.moveTo(this.lines[i][0].X, this.lines[i][0].Y);
      this.ctx.lineTo(this.lines[i][1].X, this.lines[i][1].Y);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = 'white';
      this.ctx.stroke();
    }
  },
  update: function () {
    this.generatePoints();
    this.updateRotation();
    this.generateLines();
    this.draw();
  }
}
module.exports = Cube;
