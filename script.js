let clockInterval = null;

const gameState_init = {
    abs_minutes: 19 * 60,
    currentScene: null,
    old_scene_name: null,

    active_pantry: 0,
    start_pantry: 0,
    completed_pantry: 0,

    active_friend: 0,
    start_friend: 0,
    completed_friend: 0,
    enter_friend: 0,
    start_bit: 0,

    emp_fr: 0,
    type_capboard: 0,
    in_flat: 1,
    bathroom_full: 0,
    examinate_cupboard: 0

};

let gameState = null;

const scenes = {

    start: {
        name: 'start',
        initActions: function() {
            if (clockInterval) clearInterval(clockInterval);
            gameState = JSON.parse(JSON.stringify(gameState_init));
            updateClock();
            gameState.start_pantry = 20 * 60 + Math.floor(Math.random() * 30);
            gameState.start_friend = (21 * 60 + 10) + Math.floor(Math.random() * 50);
        },
        background: function() {
            return "images/start.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            return "Поздравляю! Игра тестируется";
        },
        choices: [
            {
                text: function() {
                    return 'start';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                    clockInterval = setInterval(() => triggerManager(), 1000);
                }
            }
        ]
    },

    hallway: {
        name: 'hallway',
        initActions: function() {
        },
        background: function() {
            return "images/hallway.png";
        },
        sound: function() {
            if (gameState.active_pantry == 1) {
                return "sounds/pantry_door.mp3";
            }
            else {
                return "sounds/def.mp3";
            }
            
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в коридоре. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в коридоре. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Пойти в комнату';
                },
                next: function() {
                    return 'room';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Пойти в гостиную';
                },
                next: function() {
                    return 'living_room';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Пойти на кухню';
                },
                next: function() {
                    return 'kitchen';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Пойти в прихожую';
                },
                next: function() {
                    return 'vestibule';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Пойти в туалет';
                },
                next: function() {
                    return 'toilet';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Пойти в ванную';
                },
                next: function() {
                    return 'bathroom';
                },
                actions: function() {
                }
            },
        ]
      },

      room: {
        name: 'room',
        initActions: function() {
        },
        background: function() {
            return "images/room.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в комнате. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в комнате. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Лечь спать';
                },
                next: function() {
                    return 'sleep';
                },
                actions: function() {
                }
            },
        ]
      },

      kitchen: {
        name: 'kitchen',
        initActions: function() {
        },
        background: function() {
            return "images/kitchen.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты на кухне. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты на кухне. Всё тихо.";
            }
        },

        choices: [
            {
                text: function() {
                    return 'Поискать что-то поесть в холодильнике';
                },
                next: function() {
                    return 'fridge';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },
        ]
      },

      living_room: {
        name: 'living_room',
        initActions: function() {
        },
        background: function() {
            return "images/living_room.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в гостиной. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в гостиной. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Посмотреть телевизор';
                },
                next: function() {
                    return 'tv';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Проверить шкаф-стенку';
                },
                next: function() {
                    return 'cupboard';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },
        ]
      },

      cupboard: {
        name: 'cupboard',
        initActions: function() {
            gameState.examinate_cupboard = 1;
        },
        background: function() {
            return "images/cupboard_empty.png";
        },
        sound: function() {
            return "sounds/window_knock.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Шкаф-стенка. Слышен скрип двери кладовки.";
            }
            else {
                return "Шкаф-стенка. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Осмотреть гостиную';
                },
                next: function() {
                    return 'living_room';
                },
                actions: function() {
                }
            },
        ]
      },

      tv: {
        name: 'tv',
        initActions: function() {
        },
        background: function() {
            return "images/tv_on.png";
        },
        sound: function() {
            return "sounds/tv.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Телевизор. Слышен скрип двери кладовки.";
            }
            else {
                return "Телевизор.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Выключить';
                },
                next: function() {
                    return 'tv';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Осмотреть гостиную';
                },
                next: function() {
                    return 'living_room';
                },
                actions: function() {
                }
            },
        ]
      },

      vestibule: {
        name: 'vestibule',
        initActions: function() {
            gameState.in_flat = 1;
        },
        background: function() {
            return "images/vestibule.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в прихожей. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в прихожей. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Посмотреть в глазок';
                },
                next: function() {
                    return 'peephole';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    return 'Выйти на лестничную клетку';
                },
                next: function() {
                    return 'stairwell';
                },
                actions: function() {
                }
            },
        ]
      },

      toilet: {
        name: 'toilet',
        initActions: function() {
        },
        background: function() {
            return "images/toilet_on.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в туалете. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в туалете. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },
        ]
      },

      bathroom: {
        name: 'bathroom',
        initActions: function() {
        },
        background: function() {
            return "images/tmp.jpg";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты в ванной. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты в ванной. Всё тихо.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Выйти в коридор';
                },
                next: function() {
                    return 'hallway';
                },
                actions: function() {
                }
            },
        ]
      },

      stairwell: {
        name: 'stairwell',
        initActions: function() {
            gameState.in_flat = 0;
        },
        background: function() {
            return "images/stairwell.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Ты на лестничной клетке. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты на лестничной клетке.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Войти в квартиру';
                },
                next: function() {
                    return 'vestibule';
                },
                actions: function() {
                }
            },
        ]
      },

      peephole: {
        name: 'peephole',
        initActions: function() {
        },
        background: function() {
            return "images/peephole.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_friend == 1) {
                return "Ты смотришь в глазок. Стоит девушка. Хочет войти.";
            }
            if (gameState.active_pantry == 1) {
                return "Ты смотришь в глазок. Никого не видно. Слышен скрип двери кладовки.";
            }
            else {
                return "Ты смотришь в глазок. Никого не видно.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Отойти от глазка';
                },
                next: function() {
                    return 'vestibule';
                },
                actions: function() {
                }
            },

            {
                text: function() {
                    if (gameState.active_friend == 1){
                        return 'Впустить девушку';
                    }
                    else {
                        return 'Продолжать смотреть';
                    }
                        
                },
                next: function() {
                    if (gameState.active_friend == 1){
                        return 'vestibule';
                    }
                    else {
                        return 'peephole';
                    }
                },
                actions: function() {
                    if (gameState.active_friend == 1){
                        gameState.enter_friend = 1;
                    }
                    else {
                        
                    }
                }
            },
        ]
      },

      fridge: {
        name: 'fridge',
        initActions: function() {
        },
        background: function() {
            return "images/fridge.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            if (gameState.active_pantry == 1) {
                return "Холодильник. Слышен скрип двери кладовки.";
            }
            else {
                return "Холодильник.";
            }
        },
        choices: [
            {
                text: function() {
                    return 'Закрыть';
                },
                next: function() {
                    return 'kitchen';
                },
                actions: function() {
                }
            },
        ]
      },

      sleep: {
        name: 'sleep',
        initActions: function() {
        },
        background: function() {
            return "images/tmp.jpg";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            return "Ты спишь.";
        },
        choices: [
            {
                text: function() {
                    return 'Проснуться';
                },
                next: function() {
                    return 'room';
                },
                actions: function() {
                }
            },
        ]
      },

      game_over: {
        name: 'game_over',
        initActions: function() {
        },
        background: function() {
            return "images/game_over_axe.png";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            return "Игра окончена";
        },
        choices: [
            {
                text: function() {
                    return 'Начать сначала';
                },
                next: function() {
                    return 'start';
                },
                actions: function() {
                }
            },
        ]
      },

      scare_scene: {
        name: 'scare_scene',
        initActions: function() {
        },
        background: function() {
            return "images/scare_scene.png";
        },
        sound: function() {
            return "sounds/scare_scene.mp3";
        },
        text: function() {
            return "Ночка перестаёт быть томной";
        },
        choices: [
        ]
      },

      bite_scene: {
        name: 'bite_scene',
        initActions: function() {
        },
        background: function() {
            return "images/tmp.jpg";
        },
        sound: function() {
            return "sounds/def.mp3";
        },
        text: function() {
            return "Симулякр перешёл в активную фазу и покусал тебя. Девушка убежала.";
        },
        choices: [
        ]
      },
}


function loadScene(name) {
    const scene = scenes[name];
  
    const game = document.getElementById("game");
  
    game.classList.remove("fade-in");
    game.classList.add("fade-out");
  
    setTimeout(() => {
        gameState.currentScene = scene;
        scene.initActions();
        document.getElementById("background").style.backgroundImage = `url(${scene.background()})`;
        document.getElementById("story").textContent = scene.text();
        const audio = document.getElementById("bgm");
        audio.src = scene.sound();
        audio.loop = true;
        audio.play().catch(() => {});
  
        const choicesDiv = document.getElementById("choices");
        choicesDiv.innerHTML = "";
        scene.choices.forEach(choice => {
            const btn = document.createElement("div");
            btn.className = "choice";
            btn.textContent = choice.text();
            btn.onclick = () => {
                choice.actions();
                loadScene(choice.next());
            };
            choicesDiv.appendChild(btn);
        });
  
        game.classList.remove("fade-out");
        game.classList.add("fade-in");
    }, 400);
  }


function inTimeSegment(d, h, m, curr_d, left_h, left_m, right_h, right_m) {
    if (d == curr_d && left_h * 60 + left_m < h * 60 + m && h * 60 + m <= right_h * 60 + right_m) {
        return true;
    }
    else {
        return false;
    }
}


function updateClock() {
    const m = String((gameState.abs_minutes % (24 * 60)) % 60).padStart(2, "0");
    const h = String(Math.trunc((gameState.abs_minutes % (24 * 60)) / 60)).padStart(2, "0");
    const d = String(Math.trunc(gameState.abs_minutes / (24 * 60)) + 1).padStart(1, "0");
    document.getElementById("time").textContent = `День ${d}. ${h}:${m}`;
    // console.log(d, h, m)
    return [d, h, m]
}


function triggerManager() {
    gameState.abs_minutes += 1;

    const [d, h, m] = updateClock();

    if (inTimeSegment(d, h, m, 1, 20, 0, 21, 0)) {
        triggerPantry();
    }

    if (inTimeSegment(d, h, m, 1, 21, 0, 23, 0)) {
        triggerFriend();
    }

}


function triggerPantry() {
    if (gameState.completed_pantry == 1) {
        return;
    }
    if (gameState.currentScene.name == 'scare_scene' && gameState.abs_minutes >= 20 * 60 + 59) {
        gameState.completed_pantry = 1;
        loadScene(gameState.old_scene_name);
    }
    else if (gameState.active_pantry == 0) {
        if (gameState.start_pantry <= gameState.abs_minutes) {
            gameState.active_pantry = 1;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.abs_minutes >= (20 * 60 + 55)) {
            gameState.active_pantry = 0;
            if (gameState.currentScene.name == 'tv' && gameState.volume_tv == 2) {
                gameState.completed_pantry = 1;
                loadScene(gameState.currentScene.name);
            }
            else {
                gameState.old_scene_name = gameState.currentScene.name;
                loadScene("scare_scene");
            }
        }
    }
}


function triggerFriend() {
    if (gameState.completed_friend == 1) {
        return;
    }
    if (gameState.currentScene.name == 'bite_scene') {
        if (gameState.abs_minutes >= gameState.start_bit + 4) {
            gameState.completed_friend = 1;
            gameState.active_friend = 0;
            loadScene(gameState.old_scene_name);
        }
    }
    else if (gameState.enter_friend == 1) {
        gameState.old_scene_name = gameState.currentScene.name;
        gameState.start_bit = gameState.abs_minutes + 0;
        gameState.active_friend = 0;
        loadScene("bite_scene");
    }
    else if (gameState.active_friend == 0) {
        if (gameState.start_pantry <= gameState.abs_minutes) {
            gameState.active_friend = 1;
            loadScene(gameState.currentScene.name);
        }
    }
    else if (gameState.active_friend == 1) {
        if (gameState.abs_minutes >= (22 * 60 + 55)) {
            gameState.active_friend = 0;
            gameState.completed_friend = 1;
            loadScene(gameState.currentScene.name);
        }
    }
}

window.onload = () => {
    document.addEventListener('mousemove', e => {
      const bg = document.getElementById('background');
      const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
      bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });
    loadScene("start");
  };

