/* 
EXP 00
A small experiment that paints some nice red textures based on mouse coordinates on the screen.
*/

let brushColor = {};
let sizeMultiplier = 0.1;

function setup()
{
    createCanvas(windowWidth - 100, windowHeight - 100);
    background(0);
    noStroke();
    brushColor = color(255, 0, 0);
}

function draw()
{
    if (mouseIsPressed)
    {
        brushColor = color(0, 0, 0);
    }
    else
    {
        brushColor = color(255, 0, 0);
    }
    brushColor.setAlpha(random() * 255);
    fill(brushColor);
    rect(random() * width, random() * height, mouseX * sizeMultiplier, mouseY * sizeMultiplier);
}