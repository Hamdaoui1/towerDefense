class SoundManager {
    static instance;

    constructor(scene) {
        if (SoundManager.instance) {
            return SoundManager.instance;
        }

        this.scene = scene;
        this.preloadSounds();
        SoundManager.instance = this;
    }

    preloadSounds() {
        this.scene.load.audio('soundName1', './Son/1.mp3');
        this.scene.load.audio('soundName2', './Son/2.mp3');
        this.scene.load.audio('soundName3', './Son/3.mp3');
        this.scene.load.audio('soundName4', './Son/4.mp3');
        // Charger d'autres sons si nécessaire
    }

    playSound(soundKey) {
        this.scene.sound.play(soundKey);
    }

    // Autres méthodes pour la gestion du son
}