let flock;

function setup() {
  createCanvas(840, 400);
  createP("Drag the mouse to generate new Spaceship.");

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 10; i++) {
    let b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  background("black");
  //background for star
  push();
  strokeWeight(8);
  stroke('#ffd700');
  star(40, 50, 30, 70, 5);
  star(60, 260, 30, 70, 5); 
  star(220, 50, 30, 70, 5);
  star(740, 50, 30, 70, 5);
  star(780, 260, 30, 70, 5); 
  star(350, 350, 30, 70, 5);
  pop();
  
  deathstar();
  flock.run();
}

//idea from https://p5js.org/zh-Hans/examples/form-star.html
function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2;
  //need to set the radiu on star, so it does not run fast.
  radius1 = 0.5;
  radius2 = 1;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius1;
    var sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius2;
    sy = y + sin(a+halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function deathstar(){
  push();
  noStroke();
  beginShape();
  //biggest circle
  stroke('#778899');
  strokeWeight(120);
  circle(650,280,90,90);
  //grey circle
  stroke('#696969');
  strokeWeight(50);
  circle(630,240,30,30);
  //the small dot inside
  stroke('black');
  strokeWeight(5);
  circle(630,240,3,3);
  //the link on the death star
  stroke('#bfc1c2');
  strokeWeight(5);
  circle(548,277,3,3);
  circle(550,280,3,3);
  circle(553,283,3,3);
  circle(556,286,3,3);
  circle(559,289,3,3);
  circle(562,292,3,3);
  circle(565,295,3,3);
  circle(568,298,3,3);
  circle(571,300,3,3);
  circle(574,302,3,3);
  circle(577,304,3,3);
  circle(580,306,3,3);
  circle(583,308,3,3);
  circle(586,310,3,3);
  circle(589,311,3,3);
  circle(592,312,3,3);
  circle(595,313,3,3);
  circle(598,314,3,3);
  circle(601,315,3,3);
  circle(604,316,3,3);
  circle(607,317,3,3);
  circle(610,318,3,3);
  circle(613,319,3,3);
  circle(616,320,3,3);
  circle(619,321,3,3);
  circle(622,322,3,3);
  circle(625,323,3,3);
  circle(628,324,3,3);
  circle(631,324,3,3);
  circle(634,324,3,3);
  circle(637,324,3,3);
  circle(640,324,3,3);
  circle(643,324,3,3);
  circle(646,324,3,3);
  circle(649,324,3,3);
  circle(652,324,3,3);
  circle(655,324,3,3);
  circle(658,324,3,3);
  circle(661,324,3,3);
  circle(664,324,3,3);
  circle(667,324,3,3);
  circle(670,324,3,3);
  circle(673,323,3,3);
  circle(676,322,3,3);
  circle(679,321,3,3);
  circle(682,320,3,3);
  circle(685,319,3,3);
  circle(688,318,3,3);
  circle(691,317,3,3);
  circle(694,315,3,3);
  circle(697,313,3,3);
  circle(700,311,3,3);
  circle(703,309,3,3);
  circle(706,307,3,3);
  circle(709,305,3,3);
  circle(712,303,3,3);
  circle(715,300,3,3);
  circle(739,277,3,3);
  circle(736,280,3,3);
  circle(733,283,3,3);
  circle(730,286,3,3);
  circle(727,289,3,3);
  circle(724,292,3,3);
  circle(721,295,3,3);
  circle(719,298,3,3);
  circle(752,269,3,3);
  circle(751,270,3,3);
  circle(748,271,3,3);
  circle(745,272,3,3);
  circle(742,275,3,3);
  endShape();
  pop();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  // this.borders();
  this.render();
  this.render1();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  let avo = this.avoid(boids);      // Avoid walls
  // Arbitrarily weight these forces
  sep.mult(10.0);
  ali.mult(2.0);
  coh.mult(1.0);
  avo.mult(3.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  this.applyForce(avo);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a spaceship rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  push();
  translate(this.position.x + 150, this.position.y + 10);
  rotate(theta);
  noStroke()
  beginShape();
  fill("#FFFFFF");
  vertex(0,0);
  vertex(0,30);
  vertex(30,0);
  vertex(30,30);
  endShape(CLOSE);
  fill("#191970");
  circle(15,15,10,10);
  rect(-2,0,5,35);
  rect(30,0,5,35); 
  pop();
}

Boid.prototype.render1 = function() {
  // Draw a star destoryer
  let theta = this.velocity.heading() + radians(90);
  fill("#ff0000");
  push();
  translate(this.position.x + 300, this.position.y);
  rotate(theta);
  beginShape();
  vertex(20, 0);
  vertex(10, 40);
  vertex(30, 40);
  endShape(CLOSE);
  fill("#c0c0c0");
  rect(20,20,15,4);
  rect(25,35,24,4);
  rect(5,20,15,4);
  rect(-5,35,24,4);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

Boid.prototype.avoid = function(boids) {
  let steer = createVector(0, 0);
  if (this.position.x <= 0) {
    steer.add(createVector(1, 0));
  }
  if (this.position.x > 640) { // width of canvas
    steer.add(createVector(-1, 0));
  }
  if (this.position.y <= 0) {
    steer.add(createVector(0, 1));
  }
  if (this.position.y > 360) { // height of canvas
    steer.add(createVector(0, -1));
  }
  return steer;
}
