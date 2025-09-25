const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameText = document.getElementById("gameText");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const buttons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3")
];

let gameStarted = false;
let neighborTimer = null;

// Игрок
let player = {
  health: 3,
  sleep: 5,
  safety: 100
};

let hour = 19;
let minute = 0;

// События
const events = [
  {
    id: "midnight_steps",
    check: () => hour >= 0 && hour < 1,
    text: "Слышны тяжелые шаги рядом с вашей комнатой!",
    choices: [
      { text: "Накрыться одеялом", effect: { safety: 0 }, success: "Вы пережили ночь." },
      { text: "Игнорировать", effect: { health: -1 }, success: "Страх ударил по здоровью!" },
      { text: "Выйти из комнаты", effect: { health: -3 }, success: "Вы были пойманы! Конец игры." }
    ],
    flash: true
  },
  {
    id: "tv_whisper",
    check: () => Math.random() < 0.3,
    text: "Бабушка смотрит белый шум и шепчет!",
    choices: [
      { text: "Закрыться в ванной", effect: { safety: 0 }, success: "Вы переждали шум." },
      { text: "Игнорировать", effect: { health: -1 }, success: "Стресс, здоровье -1" },
      { text: "Подойти", effect: { health: -2 }, success: "Бабушка рассердилась, здоровье -2" }
    ]
  },
  {
    id: "bath_moo",
    check: () => hour >= 20 && hour < 21,
    text: "Слышно странное мычание из ванной!",
    choices: [
      { text: "Подпереть дверь", effect: { safety: -36 }, success: "Ночные происшествия уменьшены." },
      { text: "Игнорировать", effect: { health: -1 }, success: "Вы испугались, здоровье -1" },
      { text: "Открыть дверь", effect: { health: -3 }, success: "Что-то напало, здоровье -3!" }
    ]
  },
  {
    id: "offer_food",
    check: () => Math.random() < 0.2,
    text: "Бабушка предлагает пирог или чай.",
    choices: [
      { text: "Принять и спрятать", effect: { safety: -36 }, success: "Ночные происшествия уменьшены." },
      { text: "Отказаться", effect: { health: -1 }, success: "Обидели бабушку, здоровье -1" },
      { text: "Съесть", effect: { health: -2 }, success: "Еда странная, здоровье -2" }
    ]
  },
  {
    id: "neighbor_stand",
    check: () => Math.random() < 0.1,
    text: "Соседка стоит в комнате спиной к вам! 30 секунд чтобы уйти.",
    choices: [
      { text: "Уйти быстро", effect: {}, success: "Вы выбежали вовремя!" },
      { text: "Остаться", effect: { health: -3 }, success: "Соседка заметила вас! Конец игры." },
      { text: "Попытаться поговорить", effect: { health: -2 }, success: "Соседка рассердилась, здоровье -2" }
    ],
    timer: 30
  }
];

// Отрисовка состояния
function draw(flash = false) {
  if (flash) {
    ctx.fillStyle = `rgb(${Math.random()*255},0,0)`;
  } else {
    ctx.fillStyle = "#222";
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.font = "16px Arial";
  ctx.fillText(`Здоровье: ${player.health}`, 10, 20);
  ctx.fillText(`Сон: ${player.sleep}`, 10, 40);
  ctx.fillText(`Безопасность: ${player.safety}%`, 10, 60);
  ctx.fillText(`Время: ${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}`, 10, 80);
}

// Показ события
function showEvent(e) {
  draw(e.flash);
  gameText.innerHTML = e.text;
  buttons.forEach((b, idx) => {
    const choice = e.choices[idx];
    if (choice) {
      b.style.display = "inline-block";
      b.innerText = choice.text;
      b.onclick = () => {
        for (let key in choice.effect) {
          player[key] += choice.effect[key];
          if (player[key] < 0) player[key] = 0;
        }
        alert(choice.success);
        if (e.id === "neighbor_stand" && neighborTimer) {
          clearTimeout(neighborTimer);
          neighborTimer = null;
        }
        nextTurn();
      };
    } else {
      b.style.display = "none";
    }
  });

  if (e.timer) {
    neighborTimer = setTimeout(() => {
      alert("Время вышло! Соседка заметила вас. Конец игры.");
      resetGame();
    }, e.timer * 1000);
  }
}

// Логика игры
function nextTurn() {
  minute += 10;
  if (minute >= 60) {
    minute = 0;
    hour++;
    if (hour >= 24) hour = 0;
  }

  draw();

  if (player.health <= 0) {
    alert("Вы не выжили!");
    resetGame();
    return;
  }

  const possibleEvents = events.filter(ev => ev.check());
  if (possibleEvents.length > 0) {
    const e = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    showEvent(e);
  } else {
    gameText.innerHTML = "В квартире тихо. Ждите следующего события...";
    buttons.forEach(b => b.style.display = "none");
    setTimeout(nextTurn, 1000);
  }
}

// Сброс игры
function resetGame() {
  player = { health: 3, sleep: 5, safety: 100 };
  hour = 19;
  minute = 0;
  draw();
  startScreen.style.display = "block";
}

// Запуск игры
startBtn.onclick = () => {
  startScreen.style.display = "none";
  gameStarted = true;
  draw();
  nextTurn();
};

// Клавиши 1,2,3
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  if (e.key === "1") buttons[0].click();
  if (e.key === "2") buttons[1].click();
  if (e.key === "3") buttons[2].click();
});

draw();
