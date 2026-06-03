/**
 * Checks if the player has defeated the endboss
 * and triggers the winning state.
 */
    function checkWinCondition() {
        let boss = world.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        if (boss.isDeadAnimationFinished && world.gameState !== "winning") {
            setTimeout(() => {
                world.audio.stopBossSound();
                setWinning();
            }, 200);
        }
    }

    /**
 * Triggers the winning state, stops gameplay,
 * plays the winning sound, and returns to the start screen after a delay.
 */
    function setWinning() {
        world.gameState = "winning";
        world.audio.stopAllSounds();
        world.audio.onWinning();
        world.stopCharacterAndEnemies();
        setTimeout(() => {
        if (world.onGameEndUI) {
        world.onGameEndUI(); 
    } }, 2000);
    }

    /**
 * Checks whether the player has died
 * and triggers the game over sequence after a delay of 3 seconds.
 */
    function checkGameOver() {
        if (world.gameState !== "playing") return;
        if (world.character.isDead() && !world.gameOverTriggered) {
            world.gameOverTriggered = true;
            setTimeout(() => {
                setGameOver();
            }, 2000); 
        }
    }

    /**
 * Triggers the game over state,
 * stops gameplay and sounds,
 * and returns to the start screen after a delay.
 */
    function setGameOver() {
    world.gameState = "gameover";
    world.stopCharacterAndEnemies();
    world.audio.stopAllSounds();
    world.audio.onGameOver();
    world.gameOverTriggered = false;
    world.deathSoundPlayed = false;
    setTimeout(() => {
         if (world.onGameEndUI) {
        world.onGameEndUI(); 
    } }, 2000);
}

