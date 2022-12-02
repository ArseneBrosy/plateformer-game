var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// inputs
var inputW = false;
var inputA = false;
var inputS = false;
var inputD = false;
var inputSpace = false;

// player
var playerX = 50;
var playerY = 50;
var playerNormalX = 75;
var playerNormalY = 75;
var distortion = 1;


// game loop
function loop() {
    requestAnimationFrame(loop);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw player
    context.fillStyle = "green";
    context.fillRect(playerX - playerNormalX / distortion / 2, playerY - playerNormalY * distortion / 2, playerNormalX / distortion, playerNormalY * distortion);
}

// inputs
document.addEventListener('keydown', function(e) {
    if (e.which === 87) { inputW = true; }
    if (e.which === 65) { inputA = true; }
    if (e.which === 68) { inputS = true; }
    if (e.which === 83) { inputD = true; }
    if (e.which === 32) { inputSpace = true; }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 87) { inputW = false; }
    if (e.which === 65) { inputA = false; }
    if (e.which === 68) { inputS = false; }
    if (e.which === 83) { inputD = false; }
    if (e.which === 32) { inputSpace = false; }
});

// start game
requestAnimationFrame(loop);