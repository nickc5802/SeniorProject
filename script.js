let dots = [];
let droneImage;
let followingMouse = false;
let movingToMouse = false;
let droneX, droneY;

function preload() {
    droneImage = loadImage('images/drone_svg.svg'); // replace with the path to your SVG
  }

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', '2');
    noStroke();

    let cols = floor(width / 20);
    let rows = floor(height / 20);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let dot = createVector(i * 20, j * 20);
            dots.push(dot);
        }
    }
    droneX = width / 2;  // set initial position to the center of the canvas
    droneY = height / 2;
}

function draw() {
    background(255);

  // Define the center and radius of the drone's circular path
  let centerX = width/2;
  let centerY = height/2;
  let radius = 400;

  // Get the current time in seconds
  let time = millis() / 1000;

  // Calculate the drone's target position in a circular path
  let targetX = centerX + radius * cos(time);
  let targetY = centerY + radius * sin(time);

  // Check if the mouse is within a certain distance of the circular path
  if (dist(mouseX, mouseY+150, centerX, centerY) < radius*1.8) {
    if(!followingMouse && !movingToMouse) {
      movingToMouse = true;
    }
    if(movingToMouse) {
      // Smoothly move towards the mouse
      droneX = lerp(droneX, mouseX, 0.05);
      droneY = lerp(droneY, mouseY, 0.05);
      if(dist(droneX, droneY, mouseX, mouseY) < 10) {
        followingMouse = true;
        movingToMouse = false;
      }
    } else if(followingMouse) {
      // Directly follow the mouse
      droneX = mouseX;
      droneY = mouseY;
    }
  } else {
    if(followingMouse || movingToMouse) {
      followingMouse = false;
      movingToMouse = false;
    }
    // Smoothly interpolate the drone's position back to its circular path
    droneX = lerp(droneX, targetX, 0.05);
    droneY = lerp(droneY, targetY, 0.05);
  }

  image(droneImage, droneX - droneImage.width / 2, droneY - droneImage.height / 2);
  
    // Use droneX and droneY instead of mouseX and mouseY for the dot interaction
    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];
      let distance = dist(droneX, droneY, dot.x, dot.y);
  
      // ... (rest of your code for dot interaction)
      if (distance < 111) {
        let angle = atan2(mouseY - dot.y, mouseX - dot.x);
        dot.x -= cos(angle) * (110 - distance) * 0.1;
        dot.y -= sin(angle) * (110 - distance) * 0.1;

        let col = map(distance, 0, 500, 247, 0);
        fill(col, col*.425, col*.08);
    } else {
        let originX = (i % floor(width / 20)) * 20;
        let originY = floor(i / floor(width / 20)) * 20;
        dot.x += (originX - dot.x) * 0.1;
        dot.y += (originY - dot.y) * 0.1;

        fill(0);
    }

    ellipse(dot.x, dot.y, 3, 3);
    }
}

