class WallCircle {
    constructor(context, x, y, radius) {
        this.context = context;
        this.RADIUS = radius;
        // this.x and this.y represent the center
        this.x = x;
        this.y = y;
    }

    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
        this.context.closePath();
		this.context.fillStyle = "Grey";
		this.context.fill();
        this.context.restore();
    }

    update() {
        this.draw();
    }

    angleOfPoint(x, y) {
        return Math.atan2(y - this.y, x - this.x);
    }

    sizeX(x, y) {
        return Math.cos(this.angleOfPoint(x, y)) * this.RADIUS;
    }

    sizeY(x, y) {
        return Math.sin(this.angleOfPoint(x, y)) * this.RADIUS;
    }

    isCollidingX(x, y, xSize, ySize) {
        if (y > this.y - this.RADIUS && y < this.y + this.RADIUS) {
            if (x < this.x && x > this.x + this.sizeX(x, y) - xSize - (ySize / 2)) {
                return this.x + this.sizeX(x, y) - xSize - (ySize / 2);
            } else if (x > this.x && x < this.x + this.sizeX(x, y) + xSize + (ySize / 2)) {
                return this.x + this.sizeX(x, y) + xSize + (ySize / 2);
            }
        }
        return x;
    }

    isCollidingY(x, y, xSize, ySize) {
        if (x > this.x - this.RADIUS && x < this.x + this.RADIUS) {
            if (y < this.y && y > this.y + this.sizeY(x, y) - ySize - (xSize / 2)) {
                return this.y + this.sizeY(x, y) - ySize - (xSize / 2);
            } else if (y > this.y && y < this.y + this.sizeY(x, y) + ySize + (xSize / 2)) {
                return this.y + this.sizeY(x, y) + ySize + (xSize / 2);
            }
        }
        return y;
    }
}