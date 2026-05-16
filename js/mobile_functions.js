window.addEventListener("load", () => {
    updateMobileUI();
    checkOrientation();
    document.querySelectorAll("#mobile_controls img").forEach(img => {
    img.addEventListener("contextmenu", e => e.preventDefault());
});
});

window.addEventListener("resize", () => {
    updateMobileUI();
    checkOrientation();
});

window.addEventListener("orientationchange", () => {
    checkOrientation();
    updateMobileUI();
});

function checkOrientation() {
    if (!isMobile()) return;
    const isLandscape = window.innerWidth > window.innerHeight;
    if (pendingGameStart) {
        if (isLandscape) {
            pendingGameStart = false;
            startGame();
        } else {
            showRotateMessage();
        }
        return;
    }
    if (gameState.started) {
        if (!isLandscape) {
            showRotateMessage();
            keyboard.P = true;
            document.getElementById("rotate_overlay_gameplay").classList.remove("d_none");
            
        } else {
            hideRotateMessage();
            keyboard.P = false;
            document.getElementById("rotate_overlay_gameplay").classList.add("d_none");
            
        }
    }
}

function showRotateMessage() {
    document.getElementById("rotate_overlay").classList.remove("d_none");
}

function hideRotateMessage() {
    document.getElementById("rotate_overlay").classList.add("d_none");
}

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function updateMobileUI() {
    const controls = document.getElementById("mobile_controls");
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isMobile() && gameState.started && isLandscape) {
        controls.classList.remove("d_none");
        document.getElementById("fullscreen_btn").classList.add("d_none");
    } else {
        controls.classList.add("d_none");
        document.getElementById("fullscreen_btn").classList.remove("d_none");
    }
}

function enterGameFullscreen() {
    const game = document.getElementById("game_container");

    if (!document.fullscreenElement) {
        game.requestFullscreen();
    }
}

function exitFullscreenIfNeeded() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function toggleFullscreen() {
    let game = document.getElementById("game_container");
    if (!document.fullscreenElement) {
        game.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
