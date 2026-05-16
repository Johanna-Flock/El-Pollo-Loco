class AudioManager {
    constructor() {
        this.backgroundMusic = new Audio("./audio/background_music.mp3");
        this.openGameDescriptionSound = new Audio("./audio/open_game_description.mp3");
        this.gameEscapeSound = new Audio("./audio/game_escape_sound.mp3");
        this.jumpSound = new Audio("./audio/jump_sound.mp3");
        this.throwSound = new Audio("./audio/throw_sound.mp3");
        this.sleepSound = new Audio("./audio/sleep_sound.mp3");
        this.characterHurtSound = new Audio("./audio/character_hurt_sound.mp3");
        this.startGameMusic = new Audio("./audio/start_game_music.mp3");
        this.winningSound = new Audio("./audio/winning_sound.mp3");
        this.gameOverSound = new Audio("./audio/game_over_sound.mp3");
        this.pauseSound = new Audio("./audio/pause_sound.mp3");
        this.chickenDeadSound = new Audio("./audio/chicken_dead_sound.mp3");
        this.bigChickenSound = new Audio("./audio/big_chicken_sound.mp3");
        this.smallChickenSound = new Audio("./audio/small_chicken_sound.mp3");
        this.endBossBeginningSound = new Audio("./audio/end_boss_beginning_sound.mp3");
        this.allSounds = [
            this.backgroundMusic,
            this.openGameDescriptionSound,
            this.gameEscapeSound,
            this.jumpSound,
            this.throwSound,
            this.sleepSound,
            this.characterHurtSound,
            this.startGameMusic,
            this.winningSound,
            this.gameOverSound,
            this.pauseSound,
            this.chickenDeadSound,
            this.bigChickenSound,
            this.smallChickenSound,
            this.endBossBeginningSound
        ];

        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;
    }

initialize() {
    localStorage.setItem("soundMuted", "false");
    this.loadSoundSettings();
}

loadSoundSettings() {
    const savedState = localStorage.getItem("soundMuted");
    if (savedState === "true") {
        soundMuted = true;
    } else {
        soundMuted = false;
    }
    updateMuteButton();
}

toggleMute() {
    soundMuted = !soundMuted;
    localStorage.setItem("soundMuted", soundMuted);
    updateMuteButton();
    if (soundMuted) {
        stopAllSounds();
    } else {
        resumeSounds();
    }
}

resumeSounds() {
    playSound(backgroundMusic);
}

updateMuteButton() {
    const muteBtn = document.getElementById("mute_btn");
    if (soundMuted) {
        muteBtn.src = "./icons/mute.png";
    } else {
        muteBtn.src = "./icons/mute.png";
    }
}

playSound(sound) {
    if (soundMuted) return;
    sound.currentTime = 0;
    sound.play();
}

stopAllSounds() {
    allSounds.forEach(sound => {
        sound.pause();
    });
}

}