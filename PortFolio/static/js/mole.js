let currMoleTile;
let currPlantTile;
let playAgain = document.querySelector(".btn-p");
let score = 0;
let gameOver = false;
let scoreCanvas, scoreContext;
let clickedMoleTiles = {};

window.onload = function () {
    setGame();
    createScoreCanvas();
    updateScoreDisplay();
};

function setGame() {
    const board = document.getElementById("board");

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        board.appendChild(tile);
        tile.addEventListener("click", selectTile);
    }

    playAgain.addEventListener("click", () => {
        if (gameOver) {
            restart();
        }
    });

    setInterval(setMole, 800);
    setInterval(setPlant, 900);
}

function createScoreCanvas() {
    const board = document.getElementById("board");

    // Create canvas dynamically
    scoreCanvas = document.createElement("canvas");
    scoreCanvas.id = "scoreCanvas";
    scoreCanvas.width = 400;
    scoreCanvas.height = 50;
    scoreCanvas.style.position = "absolute";
    scoreCanvas.style.top = "0";
    scoreCanvas.style.left = "0";
    scoreCanvas.style.zIndex = "10";

    // Ensure board is relatively positioned
    board.style.position = "relative";

    board.appendChild(scoreCanvas);
    scoreContext = scoreCanvas.getContext("2d");
}

function updateScoreDisplay() {
    scoreContext.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreContext.fillStyle = "#ffffff";
    scoreContext.font = "bold 23px 'Courier New', monospace";
    scoreContext.textAlign = "center";
    scoreContext.textBaseline = "middle";
    scoreContext.shadowColor = "#000000";
    scoreContext.shadowBlur = 4;
    scoreContext.fillText(`SCORE: ${score}`, scoreCanvas.width / 4, scoreCanvas.height / 2);

    if (gameOver) {
        scoreContext.fillStyle = "#ff3333";
        scoreContext.font = "bold 23px 'Courier New', monospace";
        scoreContext.fillText("GAME OVER", scoreCanvas.width / 1.2, scoreCanvas.height / 2);
    }
}

function setMole() {
    if (gameOver) return;

    if (currMoleTile) {
        delete clickedMoleTiles[currMoleTile.id];
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./static/images/mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;

    if (currPlantTile) currPlantTile.innerHTML = "";

    let plant = document.createElement("img");
    plant.src = "./static/images/plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) return;

    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile && this.innerHTML.includes("img")) {
        if (!clickedMoleTiles[this.id]) {
            score += 10;
            clickedMoleTiles[this.id] = true;
            updateScoreDisplay();
        }
    }

    if (this === currPlantTile && this.innerHTML.includes("img")) {
        gameOver = true;
        updateScoreDisplay();
    }
}

const btn = document.querySelector(".btn-p");
btn.addEventListener("mouseover", (event) => {
    const x = event.pageX - btn.offsetLeft;
    const y = event.pageY - btn.offsetTop;
    btn.style.setProperty("--Xpos", x + "px");
    btn.style.setProperty("--Ypos", y + "px");
});

function restart() {
    score = 0;
    gameOver = false;
    clickedMoleTiles = {};
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    currMoleTile = null;
    currPlantTile = null;
    updateScoreDisplay();
}
