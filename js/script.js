alert("Welcome to the Snake Game!\nPress Enter or Arrow keys to start the game.");

// Game Constatns and Variables 
let inputDir = { x: 0, y: 0 };
let foodSound = new Audio('./music/food.mp3');
let gameOverSound = new Audio('./music/gameover.mp3');
let moveSound = new Audio('./music/move.mp3');
let musicSound = new Audio('./music/music.mp3');
let score = 0;
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
food = { x: 6, y: 7 };
let isGameRunning = false;


// Game Function 
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    // console.log(ctime);
    gameEngine();
}

function isCollide(snake) {
    // if you dumb in urself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            score = 0;
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 1 || snake[0].y >= 18 || snake[0].y <= 1) {
        score = 0;
        return true;
    }
}

function gameEngine() {
    // Part 1: Updating the snake array and food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over . Press any key to Play Again ")
        score = 0;
        snakeArr = [{ x: 13, y: 15 }];
        // musicSound.play();
    }

    // if u have eaten the food , increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = " High Score : " + highscoreval;
        }
        scoreBox.innerHTML = "Score : " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        // Generate random food position until it's not inside the snake
        let a = 2;
        let b = 16;
        do {
            food = {
                x: +Math.round(a + (b - a) * Math.random()),
                y: +Math.round(a + (b - a) * Math.random())
            };
        } while (snakeArr.some(segment => segment.x === food.x && segment.y === food.y));
    }

    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2 : Display the snake and Food 
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index == 0) {
            snakeElement.classList.add("head");
        }
        else {
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    })
    // Display the food 
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);

}

// Main logic starts here
// musicSound.play();
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
}
else {
    highscoreval = JSON.parse(highscore);
    highscoreBox.innerHTML = " High Score : " + highscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (!isGameRunning) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
            inputDir = { x: 0, y: -1 }; // Start the game
            moveSound.play();
            musicSound.play();
            switch (e.key) {
                case "ArrowUp":
                    inputDir.x = 0;
                    inputDir.y = -1;
                    break;
                case "ArrowDown":
                    inputDir.x = 0;
                    inputDir.y = 1;
                    break;
                case "ArrowLeft":
                    inputDir.x = -1;
                    inputDir.y = 0;
                    break;
                case "ArrowRight":
                    inputDir.x = 1;
                    inputDir.y = 0;
                    break;
                default:
                    break;
            }
        }
    }
});

// Add an event listener to stop the music when the window loses focus
window.addEventListener('blur', () => {
    musicSound.pause();
});

