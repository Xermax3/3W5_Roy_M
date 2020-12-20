class Surface {
    constructor(context, x, y, width, length, type) {
        // Constants
            this.context = context;
            this.WIDTH = width;
            this.LENGTH = length;
            // this.x and this.y do not represent the center, they represent the top-left corner
            this.x = x - (this.WIDTH / 2);
            this.y = y - (this.LENGTH / 2);
            switch(type) {
                case "Mud":
                    this.speedFactor = 0.80;
                    this.color = "rgb(94, 71, 43)";
                    break;
                case "Grass":
                    this.speedFactor = 0.95;
                    this.color = "rgb(108, 163, 72)";
                    break;
                case "Road":
                    this.speedFactor = 1;
                    this.color = "rgb(12, 12, 13)";
                    break;
                default:
                    this.speedFactor = 1;
                    this.color = "rgb(255, 255, 255)";
                    break;
            }
            
    }

    draw() {
        // this.context.save();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.WIDTH, this.LENGTH);
        // this.context.restore();
    }

    update() {
        this.draw();
    }

    isColliding(x, y) {
        // console.log(x < this.x + this.WIDTH);
        // console.log(x > this.x - this.WIDTH);
        // console.log(y < this.y + this.LENGTH);
        // console.log(y > this.y - this.LENGTH);
        // console.log(x < this.x + this.WIDTH && x > this.x - this.WIDTH && y < this.y + this.LENGTH && y > this.y - this.LENGTH);

        if (x < this.x + this.WIDTH && x > this.x && y < this.y + this.LENGTH && y > this.y) {
            return true;
        }
        return false;
    }
}