class AudioManager {
    constructor() {
        this.soundMuted = false;
        this.startScreenMusic = new Audio("./audio/start_screen_music.mp3");
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
            this.startScreenMusic,
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

        this.currentMusic = null;
        this.startScreenMusic.loop = true;
        this.startScreenMusic.volume = 0.1;
    }

initialize() {
    this.loadSoundSettings();
}

loadSoundSettings() {
    const savedState = localStorage.getItem("soundMuted");
    if (savedState === "true") {
        this.soundMuted = true;
    } else {
        this.soundMuted = false;
    }
    this.updateMuteButtonDesktop();
    this.updateMuteButton();
}

playMusic(sound) {
    this.stopAllSounds();
    this.currentMusic = sound;
    this.playSound(sound);
}

toggleMuteDesktop() {
    this.soundMuted = !this.soundMuted;
    localStorage.setItem("soundMuted", this.soundMuted);
    this.updateMuteButtonDesktop();
    if (this.soundMuted) {
        this.stopAllSounds();
    } else {
        this.resumeSounds();
    }
}

toggleMuteMobile() {
    this.soundMuted = !this.soundMuted;
    localStorage.setItem("soundMuted", this.soundMuted);
    this.updateMuteButton();
    if (this.soundMuted) {
        this.stopAllSounds();
    } else {
        this.resumeSounds();
    }
}

resumeSounds() {
    if (this.currentMusic) {
        this.playSound(this.currentMusic);
    }
}

updateMuteButtonDesktop() {
    const muteBtn = document.getElementById("mute_btn_desktop");
    if (this.soundMuted) {
        muteBtn.src = "./icons/mute.png";
    } else {
        muteBtn.src = "./icons/unmute.png";
    }
}

updateMuteButton() {
    const muteBtn = document.getElementById("mute_btn");
    if (this.soundMuted) {
        muteBtn.src = "./icons/mute.png";
    } else {
        muteBtn.src = "./icons/unmute.png";
    }
}

playSound(sound) {
    if (this.soundMuted) return;
    sound.currentTime = 0;
    sound.play();
}

stopAllSounds() {
    this.allSounds.forEach(sound => {
        sound.pause();
    });
}

}