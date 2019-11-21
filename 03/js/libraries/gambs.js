class Circle
{
    constructor(x, y, radius, speed, color)
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

        this.position = createVector(x, y);

        this.reset();
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

    overlaps(thingWithRadius)
    {
        let distance = p5.Vector.dist(this.position, thingWithRadius.position);
        if (distance <= thingWithRadius.radius + this.radius)
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
        ellipse(this.position.x, this.position.y, this.radius * 2);
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
    }
}
