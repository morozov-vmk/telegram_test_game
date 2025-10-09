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

  currentScene = scene;

  // фон
  document.getElementById("background").style.backgroundImage = `url(${scene.background})`;

  // текст
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

// Запускаем игру
window.onload = () => {
  loadScene("start");
};
