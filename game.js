// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let targets = [];
let bullets = [];
let targetSpeed = 2;
let bulletSpeed = 5;
let spawnInterval = 2000; // Time in ms between targets
let lastSpawn = Date.now();
let gameOver = false;

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: '#00ff00'
};

// Event listener for shooting
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        shootBullet();
    }
});

// Function to shoot a bullet
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        color: '#ffff00'
    });
}

// Function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

// Function to spawn targets
function spawnTarget() {
    const number = Math.floor(Math.random() * 100) + 2; // Random number between 2 and 101
    targets.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        number: number,
        color: isPrime(number) ? '#ff0000' : '#0000ff'
    });
}

// Game loop
function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw targets
    for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        t.y += targetSpeed;
        ctx.fillStyle = t.color;
        ctx.fillRect(t.x, t.y, t.width, t.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(t.number, t.x + 15, t.y + 30);

        // Check if target reached the bottom
        if (t.y > canvas.height) {
            gameOver = true;
        }
    }

    // Move and draw bullets
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        b.y -= bulletSpeed;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);

        // Remove bullets that are off-screen
        if (b.y < -20) {
            bullets.splice(i, 1);
            i--;
            continue;
        }

        // Check for collision with targets
        for (let j = 0; j < targets.length; j++) {
            const t = targets[j];
            if (b.x < t.x + t.width && b.x + b.width > t.x && b.y < t.y + t.height && b.y + b.height > t.y) {
                // Collision detected
                if (isPrime(t.number)) {
                    score += 10;
                } else {
                    score -= 5;
                }
                updateScore();
                targets.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                break;
            }
        }
    }

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Spawn new targets at intervals
    if (Date.now() - lastSpawn > spawnInterval) {
        spawnTarget();
        lastSpawn = Date.now();
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Function to update the score display
function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

// Function to display Game Over
function displayGameOver() {
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
}

// Start the game loop
gameLoop();
