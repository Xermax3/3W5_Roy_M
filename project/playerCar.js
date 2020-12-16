class PlayerCar {
    constructor(context, x, y) {
        // Constants
            this.context = context;
            this.LENGTH = 20;
            this.WIDTH = 10;

            // Maximum speed of the car. Stops accelerating after this point.
            this.SPEED_CAP = 12;

            // How fast the car speeds up when moving.
            this.GO_ACCELERATION_RATE = 0.00300;

            // How fast the car slows down when braking.
            this.STOP_ACCELERATION_RATE = -0.00500;

            // How much the car turns per rotation input (in angles).
            this.ROTATION_RATE = 5;

            // How much the car slows down when turning. Should be > GO_ACC to have an effect.
            this.ROTATION_ACCELERATION_RATE = -0.00305;

            // Speed at which rotation slows down the car. 0 = will fully stop the car.
            this.ROTATION_SPEED_CAP = 1;

        // Variables
            this.x = x - (this.LENGTH / 2);
            this.y = y - (this.WIDTH / 2);
            this.speed = 0;
            this.acceleration = 0;
            this.rotation = 0;

            this.goingForward = false;
            this.turningLeft = false;
            this.turningRight = false;
    }

    draw() {
        this.context.save();

        this.context.translate(this.x, this.y);
        this.context.rotate(this.rotation * Math.PI / 180);
        this.context.translate(-this.x, -this.y);
        this.context.fillStyle = "MediumPurple";
        this.context.fillRect(this.x - (this.LENGTH / 2), this.y - (this.WIDTH / 2), this.LENGTH, this.WIDTH);

        this.context.restore();
    }

    update() {
        // Update rotation
        if (this.turningLeft) {
            this.rotation -= this.ROTATION_RATE;
        }
        if (this.turningRight) {
            this.rotation += this.ROTATION_RATE;            
        }

        // Update acceleration
        if (this.speed == 0 && this.acceleration < 0) {
            this.acceleration = 0;
        } else if (this.goingForward) {
            if (this.speed < this.SPEED_CAP) {
                //console.log("Good to go");
                this.acceleration += this.GO_ACCELERATION_RATE;
            } else {
                //console.log("Cap reach -> stop acceleration");
                this.acceleration = 0;
            }
            if (this.speed > this.ROTATION_SPEED_CAP && (this.turningLeft || this.turningRight)) {
                //console.log("Rotation");
                this.acceleration += this.ROTATION_ACCELERATION_RATE;
            }
        } else {
            if (this.speed > this.ROTATION_SPEED_CAP && (this.turningLeft || this.turningRight)) {
                //console.log("Rotation");
                this.acceleration += this.ROTATION_ACCELERATION_RATE;
            }
            if (this.speed > 0) {
                //console.log("Decelerate");
                this.acceleration += this.STOP_ACCELERATION_RATE;
            } else {
                //console.log("Stopped");
                this.acceleration = 0;
            }
        }
        
        // Update speed
        this.speed += this.acceleration
        if (this.speed < 0) {
            this.speed = 0;
        } else if (this.speed > this.SPEED_CAP) {
            this.speed = this.SPEED_CAP;
        }
        
        // Update position
        this.x += Math.cos(this.rotation * Math.PI / 180) * this.speed;
        this.y += Math.sin(this.rotation * Math.PI / 180) * this.speed;

        // Check for walls
        let xSize = Math.abs(Math.cos(this.rotation * Math.PI / 180) * this.LENGTH) / 2;
        let ySize = Math.abs(Math.sin(this.rotation * Math.PI / 180) * this.LENGTH) / 2;
        if (this.x < xSize + (ySize / 2)) {
            this.x = xSize + (ySize / 2);
            //this.speed = 0; //crash
		} else if (this.x > canvas.width - xSize - (ySize / 2)) {
            this.x = canvas.width - xSize - (ySize / 2);
            //this.speed = 0; //crash
        }
		if (this.y < ySize + (xSize / 2)) {
            this.y = ySize + (xSize / 2);
            //this.speed = 0; //crash
		} else if (this.y > canvas.height - ySize - (xSize / 2)) {
            this.y = canvas.height - ySize - (xSize / 2);
            //this.speed = 0; //crash
        }

        //console.log(this.speed, this.acceleration)
        //console.log(this.turningLeft, this.turningRight);

        this.draw();
    }

    // User input methods
    turnLeft() { this.turningLeft = true; }
    turnRight() { this.turningRight = true; }
    turnLeftStop() { this.turningLeft = false; }
    turnRightStop() { this.turningRight = false; }
    go() { this.goingForward = true; }
    stop() { this.goingForward = false; }
}