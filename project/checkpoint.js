class Checkpoint {
    constructor(number, x, y, radius) {
        this.number = number;
        this.RADIUS = radius;
        // this.x and this.y represent the center
        this.x = x;
        this.y = y;
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

    isColliding(x, y, xSize, ySize) {
        if (y > this.y - this.RADIUS && y < this.y + this.RADIUS) {
            if (x < this.x && x > this.x + this.sizeX(x, y) - xSize - (ySize / 2)) {
                return true;
            } else if (x > this.x && x < this.x + this.sizeX(x, y) + xSize + (ySize / 2)) {
                return true;
            }
        }
        if (x > this.x - this.RADIUS && x < this.x + this.RADIUS) {
            if (y < this.y && y > this.y + this.sizeY(x, y) - ySize - (xSize / 2)) {
                return true;
            } else if (y > this.y && y < this.y + this.sizeY(x, y) + ySize + (xSize / 2)) {
                return true;
            }
        }
        return false;
    }
}