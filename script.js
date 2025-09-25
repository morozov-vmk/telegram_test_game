const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Игрок
let player = { x: 200, y: 500, size: 30, color: 'lime' };
let speed = 10;
let score = 0;

// Звёзды
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

  // Звёзды
  stars.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Враги
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });

  // Счёт
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("Счёт: " + score, 10, 30);
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
      alert("Игра окончена! Счёт: " + score);
      score = 0;
      player.x = 200; player.y = 500;
    }
  });

  // Проверка сбора звёзд
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

// Управление клавишами (ПК)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= speed;
  if (e.key === "ArrowDown") player.y += speed;
  if (e.key === "ArrowLeft") player.x -= speed;
  if (e.key === "ArrowRight") player.x += speed;
});

// Сенсорное управление (мобильные кнопки)
const controls = { up: false, down: false, left: false, right: false };

document.getElementById("up").addEventListener("touchstart", () => controls.up = true);
document.getElementById("up").addEventListener("touchend", () => controls.up = false);
document.getElementById("down").addEventListener("touchstart", () => controls.down = true);
document.getElementById("down").addEventListener("touchend", () => controls.down = false);
document.getElementById("left").addEventListener("touchstart", () => controls.left = true);
document.getElementById("left").addEventListener("touchend", () => controls.left = false);
document.getElementById("right").addEventListener("touchstart", () => controls.right = true);
document.getElementById("right").addEventListener("touchend", () => controls.right = false);

// Движение игрока по кнопкам
function movePlayer() {
  if (controls.up) player.y -= speed;
  if (controls.down) player.y += speed;
  if (controls.left) player.x -= speed;
  if (controls.right) player.x += speed;

  requestAnimationFrame(movePlayer);
}
movePlayer();
