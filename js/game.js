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
    world.audio.initialize();
    world.onExitToMenu = () => {
    gameState.started = false;
    updateMobileUI();
      if (isMobile()) {
        mobileGameDescription()
    } else {
        GameDescription()
    }
    };
    world.onGameEndUI = () => {
        gameState.started = false;
        document.getElementById("afterGameMenu").classList.remove("d_none");};
}

/**
 * Handles the start game button behavior depending on device type and orientation.
 * On desktop the game starts immediately.
 * On mobile, the game only starts in landscape mode; otherwise orientation check is triggered.
 */
function startGameButton() {
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
    keyboard.S = true;
    gameState.started = true;
    hideRotateMessage();
   if (isMobile()) {
        updateMobileUI() 
        removeMobileGameDescription();
        waitForLayoutStable(() => {
            resizeCanvas();
        });
    }
}

/**
 * Checks for stable layout after orientation change before starting the game.
 * This function repeatedly checks the window dimensions until they have been stable for a few frames,
 * which indicates that the layout has settled after an orientation change. Once stable, it calls the provided callback.
 *
 * @param {function} callback - The function to call once the layout is stable.
 */
function waitForLayoutStable(callback) {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let stableFrames = 0;
    function check() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === lastWidth && h === lastHeight) {stableFrames++;
        } else {
            stableFrames = 0;
            lastWidth = w;
            lastHeight = h;
        }
        if (stableFrames >= 3) {callback();

        } else {requestAnimationFrame(check);}
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
        "Space",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown"
    ];
    if (blockedKeys.includes(e.code)) {
        e.preventDefault();
    }
    if (e.code === "ArrowRight") keyboard.RIGHT = true;
    if (e.code === "ArrowLeft") keyboard.LEFT = true;
    if (e.code === "ArrowUp") keyboard.UP = true;
    if (e.code === "ArrowDown") keyboard.DOWN = true;
    if (e.code === "Space") keyboard.SPACE = true;
    if (e.code === "KeyD" && !e.repeat) {
        keyboard.D = true;
    }
    if (e.code === "KeyS") {
        keyboard.S = true;
    }
    if (e.code === "KeyP") {
        keyboard.P = true;
    }
    if (e.code === "Escape") {
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
        "Space",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown"
    ];
    if (blockedKeys.includes(e.code)) {
        e.preventDefault();
    }
    if (e.code === "ArrowRight") keyboard.RIGHT = false;
    if (e.code === "ArrowLeft") keyboard.LEFT = false;
    if (e.code === "ArrowUp") keyboard.UP = false;
    if (e.code === "ArrowDown") keyboard.DOWN = false;
    if (e.code === "Space") keyboard.SPACE = false;
    if (e.code === "KeyD") keyboard.D = false;
    if (e.code === "KeyS") keyboard.S = false;
    if (e.code === "KeyP") keyboard.P = false;
    if (e.code === "Escape") keyboard.ESC = false;
});