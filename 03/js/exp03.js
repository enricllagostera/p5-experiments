/* 
EXP 03
*/

const baseWidth = 400;
const baseHeight = 400;

let avatar = {};

function preload()
{

}

function setup()
{
    // Environment setup
    createCanvas(baseWidth, baseHeight);
    background(0);
    noStroke();

    avatar = new Circle(width / 2, 300, 40, .3, color(255, 0, 0));

    // Scaling logic
    calculateScale();
    scale(scaleFactor, scaleFactor);
    resizeCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
}

function draw()
{
    // Updating scale
    calculateScale();
    scale(scaleFactor, scaleFactor);

    let rawMouse = createVector(mouseX, mouseY);
    console.log(rawMouse);
    let cursor = createVector(rawMouse.x / width, rawMouse.y / height);
    avatar.moveToTarget(cursor.mult(baseHeight));

    // Rendering pass
    background(255, 0, 255, 20);
    avatar.render();
    push();
    fill(0);
    ellipse(baseWidth / 2, baseHeight / 2, 30);
    ellipse(avatar.position.x, avatar.position.y, 30);

    line(baseWidth / 2, baseHeight / 2, avatar.position.x, avatar.position.y);

    pop();
    drawPlayfieldFrame();
}

function windowResized()
{
    calculateScale();
    resizeCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
}

function calculateScale()
{
    scaleFactor = (windowHeight - 100) / baseHeight;
}


function drawPlayfieldFrame()
{
    push();
    noFill();
    stroke(255);
    strokeWeight(12);
    rect(0, 0, baseWidth, baseHeight);
    pop();
}