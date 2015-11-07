window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();//

var settings = {
    gravity: 3,
    clear: function(){
        entities = [];
    },
    color: "#777777",
    random: true,
    elastic: true,
    simultaneous: true,
    boomCount: 250,
    boom: function(){
        entities = [];
        var n = settings.boomCount,
            rN = Math.sqrt(n);
        for(var i = 0; i < n; i++){
            entities.push(new CelestialBody(
                1,
                {x: wid/2 - (rN/2-i%rN), y: hei/2 - (rN/2-i/rN%rN)},
                {vX: 0, vY: 0},
                true
            ));
        }
    },
    pendulum: function(){
        entities = [
          new CelestialBody(20, {x:wid/5*4, y:hei/2},{vX: 0, vY: 0}),
          new CelestialBody(200,{x:wid/2, y:hei/2},{vX: 0, vY: 0}),
          new CelestialBody(20,{x:wid/5, y:hei/2},{vX: 0, vY: 0})
        ];
    },
    solarSystem: function(){
        settings.gravity = 3;
        entities = [
          new CelestialBody(100, {x: wid/2, y: hei/2}, {vX:0, vY:0}),
          new CelestialBody(1, {x: wid/2+175, y: hei/2}, {vX:0, vY:-1.5}),
          new CelestialBody(1.5, {x: wid/2+250, y: hei/2}, {vX:0, vY:-1.2}),
          new CelestialBody(2, {x: wid/2+300, y: hei/2}, {vX:0, vY:-1.1}),
          new CelestialBody(2, {x: wid/2+375, y: hei/2}, {vX:0, vY:-1}),
        ];
    },
    saturation: .8,
    lightness: .5,
    growthRate: 125,
    pause: false
},
    gui = new dat.GUI(),
    phys = gui.addFolder("Physics"),
    ctrl = gui.addFolder("Controls"),
    clrs = gui.addFolder("Colors"),
    xtra = gui.addFolder("Extras");

phys.add(settings, "gravity", 1, 1000).listen();
//phys.add(settings, "elastic");
ctrl.add(settings, "growthRate", 10, 150);
clrs.addColor(settings, "color");
clrs.add(settings, "random");
clrs.add(settings, "saturation", 0, 1);
clrs.add(settings, "lightness", 0, 1);
xtra.add(settings, "boomCount", 100, 1000);
xtra.add(settings, "boom");
xtra.add(settings, "pendulum");
xtra.add(settings, "solarSystem");
gui.add(settings, "pause");
gui.add(settings, "clear");
phys.open();
ctrl.open();
clrs.open();
xtra.open();



var can = document.getElementById("cosmos"),
    ctx = can.getContext('2d'),
    wid = can.width = window.innerWidth,
    hei = can.height = window.innerHeight,
    entities = [],
    startPoint, curPoint, startTime;

window.onresize = function () {
    wid = can.width = window.innerWidth;
    hei = can.height = window.innerHeight;
}
can.onmousedown = function (e) {
    startPoint = {
        x: e.clientX,
        y: e.clientY
    };
    startTime = Date.now();
}
can.onmousemove = function(e){
    curPoint = {x: e.clientX, y: e.clientY};
}
can.onmouseup = function (e) {
    var endPoint = {
        x: e.clientX,
        y: e.clientY
    },
    dTime = (Date.now() - startTime)/(151-settings.growthRate),
        dist = distance(startPoint, endPoint),
        ang = angle(startPoint, endPoint),
        vel = {
            vX: Math.cos(ang)*dist/500,
            vY: Math.sin(ang)*dist/500
        };

    entities.push(new CelestialBody(dTime, startPoint, vel));
    startPoint = startTime = undefined;
}

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angle(point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

function randomColor() {
    var sat = Math.round(settings.saturation*100),
        hue = Math.floor(Math.random()*361),
        ltn = Math.round(settings.lightness*100);

  return settings.random ? 'hsl(' + [hue, sat+'%', ltn+'%'] + ')' : settings.color;
}

function CelestialBody(radius, position, velocity, isBoom, fill) {
    this.radius = radius;
    this.isBoom = isBoom;
    this.mass = 4 * Math.PI * radius * radius;
    this.position = position || {
        x: 0,
        y: 0
    };
    this.velocity = velocity || {
        vX: 0,
        vY: 0
    };
    this.force = {x:0, y:0};
    this.fillStyle = fill || randomColor();
}
CelestialBody.prototype.updatePosition = function () {
    this.resolveForce();
    this.position.x += this.velocity.vX;
    this.position.y += this.velocity.vY;
};
CelestialBody.prototype.render = function (context) {
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
};
CelestialBody.prototype.attract = function (body2) {
    var dist = distance(this.position, body2.position),
        ang = angle(this.position, body2.position),
        G = settings.gravity/1000,
        force = G * body2.mass * this.mass / dist / dist;

  if (settings.simultaneous){
    this.force.x += Math.cos(ang) * force / this.mass;
    this.force.y += Math.sin(ang) * force / this.mass;
    body2.force.x -= Math.cos(ang) * force / body2.mass;
    body2.force.y -= Math.sin(ang) * force / body2.mass;
  } else {
    this.velocity.vX += Math.cos(ang) * force / this.mass;
    this.velocity.vY += Math.sin(ang) * force / this.mass;
    body2.velocity.vX -= Math.cos(ang) * force / body2.mass;
    body2.velocity.vY -= Math.sin(ang) * force / body2.mass;
  }
};
CelestialBody.prototype.resolveForce = function(){
    this.velocity.vX += this.force.x;
    this.velocity.vY += this.force.y;
    this.force = {x:0, y:0};
};
CelestialBody.prototype.hasCollided = function(body2){
    if (Math.abs(body2.position.x - this.position.x) > body2.radius + this.radius ||
        Math.abs(body2.position.y - this.position.y) > body2.radius + this.radius)
      return false;

    var dist = distance(this.position, body2.position);

    return dist <= this.radius + body2.radius;
};
CelestialBody.prototype.performCollision = function(body2){
    //http://www.exeneva.com/2012/06/multiple-balls-bouncing-and-colliding-example/
    var dx = this.position.x - body2.position.x;
    var dy = this.position.y - body2.position.y;
    var cAng = Math.atan2(dy, dx);

    // Get velocities of each ball before collision
    var v1 = Math.sqrt(this.velocity.vX * this.velocity.vX + this.velocity.vY * this.velocity.vY);
    var v2 = Math.sqrt(body2.velocity.vX * body2.velocity.vX + body2.velocity.vY * body2.velocity.vY);

    // Get angles (in radians) for each ball, given current velocities
    var d1 = Math.atan2(this.velocity.vY, this.velocity.vX);
    var d2 = Math.atan2(body2.velocity.vY, body2.velocity.vX);

    // Rotate velocity vectors so we can plug into equation for conservation of momentum
    var rVX1 = v1 * Math.cos(d1 - cAng);
    var rVY1 = v1 * Math.sin(d1 - cAng);
    var rVX2 = v2 * Math.cos(d2 - cAng);
    var rVY2 = v2 * Math.sin(d2 - cAng);

    // Update actual velocities using conservation of momentum
    /* Uses the following formulas:
       velocity1 = ((mass1 - mass2) * velocity1 + 2*mass2 * velocity2) / (mass1 + mass2)
       velocity2 = ((mass2 - mass1) * velocity2 + 2*mass1 * velocity1) / (mass1 + mass2)
    */
    var finalVelocityX1 = ((this.mass - body2.mass) * rVX1 + (body2.mass + body2.mass) * rVX2)
    / (this.mass + body2.mass);
    var finalVelocityX2 = ((this.mass + this.mass) * rVX1 + (body2.mass - this.mass) * rVX2)
    / (this.mass + body2.mass);

    // Y velocities remain constant
    var finalVelocityY1 = rVY1;
    var finalVelocityY2 = rVY2;

    // Rotate angles back again so the collision angle is preserved
  if(settings.simultaneous){
    this.force.x += Math.cos(cAng) * finalVelocityX1 + Math.cos(cAng + Math.PI/2) * finalVelocityY1 - this.velocity.vX;
    this.force.y += Math.sin(cAng) * finalVelocityX1 + Math.sin(cAng + Math.PI/2) * finalVelocityY1 - this.velocity.vY;
    body2.force.x += Math.cos(cAng) * finalVelocityX2 + Math.cos(cAng + Math.PI/2) * finalVelocityY2 - body2.velocity.vX;
    body2.force.y += Math.sin(cAng) * finalVelocityX2 + Math.sin(cAng + Math.PI/2) * finalVelocityY2 - body2.velocity.vY;
  } else {
    this.velocity.vX = Math.cos(cAng) * finalVelocityX1 + Math.cos(cAng + Math.PI/2) * finalVelocityY1;
    this.velocity.vY = Math.sin(cAng) * finalVelocityX1 + Math.sin(cAng + Math.PI/2) * finalVelocityY1;
    body2.velocity.vX = Math.cos(cAng) * finalVelocityX2 + Math.cos(cAng + Math.PI/2) * finalVelocityY2;
    body2.velocity.vY = Math.sin(cAng) * finalVelocityX2 + Math.sin(cAng + Math.PI/2) * finalVelocityY2;
  }

    //this.updatePosition();
    //body2.updatePosition();

};

function update() {
    if (!settings.pause){
      var i = 0,
          j = 1,
          len = entities.length;

      for (; i < len - 1; i++) {
          for (j = i + 1; j < len; j++) {
              if(entities[i].hasCollided(entities[j])){
                  entities[i].performCollision(entities[j]);
              }
              else{
                  entities[i].attract(entities[j]);
              }
          }
      }
      entities.forEach(function (ent) {
          ent.updatePosition();
      });
    }
    setTimeout(update, 10);
}

function render() {
    requestAnimFrame(render);

    ctx.clearRect(0, 0, wid, hei);

    entities.forEach(function (ent) {
        ent.render(ctx);
    });

    if(startPoint){
        var dist = Date.now() - startTime;
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.arc(startPoint.x,startPoint.y,dist/(151-settings.growthRate),0,2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(curPoint.x, curPoint.y);
        ctx.closePath();
        ctx.stroke();
    }
}
requestAnimFrame(render);
update();
