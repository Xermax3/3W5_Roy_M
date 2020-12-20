class WallBlock {
    constructor(context, x, y, width, length) {
        this.context = context;
        this.WIDTH = width;
        this.LENGTH = length;
        // this.x and this.y do not represent the center, they represent the top-left corner
        this.x = x - (this.WIDTH / 2);
        this.y = y - (this.LENGTH / 2);
        this.leftWall = this.x;
        this.rightWall = this.x + this.WIDTH;
        this.topWall = this.y;
        this.bottomWall = this.y + this.LENGTH;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = "Grey";
        this.context.fillRect(this.x, this.y, this.WIDTH, this.LENGTH);
        this.context.restore();
    }

    update() {
        this.draw();
    }

    isCollidingX(x, y, xSize, ySize) {
        if (y > this.topWall && y < this.bottomWall) {
            if (x < this.x + (this.WIDTH / 2) && x > this.leftWall - xSize - (ySize / 2)) {
                //console.log("LEFT WALL", this.leftWall, x + xSize + (ySize / 2), this.x + (this.WIDTH / 2));
                return this.leftWall - xSize - (ySize / 2);
            } else if (x > this.x + (this.WIDTH / 2) && x < this.rightWall + xSize + (ySize / 2)) {
                //console.log("RIGHT WALL", this.x + (this.WIDTH / 2), x - xSize - (ySize / 2), this.rightWall);
                return this.rightWall + xSize + (ySize / 2);
            }
        }
        return x;
    }

    isCollidingY(x, y, xSize, ySize) {
        if (x > this.leftWall && x < this.rightWall) {
            if (y < this.y + (this.LENGTH / 2) && y > this.topWall - ySize - (xSize / 2)) {
                //console.log("TOP WALL", this.topWall, y + ySize + (xSize / 2), this.y + (this.LENGTH / 2));
                return this.topWall - ySize - (xSize / 2);
            } else if (y > this.y + (this.LENGTH / 2) && y < this.bottomWall + ySize + (xSize / 2)) {
                //console.log("BOTTOM WALL", this.y + (this.LENGTH / 2), y - ySize - (xSize / 2), this.bottomWall);
                return this.bottomWall + ySize + (xSize / 2);
            }
        }
        return y;
    }
}