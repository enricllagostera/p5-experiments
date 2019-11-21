/* 
EXP 05 - Combining p5 and XState
*/

const { Machine, assign, interpret } = XState;

const sceneManager = Machine(
  {
    id: "scenes",
    initial: "intro",
    context: {
      bgColor: [50, 50, 50]
    },
    states: {
      intro: {
        entry: "test",
        on: {
          ADVANCE: "gameplay"
        }
      },
      gameplay: {
        entry: "test",
        on: {
          WON: "gameWon",
          LOST: "gameLost"
        }
      },
      gameLost: {
        entry: "test",
        on: {
          ADVANCE: "intro"
        }
      },
      gameWon: {
        entry: "test",
        on: {
          ADVANCE: "intro"
        }
      }
    }
  }, // 1st arg
  {
    actions: {
      test: assign({
        bgColor: () => [random(0, 255), random(0, 255), random(0, 255)]
      })
    }
  } // 2nd arg
);

let nextState, sceneService;

function preload() {}

function setup() {
  // Environment setup
  createCanvas(400, 400);
  sceneService = interpret(sceneManager);
  sceneService.start();
}

function draw() {
  background(sceneService.state.context.bgColor);
  textSize(30);
  fill(255);
  text(sceneService.state.value, 20, 50);
}

function keyPressed() {
  if (keyCode == 32) {
    sceneService.send("ADVANCE");
  }
  if (keyCode == 49) {
    sceneService.send("WON");
  }
  if (keyCode == 50) {
    sceneService.send("LOST");
  }
}
