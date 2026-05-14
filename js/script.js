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
});

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        showRotateMessage();
    } else {
        hideRotateMessage();
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
    console.log("Updating mobile UI. Mobile detected:", isMobile(), "Game started:", gameState.started);    
    if (isMobile() && gameState.started) {
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

