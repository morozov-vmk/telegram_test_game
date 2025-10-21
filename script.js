let is_def = 1;
let neighbors_knock = 0;
let window_knock = 0;

const scenes = {

  start: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Поздравляю! Тебе досталась бабушкина двушка на окраине города. Бабушка была очень заботлива, но куда-то пропала, и теперь ты новый владелец её жилья. В квартире мрачновато, но это же не помеха для тебя, правда? На ключах ты видишь брелок в виде матрёшки. Открутив голову, ты находишь небольшой листочек со списком правил:",
    choices: [
      {text: 'start', next: 'hallway'}
    ]
  },

  cupboard_empty: {
    background: "images/cupboard_empty.png",
    sound: "sounds/cubboard.mp3",
    text: "Шкаф-стенка пуста",
    choices: [
      { 
        text: "Отлично", 
        next: is_def === 1
          ? "living_room"
          : neighbors_knock === 1
            ? "living_room_neighbors_knock"
            : "living_room_window_knock"
      },
    ]
  },

  cupboard_fish: {
    background: "images/cupboard_fish.png",
    sound: "sounds/cubboard.mp3",
    text: "В шкаф-стенке сервиз с рыбами",
    choices: [
      { 
        text: "Понял", 
        next: is_def === 1
          ? "living_room"
          : neighbors_knock === 1
            ? "living_room_neighbors_knock"
            : "living_room_window_knock"
      },
    ]
  },

  cupboard_crystal: {
    background: "images/cupboard_crystal.png",
    sound: "sounds/cubboard.mp3",
    text: "В шкаф-стенке праздничный хрусталь",
    choices: [
      { 
        text: "Понял", 
        next: is_def === 1
          ? "living_room"
          : neighbors_knock === 1
            ? "living_room_neighbors_knock"
            : "living_room_window_knock"
      },
    ]
  },

  living_room: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты в гостиной. Всё тихо.",
    choices: [
      {text: 'Проверить шкаф-стенку', next: 'cupboard_empty'},
      {text: 'Посмотреть телевизор', next: 'tv_off'},
      {text: 'Выйти в коридор', next: 'hallway'},
    ]
  },

  living_room_neighbors_knock: {
    background: "images/living_room_neighbors_knock.png",
    sound: "sounds/living_room_neighbors_knock.mp3",
    text: "Ты в гостиной. Из прихожей слышен стук соседа.",
    choices: [
      
    ]
  },

  living_room_window_knock: {
    background: "images/living_room_window_knock.png",
    sound: "sounds/living_room_window_knock.mp3",
    text: "Ты в гостиной. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  living_room_pantry_door: {
    background: "images/living_room_pantry_door.png",
    sound: "sounds/living_room_pantry_door.mp3",
    text: "Ты в гостиной. Слышен скрип открывающейся кладовки.",
    choices: [
      
    ]
  },

  living_room_voise: {
    background: "images/living_room_voise.png",
    sound: "sounds/living_room_voise.mp3",
    text: "Голос говорит: 'Ночка не будет томной'.",
    choices: [
      
    ]
  },

  silhouettes: {
    background: "images/silhouettes.png",
    sound: "sounds/silhouettes.mp3",
    text: "За окном странные силуэты.",
    choices: [
      
    ]
  },

  tv_off: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Телевизор выключен.",
    choices: [
      {text: 'Включить на среднюю громкость', next: 'tv_medium'},
      {text: 'Включить на максимальную громкость', next: 'tv_maxi'},
      {text: 'Осмотреть гостиную', next: 'living_room'},
    ]
  },

  tv_off_pantry_door: {
    background: "images/tv_off_pantry_door.png",
    sound: "sounds/tv_off_pantry_door.mp3",
    text: "Телевизор выключен. Слышен скрип открывающейся кладовки.",
    choices: [
      
    ]
  },

  tv_medium: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Телевизор включён на среднюю громкость.",
    choices: [
      {text: 'Выключить', next: 'tv_off'},
    ]
  },

  tv_maxi: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Телевизор включён на максимальную громкость.",
    choices: [
      {text: 'Выключить', next: 'tv_off'},
    ]
  },

  hallway: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты в коридоре. Всё тихо.",
    choices: [
      {text: 'Пойти в комнату', next: 'room'},
      {text: 'Пойти на кухню', next: 'kitchen'},
      {text: 'Пойти в гостиную', next: 'living_room'},
      {text: 'Пойти в прихожую', next: 'vestibule'},
      {text: 'Пойти в туалет', next: 'toilet_off'},
    ]
  },

  hallway_neighbors_knock: {
    background: "images/hallway_neighbors_knock.png",
    sound: "sounds/hallway_neighbors_knock.mp3",
    text: "Ты в коридоре. Из прихожей слышен стук соседа.",
    choices: [
      
    ]
  },

  hallway_window_knock: {
    background: "images/hallway_window_knock.png",
    sound: "sounds/hallway_window_knock.mp3",
    text: "Ты в коридоре. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  room: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты в комнате. Всё тихо.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'},
      {text: 'Лечь спать', next: 'sleep'},
    ]
  },

  room_neighbors_knock: {
    background: "images/room_neighbors_knock.png",
    sound: "sounds/room_neighbors_knock.mp3",
    text: "Ты в комнате. Из прихожей слышен стук соседа.",
    choices: [
      
    ]
  },

  room_from_sleep_neighbors_knock: {
    background: "images/room_from_sleep_neighbors_knock.png",
    sound: "sounds/room_from_sleep_neighbors_knock.mp3",
    text: "Ты резко проснулся от стука соседа из прихожей.",
    choices: [
      
    ]
  },

  room_window_knock: {
    background: "images/room_window_knock.png",
    sound: "sounds/room_window_knock.mp3",
    text: "Ты в комнате. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  room_from_sleep_window_knock: {
    background: "images/room_from_sleep_window_knock.png",
    sound: "sounds/room_from_sleep_window_knock.mp3",
    text: "Ты резко проснулся от стука в окно.",
    choices: [
      
    ]
  },

  fridge_empty: {
    background: "images/fridge_empty.png",
    sound: "sounds/fridge_empty.mp3",
    text: "Холодильник пуст. Записка: 'Жаль, что не спрятался от меня в туалете, теперь ты останешься голодным.'",
    choices: [
      
    ]
  },

  fridge: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "В холодильнике есть еда.",
    choices: [
      {text: 'Закрыть', next: 'kitchen'},
    ]
  },

  kitchen: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты на кухне. Всё тихо.",
    choices: [
      {text: 'Поискать что-то поесть в холодильнике', next: 'fridge'},
      {text: 'Выйти в коридор', next: 'hallway'}
    ]
  },

  kitchen_neighbors_knock: {
    background: "images/kitchen_neighbors_knock.png",
    sound: "sounds/kitchen_neighbors_knock.mp3",
    text: "Ты на кухне. Из прихожей слышен стук соседа.",
    choices: [
      
    ]
  },

  kitchen_window_knock: {
    background: "images/kitchen_window_knock.png",
    sound: "sounds/kitchen_window_knock.mp3",
    text: "Ты на кухне. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  vestibule: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты в прихожей. Всё тихо.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'},
      {text: 'Посмотреть в глазок', next: 'peephole_empty'},
      {text: 'Выйти на лестничную клетку', next: 'stairwell'}
    ]
  },

  vestibule_neighbors_knock: {
    background: "images/vestibule_neighbors_knock.png",
    sound: "sounds/vestibule_neighbors_knock.mp3",
    text: "Ты в прихожей. Стучится сосед.",
    choices: [
      
    ]
  },

  vestibule_window_knock: {
    background: "images/vestibule_window_knock.png",
    sound: "sounds/vestibule_window_knock.mp3",
    text: "Ты в прихожей. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  toilet_off: {
    background: "images/toilet_off.png",
    sound: "sounds/toilet_off.mp3",
    text: "Ты в туалете. Всё тихо. Свет выключен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'}
    ]
  },

  toilet_on: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты в туалете. Всё тихо. Свет включен.",
    choices: [
      
    ]
  },

  toilet_off_neighbors_knock: {
    background: "images/toilet_off_neighbors_knock.png",
    sound: "sounds/toilet_off_neighbors_knock.mp3",
    text: "Ты в туалете. Из прихожей слышен стук соседа. Свет выключен.",
    choices: [
      
    ]
  },

  toilet_on_neighbors_knock: {
    background: "images/toilet_on_neighbors_knock.png",
    sound: "sounds/toilet_on_neighbors_knock.mp3",
    text: "Ты в туалете. Из прихожей слышен стук соседа. Свет включен.",
    choices: [
      
    ]
  },

  toilet_off_window_knock: {
    background: "images/toilet_off_window_knock.png",
    sound: "sounds/toilet_off_window_knock.mp3",
    text: "Ты в туалете. Слышен отчётливый стук в окно. Свет выключен.",
    choices: [
      
    ]
  },

  peephole_empty: {
    background: "images/peephole_empty.png",
    sound: "sounds/peephole_empty.mp3",
    text: "Ты смотришь в глазок. Никого не видно.",
    choices: [
      {text: 'Отойти от глазка', next: 'vestibule'}
    ]
  },

  peephole_window_knock: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты смотришь в глазок. Никого не видно. Слышен отчётливый стук в окно.",
    choices: [
      
    ]
  },

  peephole_neighbors_knock: {
    background: "images/peephole_neighbors_knock.png",
    sound: "sounds/peephole_neighbors_knock.mp3",
    text: "Ты смотришь в глазок. Сосед просит соли.",
    choices: [
      
    ]
  },

  stairwell: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты на лестничной клетке.",
    choices: [
      {text: 'Войти в квартиру', next: 'vestibule'},
      {text: 'Завершить', next: 'happy_end'}
    ]
  },

  sleep: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты cпишь.",
    choices: [
      {text: 'Проснуться', next: 'room'}
    ]
  },

  game_over_mind: {
    background: "images/game_over_mind.png",
    sound: "sounds/game_over_mind.mp3",
    text: "Ты не смог сохранить рассудок, ты сошёл с ума. Game over.",
    choices: [
      
    ]
  },

  game_over_hunger: {
    background: "images/game_over_hunger.png",
    sound: "sounds/game_over_hunger.mp3",
    text: "Ты погиб голодной смертью. Game over.",
    choices: [
      
    ]
  },

  game_over_axe: {
    background: "images/game_over_axe.png",
    sound: "sounds/game_over_axe.mp3",
    text: "На твою голову упал топор - подарок от ночного соседа. Game over.",
    choices: [
      
    ]
  },

  game_over_strangulation: {
    background: "images/game_over_strangulation.png",
    sound: "sounds/game_over_strangulation.mp3",
    text: "Сосед удушил тебя. Не стоило ему открывать дверь. Game over.",
    choices: [
      
    ]
  },

  happy_end: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Поздравляю! Ты смог продержаться сутки в бабушкиной двушке. Подписывайтесь на канал, 100 подписчиков - и мы выпустим локации 'лифт', 'подъезд', 'смена в макдоналдсе'",
    choices: [
      {text: 'Начать заново', next: 'start'}
    ]
  },

  
  
  
  
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
    document.getElementById("story").textContent = scene.text;

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