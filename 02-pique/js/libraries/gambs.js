

class Circle
{

    constructor(x, y, radius, speed, color, controller)
    {
        // Constants
        this.snapSpeed = .4;
        this.smoothFactor = 1;
        this.quickStopFactor = 6;

        // Members
        this.startX = x;
        this.startY = y;
        this.radius = radius;
        this.baseSpeed = speed;
        this.color = color;
        this.controller = controller;

        this.position = createVector(x, y);

        this.reset();
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

    isOutOfBounds()
    {
        let horizontalCheck = this.position.x - this.radius <= 0 || this.position.x + this.radius >= baseWidth;
        let verticalCheck = this.position.y - this.radius <= 0 || this.position.y + this.radius >= baseHeight;
        return horizontalCheck || verticalCheck;
    }

    moveToTarget(target)
    {
        let movement = target.copy().sub(this.position);
        let displacement = movement.limit(this.baseSpeed * deltaTime);
        this.currentSpeed = displacement.mag();
        this.position.add(displacement);
    }

    overlaps(thing)
    {
        let distance = p5.Vector.dist(this.position, thing.position);
        if (distance <= thing.radius + this.radius)
        {
            // overlap
            return true;
        }
        // no overlap
        return false;
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
        this.x = this.startX;
        this.y = this.startY;
        this.position.set(this.x, this.y);
        this.currentSpeed = 0;
        this.relativeTarget = createVector(0, 0);
        this.zeroVector = createVector(0, 0);
        this.isActive = false;
    }

    rumble(duration, magnitude)
    {
        if (this.controller.isGamepadConnected())
        {
            let gamepad = navigator.getGamepads()[this.controller.gamepadIndex];
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: duration,
                weakMagnitude: magnitude,
                strongMagnitude: magnitude
            });
        }
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
        this.activeAgent = this.initialAgent;
        this.radius = this.baseGoalRadius;
    }
}

class Controller
{
    constructor(mapping)
    {
        this.mapping = mapping;
        this.gamepadIndex = -1;
        console.log(this.mapping);
    }

    getInputState(actionName)
    {
        let result = 0;
        let gamepadState = {};
        if (this.isGamepadConnected())
        {
            gamepadState = navigator.getGamepads()[this.gamepadIndex];
        }
        if (this.mapping.hasOwnProperty(actionName))
        {
            for (let i = 0; i < this.mapping[actionName].length; i++)
            {
                const action = this.mapping[actionName][i];
                switch (action.type)
                {
                    case "gp_btn": {
                        if (this.isGamepadConnected())
                        {
                            result += gamepadState.buttons[action.btnIndex].value * action.modifier;
                        }
                        break;
                    }
                    case "gp_axis": {
                        if (this.isGamepadConnected())
                        {
                            result += gamepadState.axes[action.axesIndex] * action.modifier;
                        }
                        break;
                    }
                    case "kb": {
                        result += ((keyIsDown(action.keyCode)) ? 1 : 0) * action.modifier;
                        break;
                    };
                }
            }
        }
        return result;
    }

    isGamepadConnected()
    {
        return this.gamepadIndex >= 0;
    }

    setGamepadIndex(index)
    {
        this.gamepadIndex = index;
    }
}

