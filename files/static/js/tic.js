class TicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.boardElement = document.getElementById('board');
        this.scoreCanvas = document.getElementById('scoreCanvas');
        this.ctx = this.scoreCanvas.getContext('2d');
        this.playButton = document.querySelector('.btn-p');
        
        this.init();
    }
    
    init() {
        this.setupBoard();
        this.setupCanvas();
        this.setupButton();
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = i;
            tile.addEventListener('click', () => this.handleTileClick(tile));
            this.boardElement.appendChild(tile);
        }
    }
    
    setupCanvas() {
        const size = Math.min(300, window.innerWidth * 0.8);
        this.scoreCanvas.width = size;
        this.scoreCanvas.height = 60;
        this.ctx.font = `${Math.min(20, size / 15)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.clearCanvas();
    }
    
    setupButton() {
        this.playButton.addEventListener('click', () => this.resetGame());
        this.playButton.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            this.playButton.style.setProperty('--x', `${e.clientX - rect.left}px`);
            this.playButton.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    }
    
    handleTileClick(tile) {
        if (this.gameOver || tile.querySelector('img')) return;
        
        const img = document.createElement('img');
        img.src = this.currentPlayer === 'X' 
            ? './static/images/X.png' 
            : './static/images/O.png';
        
        if (this.currentPlayer === 'O') img.classList.add('rotate-image');
        
        tile.appendChild(img);
        
        if (this.checkWin()) {
            this.gameOver = true;
            this.displayWinner(this.currentPlayer);
            return;
        }
        
        if (this.checkDraw()) {
            this.gameOver = true;
            this.displayDraw();
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]           
        ];
        
        const tiles = this.boardElement.children;
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return (
                tiles[a].querySelector('img') &&
                tiles[b].querySelector('img') &&
                tiles[c].querySelector('img') &&
                tiles[a].querySelector('img').src === 
                tiles[b].querySelector('img').src &&
                tiles[b].querySelector('img').src === 
                tiles[c].querySelector('img').src
            );
        });
    }
    
    checkDraw() {
        return [...this.boardElement.children].every(tile => tile.querySelector('img'));
    }
    
    displayWinner(winner) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
            `Player ${winner} wins!`,
            this.scoreCanvas.width / 2,
            this.scoreCanvas.height / 2
        );
    }
    
    displayDraw() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
            "It's a draw!",
            this.scoreCanvas.width / 2,
            this.scoreCanvas.height / 2
        );
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height);
    }
    
    resetGame() {
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.clearCanvas();
        this.setupBoard();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});