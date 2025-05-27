const setupScreen = document.getElementById('setupScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverScreen = document.getElementById('gameOver');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('finalScore');

    let snake = [];
    let food = {};
    let direction = 'right';
    let score = 0;
    let gameLoop;
    let cellSize;
    let currentBoardSize;
    let currentSpeed;

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentBoardSize = Math.min(50, Math.max(10, 
                parseInt(document.getElementById('boardSize').value)));
            currentSpeed = parseInt(e.target.dataset.speed);

            setupScreen.style.display = 'none';
            gameScreen.style.display = 'flex';

            const containerWidth = document.querySelector('.main-container').offsetWidth;
            const containerHeight = window.innerHeight * 0.8; // 80% of viewport height

            const maxCanvasSize = Math.min(containerWidth, containerHeight);
            cellSize = Math.floor(maxCanvasSize / currentBoardSize);
            canvas.width = currentBoardSize * cellSize;
            canvas.height = currentBoardSize * cellSize;

            startGame();
        });
    });

    function startGame() {
        snake = [
            {x: 5, y: 5},
            {x: 4, y: 5},
            {x: 3, y: 5}
        ];
        direction = 'right';
        score = 0;
        scoreElement.textContent = score;
        spawnFood();

        clearInterval(gameLoop);
        gameLoop = setInterval(gameUpdate, currentSpeed);
    }

    function gameUpdate() {
        const head = {...snake[0]};
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= currentBoardSize || 
            head.y < 0 || head.y >= currentBoardSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            spawnFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.forEach((segment, index) => {
            const hue = index * 15 % 360;
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.beginPath();
            ctx.roundRect(
                segment.x * cellSize + 2,
                segment.y * cellSize + 2,
                cellSize - 4,
                cellSize - 4,
                5
            );
            ctx.fill();
        });

        // Draw food
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2 - 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    function spawnFood() {
        do {
            food = {
                x: Math.floor(Math.random() * currentBoardSize),
                y: Math.floor(Math.random() * currentBoardSize)
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }

    function gameOver() {
        clearInterval(gameLoop);
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'block';
        finalScoreElement.textContent = score;
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': if(direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if(direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if(direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if(direction !== 'left') direction = 'right'; break;
        }
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        startGame();
        gameScreen.style.display = 'flex';
    });

document.getElementById('backBtn').addEventListener('click', () => {
    clearInterval(gameLoop); // Stop the game loop
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    setupScreen.style.display = 'block';
});
    document.getElementById('gameOverRestart').addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        startGame();
        gameScreen.style.display = 'flex';
    });

document.getElementById('gameOverBack').addEventListener('click', () => {
    clearInterval(gameLoop); // Stop the game loop
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    setupScreen.style.display = 'block';
});
