class Team
{
    constructor(x, y, goalRadius, activeAgent, switchKeyCode, controller)
    {
        this.position = createVector(x, y);
        this.controller = controller;
        this.baseGoalRadius = goalRadius;
        this.initialAgent = activeAgent;
        this.switchKeyCode = switchKeyCode;
        this.score = 0;
        this.activeAgent = this.initialAgent;
        this.radius = this.baseGoalRadius;
        this.justSwitched = false;
    }

    reset()
    {
        this.score = 0;
        this.radius = this.baseGoalRadius;
        this.activeAgent = this.initialAgent;
    }
}

class Agent extends Circle
{
    constructor(x, y, radius, speed, color, controller)
    {
        super(x, y, radius, speed, color);
        this.controller = controller;
    }

    getInputs()
    {
        // Update
        let rawInput = createVector(0, 0);
        let horizontal = 0, vertical = 0;
        horizontal += this.controller.getInputState("right");
        horizontal += this.controller.getInputState("left");
        vertical += this.controller.getInputState("up");
        vertical += this.controller.getInputState("down");
        rawInput.set(horizontal, vertical);
        if (rawInput.mag() <= 0.4)
        {
            rawInput.limit(0);
        }
        return rawInput;
    }

    render()
    {
        push();
        fill(this.color);
        if (this.currentSpeed > this.snapSpeed)
        {
            noStroke();
        }
        else
        {
            stroke(255);
            strokeWeight(5);
        }
        ellipse(this.position.x, this.position.y, this.radius * 2);

        if (this.isActive)
        {
            noStroke();
            fill(0, 0, 0, 255);
            ellipse(this.position.x + this.relativeTarget.x * 3, this.position.y + this.relativeTarget.y * 3, this.radius * .8);
        }
        pop();
    }

    reset()
    {
        super.reset();

        this.isActive = false;
    }

    update(activeAgent)
    {
        let rawInput = createVector(0, 0);
        if (activeAgent == this)
        {
            this.isActive = true;
            rawInput = this.getInputs();
        }
        else
        {
            this.isActive = false;
        }
        let processedInput = (rawInput.copy()).limit(1);
        if (processedInput.equals(this.zeroVector))
        {
            this.relativeTarget = p5.Vector.lerp(this.relativeTarget, processedInput.mult(this.baseSpeed), deltaTime * this.smoothFactor * this.quickStopFactor / 1000);
        }
        else
        {
            this.relativeTarget = p5.Vector.lerp(this.relativeTarget, processedInput.mult(this.baseSpeed), deltaTime * this.smoothFactor / 1000);

        }
        this.moveToTarget(this.relativeTarget.copy().add(this.position));
    }
}
