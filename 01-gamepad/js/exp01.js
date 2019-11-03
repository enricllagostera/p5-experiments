/* 
EXP 01
A gamepad controlled object moving in the screen, showing raw axis input, doing some snapping to directions and dead zone processing.
*/

let gamepadIndex = undefined;

const deadZoneX = 0.2; // pixels
const deadZoneY = 0.2; // pixels
const deadZoneMag = 0.3;

function preload()
{
    window.addEventListener("gamepadconnected", function (e)
    {
        console.log(e);
        console.log(e.gamepad.id + "gamepad connected.");
        gamepadIndex = e.gamepad.index;
    });

    window.addEventListener("gamepaddisconnected", function (e)
    {
        console.log(e);
        console.log(e.gamepad.id + " disconnected.");
        gamepadIndex = undefined;
    });
}

function setup()
{
    createCanvas(500, 500);
    noStroke();
}

function draw()
{
    // Draws background
    background(10, 30);

    // Exits if gamepad is disconnected
    if (gamepadIndex == undefined)
    {
        return;
    }

    // Poll gamepad state
    let gamepadState = navigator.getGamepads()[gamepadIndex];
    let rawInput = createVector(gamepadState.axes[0], gamepadState.axes[1]);
    let processedInput = rawInput.copy();

    // Apply a dead zone near the neutral position
    if (rawInput.mag() < deadZoneMag)
    {
        processedInput.setMag(0);
    }

    // Draw heading vector
    let heading = processedInput.heading();
    let angle = degrees(heading) + 180;
    push();
    noStroke();
    fill("#ffc400");
    textAlign(CENTER);
    textSize(30);
    text(angle.toFixed(2), width / 2, height / 2);
    pop();

    // Process and draw snapping inputs to four directions
    processedInput = arcSnapToTarget(processedInput, createVector(0, -1), 85, createVector(0, 0));
    processedInput = arcSnapToTarget(processedInput, createVector(0, 1), 85);
    processedInput = arcSnapToTarget(processedInput, createVector(1, 0), 85);
    processedInput = arcSnapToTarget(processedInput, createVector(-1, 0), 85);

    // Draw the dead zone area
    fill(255, 0, 0, 255)
    ellipse(width / 2, height / 2, deadZoneMag * width);

    // Draw the processed input as a position on the screen
    fill(color(255, 255));
    let position = createVector(width / 2 + processedInput.x * width / 2, height / 2 + processedInput.y * height / 2);
    ellipse(position.x, position.y, 30);

    // Draw the raw input vector
    fill(color(0, 0, 255, 255));
    ellipse(width / 2 + rawInput.x * width / 2, height / 2 + rawInput.y * height / 2, 10);
}

/**
 * Snaps vector if it is inside an arc range from target.
 *
 * @param {p5.Vector} inputVector Input, used for direction.
 * @param {p5.Vector} targetVector Vector defining the arc midpoint.
 * @param {*} arcRange An arc in degrees centered on the target vector.
 * @param {*} snapVector Value to be used when snapping happens. Defaults to target vector.
 * @returns {p5.Vector} Processed input.
 */
function arcSnapToTarget(inputVector, targetVector, arcRange, snapVector = targetVector)
{
    // Debug rendering
    push();
    fill(255, 20);
    let snapHeading = targetVector.heading();
    arc(width / 2, height / 2, width, width, snapHeading - radians(arcRange / 2), snapHeading + radians(arcRange / 2), PIE);
    pop();

    // Angle checks
    let angleDifference = inputVector.angleBetween(targetVector);
    if (abs(degrees(angleDifference)) < (arcRange / 2))
    {
        return snapVector;
    }
    return inputVector;
}
