class AudioManager {
    constructor() {
        this.soundMuted = false;
        this.startScreenMusic = new Audio("./audio/start_screen_music.mp3");
        this.openGameDescriptionSound = new Audio("./audio/open_game_description.mp3");
        this.gameEscapeSound = new Audio("./audio/game_escape_sound.mp3");
        this.jumpSound = new Audio("./audio/jump_sound.mp3");
        this.throwSound = new Audio("./audio/throw_sound.mp3");
        this.sleepSound = new Audio("./audio/sleep_sound.mp3");
        this.characterDeathSound = new Audio("./audio/character_death_sound.mp3");
        this.characterHurtSound = new Audio("./audio/character_hurt_sound.mp3");
        this.GameMusicLevel1 = new Audio("./audio/gameplay_music_level1.mp3");
        this.winningSound = new Audio("./audio/winning_sound.mp3");
        this.gameOverSound = new Audio("./audio/game_over_sound.mp3");
        this.pauseSound = new Audio("./audio/pause_sound.mp3");
        this.chickenDeadSound = new Audio("./audio/chicken_dead_sound.mp3");
        this.bigChickenSound = new Audio("./audio/big_chicken_sound.mp3");
        this.smallChickenSound = new Audio("./audio/small_chicken_sound.mp3");
        this.endBossBeginningSound = new Audio("./audio/end_boss_beginning_sound.mp3");

        this.music = [
        this.startScreenMusic,
        this.GameMusicLevel1,
        ];

        this.sfx = [
        this.winningSound,
        this.gameOverSound,
        this.openGameDescriptionSound,
        this.gameEscapeSound,
        this.sleepSound,
        this.characterHurtSound,
        this.jumpSound,
        this.throwSound,
        this.pauseSound,
        this.chickenDeadSound,
        this.bigChickenSound,
        this.smallChickenSound,
        this.endBossBeginningSound
        ];    

        // this.allSounds = [...this.music, ...this.sfx];
        this.activeSounds = [];
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
    this.updateMuteButtons();
}

toggleMute() {
    this.soundMuted = !this.soundMuted;
    localStorage.setItem("soundMuted", this.soundMuted);
    this.updateMuteButtons();
    if (this.soundMuted) {
        this.pauseMusic();
    } else {
        this.resumeMusic();
    }
}

updateMuteButtons() {
    const desktop = document.getElementById("mute_btn_desktop");
    const mobile = document.getElementById("mute_btn");

    [desktop, mobile].forEach(btn => {
        if (!btn) return;
        btn.src = this.soundMuted
            ? "./icons/mute.png"
            : "./icons/unmute.png";
    });
}

playMusic(sound) {
    this.stopMusic();
    this.currentMusic = sound;
    sound.loop = true;
    sound.volume = 0.1;
    if (this.soundMuted) return;
    sound.currentTime = 0;
    sound.play();
}

playSound(sound) {
    if (this.soundMuted) return;
    let soundClone = sound.cloneNode();
    soundClone.volume = sound.volume;
    soundClone.play();
    this.activeSounds.push(soundClone);
    soundClone.onended = () => {
        this.activeSounds =
            this.activeSounds.filter(s => s !== soundClone);
    };
}

pauseMusic() {
    if (this.currentMusic) {
        this.currentMusic.pause();
    }
}

stopMusic() {
    if (this.currentMusic) {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
    }
}

resumeMusic() {
    if (this.currentMusic) {
        this.currentMusic.play();
    }
}

stopAllSounds() {
    [...this.music, ...this.sfx].forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    this.activeSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    this.activeSounds = [];
}

}