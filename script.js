<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mobile & PC Game</title>
<style>
  body { margin: 0; overflow: hidden; }
  canvas { background: #222; display: block; margin: 0 auto; }
  .controls {
    position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 10px;
  }
  .btn {
    width: 50px; height: 50px; background: #555; color: white; font-size: 20px;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    user-select: none;
  }
</style>
</head>
<body>

<canvas id="gameCanvas" width="400" height="600"></canvas>

<div class="controls">
  <div class="btn" id="up">↑</div>
  <div class="btn" id="left">←</div>
  <div class="btn" id="down">↓</div>
  <div class="btn" id="right">→</div>
</div>

<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 200, y: 500, size: 30, color: 'lime' };
let speed = 10;
let score = 0;

// Создаем звезды
let stars = [];
for (let i = 0; i < 5; i++) {
  stars.push({ x: Math.random() * (canvas.width-20), y: Math.random() * 400, size: 20, color: 'yellow' });
}

// Враги
let enemies = [];
for (let i = 0; i < 3; i++) {
  enemies.push({ x: Math.random() * (canvas.width-30), y: Math.random() * 200, size: 30, color: 'red', speed: 2 + Math.random()*3 });
}

// Отрисовка объектов
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Игрок
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Звезды
  stars.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Враги
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });

  // Счет
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 10, 30);
}

// Обновление игры
function update() {
  // Двигаем врагов вниз
  enemies.forEach(e => {
    e.y += e.speed;
    if (e.y > canvas.height) {
      e.y = -e.size;
      e.x = Math.random() * (canvas.width - e.size);
    }

    // Проверка столкновения с игроком
    if (player.x < e.x + e.size && player.x + player.size > e.x &&
        player.y < e.y + e.size && player.y + player.size > e.y) {
      alert("Game Over! Score: " + score);
      score = 0;
      player.x = 200; player.y = 500;
    }
  });

  // Проверка сбора звезд
  stars.forEach(s => {
    if (player.x < s.x + s.size && player.x + player.size > s.x &&
        player.y < s.y + s.size && player.y + player.size > s.y) {
      score++;
      s.x = Math.random() * (canvas.width-20);
      s.y = Math.random() * 400;
    }
  });

  draw();
  requestAnimationFrame(update);
}

update();

// Управление клавишами
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= speed;
  if (e.key === "ArrowDown") player.y += speed;
  if (e.key === "ArrowLeft") player.x -= speed;
  if (e.key === "ArrowRight") player.x += speed;
});

// Сенсорное управление для мобильных
const controls = { up: false, down: false, left: false, right: false };
document.getElementById("up").addEventListener("touchstart", () => controls.up = true);
document.getElementById("up").addEventListener("touchend", () => controls.up = false);
document.getElementById("down").addEventListener("touchstart", () => controls.down = true);
document.getElementById("down").addEventListener("touchend", () => controls.down = false);
document.getElementById("left").addEventListener("touchstart", () => controls.left = true);
document.getElementById("left").addEventListener("touchend", () => controls.left = false);
document.getElementById("right").addEventListener("touchstart", () => controls.right = true);
document.getElementById("right").addEventListener("touchend", () => controls.right = false);

// Обновление игрока для мобильных
function movePlayer() {
  if (controls.up) player.y -= speed;
  if (controls.down) player.y += speed;
  if (controls.left) player.x -= speed;
  if (controls.right) player.x += speed;

  requestAnimationFrame(movePlayer);
}
movePlayer();
</script>
</body>
</html>
