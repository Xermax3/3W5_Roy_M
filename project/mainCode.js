/*
    F-Ultra
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
    - ✓ Limit checking (plenty)
    - ~ Sounds
    - ~ Intro splash screen (w/ instructions)
    - Game over / Play again screen
    - Originality
*/

/*
    Ideas:
    - arrow to guide
    - boosts
    - boxes that can break with enough speed
    - no-no zones where car explodes?
    - music?
    - title screen boop beep sounds

    Up next:
    collectables: coin that hovers up and down
    gameloop (play again screen) w/ transitions
    scoring//
    finished tutorial
    maps
    other ideas
    final stuff (cleanup comments and assets)//
    
*/

document.addEventListener('DOMContentLoaded', () => {


// DOM Elements
const menuContainer = document.getElementById('menu-container');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const playButton = document.getElementById("play-btn");
const tutorialButton = document.getElementById("tutorial-btn");
const textOnScreen = document.getElementById('text-on-screen');
const lapStats = document.getElementById('lap-stats');
const lapNumIndicator = document.getElementById('lap-num');
const lapTimer1 = document.getElementById('lap-1');
const speedIndicator = document.getElementById('speed-indicator');


// Assets
const CAR_IMG_SRC = 'Images/Car.png';
const FINISH_LINE_IMG_SRC = 'Images/FinishLine.png';

const raceStartMusic = new Audio()
raceStartMusic.src = 'Audio/RaceStart.mp3';
const newLapMusic = new Audio()
newLapMusic.src = 'Audio/NewLap.mp3';
const raceFinishMusic = new Audio()
raceFinishMusic.src = 'Audio/RaceFinish.mp3';


// Game loop
menu();
async function menu() {
    while (true) {
        let playerChoice = await new Promise( resolve => {
            playButton.addEventListener('click', e => {
                resolve(1);
            });
            tutorialButton.addEventListener('click', e => {
                resolve(2);
            });
        });
        switch(playerChoice) {
            case 1:
                showCanvas();
                let raceResult = await race(); // do stuff with that
                console.log(raceResult);
                break;
            case 2:
                showCanvas();
                await tutorial();
                break;
        }
        console.log("one menu loop done");
    }
}


function showCanvas() {
    menuContainer.style.display = "none";
    canvasContainer.style.display = "flex";
}

function hideCanvas() {
    canvasContainer.style.display = "none";
    menuContainer.style.display = "block";
}


async function race() {
    return new Promise( async resolve => {
        // Setup map, laps, checkpoints
        let mapNum = 1;
        let map = maps[mapNum - 1];
        canvas.width = map.xSize;
        canvas.height = map.ySize;
        let currentLap = 1;
        let nextCheckpointNum = 1;
        let lapTimers = [ lapTimer1 ];
        let lapStartTime;
        let lapCurrentTime;
        lapNumIndicator.innerText = "Lap " + currentLap + "/" + map.lapNum;

        // Setup car
        let playerCar = new PlayerCar(context, map, map.checkpoints[0].x, map.checkpoints[0].y, CAR_IMG_SRC);
        playerCar.nextCheckpoint = map.checkpoints[nextCheckpointNum];

        // Countdown
        animate();
        textOnScreen.innerText = "Press any key to start.";
        await new Promise( resolve => {
            window.addEventListener('keydown', onKeyDown);
            function onKeyDown(e) {
                window.removeEventListener('keydown', onKeyDown)
                resolve();
            }
        });
        raceStartMusic.play();
        textOnScreen.innerText = "3";
        await new Promise( resolve => setTimeout(resolve, 1000));
        textOnScreen.innerText = "2";
        await new Promise( resolve => setTimeout(resolve, 1000));
        textOnScreen.innerText = "1";
        await new Promise( resolve => setTimeout(resolve, 1000));
        textOnScreen.innerText = "GO!!!";
        lapStartTime = Date.now();
        playerCar.canMove = true;
        await new Promise( resolve => setTimeout(resolve, 1000));
        textOnScreen.innerText = "";


        // Animation loop
        function animate() {
            // Draw and update all objects in the map
            requestAnimationFrame(animate);
            context.clearRect(0, 0, canvas.width, canvas.height);
            map.surfaces.forEach( surface => surface.update() );
            map.decorations.forEach( decoration => decoration.update() );
            map.walls.forEach( wall => wall.update() );
            playerCar.update();

            // Check for laps, checkpoints, race end
            if (playerCar.reachedCheckpoint()) {
                nextCheckpointNum = (nextCheckpointNum + 1) % map.checkpoints.length;
                if (nextCheckpointNum == 1) {
                    currentLap++;
                    if (currentLap > map.lapNum) {
                        raceFinishMusic.play();
                        playerCar.canMove = false;
                        playerCar.goingForward = false;
                        // stuff on screen -> score
                        if (mapNum == maps.mapNum) {
                            resolve("END");
                        } else {
                            // Move on to next map
                            return;
                        }
                    } else {
                        updateLap();
                    }                   
                }
                playerCar.nextCheckpoint = map.checkpoints[nextCheckpointNum]; 
                console.log("hit checkpoint"); 
            }

            // Make canvas focus on the player's car
            canvas.style.marginLeft = (-playerCar.x + (canvasContainer.clientWidth / 2)) + "px";
            canvas.style.marginTop = (-playerCar.y + (canvasContainer.clientHeight / 2)) + "px";

            // Update DOM elements
            if (playerCar.canMove) {
                lapCurrentTime = Date.now();
                lapTimers[currentLap - 1].innerText = readableLapTime();
            }
            speedIndicator.innerText = playerCar.speedToKMH() + " km/h";
        }

        function updateLap() {
            newLapMusic.play();
            lapNumIndicator.innerText = "Lap " + currentLap + "/" + map.lapNum;
            let newlapTimer = document.createElement("p");
            lapStats.appendChild(newlapTimer);
            lapTimers.push(newlapTimer);
            lapStartTime = Date.now();
            console.log("new lap"); // def mention to player
        }

        function readableLapTime() {
            let diff = lapCurrentTime - lapStartTime;
            let minutes = ("0" + Math.round(diff / 60000)).slice(-2);
            diff %= 60000;
            let seconds = ("0" + Math.round(diff / 1000)).slice(-2);
            diff %= 1000;
            return minutes + ":" + seconds + ":" + diff;
        }


        // Player Controls
        let firstInteraction = true;
        window.addEventListener('keydown', event => {
            if (playerCar.canMove) {
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
                }  else if (event.key == "Escape") {
                    // return to menu
                }
            }
            
        });
        window.addEventListener('keyup', event => {
            if (playerCar.canMove) {
                if (event.key == "w") {
                    playerCar.stop();
                } if (event.key == "a") {
                    playerCar.turnLeftStop();
                } else if (event.key == "d") {
                    playerCar.turnRightStop();
                }
            }
        });
    });
}


// Maps
const maps = [

    // Map 1
    {
        xSize: 5000,
        ySize: 5000,
        lapNum: 3,
        checkpoints: [
            new Checkpoint(0, 850, 3500, 300),
            new Checkpoint(1, 2500, 2500, 300),
            new Checkpoint(2, 4150, 1500, 300),
            new Checkpoint(3, 3500, 850, 300),
            new Checkpoint(4, 2500, 2500, 300),
            new Checkpoint(5, 1500, 4150, 300)
        ],
        surfaces: [
            //new Surface(context, canvas.width / 4, canvas.height / 4, 200, 200, "Circle", "Mud"),
            //new Surface(context, canvas.width / 2, canvas.height / 4, 200, 200, "Circle", "Grass"),
            //new Surface(context, canvas.width * (3/4), canvas.height / 4, 200, 200, "Circle", "Road"),
            new Surface(context, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, 0, "Block", "Grass"),
            new Surface(context, 1500, 3500, 800, 800, 0, "Circle", "Road"),
            new Surface(context, 3500, 1500, 800, 800, 0, "Circle", "Road"),
            new Surface(context, 2500, 2500, 300, 2300, 18, "Block", "Road"),
            new Surface(context, 2500, 2500, 300, 2300, 72, "Block", "Road")
        ],
        decorations: [
            // Finish Line (x and y = Checkpoint 0's)
            new Decoration(context, 852, 3500, 300, 150, 0, FINISH_LINE_IMG_SRC)
        ],
        walls: [
            //new Wall(context, canvas.width / 3, canvas.height / 2, 400, 400, "Circle"),
            new Wall(context, 1500, 3500, 500, 500, "Circle"),
            new Wall(context, 3500, 1500, 500, 500, "Circle")
        ]
    }


]





/*
async function tutorial() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;

    let map = {
        surfaces: [
        ],
        walls: [
        ]
    };

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
        //canvas.style.marginLeft = (-playerCar.x + (canvasContainer.clientWidth / 2)) + "px";
        //canvas.style.marginTop = (-playerCar.y + (canvasContainer.clientHeight / 2)) + "px";
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
        } else if (event.key == "Escape") {
            // return to menu
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
}
*/



});
