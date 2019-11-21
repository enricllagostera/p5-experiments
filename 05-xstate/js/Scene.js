class Scene {
  constructor(name) {
    this.name = name;
  }

  draw() {
    if (this.drawFunction != undefined) {
      this.drawFunction();
    }
  }

  onEnter() {
    if (this.enterFunction != undefined) {
      this.enterFunction();
    }
  }

  onExit() {
    if (this.exitFunction != undefined) {
      this.exitFunction();
    }
  }

  keyPressed() {}

  setup() {}
}

class IntroScene extends Scene {
  constructor(name = "INTRO") {
    super(name);
    this.bgColor = [50, 50, 50];
  }

  setup() {
    console.log(sceneManager);
    createCanvas(400, 400);
  }

  draw() {
    background(this.bgColor);
  }

  keyPressed() {
    if (keyCode == 32) {
      sceneService.send({
        type: "ADVANCE",
        scene: new GameplayScene()
      });
    }
  }
}

class GameplayScene extends Scene {
  constructor(name = "GAMEPLAY") {
    super(name);
    this.bgColor = [200, 200, 200];
  }

  draw() {
    background(this.bgColor);
  }

  keyPressed() {
    if (keyCode == 49) {
      sceneService.send({
        type: "WON",
        scene: new GameOverScene("WON", [0, 0, 255], "You won!")
      });
      return;
    }
    if (keyCode == 50) {
      sceneService.send({
        type: "LOST",
        scene: new GameOverScene("LOST", [255, 0, 0], "You lose!")
      });
      return;
    }
  }
}

class GameOverScene extends Scene {
  constructor(name = "GAMEOVER", bgColor = [0, 0, 0], message = "Game over!") {
    super(name);
    this.bgColor = bgColor;
    this.message = message;
  }

  draw() {
    background(this.bgColor);
    text(this.message, 10, height - 50);
  }

  keyPressed() {
    if (keyCode == 32) {
      sceneService.send({
        type: "ADVANCE",
        scene: new IntroScene()
      });
    }
  }
}
