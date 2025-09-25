const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameText = document.getElementById("gameText");

const buttons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3")
];

// Игрок
let player = {
  health: 5,
  energy: 5,
  morale: 5
};

// Простая аномальная зона
const events = [
  {
    text: "Вы вошли в туманную комнату. В воздухе пахнет чем-то странным.",
    choices: [
      { text: "Идти вперёд", effect: { energy: -1 }, next: 1 },
      { text: "Остаться на месте", effect: { morale: -1 }, next: 2 },
      { text: "Оглядеться", effect: {}, next: 3 }
    ]
  },
  {
    text: "Туман плотнее. Слышен шёпот...",
    choices: [
      { text: "Игнорировать шёпот", effect: { morale: -1 }, next: 3 },
      { text: "Следовать за шёпотом", effect: { energy: -1, morale: 1 }, next: 4 },
      { text: "Закрыть уши руками", effect: { energy: -1 }, next: 2 }
    ]
  },
  {
    text: "Вы нашли странный артефакт на полу.",
    choices: [
      { text: "Взять его", effect: { energy: -1, morale: 1 }, next: 4 },
      { text: "Оставить", effect: {}, next: 4 },
      { text: "Разбить", effect: { morale: -2 }, next: 4 }
    ]
  },
  {
    text: "Появилась фигура в тумане. Она что-то шепчет.",
    choices: [
      { text: "Слушать", effect: { morale: 1 }, next: 4 },
      { text: "Убежать", effect: { energy: -1 }, next: 4 },
      { text: "Напасть", effect: { health: -2 }, next: 4 }
    ]
  },
  {
    text: "Вы достигли конца уровня. Поздравляем!",
    choices: [
      { text: "Начать заново", effect: {}, next: 0 },
      { text: "Закончить игру", effect: {}, next: null },
      { text: "Повторить уровень", effect: {}, next: 0 }
    ]
  }
];

let currentEvent = 0;

// Отрисовка фона и индикаторов
function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.font = "16px Arial";
  ctx.fillText(`Жизни: ${player.health}`, 10, 20);
  ctx.fillText(`Энергия: ${player.energy}`, 10, 40);
  ctx.fillText(`Мораль: ${player.morale}`, 10, 60);
}

// Отображение события и кнопок
function showEvent() {
  const e = events[currentEvent];
  gameText.innerHTML = e.text;

  e.choices.forEach((c, i) => {
    buttons[i].style.display = c ? "inline-block" : "none";
    buttons[i].innerText = c ? c.text : "";
  });
}

// Применяем выбор игрока
function choose(index) {
  const choice = events[currentEvent].choices[index];
  if (!choice) return;

  // Применяем эффекты
  for (let key in choice.effect) {
    player[key] += choice.effect[key];
    if (player[key] < 0) player[key] = 0;
  }

  draw();

  // Проверка конца игры
  if (player.health <= 0 || player.energy <= 0 || player.morale <= 0) {
    alert("Вы не смогли выжить!");
    player = { health: 5, energy: 5, morale: 5 };
    currentEvent = 0;
  } else {
    currentEvent = choice.next !== null ? choice.next : 0;
  }

  showEvent();
}

// Обработчики кнопок
buttons.forEach((btn, i) => {
  btn.addEventListener("click", () => choose(i));
});

// Управление клавишами (1,2,3)
document.addEventListener("keydown", (e) => {
  if (e.key === "1") choose(0);
  if (e.key === "2") choose(1);
  if (e.key === "3") choose(2);
});

draw();
showEvent();
