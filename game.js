//game.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'gameContainer',
    backgroundColor: '#D0D3D4',
    scene: {

        preload: function() {
            // Création de l'instance SoundManager
            const soundManager = new SoundManager(this);
            // Préchargement des sons
            soundManager.preloadSounds();
        },
        create: function() {
            const soundManager = new SoundManager(this); //Singleton Pattern ( même instance que dans preload)
            const model = GameModel.getInstance(soundManager); //Singleton Pattern
            const view = GameView.getInstance(this, model); //Singleton Pattern
            GameController.getInstance(view); //Singleton Pattern
        }
    }
};

new Phaser.Game(config);