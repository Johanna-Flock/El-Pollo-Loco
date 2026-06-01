class AudioManager {

/**
 * Initializes the AudioManager and loads all game sound assets.
 * Sets default volume, music loops, and sound effect collections.
 * Organizes sounds into music and SFX groups for easier control.
 */
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
        this.bigChickenSound.volume = 0.09;
        this.smallChickenSound = new Audio("./audio/small_chicken_sound.mp3");
        this.endbossAlert = new Audio("./audio/endboss_alert.mp3");
        this.endbossChasingSound = new Audio("./audio/endboss_chasing.mp3");
        this.endbossHurt = new Audio("./audio/endboss_hurt.mp3");
        this.endbossDead = new Audio("./audio/endboss_dead.mp3");
        this.endbossWalking = new Audio("./audio/big_chicken_sound.mp3");
        this.coinCollectSound = new Audio("./audio/coin.mp3");
        this.bottleCollectSound = new Audio("./audio/bottle.mp3");
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
            this.endbossAlert,
            this.endbossChasingSound,
            this.endbossHurt,
            this.endbossDead,
            this.endbossWalking,
            this.coinCollectSound,
            this.bottleCollectSound,
        ];
        // this.allSounds = [...this.music, ...this.sfx];
        this.activeSounds = [];
        this.currentMusic = null;
        this.startScreenMusic.loop = true;
        
    }

/**
 * Initializes the audio system and loads saved sound settings.
 */
    initialize() {
        this.loadSoundSettings();
    }

/**
 * Loads the muted sound state from localStorage and applies it.
 * Updates UI mute buttons accordingly.
 */
    loadSoundSettings() {
        const savedState = localStorage.getItem("soundMuted");
        if (savedState === "true") {
            this.soundMuted = true;
        } else {
            this.soundMuted = false;
        }
        this.updateMuteButtons();
    }

/**
 * Toggles global sound mute state and persists it in localStorage.
 * Updates UI buttons and pauses/resumes music accordingly.
 */
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

/**
 * Updates the mute/unmute icons for both desktop and mobile UI.
 * Reflects the current soundMuted state.
 */
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


/**
 * Plays background music in a loop if sound is not muted.
 * Stops any currently playing music before starting the new track.
 *
 * @param {HTMLAudioElement} sound - The music track to play.
 */
    playMusic(sound) {
        this.stopMusic();
        this.currentMusic = sound;
        sound.loop = true;
        sound.volume = 0.04;
        if (this.soundMuted) return;
        sound.currentTime = 0;
        sound.play();
    }

/**
 * Plays a one-shot sound effect.
 * Creates a clone so multiple instances can overlap.
 * Automatically removes finished sounds from the active sound list.
 *
 * @param {HTMLAudioElement} sound - The sound effect to play.
 */
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

/**
 * Plays a boss sound effect and optionally loops it.
 * Stops any currently playing boss sound before starting a new one.
 *
 * @param {HTMLAudioElement} sound - The boss sound to play.
 * @param {Object} options - Playback options.
 * @param {boolean} options.loop - Whether the sound should loop.
 */
    playBossSound(sound, { loop = false } = {}) {
        if (this.soundMuted) return;
        if (this.currentBossSound) {
            this.currentBossSound.pause();
            this.currentBossSound.currentTime = 0;
        }
        this.currentBossSound = sound;
        sound.loop = loop;
        sound.currentTime = 0;
        sound.play();
    }

/**
 * Stops the currently playing boss sound immediately.
 */
    stopBossSound() {
        if (this.currentBossSound) {
            this.currentBossSound.pause();
            this.currentBossSound.currentTime = 0;
            this.currentBossSound = null;
        }
    }

/**
 * Pauses the currently playing background music without resetting it.
 */
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

/**
 * Stops the current background music and resets playback to the beginning.
 */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

/**
 * Resumes the currently paused background music.
 */
   resumeMusic() {
    if (this.soundMuted) return;

    if (this.currentMusic) {
        this.currentMusic.play();
    }
}

/**
 * Stops and resets all active music and sound effects in the game.
 * Clears all dynamically created active sounds.
 */
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

/**
 * Plays the sleep sound effect.
 */
    onSleep() {
        this.sleepSound.volume = 0.1;
        this.playSound(this.sleepSound);
    }

/**
 * Plays the character hurt sound effect.
 */
    onCharacterHurt() {
        this.characterHurtSound.volume = 0.1;
        this.playSound(this.characterHurtSound);
    }

/**
 * Plays the jump sound effect.
 */
    onJump() {
        this.jumpSound.volume = 0.1;
        this.playSound(this.jumpSound);
    }

/**
 * Plays the throw sound effect.
 */
    onThrow() {
        this.throwSound.volume = 0.1;
        this.playSound(this.throwSound);
    }

/**
 * Plays the character death sound effect.
 * Stops any boss sound before triggering the death sound.
 * Ensures the death sound is only played once.
 */
    onCharacterDeath() {
        if (this.deathSoundPlayed) return;
        this.stopBossSound();
        this.characterDeathSound.volume = 0.1;
        this.playSound(this.characterDeathSound);
    }

/**
 * Plays the pause sound effect.
 */
    onPause() {
        this.pauseSound.volume = 0.1;
        this.playSound(this.pauseSound);
    }

/**
 * Plays the escape/menu sound effect.
 */
    onEscape() {
        this.gameEscapeSound.volume = 0.1;
        this.playSound(this.gameEscapeSound);
    }

/**
 * Plays the coin collection sound effect.
 */
    onCoinCollect() {
        this.coinCollectSound.volume = 0.02;
        this.playSound(this.coinCollectSound);
    }

/**
 * Plays the bottle collection sound effect.
 */
    onBottleCollect() {
        this.bottleCollectSound.volume = 0.03;
        this.playSound(this.bottleCollectSound);
    }

/**
 * Plays the chicken death sound effect.
 */
    onChickenDead() {
        this.chickenDeadSound.volume = 0.1;
        this.playSound(this.chickenDeadSound);
    }

/**
 * Plays the big chicken sound effect.
 */
    onBigChicken() {
        this.bigChickenSound.volume = 0.07;
        this.playSound(this.bigChickenSound);
    }

/**
 * Plays the small chicken sound effect.
 */
    onSmallChicken() {
        this.smallChickenSound.volume = 0.01;
        this.playSound(this.smallChickenSound);
       
    }

/**
 * Plays the endboss walking sound (looped).
 */
    onEndbossWalking() {
        this.endbossWalking.volume = 0.3;
        this.playBossSound(this.endbossWalking, true);
    }

/**
 * Plays the endboss alert sound (non-looped).
 */
    onEndbossAlert() {
        this.endbossAlert.volume = 0.4;
        this.playBossSound(this.endbossAlert, false);
    }

/**
 * Plays the endboss chasing sound (looped).
 */
    onEndbossChasing() {
        this.endbossChasingSound.volume = 0.2;
        this.playBossSound(this.endbossChasingSound, true);
    }

/**
 * Plays the endboss hurt sound (looped).
 */
    onEndbossHurt() {
        this.endbossHurt.volume = 0.1;
        this.playBossSound(this.endbossHurt, true);
    }

/**
 * Plays the endboss dead sound (non-looped).
 */
    onEndbossDead() {
        this.endbossDead.volume = 0.4;
        this.playBossSound(this.endbossDead, false);
    }

/**
 * Plays game over sound.
 */
    onGameOver() {
        this.gameOverSound.volume = 0.4;
        this.playSound(this.gameOverSound);
    }

/**
 * Plays winning sound.
 */
    onWinning() {
        this.winningSound.volume = 0.4;
        this.playSound(this.winningSound);
    }
}