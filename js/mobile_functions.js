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
            world.gameState = "paused";
            document.getElementById("rotate_overlay_gameplay").classList.remove("d_none");
            
        } else {
            hideRotateMessage();
            world.gameState = "playing";
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
        document.getElementById("mute_btn_desktop").classList.add("d_none");
    } else {
        controls.classList.add("d_none");
        document.getElementById("fullscreen_btn").classList.remove("d_none");
        document.getElementById("mute_btn_desktop").classList.remove("d_none");
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

function toggleMobileMenu() {
    if (event) {
        event.stopPropagation();
    }
    if (document.getElementById('overlay_mobile_game_description').classList.contains("d_none") === false) {
        closeModal('overlay_mobile_game_description');
    }
    
    const menu = document.getElementById("mobile_menu");  
    const movecontrols = document.getElementById("mobile_move_controls");  
    const actioncontrols = document.getElementById("mobile_action_controls"); 
    if (menu.classList.contains("d_none")) {
        movecontrols.classList.add("d_none");
        actioncontrols.classList.add("d_none");
        menu.classList.remove("d_none");
        document.body.classList.add("no_scroll");
        world.gameState = "paused";
    } else {      
        console.log("CLOSE MENU");  
        menu.classList.add("d_none");
        document.body.classList.remove("no_scroll");
        movecontrols.classList.remove("d_none");
        actioncontrols.classList.remove("d_none");
        world.gameState = "playing";
    }   
}

function continueGame() {
    event.stopPropagation();
    const menu = document.getElementById("mobile_menu");  
    const movecontrols = document.getElementById("mobile_move_controls");  
    const actioncontrols = document.getElementById("mobile_action_controls"); 
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
    world.gameState = "playing";
}

function restartGame() {
    world.startGame();
    const menu = document.getElementById("mobile_menu");  
    const movecontrols = document.getElementById("mobile_move_controls");  
    const actioncontrols = document.getElementById("mobile_action_controls"); 
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");
}

function goBackToStartScreen() {
    world.goToStart();
    const menu = document.getElementById("mobile_menu");  
    const movecontrols = document.getElementById("mobile_move_controls");  
    const actioncontrols = document.getElementById("mobile_action_controls"); 
    menu.classList.add("d_none");
    document.body.classList.remove("no_scroll");
    movecontrols.classList.remove("d_none");
    actioncontrols.classList.remove("d_none");  
}

function openModalGameDescriptionMobile() {
    openModal('overlay_mobile_game_description');
    const menu = document.getElementById("mobile_menu"); 
    menu.classList.add("d_none");


}
