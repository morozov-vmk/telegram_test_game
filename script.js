let clockInterval = null;

const gameState_init = {
    abs_minutes: 19 * 60,
    currentScene: null,
    old_scene_name: null,
    game_over: false,
    game_over_reason: null,

    active_pantry: false, //
    start_pantry: 0, //
    completed_pantry: false, //

    active_window: false,
    start_window: 24 * 60 + 60 + 33,
    end_window: 24 * 60 + 60 + 40,
    completed_window: false,

    active_friend: false,
    start_friend: 0,
    completed_friend: false,
    enter_friend: false,
    start_bit: 0,

    active_neighbour: false,
    start_neighbour: 0,
    completed_neighbour: false,
    future_death_from_neighbour: false,

    active_killer: false,
    start_killer: 0,
    first_killer_clap: 0,
    first_reload: false,
    second_killer_clap: 0,
    second_reload: false,
    completed_killer: false,
    player_hidden: false,

    active_infection: false,
    start_black_water_and_strange_neighbours: 24 * 60 * 3 * 60 + 4,

    check_bath_time: 24 * 60 + 12 * 60,

    vinegar_hallway: false,
    vinegar_room: false,
    vinegar_living_room: false,
    vinegar_vestibule: false,
    vinegar_toilet: false,
    vinegar_bathroom: false,
    vinegar_kitchen: false,

    completed_grandmother: false,
    active_grandmother: false, 
    grandmother_breath: false,
    trigger_grandmother: false,
    start_grandmother: 0,

    active_dog: false,
    completed_dog: false,
    check_vinegar_time: 0,
    type_dog: null,
    start_dog: null,

    active_infection: false,
    completed_infection: false,

    was_in_bath: false,
    sleeping: false,
    food_with_me: false,
    printed_question: null,
    called_gas_workers: false,
    call_from: "",
    emp_fr: false,
    bath_empty: true,
    set_type_capboard: false,
    type_capboard: 0,
    safety_time_in_flat_start: 0,
    volume_tv: 0, //
    in_flat: true,
    toilet_light: false,
    examinate_cupboard: false,
    completed_cupboard: false,

};

let gameState = null;

const scenes = {

    start: {
        name: 'start',
        initActions: function () {
            if (clockInterval) clearInterval(clockInterval);
            gameState = JSON.parse(JSON.stringify(gameState_init));
            updateClock();
            gameState.start_pantry = 20 * 60 + Math.floor(Math.random() * 30);
            gameState.start_friend = (21 * 60 + 10) + Math.floor(Math.random() * 50);
            gameState.start_neighbour = (23 * 60) + Math.floor(Math.random() * 30);
            gameState.start_killer = (23 * 60 + 45) + Math.floor(Math.random() * 14);
            gameState.first_killer_clap = 24 * 60 + 10 + Math.floor(Math.random() * 40);
            gameState.second_killer_clap = 24 * 60 + 45 + Math.floor(Math.random() * 30);
            gameState.safe_room = Math.random() < 0.5 ? 'room' : 'living_room';
            gameState.start_dog_hind_legs = 24 * 60 + 5 * 60 + 10 + Math.floor(Math.random() * 20);
            gameState.start_dog_glow = 24 * 60 + 7 * 60 + 10 + Math.floor(Math.random() * 20);
            gameState.start_dog_petting = 24 * 60 + 10 * 60 + 20 + Math.floor(Math.random() * 15);
            gameState.start_grandmother = 24 * 60 + 11 * 60 + 5 + Math.floor(Math.random() * 10);

        },
        background: function () {
            return "images/start.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            return "Поздравляю! Игра тестируется";
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'start';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                    clockInterval = setInterval(() => triggerManager(), 1000);
                }
            }
        ]
    },

    hallway: {
        name: 'hallway',
        initActions: function () {
        },
        background: function () {
            return "images/hallway.png";
        },
        sound: function () {
            if (gameState.active_pantry) {
                return "sounds/pantry_door.mp3";
            }
            else {
                return "sounds/def.mp3";
            }

        },
        text: function () {
            ans = 'Ты в коридоре. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание. '
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти в комнату';
                },
                next: function () {
                    return 'room';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти в гостиную';
                },
                next: function () {
                    return 'living_room';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти на кухню';
                },
                next: function () {
                    return 'kitchen';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти в прихожую';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти в туалет';
                },
                next: function () {
                    return 'toilet';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    if (!gameState.toilet_light) {
                        return 'Включить свет в туалете';
                    }
                    else {
                        return 'Вылючить свет в туалете';
                    }
                },
                next: function () {
                    return 'toilet';
                },
                actions: function () {
                    if (!gameState.toilet_light) {
                        gameState.toilet_light = true;
                    }
                    else {
                        gameState.toilet_light = false;
                    }
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Пойти в ванную';
                },
                next: function () {
                    return 'bathroom';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                    gameState.vinegar_hallway = true;
                }
            },
        ]
    },

    room: {
        name: 'room',
        initActions: function () {
        },
        background: function () {
            return "images/room.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = '';
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (!gameState.sleeping) {
                ans = 'Ты в комнате. ' + ans
            }
            else if (ans == '') {
                ans = 'Ты спишь. '
            }
            else {
                gameState.sleeping = false;
                ans = 'Ты проснулся. ' + ans
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    if (!gameState.sleeping) {
                        return 'Лечь спать';
                    }
                    else {
                        return 'Проснуться';
                    }
                },
                next: function () {
                    return 'room';
                },
                actions: function () {
                    if (!gameState.sleeping) {
                        gameState.sleeping = true;
                    }
                    else {
                        gameState.sleeping = false;
                    }
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Позвонить родным';
                },
                next: function () {
                    return 'phone';
                },
                actions: function () {
                    gameState.call_from = 'room';
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Позвонить в газовую службу';
                },
                next: function () {
                    return 'phone';
                },
                actions: function () {
                    gameState.call_from = 'room';
                    gameState.called_gas_workers = true;
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Нарисовать знак вопроса на стекле';
                },
                next: function () {
                    return 'room';
                },
                actions: function () {
                    gameState.printed_question = 'room';
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'room';
                },
                actions: function () {
                    gameState.vinegar_room = true;
                }
            },
        ]
    },

    kitchen: {
        name: 'kitchen',
        initActions: function () {
        },
        background: function () {
            return "images/kitchen.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты на кухне. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },

        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Поискать что-то поесть в холодильнике';
                },
                next: function () {
                    return 'fridge';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'kitchen';
                },
                actions: function () {
                    gameState.vinegar_kitchen = true;
                }
            },
        ]
    },

    living_room: {
        name: 'living_room',
        initActions: function () {
        },
        background: function () {
            return "images/living_room.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты в гостиной. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Бабушка стоит в углу спиной и тяжело дышит.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Посмотреть телевизор';
                },
                next: function () {
                    return 'tv';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Проверить шкаф-стенку';
                },
                next: function () {
                    return 'cupboard';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Позвонить родным';
                },
                next: function () {
                    return 'phone';
                },
                actions: function () {
                    gameState.call_from = 'living_room';
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Позвонить в газовую службу';
                },
                next: function () {
                    return 'phone';
                },
                actions: function () {
                    gameState.call_from = 'living_room';
                    gameState.called_gas_workers = true;
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Нарисовать знак вопроса на стекле';
                },
                next: function () {
                    return 'living_room';
                },
                actions: function () {
                    gameState.printed_question = 'living_room';
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'living_room';
                },
                actions: function () {
                    gameState.vinegar_living_room = true;
                }
            },

            {
                show: function () {
                    if (gameState.active_grandmother) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                text: function () {
                    return 'Поговорить с бабушкой';
                },
                next: function () {
                    return 'game_over';
                },
                actions: function () {
                    gameState.game_over = true;
                    gameState.completed_grandmother = true;
                    gameState.game_over_reason = 'trigger_grandmother';
                }
            },

            {
                show: function () {
                    if (gameState.active_grandmother) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                text: function () {
                    return 'Потрогать бабушку';
                },
                next: function () {
                    return 'game_over';
                },
                actions: function () {
                    gameState.game_over = true;
                    gameState.completed_grandmother = true;
                    gameState.game_over_reason = 'trigger_grandmother';
                }
            },
        ]
    },

    cupboard: {
        name: 'cupboard',
        initActions: function () {
            gameState.examinate_cupboard = true;
        },
        background: function () {
            return "images/cupboard_empty.png";
        },
        sound: function () {
            return "sounds/window_knock.mp3";
        },
        text: function () {
            if (gameState.type_capboard == 0) {
                ans = 'Шкаф-стенка пуста. '
            }
            else if (gameState.type_capboard == 1) {
                ans = 'В шкаф-стенке сервиз с рыбами. '
            }
            else {
                ans = 'В шкаф-стенке праздничный хрусталь. '
            }
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Осмотреть гостиную';
                },
                next: function () {
                    return 'living_room';
                },
                actions: function () {
                }
            },
        ]
    },

    tv: {
        name: 'tv',
        initActions: function () {
        },
        background: function () {
            return "images/tv_on.png";
        },
        sound: function () {
            return "sounds/tv.mp3";
        },
        text: function () {
            ans = 'Телевизор. '
            if (gameState.volume_tv == 0) {
                ans = ans + "Выключен"
            }
            else if (gameState.volume_tv == 1) {
                ans = ans + "Включён на среднюю громкость. "
            }
            else if (gameState.volume_tv == 2) {
                ans = ans + "Включён на максимальную громкость. "
            }
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    if (gameState.volume_tv == 0) {
                        return 'Включить телевизор на среднюю громкость';
                    }
                    else if (gameState.volume_tv == 1) {
                        return 'Включить телевизор на максимальную громкость';
                    }
                    else {
                        return 'Выключить телевизор';
                    }
                },
                next: function () {
                    return 'tv';
                },
                actions: function () {
                    if (gameState.volume_tv == 0) {
                        gameState.volume_tv = 1;
                    }
                    else if (gameState.volume_tv == 1) {
                        gameState.volume_tv = 2;
                    }
                    else {
                        gameState.volume_tv = 0;
                    }
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    if (gameState.volume_tv == 0) {
                        return 'Включить телевизор на максимальную громкость';
                    }
                    else if (gameState.volume_tv == 1) {
                        return 'Выключить телевизор';
                    }
                    else {
                        return 'Включить телевизор на среднюю громкость';
                    }
                },
                next: function () {
                    return 'tv';
                },
                actions: function () {
                    if (gameState.volume_tv == 0) {
                        gameState.volume_tv = 2;
                    }
                    else if (gameState.volume_tv == 1) {
                        gameState.volume_tv = 0;
                    }
                    else {
                        gameState.volume_tv = 1;
                    }
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Осмотреть гостиную';
                },
                next: function () {
                    return 'living_room';
                },
                actions: function () {
                    gameState.volume_tv = 0;
                }
            },
        ]
    },

    vestibule: {
        name: 'vestibule',
        initActions: function () {
            gameState.in_flat = true;
        },
        background: function () {
            return "images/vestibule.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты в прихожей. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Посмотреть в глазок';
                },
                next: function () {
                    return 'peephole';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    if (gameState.active_grandmother && !gameState.was_in_bath) {
                        return 'Нельзя на лестничную клетк, дверь закрыта - не выполнены условия взаимодействия с бабушкой';
                    }
                    else {
                        return 'Выйти на лестничную клетку';
                    }
                },
                next: function () {
                    if (gameState.active_grandmother && !gameState.was_in_bath) {
                        return 'vestibule';
                    }
                    if (gameState.future_death_from_neighbour) {
                        gameState.game_over = true;
                        gameState.game_over_reason = 'axe';
                        return 'game_over';
                    }
                    else {
                        return 'stairwell';
                    }
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                    gameState.vinegar_vestibule = true;
                }
            },
        ]
    },

    toilet: {
        name: 'toilet',
        initActions: function () {
        },
        background: function () {
            return "images/toilet_on.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты в туалете. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'toilet';
                },
                actions: function () {
                    gameState.vinegar_toilet = true;
                }
            },
        ]
    },

    phone: {
        name: 'phone',
        initActions: function () {
        },
        background: function () {
            return "images/tmp.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты звонишь. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Положить трубку';
                },
                next: function () {
                    if (gameState.call_from == 'room') {
                        return 'room';
                    }
                    else {
                        return 'living_room';
                    }
                },
                actions: function () {
                }
            },
        ]
    },

    bathroom: {
        name: 'bathroom',
        initActions: function () {
        },
        background: function () {
            return "images/tmp.jpg";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            if (gameState.player_hidden) {
                ans = 'Ты сидишь под ванной. '
            }
            else {
                ans = 'Ты в ванной. '
            }
            if (gameState.active_infection) {
                ans = ans + 'Из крана течёт чёрная вода. '
            }
            if (gameState.bath_empty) {
                ans = ans + 'Ванная пуста. '
            }
            else {
                ans = ans + 'Ванная наполнена. '
            }
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Слышен стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    if (gameState.player_hidden) {
                        return false;
                    }
                    else {
                        if (gameState.player_safety_from_grandmother) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                },
                text: function () {
                    return 'Выйти в коридор';
                },
                next: function () {
                    return 'hallway';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    if (gameState.player_hidden) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                text: function () {
                    if (gameState.bath_empty) {
                        return 'Наполнить ванную';
                    }
                    else {
                        return 'Слить ванную';
                    }

                },
                next: function () {
                    return 'bathroom';
                },
                actions: function () {
                    if (gameState.bath_empty) {
                        gameState.bath_empty = false;
                    }
                    else {
                        gameState.bath_empty = true;
                    }
                }
            },

            {
                show: function () {
                    if (gameState.player_safety_from_grandmother) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                text: function () {
                    if (!gameState.player_hidden) {
                        return 'Спрятаться под ванную';
                    }
                    else {
                        return 'Вылезти из-под ванной';
                    }

                },
                next: function () {
                    return 'bathroom';
                },
                actions: function () {
                    if (!gameState.player_hidden) {
                        gameState.player_hidden = true;
                    }
                    else {
                        gameState.player_hidden = false;
                    }
                }
            },
            
            {
                show: function () {
                    if (gameState.player_hidden) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                text: function () {
                    if (!gameState.player_safety_from_grandmother) {
                        return 'Залезть в ванную';
                    }
                    else {
                        return 'Вылезти из ванной';
                    }
                    

                },
                next: function () {
                    return 'bathroom';
                },
                actions: function () {
                    if (!gameState.player_safety_from_grandmother) {
                        gameState.player_safety_from_grandmother = true;
                        gameState.was_in_bath = true;
                    }
                    else {
                        gameState.player_safety_from_grandmother = false;
                    }
                }
            },

            {
                show: function () {
                    if (gameState.player_hidden) {
                        return false;
                    }
                    else {
                        if (gameState.player_safety_from_grandmother) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                },
                text: function () {
                    return 'Обработать стены уксусом';
                },
                next: function () {
                    return 'bathroom';
                },
                actions: function () {
                    gameState.vinegar_bathroom = true;
                }
            },
        ]
    },

    stairwell: {
        name: 'stairwell',
        initActions: function () {
            gameState.in_flat = false;
        },
        background: function () {
            return "images/stairwell.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты на лестничной клетке. '
            if (gameState.active_friend) {
                ans = ans + "Стоит девушка и хочет войти. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Войти в квартиру';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                    gameState.in_flat = true;
                }
            },
            {
                show: function () {
                    if (gameState.active_friend) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                text: function () {
                    return 'Войти в квартиру и впустить девушку';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                    gameState.enter_friend = true;
                }
            },
        ]
    },

    peephole: {
        name: 'peephole',
        initActions: function () {
        },
        background: function () {
            return "images/peephole.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            ans = 'Ты смотришь в глазок. '
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_neighbour) {
                ans = ans + "Сосед просит соли. ";
            }
            if (gameState.active_friend) {
                ans = ans + "Стоит девушка. Хочет войти. "
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Стучатся странные соседи. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Отойти от глазка';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    if (gameState.active_neighbour) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                text: function () {
                    return 'Открыть дверь и дать соли';
                },
                next: function () {
                    return 'game_over';
                },
                actions: function () {
                    gameState.game_over = true;
                    gameState.game_over_reason = 'strangulation';
                }
            },

            {
                show: function () {
                    if (gameState.active_friend) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                text: function () {
                    return 'Открыть дверь и впустить девушку';
                },
                next: function () {
                    return 'vestibule';
                },
                actions: function () {
                    gameState.enter_friend = true;
                }
            },
        ]
    },

    fridge: {
        name: 'fridge',
        initActions: function () {
        },
        background: function () {
            return "images/fridge.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            if (gameState.emp_fr){
                ans = 'Холодильник пуст. Записка: "не следовало игнорировать стук в окно"'
            }
            else {
                ans = 'Холодильник.'
            }
            if (gameState.active_friend) {
                ans = ans + "Слышен слабый стук в дверь. ";
            }
            if (gameState.active_pantry) {
                ans = ans + "Слышен скрип двери кладовки. ";
            }
            if (gameState.active_window) {
                ans = ans + "Слышен странный стук в окно. ";
            }
            if (gameState.active_infection) {
                ans = ans + 'Слышен странный стук в дверь. '
            }
            if (gameState.active_dog) {
                if (gameState.type_dog == 1) {
                    ans = ans + 'Ты замечаешь, что собака ходит на задних лапах. '
                }
                else if (gameState.type_dog == 2) {
                    ans = ans + 'Ты замечаешь, что собака светится. '
                }
                else {
                    ans = ans + 'Ты замечаешь, что собака ласкается. '
                }
            }
            if (gameState.active_grandmother) {
                ans = ans + 'Из гостиной слышно тяжёлое дыхание.'
            }
            if (gameState.active_killer) {
                if (!gameState.first_reload) {
                    ans = ans + 'Слышны странные шаги в квартире. '
                }
                else if (gameState.first_reload && !gameState.second_reload) {
                    ans = ans + 'Шаги прекратились. Дверь закрылась. '
                }
                else if (gameState.completed_killer) {
                    ans = ans + 'Дверь ещё раз закрылась .'
                }
            }
            return ans;
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Закрыть';
                },
                next: function () {
                    return 'kitchen';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Поесть';
                },
                next: function () {
                    return 'kitchen';
                },
                actions: function () {
                }
            },

            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Взять часть еды с собой';
                },
                next: function () {
                    return 'kitchen';
                },
                actions: function () {
                    gameState.food_with_me = true;
                }
            },
        ]
    },

    game_over: {
        name: 'game_over',
        initActions: function () {
        },
        background: function () {
            return "images/game_over_axe.png";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
            return "Игра окончена";
        },
        choices: [
            {
                show: function () {
                    return true;
                },
                text: function () {
                    return 'Начать сначала';
                },
                next: function () {
                    return 'start';
                },
                actions: function () {
                }
            },
        ]
    },

    scare_scene: {
        name: 'scare_scene',
        initActions: function () {
        },
        background: function () {
            return "images/scare_scene.png";
        },
        sound: function () {
            return "sounds/scare_scene.mp3";
        },
        text: function () {
            return "Ночка перестаёт быть томной";
        },
        choices: [
        ]
    },

    bite_scene: {
        name: 'bite_scene',
        initActions: function () {
        },
        background: function () {
            return "images/tmp.jpg";
        },
        sound: function () {
            return "sounds/def.mp3";
        },
        text: function () {
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
        audio.play().catch(() => { });

        const choicesDiv = document.getElementById("choices");
        choicesDiv.innerHTML = "";
        scene.choices.forEach(choice => {
            if (choice.show()) {
                const btn = document.createElement("div");
                btn.className = "choice";
                btn.textContent = choice.text();
                btn.onclick = () => {
                    choice.actions();
                    loadScene(choice.next());
                };
                choicesDiv.appendChild(btn);
            }
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
    return [Math.trunc(gameState.abs_minutes / (24 * 60)) + 1, Math.trunc((gameState.abs_minutes % (24 * 60)) / 60), (gameState.abs_minutes % (24 * 60)) % 60]
}


function triggerManager() {
    if (gameState.game_over) {
        return;
    }
    if (gameState.sleeping) {
        gameState.abs_minutes += 3;
    }
    else {
        gameState.abs_minutes += 1;
    }

    const [d, h, m] = updateClock();

    if (inTimeSegment(d, h, m, 1, 20, 0, 21, 0)) {
        triggerPantry();
    }

    if (inTimeSegment(d, h, m, 1, 21, 0, 23, 0)) {
        triggerFriend();
    }

    if (inTimeSegment(d, h, m, 1, 23, 0, 23, 45)) {
        triggerNeighbour();
    }

    if (inTimeSegment(d, h, m, 1, 23, 45, 23, 59) || inTimeSegment(d, h, m, 2, 0, -1, 1, 30)) {
        triggerKiller();
    }

    if (inTimeSegment(d, h, m, 2, 1, 32, 1, 44)) {
        triggerWindow();
    }


    if (inTimeSegment(d, h, m, 2, 3, 0, 5, 0)) {
        triggerInfection();
    }

    if (inTimeSegment(d, h, m, 2, 5, 0, 6, 0)) {
        triggerDog(type=1);
    }

    if (inTimeSegment(d, h, m, 2, 7, 0, 8, 0)) {
        triggerDog(type=2);
    }

    if (inTimeSegment(d, h, m, 2, 7, 55, 10, 10)) {
        triggerCupboard();
    }

    if (inTimeSegment(d, h, m, 2, 10, 10, 11, 0)) {
        triggerDog(type=3);
    }

    if (inTimeSegment(d, h, m, 2, 11, 0, 12, 15)) {
        triggerGrandMother();
    }

}


function checkVinegar() {
    if (vinegar_hallway && vinegar_room && vinegar_living_room && vinegar_vestibule && vinegar_toilet && vinegar_bathroom && vinegar_kitchen) {
        return true;
    }
    else {
        return false;
    }
}


function makefalseVinegar() {
    vinegar_hallway = false;
    vinegar_room = false;
    vinegar_living_room = false;
    vinegar_vestibule = false;
    vinegar_toilet = false;
    vinegar_bathroom = false;
    vinegar_kitchen = false;
}


function triggerPantry() {
    if (gameState.completed_pantry) {
        return;
    }
    if (gameState.currentScene.name == 'scare_scene') {
        if (gameState.abs_minutes >= 20 * 60 + 59) {
            gameState.completed_pantry = true;
            gameState.active_pantry = false;
            loadScene(gameState.old_scene_name);
        }

    }
    else if (!gameState.active_pantry) {
        if (gameState.start_pantry <= gameState.abs_minutes) {
            gameState.active_pantry = true;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.abs_minutes >= (20 * 60 + 55)) {
            gameState.active_pantry = false;
            if (gameState.currentScene.name == 'tv' && gameState.volume_tv == 2) {
                gameState.completed_pantry = true;
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
    if (gameState.completed_friend) {
        return;
    }
    if (gameState.currentScene.name == 'bite_scene') {
        if (gameState.abs_minutes >= gameState.start_bit + 4) {
            gameState.completed_friend = true;
            gameState.active_friend = false;
            loadScene(gameState.old_scene_name);
        }
    }
    else if (gameState.enter_friend) {
        gameState.old_scene_name = gameState.currentScene.name;
        gameState.start_bit = gameState.abs_minutes + 0;
        gameState.active_friend = false;
        loadScene("bite_scene");
    }
    else if (!gameState.active_friend) {
        if (gameState.start_friend <= gameState.abs_minutes) {
            gameState.active_friend = true;
            loadScene(gameState.currentScene.name);
        }
    }
    else if (gameState.active_friend) {
        if (gameState.abs_minutes >= (22 * 60 + 55)) {
            gameState.active_friend = false;
            gameState.completed_friend = true;
            loadScene(gameState.currentScene.name);
        }
    }
}

function triggerNeighbour() {
    if (gameState.completed_neighbour) {
        return;
    }
    if (!gameState.active_neighbour) {
        if (gameState.start_neighbour <= gameState.abs_minutes) {
            gameState.active_neighbour = true;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.currentScene.name == 'stairwell') {
            gameState.completed_neighbour = true;
            gameState.game_over = true;
            gameState.game_over_reason = 'strangulation';
            loadScene('game_over');
            return;
        }
        if (gameState.abs_minutes >= (23 * 60 + 41)) {
            gameState.active_neighbour = false;
            if (gameState.currentScene.name == 'peephole') {
                gameState.completed_neighbour = true;

            }
            else {
                gameState.future_death_from_neighbour = true;
                gameState.completed_neighbour = true;
            }
            loadScene(gameState.currentScene.name);
        }
    }
}

function triggerKiller() {
    if (gameState.completed_killer) {
        return;
    }
    if (!gameState.active_killer) {
        if (gameState.start_killer <= gameState.abs_minutes) {
            gameState.active_killer = true;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.abs_minutes > 24 * 60 + 5) {
            if (!gameState.player_hidden) {
                gameState.game_over = true;
                gameState.game_over_reason = 'killer';
                loadScene('game_over');
                return;
            }
        }
        if (gameState.abs_minutes > gameState.first_killer_clap && (!gameState.first_reload)) {
            gameState.first_reload = true;
            loadScene(gameState.currentScene.name);
        }
        if (gameState.abs_minutes > gameState.second_killer_clap && (!gameState.second_reload)) {
            gameState.second_reload = true;
            loadScene(gameState.currentScene.name);
        }
        if (gameState.abs_minutes > gameState.second_killer_clap + 2) {
            gameState.completed_killer = true;
            gameState.active_killer = false;
            loadScene(gameState.currentScene.name);
            return;
        }
    }
}


function triggerWindow() {
    if (gameState.completed_window) {
        return;
    }
    if (!gameState.active_window) {
        if (gameState.start_window <= gameState.abs_minutes) {
            gameState.active_window = true;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.abs_minutes >= gameState.end_window) {
            gameState.active_window = false;
            if (!(gameState.currentScene.name == 'toilet' && (!gameState.toilet_light))) {
                gameState.emp_fr = true;
            }
            gameState.completed_window = true;
            loadScene(gameState.currentScene.name);
        }
    }
}


function triggerInfection() {
    if (gameState.completed_infection) {
        return;
    }
    if (!gameState.active_infection) {
        if (gameState.start_black_water_and_strange_neighbours <= gameState.abs_minutes) {
            gameState.active_infection = true;
            gameState.called_gas_workers = false;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.abs_minutes > 24 * 60 + 4 * 60 + 55) {
            gameState.completed_infection = true;
            gameState.active_infection = false;
            loadScene(gameState.currentScene.name);
            return;
        }
        if (gameState.abs_minutes > 24 * 60 + 4 * 60 + 45) {
            if (!(gameState.food_with_me && (gameState.printed_question == gameState.safe_room) && gameState.called_gas_workers && gameState.currentScene.name == gameState.safe_room)) {
                gameState.game_over = true;
                gameState.game_over_reason = 'infection';
                gameState.completed_infection = true;
                loadScene('game_over');
                return;
            }
        }
        if (!gameState.in_flat) {
            gameState.game_over = true;
            gameState.game_over_reason = 'infection';
            gameState.completed_infection = true;
            loadScene('game_over');
            return;
        }
    }
}

function triggerDog(type) {
    if (gameState.completed_dog) {
        return;
    }
    if (type == 1) {
        gameState.start_dog = gameState.start_dog_hind_legs
    }
    else if (type == 2){
        gameState.start_dog = gameState.start_dog_glow
    }
    else {
        gameState.start_dog = gameState.start_dog_petting
    }
    if (!gameState.active_dog) {
        if (gameState.start_dog <= gameState.abs_minutes) {
            gameState.active_dog = true;
            gameState.type_dog = type;
            if (type == 1) {
                gameState.check_vinegar_time = 24 * 60 + 5 * 60 + 50;
            }
            else if (type == 2) {
                gameState.check_vinegar_time = 24 * 60 + 7 * 60 + 50;
            }
            else {
                gameState.check_vinegar_time = 24 * 60 + 10 * 60 + 50;
            }
            makefalseVinegar();
            loadScene(gameState.currentScene.name);
        }
    }
    else if (gameState.currentScene.name == 'bite_scene') {
        if (gameState.abs_minutes >= gameState.start_bit + 4) {
            gameState.completed_dog = true;
            gameState.active_dog = false;
            loadScene(gameState.old_scene_name);
        }
    }
    else if (gameState.abs_minutes > gameState.check_vinegar_time && (!checkVinegar())) {
        gameState.old_scene_name = gameState.currentScene.name;
        gameState.start_bit = gameState.abs_minutes + 0;
        loadScene("bite_scene");
    }
    else if (gameState.abs_minutes > gameState.check_vinegar_time && (checkVinegar())) {
        gameState.active_dog = false;
        gameState.completed_dog = true;
        loadScene(gameState.currentScene.name);
    }
}


function triggerCupboard() {
    if (gameState.completed_cupboard) {
        return;
    }
    if (gameState.abs_minutes < 24 * 60 + 7 * 6 + 59) {
        gameState.examinate_cupboard = false;
        return;
    }
    else {
        if (!gameState.set_type_capboard) {
            gameState.set_type_capboard = true;
            gameState.type_capboard = Math.random() < 0.5 ? 1 : 2;
            if (gameState.type_capboard == 1) {
                gameState.safety_time_in_flat_start = 24 * 60 + 8 * 60 + 40;
            }
            else {
                gameState.safety_time_in_flat_start = 24 * 60 + 10 * 60 + 10;
            }
        }
    }
    if ((gameState.abs_minutes > 24 * 60 + 8 * 60 + 10) && !gameState.examinate_cupboard) {
        gameState.game_over = true;
        gameState.completed_cupboard = true;
        gameState.game_over_reason = 'roof';
        loadScene('game_over');
        return;
    }
    if (gameState.abs_minutes > 24 * 60 + 8 * 60 + 10 && gameState.abs_minutes < gameState.safety_time_in_flat_start) {
        if (gameState.in_flat) {
            gameState.game_over = true;
            gameState.completed_cupboard = true;
            gameState.game_over_reason = 'roof';
            loadScene('game_over');
            return;
        }
    }
    gameState.completed_cupboard = true;
}


function triggerGrandMother() {
    if (gameState.completed_grandmother) {
        return;
    }
    if (!gameState.active_grandmother) {
        if (gameState.start_grandmother <= gameState.abs_minutes) {
            gameState.active_grandmother = true;
            gameState.was_in_bath = false;
            loadScene(gameState.currentScene.name);
        }
    }
    else {
        if (gameState.trigger_grandmother) {
            gameState.game_over = true;
            gameState.completed_grandmother = true;
            gameState.game_over_reason = 'trigger_grandmother';
            loadScene('game_over');
            return;
        }
        // if (gameState.start_breath <= gameState.abs_minutes) {
        //     gameState.grandmother_breath = true;
        // }
        if (gameState.check_bath_time <= gameState.abs_minutes) {
            if (!gameState.player_safety_from_grandmother) {
                gameState.game_over = true;
                gameState.completed_grandmother = true;
                gameState.game_over_reason = 'trigger_grandmother';
                loadScene('game_over');
                return;
            }
            else {
                gameState.was_in_bath = true;
            }
        }
        // остальная логика в переходах между сценами
    }
}


window.onload = () => {
    document.addEventListener('mousemove', e => {
        const bg = document.getElementById('background');
        const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
        bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });
    gameState = JSON.parse(JSON.stringify(gameState_init));
    loadScene("start");
};

