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
    text: "Староста рассказывает о древней тайне... Конец демо.",
    choices: [
      { text: "Начать сначала", next: "start" }
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
