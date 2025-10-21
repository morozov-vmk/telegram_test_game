// --- Игровое состояние ---
let gameState = {
    hour: 8,       // старт — 08:00 утра
    minute: 0,
    health: 100
  };

let is_def = 1;
let neighbors_knock = 0;
let window_knock = 0;
  
  // --- Сцены ---
  const scenes = {
    start: {
      background: "images/forest.png",
      sound: "sounds/sound.mp3",
      text: "Ты очнулся в лесу. Кажется, впереди тропинка. Что будешь делать?",
      onEnter: () => setTimeVisual(),
      choices: [
        { text: "Пойти по тропинке", next: "path" },
        { text: "Остаться и осмотреться", next: "look" }
      ]
    },
    path: {
      background: "images/road.png",
      sound: "sounds/sound.mp3",
      text: "Ты вышел на старую дорогу. Вдали виднеется деревня.",
      onEnter: () => addMinutes(30),
      choices: [
        { text: "Идти в деревню", next: "village" },
        { text: "Вернуться в лес", next: "start" }
      ]
    },
    look: {
      background: "images/camp.png",
      sound: "sounds/sound.mp3",
      text: "Ты находишь рюкзак с едой. +10 к здоровью.",
      onEnter: () => changeHealth(10),
      choices: [
        { text: "Пойти по тропинке", next: "path" }
      ]
    },
    village: {
      background: "images/village.png",
      sound: "sounds/sound.mp3",
      text: "Ты вошёл в деревню. Тебя приветствует староста.",
      choices: [
        { text: "Поговорить со старостой", next: "end" }
      ]
    },
    end: {
      background: "images/sunset.png",
      text: "Староста рассказывает о случившихся в деревне аномалиях, предлагает пройти в дом.",
      onEnter: () => addMinutes(120),
      choices: [
        { text: "Отказаться. Уйти из деревни", next: "start" },
        { text: "Пройти в дом", next: "home" }
      ]
    },
    home: {
      background: "images/home.png",
      text: "Вы вошли в дом. К вам спиной стоит пожилой мужчина и тяжело дышит. Слева приоткрыта дверь в комнату.",
      choices: [
        { text: "Спросить что-то у мужчины", next: "fatal" },
        { text: "Пройти в тёмную комнату", next: "room" }
      ]
    },
    fatal: {
      background: "images/fatal.png",
      text: "Вы потревожили перекожника, ваши часы сочтены, грибок вселяется в ваше тело.",
      choices: [
        { text: "Начать сначала", next: "start" }
      ]
    },
    fatal_2: {
      background: "images/fatal_2.png",
      text: "Еда была заражена, ваши часы сочтены, грибок вселяется в ваше тело.",
      choices: [
        { text: "Начать сначала", next: "start" }
      ]
    },
    happy_end: {
      background: "images/happy_end.png",
      text: "Пока что вам удалось избежать заражения. Продолжение следует...",
      choices: [
        { text: "Начать сначала", next: "start" }
      ]
    },
    room: {
      background: "images/room.png",
      text: "Вы голодны. На столе лежат фрукты, пахнут грибами. Вам нужно утолить голод.",
      choices: [
        { 
          text: "Съесть фрукты", 
          next: () => (Math.random() < 0.6 ? "fatal_2" : "happy_end") // 🎲 60% шанс заражения
        },
        { text: "Слизать смолу со стены", next: "happy_end" }
      ]
    }
  };
  
  // --- Время ---
  function addMinutes(mins) {
    gameState.minute += mins;
    while (gameState.minute >= 60) {
      gameState.minute -= 60;
      gameState.hour++;
    }
    if (gameState.hour >= 24) gameState.hour -= 24;
    updateClock();
    setTimeVisual();
  }
  
  function startClock() {
    setInterval(() => {
      addMinutes(1); // 1 сек = 1 минута
    }, 1000);
  }
  
  function updateClock() {
    const h = String(gameState.hour).padStart(2, "0");
    const m = String(gameState.minute).padStart(2, "0");
    document.getElementById("time").textContent = `${h}:${m}`;
  }
  
  // --- Изменение освещения по времени ---
  function setTimeVisual() {
    const bg = document.getElementById("background");
    const h = gameState.hour;
    if (h >= 6 && h < 12) bg.className = "morning";
    else if (h >= 12 && h < 18) bg.className = "day";
    else if (h >= 18 && h < 21) bg.className = "evening";
    else bg.className = "night";
  }
  
  // --- Здоровье ---
  function changeHealth(amount) {
    gameState.health = Math.min(100, Math.max(0, gameState.health + amount));
    document.getElementById("health").textContent = gameState.health;
    if (gameState.health <= 0) loadScene("fatal");
  }
  
  // --- Эффект печатающегося текста ---
  function typeText(element, text, speed = 25) {
    element.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }
  
  // --- Эффект фона ---
  document.addEventListener('mousemove', e => {
    const bg = document.getElementById('background');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
    bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  });
  
  // --- Логика загрузки сцен ---
  let currentScene = null;
  
  function loadScene(name) {
    const scene = scenes[name] || scenes[name()] || null;
    if (!scene) return;
  
    const game = document.getElementById("game");
    const storyEl = document.getElementById("story");
  
    game.classList.remove("fade-in");
    game.classList.add("fade-out");
  
    setTimeout(() => {
      currentScene = scene;
      document.getElementById("background").style.backgroundImage = `url(${scene.background})`;
  
      const audio = document.getElementById("bgm");
      if (scene.sound) {
        audio.src = scene.sound;
        audio.play().catch(() => {});
      }
  
      if (scene.onEnter) scene.onEnter();
  
      typeText(storyEl, scene.text);
  
      const choicesDiv = document.getElementById("choices");
      choicesDiv.innerHTML = "";
      scene.choices.forEach(choice => {
        const btn = document.createElement("div");
        btn.className = "choice";
        btn.textContent = choice.text;
        btn.onclick = () => {
          playClickSound();
          loadScene(typeof choice.next === "function" ? choice.next() : choice.next);
        };
        choicesDiv.appendChild(btn);
      });
  
      game.classList.remove("fade-out");
      game.classList.add("fade-in");
  
    }, 700);
  }
  
  // --- Звук клика ---
  function playClickSound() {
    const click = new Audio("sounds/click.mp3");
    click.volume = 0.3;
    click.play().catch(() => {});
  }
  
  // --- Запуск игры ---
  window.onload = () => {
    document.getElementById("health").textContent = gameState.health;
    updateClock();
    startClock();
    loadScene("start");
  };

  ###################

  // Игровое состояние
let currentScene = null;
let health = 100;
let food = 50;
let time = { hours: 8, minutes: 0 }; // Начало игры — 08:00 утра

// ----------------------------
// Вспомогательные функции
// ----------------------------
function changeHealth(amount) {
  health = Math.min(100, Math.max(0, health + amount));
  document.getElementById("health").textContent = health;
}

function changeFood(amount) {
  food = Math.min(100, Math.max(0, food + amount));
  document.getElementById("food").textContent = food;
}

function formatTime() {
  return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
}

function addMinutes(mins) {
  time.minutes += mins;
  while (time.minutes >= 60) {
    time.minutes -= 60;
    time.hours = (time.hours + 1) % 24;
  }
  document.getElementById("time").textContent = formatTime();
}

// ----------------------------
// Основная функция загрузки сцены
// ----------------------------
function loadScene(name) {
  const scene = scenes[name];
  if (!scene) return;

  currentScene = scene;
  document.getElementById("background").style.backgroundImage = `url(${scene.background})`;
  document.getElementById("story").textContent = scene.text;

  // звук
  const audio = document.getElementById("bgm");
  if (scene.sound) {
    audio.src = scene.sound;
    audio.play().catch(() => {});
  }

  // действия при входе
  if (scene.onEnter) scene.onEnter();

  // кнопки выбора
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  scene.choices.forEach(choice => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = choice.text;
    btn.onclick = () => loadScene(choice.next);
    choicesDiv.appendChild(btn);
  });
}

// ----------------------------
// Механика времени и событий
// ----------------------------
setInterval(() => {
  addMinutes(1); // каждая секунда = 1 минута

  // Немного убывает сытость со временем
  if (Math.random() < 0.1) changeFood(-1);

  // Смерть от голода
  if (food <= 0) {
    loadScene("fatal_hunger");
    return;
  }

  // Пример случайного события: ночью в лесу нападает зверь
  if (currentScene?.id === "start" && time.hours >= 22 && Math.random() < 0.05) {
    loadScene("wolf_attack");
  }

}, 1000); // обновление каждую секунду

// ----------------------------
// Пример набора сцен
// ----------------------------
const scenes = {
  start: {
    id: "start",
    background: "images/forest.png",
    sound: "sounds/sound.mp3",
    text: "Ты очнулся в лесу. Солнце садится, становится прохладно.",
    choices: [
      { text: "Пойти по тропинке", next: "path" },
      { text: "Развести костёр", next: "camp" }
    ]
  },

  camp: {
    background: "images/camp.png",
    text: "Ты развёл костёр. Согрелся и немного отдохнул.",
    onEnter: () => {
      changeHealth(+5);
      changeFood(-5);
    },
    choices: [
      { text: "Пойти по тропинке", next: "path" },
      { text: "Остаться у костра", next: "camp_sleep" }
    ]
  },

  camp_sleep: {
    background: "images/night.png",
    text: "Ты задремал у костра...",
    onEnter: () => {
      addMinutes(60);
      if (Math.random() < 0.3) {
        loadScene("wolf_attack");
      } else {
        changeHealth(+10);
      }
    },
    choices: [
      { text: "Проснуться", next: "start" }
    ]
  },

  path: {
    id: "path",
    background: "images/road.png",
    text: "Ты вышел на старую дорогу. Солнце уже клонится к закату.",
    onEnter: () => addMinutes(15),
    choices: [
      { text: "Идти дальше", next: "village" },
      { text: "Вернуться в лес", next: "start" }
    ]
  },

  village: {
    background: "images/village.png",
    text: "Ты пришёл в деревню. На площади кто-то поёт.",
    onEnter: () => changeFood(+10),
    choices: [
      { text: "Зайти в таверну", next: "happy_end" }
    ]
  },

  wolf_attack: {
    background: "images/wolf.png",
    text: "На тебя напал волк! Ты получил ранения.",
    onEnter: () => changeHealth(-40),
    choices: [
      { text: "Бежать!", next: "path" }
    ]
  },

  fatal_hunger: {
    background: "images/fatal.png",
    text: "Ты умер от голода. Игра окончена.",
    choices: [
      { text: "Начать сначала", next: "start" }
    ]
  },

  happy_end: {
    background: "images/happy_end.png",
    text: "Ты выжил и нашёл приют в деревне. Пока что всё хорошо...",
    choices: [
      { text: "Начать сначала", next: "start" }
    ]
  }
};

// ----------------------------
// Старт игры
// ----------------------------
window.onload = () => {
  document.getElementById("time").textContent = formatTime();
  document.getElementById("health").textContent = health;
  document.getElementById("food").textContent = food;
  loadScene("start");
};


################

const scenes = {
    start: {
      id: "start",
      background: "images/forest.png",
      sound: "sounds/sound.mp3",
      text: "Ты очнулся в лесу. Солнце садится, становится прохладно.",
      choices: [
        { text: "Пойти по тропинке", next: "path" },
        { text: "Развести костёр", next: "camp" }
      ],
      // Через 10 минут на тебя нападёт волк, если не ушёл
      delayedEvents: [
        { after: 10, action: () => loadScene("wolf_attack") }
      ]
    },
  
    camp: {
      id: "camp",
      background: "images/camp.png",
      text: "Ты развёл костёр. Согрелся и немного отдохнул.",
      onEnter: () => {
        changeHealth(+5);
        changeFood(-5);
      },
      choices: [
        { text: "Пойти по тропинке", next: "path" },
        { text: "Остаться у костра", next: "camp_sleep" }
      ],
      // Через 20 минут костёр потухнет, и будет шанс нападения
      delayedEvents: [
        {
          after: 20,
          action: () => {
            if (Math.random() < 0.3) loadScene("wolf_attack");
            else document.getElementById("story").textContent += "\nКостёр почти погас...";
          }
        }
      ]
    },
  
    wolf_attack: {
      background: "images/wolf.png",
      text: "На тебя напал волк! Ты получил ранения.",
      onEnter: () => changeHealth(-40),
      choices: [{ text: "Бежать!", next: "path" }]
    },
  
    path: {
      id: "path",
      background: "images/road.png",
      text: "Ты вышел на старую дорогу. Солнце клонится к закату.",
      onEnter: () => addMinutes(15),
      choices: [
        { text: "Идти дальше", next: "village" },
        { text: "Вернуться в лес", next: "start" }
      ]
    },
  
    fatal_hunger: {
      background: "images/fatal.png",
      text: "Ты умер от голода.",
      choices: [{ text: "Начать сначала", next: "start" }]
    }
  };
####
  
  { after: 15, action: () => { if (Math.random() < 0.2) loadScene("rain"); } }

#####

