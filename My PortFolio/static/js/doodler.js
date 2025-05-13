let leftBtn, rightBtn;
let isLeftPressed = false;
let isRightPressed = false;

let board;
let boardWidth = 480;
let boardHeight = 500;
let context;

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - boardWidth / 35;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let platformImg;
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;

let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -12;
let gravity = 0.4;

let score = 0;
let maxScore = 0;
let gameOver = false;

let playAgain = document.querySelector(".btn-p");
let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

window.onload = function () {
    leftBtn = document.querySelector(".left-btn");
    rightBtn = document.querySelector(".right-btn");

    leftBtn.addEventListener("mousedown", () => { isLeftPressed = true; });
    leftBtn.addEventListener("mouseup", () => { isLeftPressed = false; });
    leftBtn.addEventListener("mouseleave", () => { isLeftPressed = false; });
    leftBtn.addEventListener("touchstart", () => { isLeftPressed = true; });
    leftBtn.addEventListener("touchend", () => { isLeftPressed = false; });

    rightBtn.addEventListener("mousedown", () => { isRightPressed = true; });
    rightBtn.addEventListener("mouseup", () => { isRightPressed = false; });
    rightBtn.addEventListener("mouseleave", () => { isRightPressed = false; });
    rightBtn.addEventListener("touchstart", () => { isRightPressed = true; });
    rightBtn.addEventListener("touchend", () => { isRightPressed = false; });

    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    playAgain.addEventListener("click", () => {
        if (gameOver) {
            restart();
        }
    });
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./static/images/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function () {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./static/images/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./static/images/stick.jpeg";

    velocityY = initialVelocityY;
    requestAnimationFrame(update);
    window.addEventListener("keydown", moveDoodler);
    window.addEventListener("keyup", stopDoodler);
    placePlatforms();
}

function update() {
    if (gameOver) return;

    if (isLeftPressed) {
        velocityX = -5;
        doodler.img = doodlerLeftImg;
    }
    else if (isRightPressed) {
        velocityX = 5;
        doodler.img = doodlerRightImg;
    }
    else {
        velocityX = 0;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    doodler.x += velocityX;
    doodler.y = Math.max(doodler.y, 0);

    if (doodler.x > boardWidth) doodler.x = 0;
    if (doodler.x + doodlerWidth < 0) doodler.x = boardWidth;

    velocityY += gravity;
    doodler.y += velocityY;

    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        platform.y += 3;
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    if (platformArray.length > 0 && platformArray[0].y > boardHeight) {
        platformArray.shift();
        newPlatform();
    }

    if (doodler.y - 2 * doodlerWidth - 10 > boardWidth) {
        gameOver = true;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    updateScore();

    if (gameOver) {
        context.fillStyle = "#ff3333";
        context.font = "bold 20px 'Courier New', monospace";
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.shadowColor = "rgba(0,0,0,0.5)";
        context.fillText("GAME OVER", 20, 70);
    }
}

function moveDoodler(e) {
    if (gameOver) return;

    if (e.code == "ArrowRight" || e.code == "KeyD") {
        isRightPressed = true;
        velocityX = 5;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        isLeftPressed = true;
        velocityX = -5;
        doodler.img = doodlerLeftImg;
    }
}

function stopDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        isRightPressed = false;
        if (!isLeftPressed) velocityX = 0;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        isLeftPressed = false;
        if (!isRightPressed) velocityX = 0;
    }
}

function placePlatforms() {
    if (gameOver) return;

    platformArray = [];
    platformArray.push({
        img: platformImg,
        x: boardHeight / 3,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    });

    for (let i = 0; i < 6; i++) {
        platformArray.push({
            img: platformImg,
            x: Math.floor(Math.random() * boardWidth * 3 / 4),
            y: boardHeight - (75 * i) - 150,
            width: platformWidth,
            height: platformHeight
        });
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function newPlatform() {
    if (gameOver) return;

    platformArray.push({
        img: platformImg,
        x: Math.floor(Math.random() * boardWidth * 3 / 4),
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    });
}

function updateScore() {
    let points = Math.floor(1 * Math.random()) + 1;
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) score = maxScore;
    }
    context.fillStyle = "#ffffff";
    context.font = "bold 20px 'Courier New', monospace";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.shadowColor = "#000000";
    context.shadowBlur = 4;
    context.fillText(`SCORE: ${score}`, 20, 40);
}

function restart() {
    doodler = {
        img: doodlerRightImg,
        x: doodlerX,
        y: doodlerY,
        width: doodlerWidth,
        height: doodlerHeight
    };

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
    requestAnimationFrame(update);
}