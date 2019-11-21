/* 
EXP 02 Pique
*/

const maxScore = 3;
const baseWidth = 600;
const baseHeight = 400;

let rawInput;
let agentOne, agentTwo, agentThree, agentFour;
let teamOne, teamTwo;
let controllerOne, controllerTwo;
let agents = [];
let scaleFactor = 1;
let colorOne, colorTwo;
let activeGamepadIndex = -1;

function preload() {
  window.addEventListener("gamepadconnected", function(e) {
    console.log(e);
    console.log(e.gamepad.id + "gamepad connected.");
    activeGamepadIndex = e.gamepad.index;
  });

  window.addEventListener("gamepaddisconnected", function(e) {
    console.log(e);
    console.log(e.gamepad.id + " disconnected.");
    activeGamepadIndex = -1;
  });
}

function setup() {
  createCanvas(baseWidth, baseHeight);
  background(0);
  noStroke();

  colorOne = color(0, 164, 240);
  colorTwo = color(255, 132, 0);

  controllerOne = new Controller(controlMapping.teamOne);
  controllerTwo = new Controller(controlMapping.teamTwo);

  // Agents declaration
  agentOne = new Circle(100, 100, 20, 5, colorOne, controllerOne);
  agentTwo = new Circle(100, height - 100, 20, 5, colorOne, controllerOne);
  agentThree = new Circle(width - 100, 100, 20, 5, colorTwo, controllerTwo);
  agentFour = new Circle(
    width - 100,
    height - 100,
    20,
    5,
    colorTwo,
    controllerTwo
  );

  // Team creation
  teamOne = new Team(0, height / 2, 100, agentOne, 70, controllerOne);
  teamTwo = new Team(width, height / 2, 100, agentFour, 76, controllerTwo);

  // Some gruping
  agents.push(agentOne);
  agents.push(agentTwo);
  agents.push(agentThree);
  agents.push(agentFour);

  // Important to make sure game start is equal to reset
  reset();

  // Scaling logic
  calculateScale();
  scale(scaleFactor, scaleFactor);
  resizeCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
}

function draw() {
  //console.log(controllerOne.devices);
  controllerOne.setGamepadIndex(activeGamepadIndex);
  controllerTwo.setGamepadIndex(activeGamepadIndex);
  // Updating scale
  calculateScale();
  scale(scaleFactor, scaleFactor);

  // Check for game over conditions
  if (checkRestart()) {
    reset();
  }
  if (teamOne.score >= maxScore) {
    background(colorOne);
    drawPlayfieldFrame();
    agentOne.rumble(100, 1.0);
    return;
  } else if (teamTwo.score >= maxScore) {
    background(colorTwo);
    drawPlayfieldFrame();
    agentOne.rumble(100, 1.0);
    return;
  }

  // Handle out of bounds agents
  agents.forEach(agent => {
    if (agent.isOutOfBounds()) {
      agent.reset();
    }
  });

  // Collision with goals - Rules variant TWO
  agents.forEach(agent => {
    if (agent == agentOne || agent == agentTwo) {
      if (agent.overlaps(teamTwo)) {
        agent.reset();
        agent.rumble(300, 0.8);
        colorOne.setAlpha(80);
        background(colorOne);
        colorOne.setAlpha(255);
        teamOne.score++;
        teamTwo.radius =
          (teamTwo.baseGoalRadius * (maxScore - teamOne.score)) / maxScore;
      }
    } else {
      if (agent.overlaps(teamOne)) {
        agent.reset();
        agent.rumble(300, 0.8);
        colorTwo.setAlpha(80);
        background(colorTwo);
        colorTwo.setAlpha(255);
        teamTwo.score++;
        teamOne.radius =
          (teamOne.baseGoalRadius * (maxScore - teamTwo.score)) / maxScore;
      }
    }
  });

  // Collision with stopped opponents
  agents.forEach(agent => {
    if (agent == agentOne || agent == agentTwo) {
      let overlapsWithThree =
        agent.overlaps(agentThree) &&
        agentThree.currentSpeed <= agentThree.snapSpeed;
      let overlapsWithFour =
        agent.overlaps(agentFour) &&
        agentFour.currentSpeed <= agentFour.snapSpeed;
      if (overlapsWithThree || overlapsWithFour) {
        agent.reset();
        agent.rumble(100, 1.0);
      }
    } else {
      let overlapsWithOne =
        agent.overlaps(agentOne) && agentOne.currentSpeed <= agentOne.snapSpeed;
      let overlapsWithTwo =
        agent.overlaps(agentTwo) && agentTwo.currentSpeed <= agentTwo.snapSpeed;
      if (overlapsWithOne || overlapsWithTwo) {
        agent.reset();
        agent.rumble(100, 1.0);
      }
    }
  });

  checkSwitchingAgents();

  // Check inputs and move agents
  agentOne.update(teamOne.activeAgent);
  agentTwo.update(teamOne.activeAgent);
  agentThree.update(teamTwo.activeAgent);
  agentFour.update(teamTwo.activeAgent);

  // Rendering pass
  background(0, 0, 0, 20);
  agents.forEach(agent => agent.render());
  push();
  colorOne.setAlpha(80);
  colorTwo.setAlpha(80);
  fill(colorTwo, 20);
  ellipse(teamTwo.position.x, teamTwo.position.y, teamTwo.radius * 2);
  fill(colorOne, 20);
  ellipse(teamOne.position.x, teamOne.position.y, teamOne.radius * 2);
  colorOne.setAlpha(255);
  colorTwo.setAlpha(255);
  pop();
  drawPlayfieldFrame();
}

function windowResized() {
  calculateScale();
  resizeCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
}

function calculateScale() {
  scaleFactor = (windowHeight - 100) / baseHeight;
}

function checkSwitchingAgents() {
  let teamOneSwitch = teamOne.controller.getInputState("switch");
  let teamTwoSwitch = teamTwo.controller.getInputState("switch");

  if (teamOneSwitch > 0 && !teamOne.justSwitched) {
    teamOne.justSwitched = true;
    if (teamOne.activeAgent == agentOne) {
      teamOne.activeAgent = agentTwo;
    } else {
      teamOne.activeAgent = agentOne;
    }
  } else if (teamOneSwitch < 0.1) {
    teamOne.justSwitched = false;
  }

  if (teamTwoSwitch > 0 && !teamTwo.justSwitched) {
    teamTwo.justSwitched = true;
    if (teamTwo.activeAgent == agentThree) {
      teamTwo.activeAgent = agentFour;
    } else {
      teamTwo.activeAgent = agentThree;
    }
  } else if (teamTwoSwitch < 0.1) {
    teamTwo.justSwitched = false;
  }
}

function checkRestart() {
  if (teamOne.score >= maxScore || teamTwo.score >= maxScore) {
    let teamOneRestart = teamOne.controller.getInputState("restart");
    let teamTwoRestart = teamTwo.controller.getInputState("restart");

    if (teamOneRestart > 0 || teamTwoRestart > 0) {
      return true;
    }
  }
  return false;
}

function drawPlayfieldFrame() {
  push();
  noFill();
  stroke(255);
  strokeWeight(12);
  rect(0, 0, baseWidth, baseHeight);
  pop();
}

function reset() {
  agents.forEach(agent => agent.reset());
  teamOne.reset();
  teamTwo.reset();
}
