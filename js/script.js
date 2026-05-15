function openModal(id) {
    document.getElementById(id).classList.remove("d_none");
    document.body.classList.add("no_scroll");
}

function closeModal(id) {
    document.getElementById(id).classList.add("d_none");
    document.body.classList.remove("no_scroll");
}

function toggleFullscreen() {
    let game = document.getElementById("game_container");
    if (!document.fullscreenElement) {
        game.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

window.addEventListener("load", () => {
    updateMobileUI();
    checkOrientation();
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
            
        } else {
            hideRotateMessage();
            keyboard.P = false;
            
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

