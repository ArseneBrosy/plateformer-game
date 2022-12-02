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
const JUMP_FORCE = 12;
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
const START_JUMP_DISTROTION_SPEED = 0.1;
const END_JUMP_DISTORTION_SPEED = 0.05;
//#endregion
//#endregion

//#region FUNCTIONS
function groundDistance(x, y) {
    return canvas.height - y;
}
//#endregion

// game loop
function loop() {
    requestAnimationFrame(loop);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw player
    context.fillStyle = "green";
    context.fillRect(playerX - playerNormalX / playerDistortion / 2, playerY - (playerNormalY * playerDistortion / 2), playerNormalX / playerDistortion, playerNormalY * playerDistortion);

    //#region PHYSICS
    if (startedJump) {
        playerDistortion += END_JUMP_DISTORTION_SPEED * startJumpPhase;
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2));
        if (playerDistortion <= 0.6) {
            startJumpPhase = 1;
        }
        if (playerDistortion >= 1 && startJumpPhase == 1) {
            startedJump = false;
            playerVelocityY = -JUMP_FORCE;
            startJumpPhase = -1;
        }
    } else if (endendJump) {
        playerDistortion += END_JUMP_DISTORTION_SPEED * startJumpPhase;
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2));
        if (playerDistortion <= 0.8) {
            startJumpPhase = 1;
        }
        if (playerDistortion >= 1 && startJumpPhase == 1) {
            endendJump = false;
        }
    } else {
        playerDistortion += (distortionTarget - playerDistortion) / 10;
    }
    if (groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2) + playerVelocityY + GRAVITY_FORCE) > 0) {
        playerVelocityY += GRAVITY_FORCE;
        if (playerVelocityY < 0) {
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
        playerY += groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2));
        playerVelocityY = 0
        distortionTarget = 1;
    }
    playerY += playerVelocityY;
    //#endregion
}

// inputs
document.addEventListener('keydown', function(e) {
    if (e.which === 87) { inputW = true; }
    if (e.which === 65) { inputA = true; }
    if (e.which === 68) { inputS = true; }
    if (e.which === 83) { inputD = true; }
    if (e.which === 32 && groundDistance(playerX, playerY + (playerNormalY * playerDistortion / 2)) <= 0 && !startedJump) { 
        startedJump = true;
        startJumpPhase = -1;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 87) { inputW = false; }
    if (e.which === 65) { inputA = false; }
    if (e.which === 68) { inputS = false; }
    if (e.which === 83) { inputD = false; }
});

// start game
requestAnimationFrame(loop);