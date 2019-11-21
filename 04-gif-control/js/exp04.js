/* 
EXP 04 - Loading and controlling an animated GIF
*/

let myGif = {};
let currentFrame = 0;

function preload() {
  // loads a GIF file on an p5.Image object
  myGif = loadImage("assets/chess.gif");
}

function setup() {
  // Environment setup
  createCanvas(400, 400);
}

function draw() {
  // Rendering pass
  background(0, 0, 255);
  // Stops the GIF from animating on its own
  myGif.pause();
  // Uses center coordinates for drawing the image
  imageMode(CENTER);
  // Draws the gif on its current frame
  image(myGif, width / 2, height / 2);
}

function keyPressed() {
  // On space key
  if (keyCode == 32) {
    currentFrame = myGif.getCurrentFrame();
    // Go to next frame
    currentFrame++;
    // makes sure the animation loops back to the first frame
    if (currentFrame >= myGif.numFrames()) {
      currentFrame = 0;
    }
    myGif.setFrame(currentFrame);
  }
}
