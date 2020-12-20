class Surface {
    constructor(context, x, y, width, length, rotation, shape, type) {
        // Constants
            this.context = context;
            this.shape = shape;
            this.WIDTH = width;
            this.LENGTH = length;
            // Rotation should always be > 0 and < 180
            this.ROTATION = rotation * Math.PI / 180;
            this.points = null;
            this.x = x;
            this.y = y;
            switch(type) {
                case "Mud":
                    this.speedFactor = 0.94;
                    this.color = "rgb(94, 71, 43)";
                    break;
                case "Grass":
                    this.speedFactor = 0.98;
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
        this.context.fillStyle = this.color;
        switch(this.shape) {
            case "Circle":
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.LENGTH, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
                break;
            default:
                this.context.save();
                this.context.translate(this.x, this.y);
                this.context.rotate(this.ROTATION);
                this.context.translate(-this.x, -this.y);
                this.context.fillRect(this.x - (this.WIDTH / 2), this.y - (this.LENGTH / 2), this.WIDTH, this.LENGTH);
                this.context.restore();
        }
        
    }

    update() {
        this.draw();
    }


    // // Function borrowed from Stack Overflow:
    // // https://stackoverflow.com/questions/38297082/get-rotated-rectangle-points-from-x-y-width-height-and-rotation 
    // getRectFourPoints(x, y, width, height, ang) {
    //     const points = {first: {x,y}}
    //     const sinAng = Math.sin(ang * (Math.PI / 180))	
    //     const cosAng = Math.cos(ang * (Math.PI / 180))
        
    //     let upDiff = sinAng * width
    //     let sideDiff = cosAng * width
    //     const second = {x: x + sideDiff, y: y + upDiff}
    //     points.second = second
        
    //     upDiff = cosAng * height
    //     sideDiff = sinAng * height
    //     points.third = {x: x + sideDiff, y: y - upDiff}
        
    //     const fourth = {x: second.x + sideDiff, y: second.y - upDiff}
    //     points.fourth = fourth
    //     return points
    // }

    // // I did the two functions below myself, but various Stack Overflow posts helped me figure it out
    // areaOfTriangleFromThreePoints(x1, y1, x2, y2, x3, y3) {
    //     return Math.abs(( (x1 * (y2-y3)) + (x2 * (y3-y1)) + (x3 * (y1-y2)) ) / 2);
    // }

    // isInsideRotatedRectangle(x, y) {
    //     if (this.areaOfTriangleFromThreePoints(x,y, this.points.first.x,this.points.first.y, this.points.second.x,this.points.second.y) + 
    //         this.areaOfTriangleFromThreePoints(x,y, this.points.second.x,this.points.second.y, this.points.third.x,this.points.third.y) +
    //         this.areaOfTriangleFromThreePoints(x,y, this.points.third.x,this.points.third.y, this.points.fourth.x,this.points.fourth.y) +
    //         this.areaOfTriangleFromThreePoints(x,y, this.points.fourth.x,this.points.fourth.y, this.points.first.x,this.points.first.y)
    //         > this.WIDTH * this.LENGTH) {
    //         return false;
    //     }
    //     return true;
    // }
    

    isColliding(x, y) {
        switch(this.shape) {
            case "Circle":
                if (Math.hypot(y - this.y, x - this.x) < this.LENGTH) {
                    return true;
                }
                return false;
            default:
                if (this.ROTATION == 0) {
                    if (x < this.x + (this.WIDTH / 2) && x > this.x - (this.WIDTH / 2) && 
                        y < this.y + (this.LENGTH / 2) && y > this.y - (this.LENGTH / 2)) {
                        return true;
                    }
                } else {
                    // Equation borrowed form Stack Overflow:
                    // https://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
                    let relX = x - this.x;
                    let relY = y - this.y;
                    relX = relX * Math.cos(Math.PI - this.ROTATION) - relY * Math.sin(Math.PI - this.ROTATION);
                    relY = relX * Math.sin(Math.PI - this.ROTATION) - relY * Math.cos(Math.PI - this.ROTATION);
                    relX = relX + this.x;
                    relY = relY + this.y;
                    //console.log(x, relX, y, relY);
                    if (relX < this.x + (this.WIDTH / 2) && relX > this.x - (this.WIDTH / 2) && 
                    relY < this.y + (this.LENGTH / 2) && relY > this.y - (this.LENGTH / 2)) {
                        //console.log("touching");
                        return true;
                    }
                }
                return false;
        }
        
    }
}