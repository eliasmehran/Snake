//colors
const CANVAS_BORDER_COLOR = 'grey';
const CANVAS_BACKGROUND_COLOR = 'black';
const P1_BORDER_COLOR = 'darkgreen';
const P1_COLOR = 'lightgreen';
const P1_HEAD_COLOR = 'orange';
const P1_HEAD_BORDER_COLOR = 'red';
const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';

//speed
const SPEED = 100;

//snake
let p1 = [
    {x: 150, y: 150},
    {x: 130, y: 150},
    {x: 110, y: 150},
    {x: 90, y: 150},
    {x: 70, y: 150},
    {x: 50, y: 150},
    {x: 30, y: 150},
    {x: 10, y: 150},
];

//scores
let scoreP1 = 0;
let p1dead = false;

//food coordinates
let xFood;
let yFood;

//velocities
let xVelocityP1 = 10;
let yVelocityP1 = 0;

//buffer inputs
let queueP1 = [];
const directions = {
    up: {x: 0, y: -10},
    left: {x: -10, y: 0},
    down: {x: 0, y: 10},
    right: {x: 10, y: 0}
};

//get canvas element
const gameCanvas = document.getElementById("gameCanvas");

//make 2d drawing context
const ctx = gameCanvas.getContext("2d");

play();

//first food location
createFood();

//eventListener for controls
document.addEventListener("keydown", changeDirection);

//play
function play() {
    //game over
    if (p1dead) {
        document.getElementById('log').innerHTML = 'GAME OVER!';
    }
    //every tick
    setTimeout(function onTick() {
        //turn
        if (queueP1.length) {
            xVelocityP1 = queueP1[0].x;
            yVelocityP1 = queueP1[0].y;
            queueP1.shift();
        }
        clearCanvas();
        drawFood();
        //advance if not dead
        if (gameOver(p1)) p1dead = true;
        if (!p1dead) {
            advanceSnake(p1);
        }

        drawSnake();
        play();
    }, SPEED);
}

function changeDirection(event) {
    //get pressed key
    const keyPressed = event.keyCode;
    //space === reset
    if (keyPressed === 32) window.location.reload();
    //player 1
    //up
    if (keyPressed === 87 || keyPressed === 38) {
        if (queueP1.length < 2) {
            if (queueP1.length) {
                if (queueP1[0] !== directions.down) {
                    queueP1.push(directions.up);
                }
            } else {
                if (yVelocityP1 !== directions.down.y) {
                    queueP1.push(directions.up);
                }
            }
        }
    }
    //left
    if (keyPressed === 65 || keyPressed === 37) {
        if (queueP1.length < 2) {
            if (queueP1.length) {
                if (queueP1[0] !== directions.right) {
                    queueP1.push(directions.left);
                }
            } else {
                if (xVelocityP1 !== directions.right.x) {
                    queueP1.push(directions.left);
                }
            }
        }
    }
    //down
    if (keyPressed === 83 || keyPressed === 40) {
        if (queueP1.length < 2) {
            if (queueP1.length) {
                if (queueP1[0] !== directions.up) {
                    queueP1.push(directions.down);
                }
            } else {
                if (yVelocityP1 !== directions.up.y) {
                    queueP1.push(directions.down);
                }
            }
        }
    }
    //right
    if (keyPressed === 68 || keyPressed === 39) {
        if (queueP1.length < 2) {
            if (queueP1.length) {
                if (queueP1[0] !== directions.left) {
                    queueP1.push(directions.right);
                }
            } else {
                if (xVelocityP1 !== directions.left.x) {
                    queueP1.push(directions.right);
                }
            }
        }
    }
}

//clear playground
function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.strokeStyle = CANVAS_BORDER_COLOR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

//draw Food
function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.strokeStyle = FOOD_BORDER_COLOR;
    ctx.fillRect(xFood, yFood, 10, 10);
    ctx.strokeRect(xFood, yFood, 10, 10);
}

//advance Snake
function advanceSnake(snake) {
    snake.unshift({x: snake[0].x + xVelocityP1, y: snake[0].y + yVelocityP1});
    //if eats score up
    if (snake[0].x === xFood && snake[0].y === yFood) {
        scoreP1 = scoreP1 + 10;
        document.getElementById('scoreP1').innerHTML = 'Score: ' + scoreP1;
        createFood();
    } else {
        snake.pop();
    }
}

//check if dead
function gameOver(player) {
    //in self
    for (let i = 4; i < player.length; i++) {
        if (player[i].x === player[0].x && player[i].y === player[0].y) return true;
    }
    //in wall
    return player[0].x < 0 || player[0].x > gameCanvas.width - 10 || player[0].y < 0 || player[0].y > gameCanvas.height - 10;
}

//food location generation
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

//create food
function createFood() {
    xFood = randomTen(0, gameCanvas.width - 10);
    yFood = randomTen(0, gameCanvas.height - 10);
    let foodInSnake = false;
    //check if food in snake
    p1.forEach(function isFoodOnSnake(part) {
        if (part.x === xFood && part.y === yFood) {
            foodInSnake = true;
        }
    });
    if (foodInSnake) createFood();
}

//draw whole snake
function drawSnake() {
    p1.slice().reverse().forEach(drawSnakePart);
}

//draw snake parts
function drawSnakePart(snakePart) {
    if (snakePart === p1[0]) {
        ctx.fillStyle = P1_HEAD_COLOR;
        ctx.strokeStyle = P1_HEAD_BORDER_COLOR;
    } else if (p1.includes(snakePart)) {
        ctx.fillStyle = P1_COLOR;
        ctx.strokeStyle = P1_BORDER_COLOR;
    }
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}