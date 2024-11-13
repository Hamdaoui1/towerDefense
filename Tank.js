class Tank {
    constructor(view, index, randomColor) {
        this.position = { x: (view.model.mapPath[index][0]) * 40, y: ((view.model.mapPath[index][1]) * 40) + 20, index: index };
        this.view = view;
        this.initialDuration = 1000;
        this.destroyedCallFunc = false;
        this.life = true;
        const colors = ['#00ff7f', '#0000ff', '#ffff00', '#ff0000'];
        this.index = randomColor;
        this.resistance = 7 + (3 * (this.index + 1));
        this.maxResistance = this.resistance;
        this.createHalfDiamondBorderTexture(this.position.x, this.position.y);
        this.randomColor = colors[this.index];

        // Générer une clé de texture unique pour chaque tank
        const textureKey = 'tankTexture' + Date.now() + Math.random().toString(16);

        // Générer la texture en utilisant la couleur aléatoire pour tous les pixels '2'
        const tankDataWithColor = this.view.model.squareTank.map(row => {
            return row.replace(/2/g, 'C'); // Remplacer '2' par 'C' pour utiliser la couleur aléatoire
        });

        // Générer la texture
        this.view.game.textures.generate(textureKey, {
            data: tankDataWithColor,
            pixelWidth: 1.5,
            pixelHeight: 1.5,
            palette: {
                '1': '#000000', // Noir pour les chenilles
                'C': this.randomColor // Couleur aléatoire pour le corps du tank
            }
        });



        // Créer le sprite du tank
        this.sprite = this.view.game.add.sprite(this.position.x, this.position.y, textureKey);
        this.sprite.setRotation(Math.PI / 4);


    }


    createHalfDiamondBorderTexture(startX, startY) {
        // Enregistrez la position initiale du HalfDiamondBorder
        this.initialBorderX = startX;
        this.initialBorderY = startY;
        const graphics = this.view.game.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.beginPath();
        graphics.lineTo(20, 0);
        graphics.lineTo(40, 20);
        graphics.lineTo(20, 40);
        graphics.strokePath();

        // Créer une texture à partir des graphiques
        const textureKey = 'halfDiamondBorder' + Date.now();
        graphics.generateTexture(textureKey, 40, 40);
        graphics.destroy();

        // Créer un sprite à partir de la texture
        this.borderSprite = this.view.game.add.sprite(this.initialBorderX, this.initialBorderY, textureKey);
    }

    getVitesse() {
        return Math.sqrt(40) / this.initialDuration;
    }
    getX() {
        return this.position.x;
    }
    getY() {
        return this.position.y;
    }
    setMediator(mediator) {
        this.mediator = mediator;
    }

    // Méthode pour gérer l'effet de dommage
    applyDamageEffect() {
        // Effet de clignotement pour indiquer les dommages
        this.view.game.tweens.add({
            targets: this.sprite,
            alpha: { from: 1, to: 0.25 },
            duration: 100,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.sprite.alpha = 1; // Restaure l'opacité normale
            }
        });
    }

    move(tanks2, duration = this.initialDuration) {
        if (this.life) {
            this.initialDuration = duration;
            let tween;
            if (this.position.index < this.view.model.mapPath.length && this.resistance > 0) {

                if (!this.borderSprite)
                    this.createHalfDiamondBorderTexture(this.sprite.x, this.sprite.y);


                // Mouvement normal le long du chemin
                tween = this.view.game.tweens.add({
                    targets: [this.sprite, this.borderSprite],
                    x: (this.view.model.mapPath[this.position.index][0] * 40) + 20,
                    y: (this.view.model.mapPath[this.position.index][1] * 40) + 20,
                    ease: 'Linear',
                    duration: duration,
                    onComplete: () => {
                        if (this.resistance <= 0) {
                            this.life = false;
                            this.destroy();
                        }
                        if (this.borderSprite) {
                            this.updateBorderOrientation(this.position.index);
                        }
                        this.position.index++;

                        this.move(tanks2, duration = this.initialDuration)
                    }
                });
                this.position.x = (this.view.model.mapPath[this.position.index][0] * 40) + 20;
                this.position.y = (this.view.model.mapPath[this.position.index][1] * 40) + 20;
            } else if (this.position.index == this.view.model.mapPath.length) {
                // Effet de "rentrée" à la fin du chemin
                tween = this.view.game.tweens.add({
                    targets: [this.sprite, this.borderSprite],
                    x: (this.view.model.mapPath[this.position.index - 1][0] * 40) + 20,
                    y: (this.view.model.mapPath[this.position.index - 1][1] * 40) + 20,
                    scaleX: 0,
                    scaleY: 0,
                    ease: 'Linear',
                    duration: duration,
                    onComplete: () => {
                        this.destroy();
                    }
                });
                this.position.x = (this.view.model.mapPath[this.position.index - 1][0] * 40) + 20;
                this.position.y = (this.view.model.mapPath[this.position.index - 1][1] * 40) + 20;

            }
            this.tween = tween;


            if (this.resistance > 0) {

                this.mediator.notify(this, { type: 'move', index: this.position.index });

            }
        }
    }

    updateHalfDiamondBorder() {
        // Ajustez uniquement l'échelle (taille) du HalfDiamondBorder
        let scale = this.resistance / this.maxResistance;
        this.borderSprite.setScale(scale);
    }


    updateBorderOrientation(index) {
        if (index < this.view.model.mapPath.length - 1) {
            const nextX = this.view.model.mapPath[index + 1][0];
            const nextY = this.view.model.mapPath[index + 1][1];
            const deltaX = nextX - this.view.model.mapPath[index][0];
            const deltaY = nextY - this.view.model.mapPath[index][1];

            if (deltaX > 0) this.borderSprite.setRotation(0); // Droite
            else if (deltaX < 0) this.borderSprite.setRotation(Math.PI); // Gauche
            else if (deltaY > 0) this.borderSprite.setRotation(Math.PI / 2); // Bas
            else if (deltaY < 0) this.borderSprite.setRotation(-Math.PI / 2); // Haut
        }
    }


    destroy() {
            if (this.sprite && !this.destroyedCallFunc) {
                this.destroyedCallFunc = true;
                let textureKey = this.sprite.texture.key;
                this.view.game.textures.remove(textureKey); // Supprimer la texture du cache
                this.borderSprite.destroy();
                this.sprite.destroy();
                if (this.onDestroyed) {
                    this.onDestroyed(); // Notifie GameView de la destruction
                }
            }
        }
        // Callback Pattern
    setOnDestroyedCallback(callback) {
        this.onDestroyed = callback;
    }
}