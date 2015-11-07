var Cube = {
  rotation: [0, 0, 0],
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
      {X: this.origin[0]-this.size/2, Y: this.origin[1]-this.size/2, Z: this.origin[2]-this.size/2},
      {X: this.origin[0]-this.size/2, Y: this.origin[1]-this.size/2, Z: this.origin[2]+this.size/2},
      {X: this.origin[0]-this.size/2, Y: this.origin[1]+this.size/2, Z: this.origin[2]-this.size/2},
      {X: this.origin[0]-this.size/2, Y: this.origin[1]+this.size/2, Z: this.origin[2]+this.size/2},
      {X: this.origin[0]+this.size/2, Y: this.origin[1]-this.size/2, Z: this.origin[2]-this.size/2},
      {X: this.origin[0]+this.size/2, Y: this.origin[1]-this.size/2, Z: this.origin[2]+this.size/2},
      {X: this.origin[0]+this.size/2, Y: this.origin[1]+this.size/2, Z: this.origin[2]-this.size/2},
      {X: this.origin[0]+this.size/2, Y: this.origin[1]+this.size/2, Z: this.origin[2]+this.size/2}
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
    this.rotate('x', this.rotation[0]);
    this.rotate('y', this.rotation[1]);
    this.rotate('z', this.rotation[2]);
  },
  resize: function (amount) {
    this.size += amount;
  },
  draw: function () {
    ctx.clearRect (this.origin[0]-this.cubeRadius,this.origin[1]-this.cubeRadius, this.cubeRadius*2, this.cubeRadius*2);
    for(var i in this.lines){
      ctx.beginPath();
      ctx.moveTo(this.lines[i][0].X, this.lines[i][0].Y);
      ctx.lineTo(this.lines[i][1].X, this.lines[i][1].Y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
  },
  update: function () {
    this.generatePoints();
    this.updateRotation();
    this.generateLines();
    this.draw();
  }
}


// function oldCube(origin, size, context) {
//   var self = this;
//   self.origin = origin;
//   self.rotation = [0, 0, 0];
//   self.size = size;
//   self.squareRadius = Math.ceil(Math.pow((size/2)*(size/2)+(size/2)*(size/2), 0.5));
//   self.cubeRadius = Math.ceil(Math.pow(self.squareRadius*self.squareRadius+(size/2)*(size/2), 0.5));

//   this.generatePoints = function () {
//     self.points = [
//       {X: self.origin[0]-self.size/2, Y: self.origin[1]-self.size/2, Z: self.origin[2]-self.size/2},
//       {X: self.origin[0]-self.size/2, Y: self.origin[1]-self.size/2, Z: self.origin[2]+self.size/2},
//       {X: self.origin[0]-self.size/2, Y: self.origin[1]+self.size/2, Z: self.origin[2]-self.size/2},
//       {X: self.origin[0]-self.size/2, Y: self.origin[1]+self.size/2, Z: self.origin[2]+self.size/2},
//       {X: self.origin[0]+self.size/2, Y: self.origin[1]-self.size/2, Z: self.origin[2]-self.size/2},
//       {X: self.origin[0]+self.size/2, Y: self.origin[1]-self.size/2, Z: self.origin[2]+self.size/2},
//       {X: self.origin[0]+self.size/2, Y: self.origin[1]+self.size/2, Z: self.origin[2]-self.size/2},
//       {X: self.origin[0]+self.size/2, Y: self.origin[1]+self.size/2, Z: self.origin[2]+self.size/2}
//     ];
//   };
//   this.generateLines = function () {
//     self.lines = [
//       [self.points[0], self.points[1]],
//       [self.points[1], self.points[3]],
//       [self.points[3], self.points[2]],
//       [self.points[2], self.points[0]],
//       [self.points[4], self.points[5]],
//       [self.points[5], self.points[7]],
//       [self.points[7], self.points[6]],
//       [self.points[6], self.points[4]],
//       [self.points[0], self.points[4]],
//       [self.points[1], self.points[5]],
//       [self.points[2], self.points[6]],
//       [self.points[3], self.points[7]],
//     ];
//   };
//   this.rotate = function (axes, theta) {
//     var sinTheta = Math.sin(theta);
//     var cosTheta = Math.cos(theta);
//     self.points = self.points.map(function (point) {
//       var x = point.X;
//       var y = point.Y;
//       var z = point.Z;
//       if(axes === 'x'){
//         return {X: x, Y: y*cosTheta-z*sinTheta, Z: z*cosTheta+y*sinTheta};
//       }else if(axes === 'y'){
//         return {X: x*cosTheta-z*sinTheta, Y: y, Z: z*cosTheta+x*sinTheta};
//       }else if(axes === 'z'){
//         return {X: x*cosTheta-y*sinTheta, Y: y*cosTheta+x*sinTheta, Z: z};
//       }
//     });
//   };
//   this.updateRotation = function () {
//     this.rotate('x', self.rotation[0]);
//     this.rotate('y', self.rotation[1]);
//     this.rotate('z', self.rotation[2]);
//   };
//   this.resize = function (amount) {
//     for(var i in self.points){
//       var x = self.points[i].X;
//       var y = self.points[i].Y;
//       var z = self.points[i].Z;

//       x < 0 ? self.points[i].X -= amount : self.points[i].X += amount;
//       y < 0 ? self.points[i].Y -= amount : self.points[i].Y += amount;
//       z < 0 ? self.points[i].Z -= amount : self.points[i].Z += amount;
//     }
//   };
//   this.draw = function () {
//     // ctx.clearRect (self.origin[0]-self.cubeRadius,self.origin[1]-self.cubeRadius, self.cubeRadius*2, self.cubeRadius*2);
//     for(var i in self.lines){
//       context.beginPath();
//       context.moveTo(self.lines[i][0].X, self.lines[i][0].Y);
//       context.lineTo(self.lines[i][1].X, self.lines[i][1].Y);
//       context.lineWidth = 3;
//       context.strokeStyle = 'white';
//       context.stroke();
//     }
//   };
//   this.update = function () {
//     this.generatePoints();
//     this.updateRotation();
//     this.generateLines();
//     this.draw();
//   };
// }
