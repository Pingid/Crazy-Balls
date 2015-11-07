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
