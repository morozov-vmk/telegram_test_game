let clockInterval = null;

let gameState = {
    abs_minutes: 19 * 60,
    currentScene: null,
    currentScenename: null

};

const scenes = {

    start: {
        background: "images/start.png",
        sound: "sounds/def.mp3",
        text: "Поздравляю! Игра тестируется",
        choices: [
            
          ]
    }
}


function loadScene(name) {
    const scene = scenes[name];
  
    const game = document.getElementById("game");
  
    game.classList.remove("fade-in");
    game.classList.add("fade-out");
  
    setTimeout(() => {
        gameState.currentScene = scene;
        gameState.currentScenename = name;
        document.getElementById("background").style.backgroundImage = `url(${scene.background})`;
        document.getElementById("story").textContent = scene.text;
        const audio = document.getElementById("bgm");
        if (scene.sound) {
            audio.src = scene.sound;
            audio.loop = true;
            audio.play().catch(() => {});
        }
        if (scene.onEnter) scene.onEnter();
  
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
  
        game.classList.remove("fade-out");
        game.classList.add("fade-in");
    }, 400);
  }


function startClock() {
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(() => triggerManager(), 1000);
}


function updateClock() {
    const m = String((gameState.abs_minutes % (24 * 60)) % 60).padStart(2, "0");
    const h = String(Math.trunc((gameState.abs_minutes % (24 * 60)) / 60)).padStart(2, "0");
    const d = String(Math.trunc(gameState.abs_minutes / (24 * 60)) + 1).padStart(1, "0");
    document.getElementById("time").textContent = `День ${d}. ${h}:${m}`;
    // console.log(d, h, m)
}


function triggerManager() {
    gameState.abs_minutes += 1;

    updateClock();
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

