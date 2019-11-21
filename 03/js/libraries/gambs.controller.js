class Controller
{
    constructor(mapping)
    {
        this.mapping = mapping;
        this.gamepadIndex = -1;
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

    rumble(duration, magnitude)
    {
        if (this.controller.isGamepadConnected())
        {
            let gamepad = navigator.getGamepads()[this.controller.gamepadIndex];
            try
            {
                gamepad.vibrationActuator.playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: duration,
                    weakMagnitude: magnitude,
                    strongMagnitude: magnitude
                });
            } catch (error)
            {
                console.log(error);
            }

        }
    }

    setGamepadIndex(index)
    {
        this.gamepadIndex = index;
    }
}
