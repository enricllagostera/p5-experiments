/* 
EXP 05 - Combining p5 and XState
*/

const { Machine, assign, interpret } = XState;

const sceneManager = Machine(
  {
    id: "scenes",
    initial: "intro",
    context: {
      scene: undefined
    },
    states: {
      intro: {
        entry: "resetToIntro",
        on: {
          ADVANCE: {
            target: "gameplay"
          }
        }
      },
      gameplay: {
        entry: "connectNewScene",
        on: {
          WON: {
            target: "gameWon"
          },
          LOST: {
            target: "gameLost"
          }
        }
      },
      gameLost: {
        entry: "connectNewScene",
        on: {
          ADVANCE: {
            target: "intro"
          }
        }
      },
      gameWon: {
        entry: "connectNewScene",
        on: {
          ADVANCE: "intro"
        }
      }
    }
  }, // 1st arg
  {
    actions: {
      connectNewScene: assign({
        scene: (context, event) => {
          if (context.scene != undefined) {
            context.scene.onExit();
          }
          event.scene.onEnter();
          return event.scene;
        }
      }),
      resetToIntro: assign({
        scene: (context, event) => {
          if (context.scene != undefined) {
            context.scene.onExit();
          }
          let introScene = new IntroScene();
          introScene.onEnter();
          return introScene;
        }
      })
    }
  } // 2nd arg
);

let sceneService;

function preload() {
  // Environment setup
  sceneService = interpret(sceneManager);
  sceneService.start();
}

function setup() {
  sceneService.state.context.scene.setup();
}

function draw() {
  sceneService.state.context.scene.draw();
}

function keyPressed() {
  sceneService.state.context.scene.keyPressed();
}
