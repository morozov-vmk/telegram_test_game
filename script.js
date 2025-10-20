/* demo game: бабушкина квартира
   - 1 sec = 1 game minute
   - survive from Sun 19:00 -> Mon 19:00
   - features: neighbor knock, pantry/tv event, window knock 01:33, morning cabinet check, stat management
*/

// -----------------------------
// Инициализация состояния
// -----------------------------
let startGameMinutes = 0; // minutes since game start
let timeObj = { dayOfWeek: 0, hours: 19, minutes: 0 }; // dayOfWeek: 0 = Sun, 1 = Mon
// Player stats
let hunger = 80;
let sleepStat = 70;
let sanity = 90;
let health = 100;

// game flags
let currentSceneId = null;
let sleeping = false;
let outsideBlockedUntil = null; // minutes count until which outside is blocked (when must wait)
let fridgeSabotaged = false;
let cabinetContent = null; // 'empty'|'fish'|'crystal'
let cabinetCheckedToday = false;
let neighborKnockHappened = false;
let neighborHandled = false; // true if player looked through peephole and waited until neighbor left
let neighborWillKnockAt = null; // minute timestamp when knock happens
let neighborPresent = false; // true while knocking
let pantryEvent = null; // {active:true, triggerAt, expiresAt, requiredFocusMinutes}
let tvFocusStart = null; // global minute when player started focusing on TV
let tvFocused = false;
let voiceEffectActive = false; // consequence of failing pantry event
let windowKnockTriggered = false; // 01:33 event happened
let windowEventFailed = false; // failed to hide in toilet -> fridge sabotaged
let gameEnded = false;

// DOM elements
const el = {
  time: document.getElementById("time"),
  hunger: document.getElementById("hunger"),
  sleep: document.getElementById("sleep"),
  sanity: document.getElementById("sanity"),
  health: document.getElementById("health"),
  sceneName: document.getElementById("scene-name"),
  sceneText: document.getElementById("scene-text"),
  choices: document.getElementById("choices"),
  log: document.getElementById("log"),
  bgm: document.getElementById("bgm"),
  sfx: document.getElementById("sfx")
};

// -----------------------------
// Helper utilities
// -----------------------------
function log(msg) {
  const time = formatTime();
  const line = `[${time}] ${msg}`;
  el.log.textContent = line + "\n" + el.log.textContent;
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }
function formatTime() {
  const hh = String(timeObj.hours).padStart(2, "0");
  const mm = String(timeObj.minutes).padStart(2, "0");
  const day = timeObj.dayOfWeek === 0 ? "Вс" : "Пн";
  return `${hh}:${mm} ${day}`;
}
function updateHUD() {
  el.time.textContent = `${String(timeObj.hours).padStart(2,"0")}:${String(timeObj.minutes).padStart(2,"0")}` + (timeObj.dayOfWeek===0?" (Вс)":" (Пн)");
  el.hunger.textContent = Math.round(hunger);
  el.sleep.textContent = Math.round(sleepStat);
  el.sanity.textContent = Math.round(sanity);
  el.health.textContent = Math.round(health);
}

// convert current absolute minutes since start
function absoluteMinutes() { return startGameMinutes; }

// add minutes to time and simulate day overflow
function addMinutes(mins) {
  for (let i=0;i<mins;i++){
    timeObj.minutes++;
    startGameMinutes++;
    if (timeObj.minutes >= 60) {
      timeObj.minutes = 0;
      timeObj.hours++;
      if (timeObj.hours >= 24) {
        timeObj.hours = 0;
        timeObj.dayOfWeek = (timeObj.dayOfWeek + 1) % 7;
      }
    }
  }
  updateHUD();
}

// play sound
function playSfx(src, volume=0.7) {
  if (!src) return;
  el.sfx.src = src;
  el.sfx.volume = volume;
  el.sfx.play().catch(()=>{});
}
function playBgm(src, volume=0.5) {
  if (!src) return;
  el.bgm.src = src;
  el.bgm.volume = volume;
  el.bgm.play().catch(()=>{});
}

// end game
function endGame(text) {
  if (gameEnded) return;
  gameEnded = true;
  showScene('gameover', text);
  log("GAME OVER: " + text);
}

// victory
function victory(text) {
  if (gameEnded) return;
  gameEnded = true;
  showScene('victory', text);
  log("VICTORY: " + text);
}

// -----------------------------
// Scene system: rooms & transitions
// -----------------------------
const scenes = {
  corridor: {
    id:'corridor',
    name: 'Коридор',
    text: 'Ты в коридоре бабушкиной квартиры. Отсюда: кухня, спальня, гостиная, туалет, прихожая.',
    choices: [
      { t: 'Кухня', to:'kitchen' },
      { t: 'Гостиная', to:'livingroom' },
      { t: 'Спальня', to:'bedroom' },
      { t: 'Туалет', to:'toilet' },
      { t: 'Прихожая', to:'hall' }
    ]
  },

  kitchen: {
    id:'kitchen',
    name:'Кухня',
    text:'Кухня. Холодильник в углу.',
    choices:[
      { t:'Открыть холодильник', to:'fridge' },
      { t:'Вернуться в коридор', to:'corridor' }
    ]
  },

  fridge: {
    id:'fridge',
    name:'Холодильник',
    text: ()=> fridgeSabotaged ? 'Холодильник пуст. На дне записка: "Жаль, что не спрятался..."' : 'В холодильнике кое-что осталось.',
    choices:[
      { t:'Поесть (+20 сытости)', action: ()=> {
          if (fridgeSabotaged) { log('В холодильнике пусто — ничего не поел'); }
          else { hunger = clamp(hunger + 20); log('Ты поел.'); }
          updateHUD();
        }, to:'kitchen' },
      { t:'Закрыть', to:'kitchen' }
    ]
  },

  livingroom: {
    id:'livingroom',
    name:'Гостиная',
    text: 'Старая стенка, телевизор в углу.',
    choices:[
      { t:'Телевизор', to:'tv_off' },
      { t:'Проверить шкаф-стенку', to:'cabinet' },
      { t:'Вернуться в коридор', to:'corridor' }
    ]
  },

  tv_off: {
    id:'tv_off',
    name:'Телевизор (выключен)',
    text: 'Экран тёмный. Можно включить.',
    choices:[
      { t:'Включить (средняя громкость)', action: ()=> showScene('tv_on_medium') },
      { t:'Включить (максимум)', action: ()=> showScene('tv_on_max') },
      { t:'Назад', to:'livingroom' }
    ]
  },

  tv_on_medium: {
    id:'tv_on_medium',
    name:'Телевизор (средн.)',
    text:'Телевизор играет негромко.',
    choices:[
      { t:'Выключить', to:'tv_off' },
      { t:'Обернуться (прервать внимание)', action: ()=> { tvFocused=false; tvFocusStart=null; showScene('tv_on_medium'); } }
    ]
  },

  tv_on_max: {
    id:'tv_on_max',
    name:'Телевизор (макс.)',
    text:'Телевизор орущет на всю. Ты сосредоточен на громком звуке — удерживай фокус.',
    onEnter: ()=> {
      tvFocusStart = absoluteMinutes();
      tvFocused = true;
      log('Ты включил ТВ на максимум и фокусируешься.');
    },
    onLeave: ()=> {
      // leaving clears focus
      tvFocused = false;
      tvFocusStart = null;
    },
    choices:[
      { t:'Останься и смотреть (не отвлекаться)', action: ()=> { /* stay */ }, to:'tv_on_max' },
      { t:'Обернуться (отвлечься)', action: ()=> {
          // abandoning focus will be handled by main loop (fail pantry if needed)
          tvFocused = false;
          tvFocusStart = null;
          showScene('tv_on_medium');
        } },
      { t:'Выключить', action: ()=> { tvFocused=false; tvFocusStart=null; showScene('tv_off'); } }
    ]
  },

  cabinet: {
    id:'cabinet',
    name:'Шкаф-стенка',
    text: ()=> {
      if (cabinetContent==='empty') return 'Полки пусты.';
      if (cabinetContent==='fish') return 'На полке сервиз с рыбами.';
      if (cabinetContent==='crystal') return 'Праздничный хрусталь мерцает.';
      return 'Полки...';
    },
    onEnter: ()=> {
      // mark checked only when checked at or after 08:00 (we require player to check between 8:00 and 9:00)
      const hh = timeObj.hours;
      if (hh === 8) {
        cabinetCheckedToday = true;
        log('Ты проверил шкаф-стенку утром как положено.');
      } else {
        // if checked earlier than 08:00 => bad per rules
        if (timeObj.dayOfWeek === 1 || timeObj.dayOfWeek === 0) {
          // if earlier than 8:00 on the day of check lead to collapse per user's rule
          if (timeObj.hours < 8) {
            endGame('Ты проверил шкаф раньше положенного времени — потолок обрушился.');
            return;
          }
        }
      }

      // handle content
      if (cabinetContent==='fish') {
        // must leave for 30 minutes
        const wait = 30;
        outsideBlockedUntil = absoluteMinutes() + wait;
        showScene('outside_wait', `С сервизом — по правилам нужно уйти. Ты вынужден выйти на ${wait} минут.`);
      } else if (cabinetContent==='crystal') {
        const wait = 120;
        outsideBlockedUntil = absoluteMinutes() + wait;
        showScene('outside_wait', `Праздничный хрусталь — нужно уйти. Оставаться опасно, уходим на ${Math.floor(wait/60)}ч.`);
      }
    },
    choices:[
      { t:'Вернуться в гостиную', to:'livingroom' }
    ]
  },

  bedroom: {
    id:'bedroom',
    name:'Спальня',
    text:'Кровать. Можно лечь и поспать.',
    choices:[
      { t:'Поспать (уснуть на 30 мин)', action: ()=> {
          sleeping = true;
          showScene('sleeping');
      }},
      { t:'Вернуться', to:'corridor' }
    ]
  },

  sleeping: {
    id:'sleeping',
    name:'Сон',
    text:'Ты засыпаешь...',
    onEnter: ()=> {
      // benefit is applied on manual wake, events can interrupt
      log('Игрок заснул.');
    },
    choices: [
      { t:'Проснуться', action: ()=> {
          sleeping = false;
          // sleeping normally gives +30 sleep and +10 sanity
          sleepStat = clamp(sleepStat + 30);
          sanity = clamp(sanity + 10);
          updateHUD();
          showScene('bedroom');
        } }
    ]
  },

  toilet: {
    id:'toilet',
    name:'Туалет',
    text:'Туалет — можно закрыть дверь и сидеть в темноте.',
    choices:[
      { t:'Спрятаться в темноте (скрыться)', action: ()=> {
          // hiding for window event
          showScene('toilet_hide');
        }},
      { t:'Вернуться', to:'corridor' }
    ]
  },

  toilet_hide: {
    id:'toilet_hide',
    name:'Туалет (в темноте)',
    text:'Ты сидишь в темном туалете и ждёшь...',
    choices:[
      { t:'Выйти', to:'corridor' }
    ]
  },

  hall: {
    id:'hall',
    name:'Прихожая',
    text:'Прихожая у двери. Можно посмотреть в глазок или выйти в тамбур.',
    choices:[
      { t:'Посмотреть в глазок', to:'peephole' },
      { t:'Выйти в тамбур (выйти из квартиры)', action: ()=> {
          // check neighbor rules and outsideBlockedUntil
          // if neighborKnockHappened and not neighborHandled and it's next day after 08:00 -> axe falls
          if (neighborKnockHappened && !neighborHandled && (timeObj.dayOfWeek>=1 && (timeObj.hours>=8))) {
            endGame('Когда ты вышел — сверху упал топор. (Ты игнорировал стук; сосед оказался опасен.)');
            return;
          }
          // if we are forced to stay outsideBlockedUntil > now => allow outside but restrict reentry? We'll simulate leaving to outside_wait
          showScene('outside'); 
        }},
      { t:'Вернуться', to:'corridor' }
    ]
  },

  peephole: {
    id:'peephole',
    name:'Глазок',
    text: 'Ты выглядываешь в глазок. Пока никого не видно.',
    onEnter: ()=> {
      // if neighborPresent is true -> player can observe until neighbor leaves
      if (neighborPresent) {
        log('Ты посмотрел в глазок на соседа.');
        // we will wait until neighborPresent becomes false (neighbor leaves)
        // Mark neighborHandled when neighbor leaves
        // For demo: set an interval to check neighbor leaving; handled in main loop
      } else {
        // nothing immediate
      }
    },
    choices:[
      { t:'Отойти от глазка', to:'hall' }
    ]
  },

  outside_wait: {
    id:'outside_wait',
    name:'Снаружи (ожидание)',
    text: (s) => s || 'Ты вынужден выйти из квартиры на время.',
    choices:[
      { t:'Подождать снаружи', to:'outside_wait' }
    ]
  },

  outside: {
    id:'outside',
    name:'Тамбур / Небольшая улица',
    text:'Ты на лестничной площадке. Пока что безопасно (но правила могут быть строги).',
    choices:[
      { t:'Вернуться в прихожую', action: ()=> {
          // prevent reentry if outsideBlockedUntil in future
          if (outsideBlockedUntil && absoluteMinutes() < outsideBlockedUntil) {
            endGame('Ты вернулся раньше положенного — потолок обрушился.');
            return;
          }
          showScene('hall');
        } },
      { t:'Остаться снаружи', to:'outside' }
    ]
  },

  // outcomes
  fatal: {
    id:'fatal',
    name:'Кризис',
    text:'Плохая концовка.',
    choices:[ { t:'Начать сначала', action: ()=> location.reload() } ]
  },

  gameover: {
    id:'gameover',
    name:'GAME OVER',
    text:'Ты не выжил.',
    choices:[ { t:'Попробовать снова', action: ()=> location.reload() } ]
  },

  victory: {
    id:'victory',
    name:'ПОБЕДА',
    text:'Ты дожил до 19:00 Понедельника. Поздравляем — демо пройдено.',
    choices:[ { t:'Перезапустить', action: ()=> location.reload() } ]
  }
};

// render a scene by id (scene can be string or function)
function showScene(idOrName, optionalText) {
  if (gameEnded) return;
  let scene = typeof idOrName === 'string' ? scenes[idOrName] : idOrName;
  if (!scene) return;
  currentSceneId = scene.id || idOrName;

  // call onLeave of previous scene (cleanup)
  if (previousScene && previousScene.onLeave) previousScene.onLeave();

  previousScene = scene;

  // dynamic text
  const text = (typeof scene.text === 'function') ? scene.text(optionalText) : (optionalText || scene.text);
  el.sceneName.textContent = scene.name;
  el.sceneText.textContent = text;

  // choices
  el.choices.innerHTML = '';
  if (scene.choices && scene.choices.length) {
    scene.choices.forEach(ch => {
      const btn = document.createElement('div');
      btn.className = 'choice';
      btn.textContent = ch.t;
      btn.onclick = ()=> {
        if (ch.action) ch.action();
        if (ch.to) {
          // call onLeave for this scene if any
          if (scene.onLeave) scene.onLeave();
          showScene(ch.to);
        }
      };
      el.choices.appendChild(btn);
    });
  }

  // run onEnter if present
  if (scene.onEnter) scene.onEnter();
}

// -----------------------------
// Events scheduling at start
// -----------------------------
function scheduleInitialRandoms() {
  // cabinet content random
  const r = Math.random();
  if (r < 0.5) cabinetContent = 'empty';
  else if (r < 0.8) cabinetContent = 'fish';
  else cabinetContent = 'crystal';
  log('Шкаф-стенка содержит: ' + cabinetContent);

  // schedule neighbor knock at random minute between 23:30 and 00:00
  // compute absolute minute for 23:30 same day: currently start time is day 0 19:00 -> 4 hours = 240 minutes to midnight, 23:30 is 4h30 => absolute add 4h30 = 270 minutes from start.
  // startGameMinutes currently 0 => neighborKnockAt = random between 23:30(=270) and 24:00(=300)
  const minAt = 270; const maxAt = 300;
  neighborWillKnockAt = Math.floor(Math.random() * (maxAt - minAt + 1)) + minAt;
  log('К соседу приедет стук в минуту (abs): ' + neighborWillKnockAt + ' (примерно в ' + minutesToClock(neighborWillKnockAt) + ')');

  // schedule window knock at 01:33 => that's 6h33 after 19:00 = 6*60 + 33 = 393 min
  windowKnockAt = 393;

  // schedule morning cabinet check event at 8:00 next day -> absolute minute 13h from 19:00 to 08:00 = 13 hours = 780 min
  morningCheckAt = 13 * 60; // 780

  // pantry event: schedule a random time between 22:00 and 02:00 (wrap) or choose some other randoms — for demo choose between 22:00(=180) and 360 (next day 1:00)
  // Let's schedule pantry open at random between 21:00 and 02:00 => range absolute 120..420
  const panMin = 120, panMax = 420;
  const panAt = Math.floor(Math.random() * (panMax - panMin + 1)) + panMin;
  pantryEvent = { active:false, triggerAt: panAt, expiresAt: null, requiredFocus: 5 }; // required focus in minutes
  log('Кладовка может открыться в минуту (abs): ' + pantryEvent.triggerAt + ' (≈ ' + minutesToClock(pantryEvent.triggerAt) + ')');

  // flags
  fridgeSabotaged = false;
  windowKnockTriggered = false;
  neighborKnockHappened = false;
  neighborHandled = false;
  voiceEffectActive = false;
}

// helper: convert absolute minute to clock (only approximately)
function minutesToClock(absMin) {
  const startHour = 19;
  const totalMinutes = absMin;
  let hh = Math.floor(totalMinutes/60) + startHour;
  let dayOffset = Math.floor(hh/24);
  hh = hh % 24;
  const mm = totalMinutes % 60;
  const day = (dayOffset===0) ? 'Вс' : 'Пн';
  return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')} ${day}`;
}

// -----------------------------
// Main loop: 1 second = 1 minute
// -----------------------------
let previousScene = null;
let windowKnockAt = null;
let morningCheckAt = null;

function mainTick() {
  if (gameEnded) return;

  // 1 minute passes
  addMinutes(1);

  // natural stat decay per minute
  hunger = clamp(hunger - 0.1);
  sleepStat = clamp(sleepStat - (sleeping ? 0.02 : 0.08)); // if sleeping, slow decay
  sanity = clamp(sanity - (voiceEffectActive ? 0.08 : 0.02));
  // if sleeping normally, we don't apply decay and we apply small recovery if sleeping
  if (sleeping) {
    // but events may wake you instead of this recovery
  }

  updateHUD();

  // if any stat hit 0 -> immediate game over
  if (hunger <= 0 || sleepStat <= 0 || sanity <= 0 || health <= 0) {
    endGame('Одна из характеристик достигла 0 — конец.');
    return;
  }

  const abs = absoluteMinutes();

  // ----- Neighbor knock event -----
  if (!neighborKnockHappened && neighborWillKnockAt !== null && abs >= neighborWillKnockAt && abs <= neighborWillKnockAt + 30) {
    // trigger neighbor arrival
    neighborKnockHappened = true;
    neighborPresent = true;
    log('Ты слышишь стук в дверь — сосед просит соль.');
    playSfx('sounds/knock.mp3', 0.7);
    // neighbor will leave after a few minutes (let's say 3 minutes)
    setTimeout(() => {
      neighborPresent = false;
      log('Сосед ушёл (покинул лестничную площадку).');
      // if player observed through peephole and was watching while neighborPresent was true => neighborHandled = true
      // we mark neighborHandled only when player was at peephole and neighborPresent becomes false; we detect peephole observation in peephole scene's onEnter (see below)
    }, 3000); // 3 seconds -> equals 3 minutes in-game
  }

  // if neighborPresent and player opens door (we handle opening in action), if they ignore, consequences later (when leaving after 8:00)
  // Opening door is processed in action when player chooses to open.

  // ----- Window knock at 01:33 (abs minute fixed) -----
  if (!windowKnockTriggered && windowKnockAt !== null && abs >= windowKnockAt) {
    windowKnockTriggered = true;
    log('Стук в окно в 01:33!');
    playSfx('sounds/window_knock.mp3', 0.8);
    // if player is in toilet_hide, they are safe; otherwise failure will sabotage fridge (but we model as: if not in toilet_hide within next 7 minutes -> fail)
    // give a short grace: if current scene equals 'toilet_hide' now -> safe -> wait 7 minutes
    if (currentSceneId === 'toilet_hide') {
      log('Ты спрятался в туалете — нужно подождать 7 минут.');
      // schedule end of safe period after 7 minutes
      const endAbs = abs + 7;
      const checkHideInterval = setInterval(()=> {
        if (absoluteMinutes() >= endAbs) {
          clearInterval(checkHideInterval);
          log('Ожидание в туалете завершено — всё в порядке.');
        } else {
          // if player left toilet_hide early: fail
          if (currentSceneId !== 'toilet_hide') {
            clearInterval(checkHideInterval);
            fridgeSabotaged = true;
            windowEventFailed = true;
            log('Ты вышел раньше — дома что-то произошло. Холодильник будет пуст.');
          }
        }
      }, 1000);
    } else {
      // player was not hiding at the moment of knock -> they have chance to run to toilet within next minute(s)
      // implement grace: if they reach toilet_hide within 1 minute -> safe; else fail
      const graceEnd = abs + 1;
      const check = setInterval(()=> {
        if (absoluteMinutes() > graceEnd) {
          clearInterval(check);
          // if not in hide, fail
          if (currentSceneId !== 'toilet_hide') {
            fridgeSabotaged = true;
            windowEventFailed = true;
            log('Ты не успел спрятаться — свет погас, холодильник опустел. Записка оставлена.');
            // play creepy sound
            playSfx('sounds/power_out.mp3', 0.9);
            // reduce sanity and make hunger more severe over time
            sanity = clamp(sanity - 15);
            updateHUD();
          }
        } else {
          // if player reached toilet_hide -> safe path (wait 7 min)
          if (currentSceneId === 'toilet_hide') {
            clearInterval(check);
            log('Ты успел спрятаться в туалете — нужно подождать 7 минут.');
            const endAbs = absoluteMinutes() + 7;
            const check2 = setInterval(()=> {
              if (absoluteMinutes() >= endAbs) {
                clearInterval(check2);
                log('Ты благополучно дождался конца.');
              } else {
                if (currentSceneId !== 'toilet_hide') {
                  clearInterval(check2);
                  fridgeSabotaged = true;
                  windowEventFailed = true;
                  log('Ты вышел раньше — холодильник опустел.');
                }
              }
            }, 1000);
          }
        }
      }, 1000);
    }
  }

  // ----- Pantry (кладовка) event -----
  if (pantryEvent && !pantryEvent.active && abs >= pantryEvent.triggerAt) {
    pantryEvent.active = true;
    pantryEvent.expiresAt = abs + 10; // remain active 10 minutes
    log('Дверца кладовки скрипнула — что-то открылось в квартире.');
    playSfx('sounds/closet_open.mp3', 0.7);
    // Now player must go to TV and set to max and focus for pantryEvent.requiredFocus minutes to avoid penalty
  }

  // if pantryEvent active => check if player succeeded: requires tvFocused true and focus duration >= requiredFocus
  if (pantryEvent && pantryEvent.active) {
    // success condition
    if (tvFocused && tvFocusStart !== null && (abs - tvFocusStart) >= pantryEvent.requiredFocus) {
      pantryEvent.active = false;
      log('Ты правильно сконцентрировался на ТВ — кладовка более не угрожает.');
      // clear possible voice effect
      voiceEffectActive = false;
    }
    // failure: time expired and not resolved
    if (pantryEvent.active && abs >= pantryEvent.expiresAt) {
      pantryEvent.active = false;
      // failed: voice effect starts
      voiceEffectActive = true;
      log('Кто-то в кладовке использовал момент — тихий голос нашептывает: "ночка перестаёт быть томной"...');
      playSfx('sounds/creepy_voice.mp3', 0.8);
      // consequence: during night sanity will degrade more and sleep recovers less.
    }
  }

  // if tvFocused but player left tv_on_max scene, tvFocused was reset on leaving (see onLeave)
  // we also ensure if tvFocused true and pantryEvent hasn't started, it's fine but not necessary

  // ----- Neighbor consequences: if neighborKnockHappened & ignored -> if player exits after 8:00 next day -> axe falls handled in hall exit action ----- //

  // ----- Morning cabinet check at 08:00 next day -----
  if (abs === morningCheckAt) {
    log('08:00 — пришло время проверить шкаф-стенку. Надо проверить шкаф в гостиной в ближайший час.');
    // if player currently checked cabinet earlier, cabinetCheckedToday will be true, else user must check between 08:00 and 09:00
    // schedule failure at 09:00 if not checked
    const failAt = morningCheckAt + 60;
    const watch = setInterval(()=> {
      if (absoluteMinutes() >= failAt) {
        clearInterval(watch);
        if (!cabinetCheckedToday) {
          endGame('Ты не проверил шкаф/пришёл не вовремя — потолок обрушился.');
        }
      }
    }, 1000);
  }

  // ----- If sleeping during an event -> they get jolted awake with consequences -----
  // we treat events above: neighborKnock, windowKnock, pantryEvent. If they happen and sleeping true -> wake with penalty
  // Check neighbor present and sleeping
  if (neighborPresent && sleeping) {
    sleeping = false;
    sleepStat = clamp(sleepStat - 20); // sleep not restored
    sanity = clamp(sanity - 20);
    log('Сосед стучит — тебя разбудили! Сон почти не восстановился, рассудок пострадал.');
    // show player bedroom scene to represent waking
    showScene('bedroom');
  }
  if (windowKnockTriggered && sleeping) {
    sleeping = false;
    sleepStat = clamp(sleepStat - 25);
    sanity = clamp(sanity - 25);
    log('Стук в окно разбудил тебя резко — последствия тяжёлые.');
    showScene('bedroom');
  }
  if (pantryEvent && pantryEvent.active && sleeping) {
    sleeping = false;
    sleepStat = clamp(sleepStat - 15);
    sanity = clamp(sanity - 10);
    log('Звук из кладовки разбудил тебя — сон почти не восстановился.');
    showScene('bedroom');
  }

  // ----- Goal check: survive to Mon 19:00 (which is startGameMinutes >= 24*60 = 1440) -----
  // Start is Sun 19:00 => to Mon 19:00 is 24 hours => 1440 minutes
  if (abs >= 1440) {
    victory('Ты выжил 24 часа — демо пройдено!');
    return;
  }
}

// -----------------------------
// Player actions that interact with events (open door, give salt, etc.)
// We'll implement door opening and giving salt in hall / peephole interactions.
// -----------------------------
function playerOpenDoorAndGiveSalt() {
  // If neighbor is present and knocking, opening -> immediate death per rules
  if (neighborPresent) {
    endGame('Ты открыл дверь и дал соли — сосед оказался опасен и задушил тебя.');
    return;
  } else {
    // opening while no neighbor: nothing special
    log('Ты открыл дверь — никого нет.');
  }
}

function playerLookThroughPeepholeAndWait() {
  // If neighbor present, we watch until neighbor leaves; neighborHandled is set when neighborPresent becomes false
  if (neighborPresent) {
    // set an interval to watch neighbor leaving: if neighborPresent is true, player should stay at peephole
    log('Ты выглядываешь — жди, пока сосед уйдёт.');
    const start = absoluteMinutes();
    const check = setInterval(()=> {
      if (!neighborPresent) {
        neighborHandled = true;
        clearInterval(check);
        log('Сосед ушёл — ты посмотрел в глазок достаточно долго и избежал опасности.');
        // if player was at peephole and waited, no further consequence
      } else {
        // if player left peephole (currentSceneId != 'peephole') -> cancel watch
        if (currentSceneId !== 'peephole') {
          clearInterval(check);
          log('Ты оторвался от глазка — не ясно, остался ли сосед.');
        }
      }
    }, 1000);
  } else {
    log('Никого нет в коридоре.');
  }
}

// -----------------------------
// Additional in-scene actions to wire: open door, give salt, trigger open closet, etc.
// We'll add a small hook so choices can call these actions easily.
// -----------------------------
function openDoorFromHall() {
  // if neighborPresent => opening causes death
  if (neighborPresent) {
    endGame('Ты открыл дверь во время стука — сосед оказался смертельно опасен.');
    return;
  } else {
    log('Дверь открыта — пусто.');
  }
}

// -----------------------------
// Wiring pewphole scene to set neighborHandled when player is looking
// (the peephole onEnter already logs; we'll call our watch function when player chooses to "посмотреть в глазок")
// Update the scene choices to call playerLookThroughPeepholeAndWait when choosing peephole
// -----------------------------
scenes.hall.choices = [
  { t:'Посмотреть в глазок', action: ()=> showScene('peephole'), to: 'peephole' },
  { t:'Выйти в тамбур (выйти из квартиры)', action: ()=> {
      // leaving apartment
      if (neighborKnockHappened && !neighborHandled && timeObj.dayOfWeek >= 1 && timeObj.hours >= 8) {
        endGame('Когда ты вышел из квартиры — сверху упал топор. (Игнор стука)');
        return;
      }
      if (outsideBlockedUntil && absoluteMinutes() < outsideBlockedUntil) {
        endGame('Ты вернулся раньше определения безопасного времени — последствия ужасны.');
        return;
      }
      showScene('outside');
    } },
  { t:'Вернуться', to:'corridor' }
];

// override peephole scene choices to observe
scenes.peephole.choices = [
  { t:'Смотреть в глазок (ждать)', action: ()=> {
      // call watch function
      playerLookThroughPeepholeAndWait();
      showScene('peephole');
    } },
  { t:'Отойти', to:'hall' }
];

// Hall onEnter to show neighbor messages if present
scenes.hall.onEnter = ()=> {
  if (neighborPresent) {
    log('Слышен стук — соседи на лестничной площадке.');
  }
};

// Fridge action already covers fridgeSabotaged via text function

// Hook: when player chooses to "give salt" (if implemented) we would call playerOpenDoorAndGiveSalt()
// But in our demo choices we do not include giving salt — we only allow looking through peephole or opening.

// For TV on max we want the player to remain to win pantry challenge. tv_on_max.onEnter sets tvFocused.

// When player leaves tv_on_max, onLeave resets tvFocused. We already set that in showScene by calling onLeave.

// -----------------------------
// Initialization
// -----------------------------
function startGame() {
  // reset basic vars
  startGameMinutes = 0;
  timeObj = { dayOfWeek:0, hours:19, minutes:0 };
  hunger = 80; sleepStat=70; sanity=90; health=100;
  currentSceneId = null; sleeping=false;
  cabinetCheckedToday=false; fridgeSabotaged=false;
  neighborKnockHappened=false; neighborHandled=false; neighborPresent=false;
  pantryEvent=null; tvFocused=false; tvFocusStart=null;
  windowKnockTriggered=false; windowEventFailed=false; voiceEffectActive=false;
  gameEnded=false;

  scheduleInitialRandoms();

  updateHUD();
  showScene('corridor');
  // start main tick
  mainInterval = setInterval(mainTick, 1000);
}

let mainInterval = null;
startGame();

// Expose some functions for debugging from console (optional)
window._game = {
  state: ()=> ({ timeObj, startGameMinutes, hunger, sleepStat, sanity, health, neighborPresent, pantryEvent }),
  addMinutes: addMinutes
};
