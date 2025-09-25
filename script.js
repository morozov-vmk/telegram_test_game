const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = 200;
let y = 200;
const size = 30;
const speed = 10;

// Отрисовка квадрата
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, size, size);
}

draw();

// Управление стрелками
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") y -= speed;
  if (e.key === "ArrowDown") y += speed;
  if (e.key === "ArrowLeft") x -= speed;
  if (e.key === "ArrowRight") x += speed;

  draw();
});
