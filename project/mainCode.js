/*
    TITLE HERE
    Created by: Maxence Roy
    Latest update: December 12, 2020
    Description: DESCRIPTION HERE
*/

/*
    To do:
    - ~ Array manipulation (add/remove objects)
    - ✓ Movement / Animation loop
    - Scoring
    - Game end condition
    - ✓ Limit checking
    - ~ Sounds
    - Intro splash screen (w/ instructions)
    - Game over / Play again screen
    - Originality
*/

/*
    Ideas:
    - Title screen: Option to bind keys
    - Title screen: Make player select different car models with different stats (show on screen)
    - Instructions = tutorial with text while player plays around
    - sound effects when collect & win. also music?
    - map has list of collidable objects, surface objects, stuff to collect (array manip)
    - collectable: coin that hovers up and down
    - game end = finish track. score = time + collect.

    Up next: title, checkpoints/goal/endscreen, collectables/timer/score, maps & car select
    
*/

document.addEventListener('DOMContentLoaded', () => {


const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const speedIndicator = document.getElementById('speed-indicator');


let map = {
    xSize: canvas.width,
    ySize: canvas.height,
    surfaces: [
        // Note for surfaces, x and y are the position proportional to the map
        new Surface(context, canvas.width / 4, canvas.height / 4, 300, 200, "Mud"),
        new Surface(context, canvas.width / 2, canvas.height / 4, 300, 200, "Grass"),
        new Surface(context, canvas.width * (3/4), canvas.height / 4, 300, 200, "Road")
    ],
    walls: [
        new WallBlock(context, canvas.width / 3, canvas.height / 2, 400, 400),
        new WallCircle(context, canvas.width * (2/3), canvas.height / 2, 500)
    ]
}


let playerCarImg = new Image();
playerCarImg.src = 'Images/Car.png';
let playerCar = new PlayerCar(context, map, canvas.width / 2, canvas.height * (3/4), playerCarImg);


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all objects in the map
    map.surfaces.forEach( surface => surface.update() );
    map.walls.forEach( wall => wall.update() );
    playerCar.update();

    // Make canvas focus on the player's car
    canvas.style.marginLeft = (-playerCar.x + (canvasContainer.clientWidth / 2)) + "px";
    canvas.style.marginTop = (-playerCar.y + (canvasContainer.clientHeight / 2)) + "px";
    speedIndicator.innerText = playerCar.speedToKMH() + " km/h";
}
animate();


// Player Controls
let firstInteraction = true;

window.addEventListener('keydown', event => {
    if (event.key == "w") {
        // Google does not permit playing audio before the user has interacted with the webpage
        if (firstInteraction) {            
            playerCar.playVroom();
            firstInteraction = false;
        }
        playerCar.go();
    } if (event.key == "a") {
        playerCar.turnLeft();
    } else if (event.key == "d") {
        playerCar.turnRight();
    }
});

window.addEventListener('keyup', event => {
    if (event.key == "w") {
        playerCar.stop();
    } if (event.key == "a") {
        playerCar.turnLeftStop();
    } else if (event.key == "d") {
        playerCar.turnRightStop();
    }
});

});
