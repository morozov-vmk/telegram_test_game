let game_over = 0;
let future_axe = 0;
let scare = 0;
let emp_fr = 0;
let clockInterval = null;
let examinate = 0;
let type_capboard = 0;
let in_flat = 1;
let start_scare_scene = null;
let old_scene = null;


let currentScene = null;
let currentScenename = null;
let health = 100;

let gameState = {
  hour: 19,
  minute: 0,
  was_neighbor: 0,
  neighbors_knock: 0,
  neighborEventMinute: null,
  window_knock: 0,
  was_window: 0,
  windowEventMinute: null,
  pantry: 0,
  was_pantry: 0,
  pantryEventMinute: null,
};

const scenes = {

  start: {
    background: "images/start.png",
    sound: "sounds/def.mp3",
    text: "Поздравляю! Тебе досталась бабушкина двушка на окраине города. Бабушка была очень заботлива, но куда-то пропала, и теперь ты новый владелец её жилья. В квартире мрачновато, но это же не помеха для тебя, правда? На ключах ты видишь брелок в виде матрёшки. Открутив голову, ты находишь небольшой листочек со списком правил:",
    text: [
      "Поздравляю! Тебе досталась бабушкина двушка на окраине города. Бабушка была очень заботлива, но куда-то пропала, и теперь ты новый владелец её жилья. В квартире мрачновато, но это же не помеха для тебя, правда? На ключах ты видишь брелок в виде матрёшки. Открутив голову, ты находишь небольшой листочек со списком правил:",
      "1. Каждое воскресенье ближе к полуночи приходит человек, который представляется как сосед и просит соли. Ни в коем случае не открывай дверь и не отвечай, смотри на него в глазок пока не скроется в соседней квартире, в которой 10 лет никто не живет.",
      "2. Если услышишь, как открывается дверь кладовки, то немедленно включи телевизор на максимальную громкость и не отводи взгляда от передачи. Тебе может показаться, что кто-то ходит по дому и даже заходит в комнату, но ты должен будешь глядеть в телевизор несмотря ни на что. Как только дверь кладовки закроется, ты можешь вернуться к своим делам.",
      "3. Раз в неделю в 01:33 ночи ты услышишь стук в окно. Не забывай закрывать занавески на ночь. Как только это произойдет, то сразу закройся в туалете, не включая свет. Стук пройдет ровно через 7 минут в 01:40.",
      "4. Держи шкаф стенку пустой и проверяй его каждый день в восемь утра. Если ты заметишь, что там появился сервиз с рыбами, немедленно покинь квартиру минимум на полчаса. Но если там появляется праздничный хрусталь, ни в коем случае не возвращайся в течение двух часов."
    ].join('\n'),
    choices: [
      {text: 'start', next: 'hallway'}
    ]
  },

  cupboard_empty: {
    background: "images/cupboard_empty.png",
    sound: "sounds/def.mp3",
    text: "Шкаф-стенка пуста",
    choices: [
      {text: 'Осмотреть гостиную', next: 'living_room'},
    ],
    onEnter: () => {
      examinate = 1;
    }
  },

  cupboard_empty_neighbors_knock: {
    background: "images/cupboard_empty.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Шкаф-стенка пуста. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Осмотреть гостиную', next: 'living_room_neighbors_knock'},
    ],
    onEnter: () => {
      examinate = 1;
    }
  },

  cupboard_empty_window_knock: {
    background: "images/cupboard_empty.png",
    sound: "sounds/window_knock.mp3",
    text: "Шкаф-стенка пуста. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Осмотреть гостиную', next: 'living_room_window_knock'},
    ],
    onEnter: () => {
      examinate = 1;
    }
  },

  cupboard_fish: {
    background: "images/cupboard_fish.png",
    sound: "sounds/def.mp3",
    text: "В шкаф-стенке сервиз с рыбами",
    choices: [
      {text: 'Осмотреть гостиную', next: 'living_room'},
    ],
    onEnter: () => {
      examinate = 1;
    }
  },

  cupboard_crystal: {
    background: "images/cupboard_crystal.png",
    sound: "sounds/def.mp3",
    text: "В шкаф-стенке праздничный хрусталь",
    choices: [
      {text: 'Осмотреть гостиную', next: 'living_room'},
    ],
    onEnter: () => {
      examinate = 1;
    }
  },

  living_room: {
    background: "images/living_room.png",
    sound: "sounds/def.mp3",
    text: "Ты в гостиной. Всё тихо.",
    choices: [
      {text: 'Посмотреть телевизор', next: 'tv_off'},
      {
        text: 'Проверить шкаф-стенку',
        next: function() {
          switch(type_capboard) {
            case 2: return 'cupboard_crystal';
            case 1: return 'cupboard_fish';
            default: return 'cupboard_empty';
          }
        }
      },
      {text: 'Выйти в коридор', next: 'hallway'},
    ]
  },

  living_room_neighbors_knock: {
    background: "images/living_room.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в гостиной. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Проверить шкаф-стенку', next: 'cupboard_empty_neighbors_knock'},
      {text: 'Посмотреть телевизор', next: 'tv_off_neighbors_knock'},
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'},
    ]
  },

  living_room_window_knock: {
    background: "images/living_room.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в гостиной. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Проверить шкаф-стенку', next: 'cupboard_empty_window_knock'},
      {text: 'Посмотреть телевизор', next: 'tv_off_window_knock'},
      {text: 'Выйти в коридор', next: 'hallway_window_knock'},
    ]
  },

  living_room_pantry_door: {
    background: "images/living_room.png",
    sound: "sounds/pantry_door.mp3",
    text: "Ты в гостиной. Слышен скрип открывающейся кладовки.",
    choices: [
      {text: 'Проверить шкаф-стенку', next: 'cupboard_empty'},
      {text: 'Посмотреть телевизор', next: 'tv_off_pantry_door'},
      {text: 'Выйти в коридор', next: 'hallway'},
    ]
  },


  tv_off: {
    background: "images/tv_off.png",
    sound: "sounds/def.mp3",
    text: "Телевизор выключен.",
    choices: [
      {text: 'Включить на среднюю громкость', next: 'tv_medium'},
      {text: 'Включить на максимальную громкость', next: 'tv_maxi'},
      {text: 'Осмотреть гостиную', next: 'living_room'},
    ]
  },

  tv_off_neighbors_knock: {
    background: "images/tv_off.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Телевизор выключен. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Включить на среднюю громкость', next: 'tv_medium_neighbors_knock'},
      {text: 'Включить на максимальную громкость', next: 'tv_maxi_neighbors_knock'},
      {text: 'Осмотреть гостиную', next: 'living_room_neighbors_knock'},
    ]
  },

  tv_off_window_knock: {
    background: "images/tv_off.png",
    sound: "sounds/window_knock.mp3",
    text: "Телевизор выключен. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Включить на среднюю громкость', next: 'tv_medium_window_knock'},
      {text: 'Включить на максимальную громкость', next: 'tv_maxi_window_knock'},
      {text: 'Осмотреть гостиную', next: 'living_room_window_knock'},
    ]
  },

  tv_off_pantry_door: {
    background: "images/tv_off.png",
    sound: "sounds/pantry_door.mp3",
    text: "Телевизор выключен. Слышен скрип открывающейся кладовки.",
    choices: [
      {text: 'Включить на среднюю громкость', next: 'tv_medium_pantry_door'},
      {text: 'Включить на максимальную громкость', next: 'tv_maxi_pantry_door'},
      {text: 'Осмотреть гостиную', next: 'living_room_pantry_door'},
    ]
  },

  tv_medium_pantry_door: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на среднюю громкость. Слышен скрип открывающейся кладовки.",
    choices: [
      {text: 'Выключить', next: 'tv_off_pantry_door'},
    ]
  },

  tv_maxi_pantry_door: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на максимальную громкость. Слышен скрип открывающейся кладовки.",
    choices: [
      {text: 'Выключить', next: 'tv_off_pantry_door'},
    ]
  },

  tv_medium: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на среднюю громкость.",
    choices: [
      {text: 'Выключить', next: 'tv_off'},
    ]
  },

  tv_medium_neighbors_knock: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на среднюю громкость. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Выключить', next: 'tv_off_neighbors_knock'},
    ]
  },

  tv_medium_window_knock: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на среднюю громкость. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Выключить', next: 'tv_off_window_knock'},
    ]
  },

  tv_maxi: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на максимальную громкость.",
    choices: [
      {text: 'Выключить', next: 'tv_off'},
    ]
  },

  tv_maxi_neighbors_knock: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на максимальную громкость. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Выключить', next: 'tv_off_neighbors_knock'},
    ]
  },

  tv_maxi_window_knock: {
    background: "images/tv_on.png",
    sound: "sounds/tv.mp3",
    text: "Телевизор включён на максимальную громкость. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Выключить', next: 'tv_off_window_knock'},
    ]
  },

  hallway: {
    background: "images/hallway.png",
    sound: "sounds/def.mp3",
    text: "Ты в коридоре. Всё тихо.",
    choices: [
      {text: 'Пойти в комнату', next: 'room'},
      {text: 'Пойти на кухню', next: 'kitchen'},
      {text: 'Пойти в гостиную', next: 'living_room'},
      {text: 'Пойти в прихожую', next: 'vestibule'},
      {text: 'Пойти в туалет, не включая свет', next: 'toilet_off'},
      {text: 'Пойти в туалет, включить свет', next: 'toilet_on'},
    ]
  },

  hallway_neighbors_knock: {
    background: "images/hallway.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в коридоре. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Пойти в комнату', next: 'room_neighbors_knock'},
      {text: 'Пойти на кухню', next: 'kitchen_neighbors_knock'},
      {text: 'Пойти в гостиную', next: 'living_room_neighbors_knock'},
      {text: 'Пойти в прихожую', next: 'vestibule_neighbors_knock'},
      {text: 'Пойти в туалет, не включая свет', next: 'toilet_off_neighbors_knock'},
      {text: 'Пойти в туалет, включить свет', next: 'toilet_on_neighbors_knock'},
    ]
  },

  hallway_window_knock: {
    background: "images/hallway.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в коридоре. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Пойти в комнату', next: 'room_window_knock'},
      {text: 'Пойти на кухню', next: 'kitchen_window_knock'},
      {text: 'Пойти в гостиную', next: 'living_room_window_knock'},
      {text: 'Пойти в прихожую', next: 'vestibule_window_knock'},
      {text: 'Пойти в туалет, не включая свет', next: 'toilet_off_window_knock'},
      {text: 'Пойти в туалет, включить свет', next: 'toilet_on_window_knock'},
    ]
  },

  room: {
    background: "images/room.png",
    sound: "sounds/def.mp3",
    text: "Ты в комнате. Всё тихо.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'},
      {text: 'Лечь спать', next: 'sleep'},
    ]
  },

  room_neighbors_knock: {
    background: "images/room.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в комнате. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'}
    ]
  },

  room_from_sleep_neighbors_knock: {
    background: "images/room.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты резко проснулся от стука соседа из прихожей.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'}
    ]
  },

  room_window_knock: {
    background: "images/room.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в комнате. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_window_knock'}
    ]
  },

  room_from_sleep_window_knock: {
    background: "images/room.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты резко проснулся от стука в окно.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_window_knock'}
    ]
  },

  room_from_sleep_scare: {
    background: "images/room.png",
    sound: "sounds/def.mp3",
    text: "Ты резко проснулся от странных силуэтов за окном.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'},
      {text: 'Лечь спать', next: 'sleep'},
    ]
  },

  fridge_empty: {
    background: "images/fridge_empty.png",
    sound: "sounds/def.mp3",
    text: "Холодильник пуст. Записка: 'Жаль, что не спрятался от меня в туалете, теперь ты останешься голодным.'",
    choices: [
      {text: 'Закрыть', next: 'kitchen'},
    ]
  },

  fridge: {
    background: "images/fridge.png",
    sound: "sounds/def.mp3",
    text: "В холодильнике есть еда.",
    choices: [
      {text: 'Закрыть', next: 'kitchen'},
    ]
  },

  

  fridge_neighbors_knock: {
    background: "images/fridge.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "В холодильнике есть еда. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Закрыть', next: 'kitchen_neighbors_knock'},
    ]
  },


  fridge_window_knock: {
    background: "images/fridge.png",
    sound: "sounds/window_knock.mp3",
    text: "В холодильнике есть еда. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Закрыть', next: 'kitchen_window_knock'},
    ]
  },

  kitchen: {
    background: "images/kitchen.png",
    sound: "sounds/def.mp3",
    text: "Ты на кухне. Всё тихо.",
    choices: [
      {
        text: 'Поискать что-то поесть в холодильнике',
        next: function() {
          switch(emp_fr) {
            case 1: return 'fridge_empty';
            default: return 'fridge';
          }
        }
      },
      {text: 'Выйти в коридор', next: 'hallway'}
    ]
  },

  kitchen_neighbors_knock: {
    background: "images/kitchen.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты на кухне. Из прихожей слышен стук соседа.",
    choices: [
      {text: 'Поискать что-то поесть в холодильнике', next: 'fridge_neighbors_knock'},
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'}
    ]
  },

  kitchen_window_knock: {
    background: "images/kitchen.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты на кухне. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Поискать что-то поесть в холодильнике', next: 'fridge_window_knock'},
      {text: 'Выйти в коридор', next: 'hallway_window_knock'}
    ]
  },

  vestibule: {
    background: "images/vestibule.png",
    sound: "sounds/def.mp3",
    text: "Ты в прихожей. Всё тихо.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'},
      {text: 'Посмотреть в глазок', next: 'peephole'},
      {text: 'Выйти на лестничную клетку', next: 'stairwell'}
    ],
    onEnter: () => {
      in_flat = 1;
    }
  },

  vestibule_neighbors_knock: {
    background: "images/vestibule.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в прихожей. Стучится сосед.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'},
      {text: 'Посмотреть в глазок', next: 'peephole_neighbors_knock'},
      {text: 'Выйти на лестничную клетку', next: 'game_over_strangulation'}
    ],
    onEnter: () => {
      in_flat = 1;
    }
  },

  vestibule_window_knock: {
    background: "images/vestibule.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в прихожей. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_window_knock'},
      {text: 'Посмотреть в глазок', next: 'peephole_window_knock'},
      {text: 'Выйти на лестничную клетку', next: 'stairwell_window_knock'}
    ],
    onEnter: () => {
      in_flat = 1;
    }
  },

  toilet_off: {
    background: "images/toilet_off.png",
    sound: "sounds/def.mp3",
    text: "Ты в туалете. Всё тихо. Свет выключен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'}
    ]
  },

  toilet_on: {
    background: "images/toilet_on.png",
    sound: "sounds/def.mp3",
    text: "Ты в туалете. Всё тихо. Свет включен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway'}
    ]
  },

  toilet_off_neighbors_knock: {
    background: "images/toilet_off.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в туалете. Из прихожей слышен стук соседа. Свет выключен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'}
    ]
  },

  toilet_on_neighbors_knock: {
    background: "images/toilet_on.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты в туалете. Из прихожей слышен стук соседа. Свет включен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_neighbors_knock'}
    ]
  },

  toilet_on_window_knock: {
    background: "images/toilet_on.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в туалете. Слышен отчётливый стук в окно. Свет включен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_window_knock'}
    ]
  },

  toilet_off_window_knock: {
    background: "images/toilet_off.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты в туалете. Слышен отчётливый стук в окно. Свет выключен.",
    choices: [
      {text: 'Выйти в коридор', next: 'hallway_window_knock'}
    ]
  },

  peephole: {
    background: "images/peephole.png",
    sound: "sounds/def.mp3",
    text: "Ты смотришь в глазок. Никого не видно.",
    choices: [
      {text: 'Отойти от глазка', next: 'vestibule'}
    ]
  },

  peephole_window_knock: {
    background: "images/peephole.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты смотришь в глазок. Никого не видно. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Отойти от глазка', next: 'vestibule_window_knock'}
    ]
  },

  peephole_neighbors_knock: {
    background: "images/peephole_neighbors_knock.png",
    sound: "sounds/neighbors_knock.mp3",
    text: "Ты смотришь в глазок. Сосед просит соли.",
    choices: [
      {text: 'Отойти от глазка', next: 'vestibule_neighbors_knock'}
    ]
  },

  stairwell: {
    background: "images/stairwell.png",
    sound: "sounds/def.mp3",
    text: "Ты на лестничной клетке.",
    choices: [
      {text: 'Войти в квартиру', next: 'vestibule'}
    ],
    onEnter: () => {
      in_flat = 0;
    }
  },

  stairwell_window_knock: {
    background: "images/stairwell.png",
    sound: "sounds/window_knock.mp3",
    text: "Ты на лестничной клетке. Слышен отчётливый стук в окно.",
    choices: [
      {text: 'Войти в квартиру', next: 'vestibule_window_knock'}
    ],
    onEnter: () => {
      in_flat = 0;
    }
  },

  sleep: {
    background: "images/toilet_off.png",
    sound: "sounds/sleep.mp3",
    text: "Ты cпишь.",
    choices: [
      {text: 'Проснуться', next: 'room'}
    ]
  },

  game_over_mind: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты не смог сохранить рассудок, ты сошёл с ума. Game over.",
    choices: [
      {text: 'Начать сначала', next: 'start'}
    ]
  },

  game_over_hunger: {
    background: "images/village.png",
    sound: "sounds/sound.mp3",
    text: "Ты погиб голодной смертью. Game over.",
    choices: [
      {text: 'Начать сначала', next: 'start'}
    ]
  },

  game_over_axe: {
    background: "images/game_over_axe.png",
    sound: "sounds/game_over_axe.mp3",
    text: "На твою голову упал топор - подарок от ночного соседа. Game over.",
    choices: [
      {text: 'Начать сначала', next: 'start'}
    ]
  },

  game_over_strangulation: {
    background: "images/game_over_strangulation.png",
    sound: "sounds/game_over_strangulation.mp3",
    text: "Сосед удушил тебя. Не стоило ему открывать дверь. Game over.",
    choices: [
      {text: 'Начать сначала', next: 'start'}
    ]
  },

  game_over_roof: {
    background: "images/game_over_roof.png",
    sound: "sounds/game_over_roof.mp3",
    text: "На тебя обрушился потолок. Ты забыл о правиле про шкаф-стенку. Game over.",
    choices: [
      {text: 'Начать сначала', next: 'start'}
    ]
  },

  scare_scene: {
    background: "images/scare_scene.png",
    sound: "sounds/scare_scene.mp3",
    text: "Ночка перестаёт быть томной",
    choices: [
    ]
  },

  happy_end: {
    background: "images/start.png",
    sound: "sounds/start.mp3",
    text: "Поздравляю! Ты смог продержаться сутки в бабушкиной двушке. Подписывайтесь на канал, 100 подписчиков - и мы выпустим локации 'лифт', 'подъезд', 'смена в макдоналдсе'",
    choices: [
      {text: 'Начать заново', next: 'start'}
    ]
  },

  
  
  
  
};




function changeHealth(amount) {
  health = Math.min(100, Math.max(0, health + amount));
  document.getElementById("health").textContent = health;
}

function loadScene(name) {
  const scene = scenes[name];
  if (!scene) return;
  if (name === 'start') {
    game_over = 0;
    future_axe = 0;
    scare = 0;
    clockInterval = null;
    examinate = 0;
    type_capboard = 0;
    in_flat = 1;
    emp_fr = 0;
    start_scare_scene = null;
    old_scene = null;


    currentScene = null;
    currentScenename = null;
    health = 100;

    gameState = {
      hour: 19,
      minute: 0,
      was_neighbor: 0,
      neighbors_knock: 0,
      neighborEventMinute: null,
      window_knock: 0,
      was_window: 0,
      windowEventMinute: null,
      pantry: 0,
      was_pantry: 0,
      pantryEventMinute: null,
    };
  }

  const game = document.getElementById("game");

  // 🔹 Этап 1: затемнение старой сцены
  game.classList.remove("fade-in");
  game.classList.add("fade-out");

  // ⏳ Ждём 700 мс (как transition в CSS), потом меняем контент
  setTimeout(() => {
    currentScene = scene;
    currentScenename = name;

    // фон
    document.getElementById("background").style.backgroundImage = `url(${scene.background})`;

    // текст
    document.getElementById("story").textContent = scene.text;

    

    // звук
    const audio = document.getElementById("bgm");
    if (scene.sound) {
      audio.src = scene.sound;
      audio.loop = true;
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
      const nextScene = typeof choice.next === 'function' ? choice.next() : choice.next;
      btn.onclick = () => loadScene(nextScene);
      choicesDiv.appendChild(btn);
    });

    // 🔹 Этап 2: проявление новой сцены
    game.classList.remove("fade-out");
    game.classList.add("fade-in");
  }, 700);
}


function addMinutes(mins) {
  gameState.minute += mins;
  while (gameState.minute >= 60) {
    gameState.minute -= 60;
    gameState.hour++;
  }
  if (gameState.hour >= 24) gameState.hour -= 24;
  updateClock();
  maybeTriggerNeighborKnock();
  maybeTriggerWindowKnock();
  maybeTriggerCupboard();
  maybeTriggerPantry();
  maybeTriggerScare();
  maybeTriggerAxe()
}

function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => addMinutes(1), 1000);
}

function updateClock() {
  const h = String(gameState.hour).padStart(2, "0");
  const m = String(gameState.minute).padStart(2, "0");
  document.getElementById("time").textContent = `${h}:${m}`;
}


function maybeTriggerNeighborKnock() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (game_over == 0 && gameState.neighbors_knock === 1 && gameState.hour * 60 + gameState.minute < 23 * 60 + 30) {
    if (currentScenename === 'room_from_sleep_neighbors_knock') {
      loadScene('room');
      future_axe = 1;
    }
    if (currentScenename === 'room_from_sleep_scare') {
      loadScene('room');
      future_axe = 1;
    }
    else if (currentScenename === 'peephole_neighbors_knock') {
      loadScene(currentScenename.slice(0, -16));
    }
    else {
      loadScene(currentScenename.slice(0, -16));
      future_axe = 1;
    }
  }
  if (gameState.was_neighbor === 0) {
    const time = gameState.hour * 60 + gameState.minute;

    if (gameState.neighborEventMinute === null && game_over === 0) {
      gameState.neighborEventMinute = 23 * 60 + (30 + Math.floor(Math.random() * 30));
    }

    if (time >= gameState.neighborEventMinute) {
      gameState.neighbors_knock = 1;
      gameState.was_neighbor = 1;
      if (currentScenename === 'start') {
        loadScene('hallway_neighbors_knock')
      } else if (currentScenename === 'stairwell') {
        loadScene('game_over_strangulation')
      } else if (currentScenename === 'sleep') {
        loadScene('room_from_sleep_neighbors_knock')
      } else {
        loadScene(currentScenename + "_neighbors_knock")
      }

    }
  }
}

function maybeTriggerWindowKnock() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (game_over == 0 && gameState.window_knock === 1 && gameState.hour * 60 + gameState.minute === 1 * 60 + 40) {
    if (currentScenename === 'room_from_sleep_window_knock') {
      loadScene('room');
      emp_fr = 1;
    }
    else if (currentScenename === 'toilet_off_window_knock') {
      loadScene(currentScenename.slice(0, -13));
    }
    else {
      loadScene(currentScenename.slice(0, -13));
      emp_fr = 1;
    }
  }
  if (gameState.was_window === 0) {
    const time = gameState.hour * 60 + gameState.minute;

    if (gameState.windowEventMinute === null && game_over === 0) {
      gameState.windowEventMinute = 1 * 60 + 33;
    }

    if (time === gameState.windowEventMinute) {
      gameState.window_knock = 1;
      gameState.was_window = 1;
      if (currentScenename === 'start') {
        loadScene('hallway_window_knock')
      } else if (currentScenename === 'sleep') {
        loadScene('room_from_sleep_window_knock')
      } else {
        loadScene(currentScenename + "_window_knock")
      }

    }
  }
}

function maybeTriggerCupboard() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (gameState.hour * 60 + gameState.minute === 7 * 60 + 57) {
    examinate = 0;
    const random = Math.random();
  
    if (random < 0.6) {
      type_capboard = 0;
    } else if (random < 0.8) {
      type_capboard = 1;
    } else {
      type_capboard = 2;
    }
    return;
  }
  if (gameState.hour * 60 + gameState.minute === 8 * 60 + 7 && examinate === 0) {
    console.log("CHECK", gameState.hour, gameState.minute, "examinate", examinate);
    loadScene('game_over_roof');
    game_over = 1;
    return;
  }
  if (type_capboard > 0 && gameState.hour * 60 + gameState.minute >= 8 * 60 + 7 && gameState.hour * 60 + gameState.minute <= 8 * 60 + 40 && in_flat) {
    loadScene('game_over_roof');
    game_over = 1;
    return;
  }
  if (type_capboard > 1 && gameState.hour * 60 + gameState.minute >= 8 * 60 + 7 && gameState.hour * 60 + gameState.minute < 10 * 60 + 10 && in_flat) {
    loadScene('game_over_roof');
    game_over = 1;
    return;
  }
  if (type_capboard === 1 && gameState.hour * 60 + gameState.minute > 8 * 60 + 40) {
    type_capboard = 0;
    return;
  }
  if (type_capboard === 2 && gameState.hour * 60 + gameState.minute > 10 * 60 + 10) {
    type_capboard = 0;
    return;
  }
}

function maybeTriggerScare() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (scare === 1 && currentScenename === 'sleep' && Math.random() < 0.1) {
    loadScene('room_from_sleep_scare');
  }
}

function maybeTriggerAxe() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (currentScenename === 'stairwell' || currentScenename === 'stairwell_window_knock') {
    if (future_axe === 1) {
      game_over = 1;
      loadScene('game_over_axe');
    }
  }
}

function maybeTriggerPantry() {
  if (!currentScene) return;
  if (game_over === 1) return;
  if (start_scare_scene != null) {
    if (gameState.hour * 60 + gameState.minute - 5 >= start_scare_scene) {
      start_scare_scene = null;
      loadScene(old_scene);
      old_scene = null;
    }
    else {
      return;
    }
  }
  if (gameState.pantry === 1 && currentScenename != 'living_room_pantry_door' && currentScenename != 'tv_off_pantry_door' && currentScenename != 'tv_medium_pantry_door' && currentScenename != 'tv_maxi_pantry_door') {
    gameState.pantry = 0;
    scare = 1;
    start_scare_scene = gameState.hour * 60 + gameState.minute
    old_scene = currentScenename;
    loadScene('scare_scene'); 
  }
  if (game_over == 0 && gameState.pantry === 1 && gameState.hour * 60 + gameState.minute > 21 * 60 + 30) {
    if (currentScenename === 'tv_maxi_pantry_door') {
      gameState.pantry = 0;
      loadScene('tv_maxi'); 
    } else if (currentScenename === 'tv_medium_pantry_door') {
      start_scare_scene = gameState.hour * 60 + gameState.minute
      old_scene = 'tv_medium';
      scare = 1;
    } else if (currentScenename === 'tv_off_pantry_door') {
      start_scare_scene = gameState.hour * 60 + gameState.minute
      old_scene = 'tv_off';
      scare = 1;
    } else if (currentScenename === 'living_room_pantry_door') {
      start_scare_scene = gameState.hour * 60 + gameState.minute
      old_scene = 'living_room';
      scare = 1;
    }
  }
  if (gameState.was_pantry === 0) {
    const time = gameState.hour * 60 + gameState.minute;

    if (gameState.pantryEventMinute === null && game_over === 0) {
      gameState.pantryEventMinute = 20 * 60 + (30 + Math.floor(Math.random() * 40));
    }

    if (time >= gameState.pantryEventMinute && time <= 20 * 60 + 30 + 50) {
      gameState.pantry = 1;
      gameState.was_pantry = 1;
      if (currentScenename === 'living_room') {
        loadScene('living_room_pantry_door')
      } else if (currentScenename === 'tv_off') {
        loadScene('tv_off_pantry_door')
      } else if (currentScenename === 'tv_medium') {
        loadScene('tv_medium_pantry_door')
      } else if (currentScenename === 'tv_maxi') {
        loadScene('tv_maxi_pantry_door')
      } else {
        gameState.pantry = 0;
        gameState.was_pantry = 0;
      }

    }
  }
}


window.onload = () => {
  updateClock();
  startClock();
  document.addEventListener('mousemove', e => {
    const bg = document.getElementById('background');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
    bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  });
  loadScene("start");
};