let canvas;
let world; 
let keyboard = new Keyboard();
let gameState = {
    started: false,};
let pendingGameStart = false;



function init(){
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard);
    world.onExitToMenu = () => {
    gameState.started = false;
    updateMobileUI();
    exitFullscreenIfNeeded();
    };
    world.onGameEnded = () => {
        gameState.started = false;
        updateMobileUI();
        exitFullscreenIfNeeded();
    };
}

function startGameButton() {
    // Desktop -> direkt starten
    if (!isMobile()) {
        startGame();
        return;
    }
    // Mobile + Landscape -> starten
    if (window.innerWidth > window.innerHeight) {
        startGame();
    } else {
    // Mobile + Portrait
        pendingGameStart = true;
        checkOrientation()
    }
}

function startGame() {
    keyboard.S = true;
    gameState.started = true;
    hideRotateMessage();
   if (isMobile()) {
        console.log("Entering fullscreen mode for mobile.");
        enterGameFullscreen();
        console.log("mobile detected, updating UI.");
        updateMobileUI() 
    }
}

function openModal(id) {
    document.getElementById(id).classList.remove("d_none");
    document.body.classList.add("no_scroll");
}

function closeModal(id) {
    document.getElementById(id).classList.add("d_none");
    document.body.classList.remove("no_scroll");
}

window.addEventListener("keydown", (e) => { 
    if(e.keyCode == 39) keyboard.RIGHT = true;
    if(e.keyCode == 37) keyboard.LEFT = true;
    if(e.keyCode == 38) keyboard.UP = true;
    if(e.keyCode == 40) keyboard.DOWN = true;
    if(e.keyCode == 32) keyboard.SPACE = true;
    if(e.key == "d" || e.key == "D") keyboard.D = true;
    if(e.key == "s" || e.key == "S") keyboard.S = true; 
    if(e.key == "p" || e.key == "P") keyboard.P = true; 
    if(e.key === "Escape") keyboard.ESC = true;
    
});


window.addEventListener("keyup", (e) => { 
    if(e.keyCode == 39) keyboard.RIGHT = false;
    if(e.keyCode == 37) keyboard.LEFT = false;
    if(e.keyCode == 38) keyboard.UP = false;
    if(e.keyCode == 40) keyboard.DOWN = false;
    if(e.keyCode == 32) keyboard.SPACE = false;
    if(e.key == "d" || e.key == "D") keyboard.D = false; //Taste für Werfen von Objekten
    if(e.key == "s" || e.key == "S") keyboard.S = false; //S-Taste für Starten/Neustarten des Spiels
    if(e.key == "p" || e.key == "P") keyboard.P = false; //P-Taste für Pause/Unpause des Spiels
    if(e.key === "Escape") keyboard.ESC = false; //Zurücl zum Startbildschirm mit ESC-Taste
    
});