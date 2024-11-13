// GameView.js
class GameView {
    constructor(game, model) {
            // Singleton Pattern
            if (GameView.instance) {
                return GameModel.instance;
            }
            this.model = model;
            this.game = game;
            this.isGamePlaying = false;
            this.activeSpeedButton = null;
            this.speedButtons = {}; // Stocker les références aux boutons de vitesse
            // Singleton Pattern
            GameView.instance = this;

        }
        // Singleton Pattern
    static getInstance(game, model) {
        if (!GameView.instance) {
            GameView.instance = new GameView(game, model);
        }
        return GameView.instance;
    }

    isOnPath(gridX, gridY) {
        if (this.model.mapPath && Array.isArray(this.model.mapPath)) {
            return this.model.mapPath.some(point => point[0] === gridX && point[1] === gridY);
        }
        return false;
    }
    createControlBar() {
        const controlBarHeight = 40; // Hauteur de la barre de contrôle
        const topY = 0; // Position Y de la barre

        // Créer un fond pour la barre de contrôle
        const controlBarBackground = this.game.add.rectangle(0, topY, this.game.scale.width, controlBarHeight, 0x000000);
        controlBarBackground.setOrigin(0, 0); // Positionner en haut

        // Créer le bouton "Play" avec un fond et une bordure
        this.createPlayButton(20, topY + 20, 'Play');

        // Boutons de vitesse
        const speeds = ['x1', 'x2', 'x3'];
        speeds.forEach((speed, index) => {
            let button = this.createButton(100 + index * 60, topY + 20, speed, () => {
                this.game.events.emit('setSpeed', speed);
                if (this.activeSpeedButton) {
                    this.activeSpeedButton.setFillStyle(0x888888); // Réinitialiser le bouton précédent
                }
                button.setFillStyle(0x555555); // Assombrir le bouton actuel
                this.activeSpeedButton = button;
            });
            this.speedButtons[speed] = button; // Stocker la référence au bouton
            if (speed === 'x1') { // Par défaut, sélectionnez x1
                button.setFillStyle(0x555555);
                this.activeSpeedButton = button;
            }
        });
    }

    createPlayButton(x, y, text) {
        const buttonBackground = this.game.add.rectangle(x, y, 50, 30, 0x888888).setOrigin(0, 0.5);
        buttonBackground.setStrokeStyle(2, 0xffffff);

        const buttonText = this.game.add.text(x + 25, y, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        buttonBackground.setInteractive();
        buttonBackground.on('pointerdown', () => {
            this.isGamePlaying = !this.isGamePlaying;
            buttonText.setText(this.isGamePlaying ? 'Pause' : 'Play');
            this.game.events.emit('playGame');
        });
        buttonBackground.on('pointerover', () => buttonText.setFill('#ffff00')); // Changer la couleur au survol
        buttonBackground.on('pointerout', () => buttonText.setFill('#ffffff')); // Revenir à la couleur originale
    }

    createButton(x, y, text, callback) {
        const buttonBackground = this.game.add.rectangle(x, y, 50, 30, 0x888888).setOrigin(0, 0.5);
        buttonBackground.setStrokeStyle(2, 0xffffff);

        const buttonText = this.game.add.text(x + 25, y, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        buttonBackground.setInteractive();
        buttonBackground.on('pointerdown', () => {
            buttonText.setFill('#ff0000');
            callback();
        });
        buttonBackground.on('pointerover', () => buttonText.setFill('#ffff00'));
        buttonBackground.on('pointerout', () => buttonText.setFill('#ffffff'));

        return buttonBackground;
    }


    createInfoBar() {
        const infoBarHeight = 40; // Hauteur de la barre d'information
        const bottomY = this.game.scale.height - infoBarHeight; // Position Y de la barre

        // Créer un fond pour la barre d'information
        const infoBarBackground = this.game.add.rectangle(0, bottomY, this.game.scale.width, infoBarHeight, 0x000000);
        infoBarBackground.setOrigin(0, 0); // Positionner en bas
        // Ajouter des éléments textuels pour les vies, l'argent, les vagues et le bouton "Send Next"
        this.livesText = this.game.add.text(20, bottomY + 10, 'Vies: 13/13', { font: '16px Arial', fill: '#ffffff' });
        this.moneyText = this.game.add.text(150, bottomY + 10, 'Argent: $500', { font: '16px Arial', fill: '#ffffff' });
        this.waveText = this.game.add.text(280, bottomY + 10, 'Vagues: 0/20', { font: '16px Arial', fill: '#ffffff' });
        this.nextWaveText = this.game.add.text(410, bottomY + 10, ' Prochaine:', { font: '16px Arial', fill: '#ffffff' });
        this.nextWaveval1 = this.game.add.text(500, bottomY + 10, 'V', { font: '16px Arial', fill: '#00ff7f' });
        this.nextWaveval2 = this.game.add.text(530, bottomY + 10, 'B', { font: '16px Arial', fill: '#0000ff' });
        this.nextWaveval3 = this.game.add.text(560, bottomY + 10, 'J', { font: '16px Arial', fill: '#ffff00' });
        this.nextWaveval4 = this.game.add.text(590, bottomY + 10, 'R', { font: '16px Arial', fill: '#ff0000' });

        // Bouton pour envoyer la prochaine vague
        this.sendNextButton = this.game.add.text(650, bottomY + 10, 'Envoyer ', { font: '16px Arial', fill: '#ffffff' }).setInteractive();
        this.sendNextButton.on('pointerdown', () => this.game.events.emit('sendNextWave'));
    }
    updateInfo(lives, money, wave, v, b, j, r, timer) {
        console.log('v : ' + v + ' b : ' + b + ' j : ' + j + ' r : ' + r);
        if (lives) this.livesText.setText(`Vies: ${lives}/13`);
        if (money) this.moneyText.setText(`Argent: $${money}`);
        if (wave) this.waveText.setText(`Vagues: ${wave}/20`);
        if (timer) this.sendNextButton.setText(`Envoyer (${timer}s)`);

        this.nextWaveval1.setText(`${v}`);
        this.nextWaveval2.setText(`${b}`);
        this.nextWaveval3.setText(`${j}`);
        this.nextWaveval4.setText(`${r}`);

    }
    fadeBack(tile, color, alpha, duration) {
        let elapsedTime = 0;
        const intervalTime = 30; // Durée d'un pas de l'animation, en ms
        const steps = duration / intervalTime; // Nombre total de pas
        const alphaStep = (alpha - tile.fillAlpha) / steps; // Changement d'alpha par étape

        const interval = setInterval(() => {
            elapsedTime += intervalTime;
            tile.setFillStyle(color, tile.fillAlpha + alphaStep);

            if (elapsedTime >= duration) {
                clearInterval(interval);
                tile.setFillStyle(color, alpha); // Assurez-vous que la couleur et l'opacité sont correctement réinitialisées à la fin
            }
        }, intervalTime);

        return interval;
    }


}