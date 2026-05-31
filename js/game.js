let canvas;
let world; 
let keyboard = new Keyboard();
let gameState = {
    started: false,};
let pendingGameStart = false;

/**
 * Initializes the game world, canvas, and audio system.
 * Sets up callbacks for exiting to menu and game over UI handling.
 * Starts background music on the start screen.
 */
function init(){
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard);
    world.onExitToMenu = () => {
    gameState.started = false;
    updateMobileUI();
    mobileGameDescription();
    };
    world.onGameOverUI = () => {
        gameState.started = false;
        updateMobileUI();
        mobileGameDescription();};
    world.audio.initialize();
    world.audio.playMusic(world.audio.startScreenMusic);
}

/**
 * Handles the start game button behavior depending on device type and orientation.
 * On desktop the game starts immediately.
 * On mobile, the game only starts in landscape mode; otherwise orientation check is triggered.
 */
function startGameButton() {
    // Desktop -> direkt starten
    if (!isMobile()) {
        startGame();
        return;
    }
    if (window.innerWidth > window.innerHeight) {
        startGame();
    } else {
        pendingGameStart = true;
        checkOrientation()
    }
}

/**
 * Starts the actual game session.
 * Sets game state, triggers fullscreen on mobile devices,
 * updates UI and hides orientation messages.
 */
function startGame() {
    console.log("START GAME");
    keyboard.S = true;
    gameState.started = true;
    hideRotateMessage();
   if (isMobile()) {
        console.log("Entering fullscreen mode for mobile.");
        console.log("mobile detected, updating UI.");
        updateMobileUI() 
        removeMobileGameDescription();
        waitForLayoutStable(() => {
            resizeCanvas();
        });
    }
}

function waitForLayoutStable(callback) {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let stableFrames = 0;
    function check() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === lastWidth && h === lastHeight) {
            stableFrames++;
        } else {
            stableFrames = 0;
            lastWidth = w;
            lastHeight = h;
        }
        if (stableFrames >= 3) {
            callback();
        } else {
            requestAnimationFrame(check);
        }
    }
    requestAnimationFrame(check);
}


/**
 * Opens a modal dialog by id and locks page scrolling.
 * Also plays a UI sound effect.
 *
 * @param {string} id - The DOM element ID of the modal to open.
 */
function openModal(id) {
    document.getElementById(id).classList.remove("d_none");
    document.body.classList.add("no_scroll");
    world.audio.playSound(world.audio.openGameDescriptionSound);
}

/**
 * Closes a modal dialog by id and restores page scrolling.
 * Also plays a UI sound effect.
 *
 * @param {string} id - The DOM element ID of the modal to close.
 */
function closeModal(id) {
    document.getElementById(id).classList.add("d_none");
    document.body.classList.remove("no_scroll");
    world.audio.playSound(world.audio.openGameDescriptionSound);
}

/**
 * Handles keyboard input when a key is pressed down.
 * Updates the global keyboard state for movement, actions, and game controls.
 * Prevents default browser behavior for arrow keys and space.
 * The "D" key is only triggered once per press (no repeat while holding).
 */
window.addEventListener("keydown", (e) => {
    const blockedKeys = [
        32,
        37,
        38,
        39,
        40
    ];
    if (blockedKeys.includes(e.keyCode)) {
        e.preventDefault();
    }
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (
        (e.key == "d" || e.key == "D")
        && !e.repeat
    ) {
        keyboard.D = true;
    }
    if (e.key == "s" || e.key == "S") {
        keyboard.S = true;
    }
    if (e.key == "p" || e.key == "P") {
        keyboard.P = true;
    }
    if (e.key === "Escape") {
        keyboard.ESC = true;
    }
});

/**
 * Handles keyboard input when a key is released.
 * Resets movement and action states so the character stops or stops performing actions.
 * Prevents default browser behavior for arrow keys and space.
 */
window.addEventListener("keyup", (e) => { 
      const blockedKeys = [
        32, // Space
        37, // Left
        38, // Up
        39, // Right
        40  // Down
    ];
    if (blockedKeys.includes(e.keyCode)) {
        e.preventDefault();
    }
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