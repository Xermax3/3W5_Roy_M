/*
    TITLE HERE
    Created by: Maxence Roy
    Latest update: December 12, 2020
    Description: DESCRIPTION HERE
*/

/*
    To do:
    - Array manipulation (add/remove objects)
    - Movement / Animation loop
    - Scoring
    - Game end condition
    - Limit checking
    - Sounds
    - Intro splash screen (w/ instructions)
    - Game over / Play again screen
    - Originality
*/

/*
    Ideas:
    - Title screen: Option to bind keys
    - Title screen: Make player select different car models with different stats (show on screen)
    - KM/H meter
    - Particles when collision, particles for everything tbh
*/

document.addEventListener('DOMContentLoaded', () => {

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

playerCar = new PlayerCar(context, canvas.width / 2, canvas.height / 2);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    playerCar.update();
}
animate();

// Player Controls
window.addEventListener('keydown', event => {
    if (event.key == "w") {
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
