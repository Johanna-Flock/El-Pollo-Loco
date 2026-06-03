/**
 * Initializes mobile UI and orientation handling after page load.
 * Prevents long-press context menu on mobile control images.
 */
window.addEventListener("load", () => {
    updateMobileUI();
    checkOrientation();
    document.querySelectorAll("#mobile_controls img").forEach(img => {
        img.addEventListener("contextmenu", e => e.preventDefault());
    });
    if (isMobile()) {
        mobileGameDescription();
    }
     if (!isMobile()) {
        GameDescription();
    }
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            resizeCanvas();
        });
    });
});

/**
 * Updates mobile UI layout whenever the window is resized.
 * Also checks screen orientation to adjust gameplay/UI behavior.
 */
window.addEventListener("resize", () => {
    updateMobileUI();   
    checkOrientation();
     if (isMobile()) {
        mobileGameDescription();
    }
    if (!isMobile()) {
        GameDescription();
    }
     setTimeout(() => {
        resizeCanvas();
    }, 150);
});

/**
 * Handles device orientation changes (portrait/landscape).
 * Ensures UI and game state adapt correctly after rotation.
 */
window.addEventListener("orientationchange", () => {
    checkOrientation();
    updateMobileUI();
    if (isMobile()) {
        mobileGameDescription();
    }
    if (!isMobile()) {
        GameDescription();
    }
    setTimeout(() => {
        resizeCanvas();
    }, 150);
});

/**
 * Checks device orientation and handles game behavior accordingly.
 * - Handles pending game start
 * - Pauses/resumes gameplay on orientation change
 */
function checkOrientation() {
    if (!isMobile()) return;
    const isLandscape = window.innerWidth > window.innerHeight;
    handlePendingStart(isLandscape);
    handleGameplayOrientation(isLandscape);
}


/**
 * Handles game start that was triggered in portrait mode.
 * Starts the game automatically when landscape is reached.
 */
function handlePendingStart(isLandscape) {
    if (!pendingGameStart) return;
    pendingGameStart = false;
    if (isLandscape) {
        startGame();
    } else {
        showRotateMessage();
        pendingGameStart = true;
    }
}

/**
 * Handles orientation changes during active gameplay.
 * Pauses or resumes the game depending on screen orientation.
 */
function handleGameplayOrientation(isLandscape) {
    if (!gameState.started) return;
    if (!world) return;
    if (!world.level) return;
    const overlay = document.getElementById("rotate_overlay");
    if (!isLandscape) {
        showRotateMessage();
        world.pauseGame();
        overlay.classList.remove("d_none");
    } else {
        hideRotateMessage();
        world.resumeGame();
        overlay.classList.add("d_none");
    }
}

/**
 * Shows the rotate device overlay.
 */
function showRotateMessage() {
    document.getElementById("rotate_overlay").classList.remove("d_none");
}

/**
 * Hides the rotate device overlay.
 */
function hideRotateMessage() {
    document.getElementById("rotate_overlay").classList.add("d_none");
}

/**
 * Detects whether the user is on a mobile device.
 * @returns {boolean}
 */
function isMobile() {
    return (
        window.matchMedia("(pointer: coarse)").matches &&
        window.matchMedia("(hover: none)").matches
    );  
}

/**
 * Updates mobile UI visibility depending on device, orientation and game state.
 */
function updateMobileUI() {
    const controls = document.getElementById("mobile_controls");
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isMobile() && gameState.started && isLandscape) {
        controls.classList.remove("d_none");
        document.getElementById("fullscreen_btn").classList.add("d_none");
        document.getElementById("mute_btn_desktop").classList.add("d_none");
        removeMobileGameDescription()

    } else {
        controls.classList.add("d_none");
        document.getElementById("fullscreen_btn").classList.remove("d_none");
        document.getElementById("mute_btn_desktop").classList.remove("d_none");
    }
    requestAnimationFrame(() => {
    resizeCanvas();
});
}

/**
 * Shows the mobile game description UI and hides desktop elements.
 * Only executes when the game has not started yet.
 */
function mobileGameDescription() {
if (gameState.started) return;
    document.getElementById("game_description").classList.add("d_none");
    document.getElementById("headline").classList.add("d_none");
    document.getElementById("game_description_mobile").classList.remove("d_none");
    requestAnimationFrame(() => {
    resizeCanvas();
});
}

/**
 * Hides the mobile game description overlay and updates canvas size.
 */
function removeMobileGameDescription() {
    document.getElementById("game_description_mobile").classList.add("d_none");
    requestAnimationFrame(() => {
    resizeCanvas();
});
}

/**
 * Restores the desktop game description UI and hides mobile version.
 */
function GameDescription() {
    document.getElementById("game_description_mobile").classList.add("d_none");
    document.getElementById("headline").classList.remove("d_none");
    document.getElementById("game_description").classList.remove("d_none");

}

/**
 * Enters fullscreen mode for the game container if not already in fullscreen.
 */
function enterGameFullscreen() {
    const game = document.getElementById("game_container");
    if (!document.fullscreenElement) {
        game.requestFullscreen();
    }
}

/**
 * Exits fullscreen mode if the document is currently in fullscreen.
 */
function exitFullscreenIfNeeded() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

/**
 * Toggles fullscreen mode for the game container.
 * Enters fullscreen if not active, otherwise exits fullscreen.
 */
function toggleFullscreen() {
    let game = document.getElementById("game_container");
    if (!document.fullscreenElement) {
        game.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Toggles the mobile menu open/close state and handles game pause/resume logic.
 */
function toggleMobileMenu() {
    if (event) {
        event.stopPropagation();
    }
    closeMobileDescriptionIfOpen();
    const menu = document.getElementById("mobile_menu");
    const movecontrols = document.getElementById("mobile_move_controls");
    const actioncontrols = document.getElementById("mobile_action_controls");
    if (isMenuClosed(menu)) {
        openMobileMenu(menu, movecontrols, actioncontrols);
    } else {
        closeMobileMenu(menu, movecontrols, actioncontrols);
    }
}

/**
 * Closes the mobile game description overlay if it is currently open.
 */
function closeMobileDescriptionIfOpen() {
    const overlay = document.getElementById('overlay_mobile_game_description');
    if (!overlay.classList.contains("d_none")) {
        closeModal('overlay_mobile_game_description');
    }
}

/**
 * Checks whether the mobile menu is currently closed.
 */
function isMenuClosed(menu) {
    return menu.classList.contains("d_none");
}

/**
 * Opens the mobile menu and hides in-game controls.
 */
function openMobileMenu(menu, movecontrols, actioncontrols) {
    movecontrols.classList.add("d_none");
    actioncontrols.classList.add("d_none");
    menu.classList.remove("d_none");
    document.body.classList.add("no_scroll");
    world.pauseGame();
}

/**
 * Closes the mobile menu and restores in-game controls.
 */
function closeMobileMenu(menu, movecontrols, actioncontrols) {
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
    world.resumeGame();
}

/**
 * Continues the game from the paused mobile menu state.
 */
function continueGame() {
    event.stopPropagation();
    const menu = document.getElementById("mobile_menu");
    const movecontrols = document.getElementById("mobile_move_controls");
    const actioncontrols = document.getElementById("mobile_action_controls");
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
    world.resumeGame();
    resizeCanvas();
}

/**
 * Restarts the game and closes the mobile menu.
 */
function restartGame() {
    world.startGame();
    const menu = document.getElementById("mobile_menu");
    const movecontrols = document.getElementById("mobile_move_controls");
    const actioncontrols = document.getElementById("mobile_action_controls");
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
    resizeCanvas();
}

/**
 * Restarts the game after the winning/gameover Screen.
 */
function restartGameAfterEnding() {
    document.getElementById("afterGameMenu").classList.add("d_none")
    world.startGame();
    gameState.started = true;
    updateMobileUI()
    waitForLayoutStable(() => {
            resizeCanvas();
    });
}

/**
 * Goes back to the start screen after the game has ended.
 */
function goBackToStartScreenAfterEnding() { 
    world.goToStart();
    gameState.started = false;
    updateMobileUI()
     if (isMobile()) {
        mobileGameDescription()
    } else {
        GameDescription()
    }
    exitFullscreenIfNeeded() 
    document.getElementById("afterGameMenu").classList.add("d_none");
}

/**
 * Returns to the start screen and closes the mobile menu.
 */
function goBackToStartScreen() {
    world.goToStart();
    const menu = document.getElementById("mobile_menu");
    const movecontrols = document.getElementById("mobile_move_controls");
    const actioncontrols = document.getElementById("mobile_action_controls");
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
    gameState.started = false;
    mobileGameDescription();

}

/**
 * Opens the mobile game description modal and closes the menu.
 */
function openModalGameDescriptionMobile() {
    openModal('overlay_mobile_game_description');
    const menu = document.getElementById("mobile_menu");
    menu.classList.add("d_none");
}

/**
 * resizes the game canvas to fit the current window size while maintaining aspect ratio.
 * Uses requestAnimationFrame for smooth resizing and performance optimization.
 */
function resizeCanvas() {
    requestAnimationFrame(() => {
        const canvas = document.getElementById("canvas");
        const menu = document.getElementById("afterGameMenu");
        const w = window.innerWidth;
        const h = window.innerHeight;
        let scale = Math.min(w / 720, h / 480);
        scale = Math.min(scale, 1.5);
        const SAFETY_FACTOR = 0.99;
        const width = Math.floor(720 * scale * SAFETY_FACTOR);
        const height = Math.floor(480 * scale * SAFETY_FACTOR);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        menu.style.width = width + "px";
        menu.style.height = height + "px";
    });
}
