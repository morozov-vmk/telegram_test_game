// Пример набора сцен
const scenes = {
  start: {
    background: "images/forest.png",
    sound: "sounds/sound.mp3",
    text: "Ты очнулся в лесу. Кажется, впереди тропинка. Что будешь делать?",
    choices: [
      { text: "Пойти по тропинке", next: "path" },
      { text: "Остаться и осмотреться", next: "look" }
    ]
  },
  path: {
    background: "images/road.png",
    sound: "sounds/sound.mp3",
    text: "Ты вышел на старую дорогу. Вдали виднеется деревня.",
    choices: [
      { text: "Идти в деревню", next: "village" },
      { text: "Вернуться в лес", next: "start" }
    ]
  },
  look: {
    background: "images/camp.png",
    sound: "sounds/sound.mp3",
    text: "Ты находишь рюкзак с едой. +10 к жизням.",
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
    choices: [
      { text: "Отказаться. Уйти из деревни", next: "start" },
      { text: "Пройти в дом", next: "home" }
    ]
  },
  home: {
    background: "images/home.png",
    text: "Вы вошли в дом. К Вам спиной стоит пожилой мужчина и тяжело дышит. Слева приоткрыта дверь в комнату",
    choices: [
      { text: "Спросить что-то у мужчины", next: "fatal" },
      { text: "Пройти в тёмную комнату", next: "room" }
    ]
  },
  fatal: {
    background: "images/fatal.png",
    text: "Вы потревожили перекожника, ваши часы сочтены, грибок вселяется в ваше тело",
    choices: [
      { text: "Начать сначала", next: "start" }
    ]
  },
  fatal_2: {
    background: "images/fatal_2.png",
    text: "Еда была заражена, ваши часы сочтены, грибок вселяется в ваше тело",
    choices: [
      { text: "Начать сначала", next: "start" }
    ]
  },
  happy_end: {
    background: "images/happy_end.png",
    text: "Пока что вам удалось избежать заражения, продолжение следует...",
    choices: [
      { text: "Начать сначала", next: "start" }
    ]
  },
  room: {
    background: "images/room.png",
    text: "Вы голодны. На столе лежат фрукты, пахнут грибами, из стены течёт смола с запахом рыбы. Вам нужно утолить голод",
    choices: [
      { text: "Съесть фрукты", next: "fatal_2" },
      { text: "Слизать смолу со стены", next: "happy_end" }
    ]
  }
};
let currentScene = null;
let health = 100;

function changeHealth(amount) {
  health = Math.min(100, Math.max(0, health + amount));
  document.getElementById("health").textContent = health;
}

function loadScene(name) {
  const scene = scenes[name];
  if (!scene) return;

  const game = document.getElementById("game");

  // 🔹 Этап 1: затемнение старой сцены
  game.classList.remove("fade-in");
  game.classList.add("fade-out");

  // ⏳ Ждём 700 мс (как transition в CSS), потом меняем контент
  setTimeout(() => {
    currentScene = scene;

    // фон
    document.getElementById("background").style.backgroundImage = `url(${scene.background})`;

    // текст
    typeText(document.getElementById("story"), scene.text);

    document.addEventListener('mousemove', e => {
      const bg = document.getElementById('background');
      const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
      bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    // звук
    const audio = document.getElementById("bgm");
    if (scene.sound) {
      audio.src = scene.sound;
      audio.play().catch(() => {});
    }

    // onEnter (доп. эффект при входе)
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

    // 🔹 Этап 2: проявление новой сцены
    game.classList.remove("fade-out");
    game.classList.add("fade-in");
  }, 700);
}

function typeText(element, text, speed = 30) {
  element.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Запускаем игру
window.onload = () => {
  loadScene("start");
};
