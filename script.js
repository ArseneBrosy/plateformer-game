var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// inputs
var inputW = false;
var inputA = false;
var inputS = false;
var inputD = false;

//#region Global Variables
//#region Player
var playerX = 100;
var playerY = 50;
var playerNormalX = 75;
var playerNormalY = 75;
var playerDistortion = 1;
const JUMP_FORCE = 14;
const PLAYER_SPEED = 4;

var playerSpriteLeft = new Image();
playerSpriteLeft.src = "sprites/playerLeft.png";
var playerSpriteRight = new Image();
playerSpriteRight.src = "sprites/playerRight.png";
var playerSprite = playerSpriteRight;
//#endregion

//#region MAP
var ground = [[50, 400, 150, 500], [150, 500, 250, 600]];
//#endregion

//#region Physics
var playerVelocityY = 0;
var startedJump = false;
var endendJump = false;
var distortionTarget = 1;
var startJumpPhase = -1;
var wasAir = false;
const GRAVITY_FORCE = 0.5;
const AIR_UP_DISTORTION = 1.1;
const AIR_DOWN_DISTORTION = 0.9;
const START_JUMP_DISTROTION_SPEED = 0.2;
const END_JUMP_DISTORTION_SPEED = 0.05;
//#endregion
//#endregion

//#region FUNCTIONS
function groundDistance(x, y, width) {
    // stup variables
    var result = canvas.height - y;
    var alreadyUsed = [];
    for(var i = 0; i < ground.length; i++) {
        alreadyUsed.push(false);
    }
    //check every blocs from lowest to highest
    for(var i = 0; i < ground.length; i++) {
        var lowestBlocId = 0;
        var lowestBlocY = 0;
        for(var bloc = 0; bloc < ground.length; bloc++) {
            //check if already calculated
            var isAlreadyUsed = alreadyUsed[bloc];
            if(ground[bloc][1] > lowestBlocY && !isAlreadyUsed) {
                lowestBlocY = ground[bloc][1];
                lowestBlocId = bloc;
            }
        }
        //check if player is on top of it
        if(x + width / 2 >= ground[lowestBlocId][0] && x - width / 2 <= ground[lowestBlocId][2] && y - 20 <= ground[lowestBlocId][1]) {
            result = ground[lowestBlocId][1] - y;
        }
        alreadyUsed[lowestBlocId] = true;
    }
    return result;
}
function ceilDistance(x, y, width) {
    // stup variables
    var result = y;
    var alreadyUsed = [];
    for(var i = 0; i < ground.length; i++) {
        alreadyUsed.push(false);
    }
    //check every blocs from highest to lowest
    for(var i = 0; i < ground.length; i++) {
        var heighestBlocId = 0;
        var heighestBlocY = canvas.height;
        for(var bloc = 0; bloc < ground.length; bloc++) {
            //check if already calculated
            var isAlreadyUsed = alreadyUsed[bloc];
            if(ground[bloc][3] < heighestBlocY && !isAlreadyUsed) {
                heighestBlocY = ground[bloc][3];
                heighestBlocId = bloc;
            }
        }
        //check if player is under it
        if(x + width / 2 >= ground[heighestBlocId][0] && x - width / 2 <= ground[heighestBlocId][2] && y + 20 >= ground[heighestBlocId][3]) {
            result = y - ground[heighestBlocId][3];
        }
        alreadyUsed[heighestBlocId] = true;
    }
    return result;
}
//#endregion

// game loop
function loop() {
    requestAnimationFrame(loop);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw player
    if (inputA) {
        playerSprite = playerSpriteLeft;
    }
    if (inputD) {
        playerSprite = playerSpriteRight;
    }
    context.drawImage(playerSprite, playerX - playerNormalX / playerDistortion / 2, playerY - (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion, playerNormalY * playerDistortion);

    //#region DRAW WALLS
    context.fillStyle = "#FED049";
    for (var i = 0; i < ground.length; i++) {
        context.fillRect(ground[i][0], ground[i][1], ground[i][2] - ground[i][0], ground[i][3] - ground[i][1]);
    }
    //#endregion

    //#region PHYSICS
    if (startedJump) {
        playerDistortion += END_JUMP_DISTORTION_SPEED * startJumpPhase;
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion);
        if (playerDistortion <= 0.8) {
            startJumpPhase = 1;
        }
        if (playerDistortion >= 1 && startJumpPhase == 1) {
            startedJump = false;
            playerVelocityY = -JUMP_FORCE;
            startJumpPhase = -1;
        }
    } else if (endendJump) {
        playerDistortion += END_JUMP_DISTORTION_SPEED * startJumpPhase;
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion);
        if (playerDistortion <= 0.8) {
            startJumpPhase = 1;
        }
        if (playerDistortion >= 1 && startJumpPhase == 1) {
            endendJump = false;
        }
    } else {
        playerDistortion += (distortionTarget - playerDistortion) / 10;
    }
    if (groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2) + playerVelocityY + GRAVITY_FORCE, playerNormalX / playerDistortion) > 0) {
        playerVelocityY += GRAVITY_FORCE;
        if (playerVelocityY < -5) {
            distortionTarget = AIR_UP_DISTORTION;
        } else {
            distortionTarget = AIR_DOWN_DISTORTION;
        }
        wasAir = true;
    } else {
        if (wasAir) {
            endendJump = true;
            wasAir = false;
        }
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion);
        playerVelocityY = 0
        distortionTarget = 1;
    }
    if (playerVelocityY < 0 && ceilDistance(playerX, playerY - (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion) <= 0) {
        playerVelocityY = 0;
    } else {
        playerY += playerVelocityY;
    }
    //#endregion

    //#region Movements
    if (inputA) {
        playerX -= PLAYER_SPEED * (startedJump || endendJump ? 0 : 1);
    }
    if (inputD) {
        playerX += PLAYER_SPEED * (startedJump || endendJump ? 0 : 1);
    }
    //#endregion
}

// inputs
document.addEventListener('keydown', function(e) {
    if (e.which === 87) { inputW = true; }
    if (e.which === 65) { inputA = true; }
    if (e.which === 68) { inputD = true; }
    if (e.which === 83) { inputS = true; }
    if (e.which === 32 && groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion) <= 0 && !startedJump) { 
        startedJump = true;
        startJumpPhase = -1;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 87) { inputW = false; }
    if (e.which === 65) { inputA = false; }
    if (e.which === 68) { inputD = false; }
    if (e.which === 83) { inputS = false; }
});

// start game
requestAnimationFrame(loop);