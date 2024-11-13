class Bullet {
    constructor(view, x, y) {
        this.view = view;
        this.index = 2;
        this.x = x;
        this.y = y;
        const bulletColor = 0xffc0cb; // Rose en hexadécimal

        // Créer un cercle graphique pour représenter la balle
        const graphics = this.view.game.add.graphics();
        graphics.fillStyle(bulletColor, 1);
        graphics.fillCircle(5, 5, 5);
        // Créer une texture à partir du cercle graphique
        const textureKey = 'bulletTexture' + Date.now() + Math.random().toString(16);
        graphics.generateTexture(textureKey, 10, 10); // La texture aura une taille de 20x20 pixels
        graphics.destroy(); // Détruire le graphique après avoir créé la texture

        // Créer le sprite de la balle
        this.sprite = this.view.game.add.sprite(this.x + 40, this.y, textureKey);
    }

    moveTo(x, y, duration) {
        this.view.game.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            ease: 'Linear',
            duration: duration,
            onComplete: () => {
                this.destroy();
            }
        });
    }
    destroy() {
        if (this.sprite) {
            let textureKey = this.sprite.texture.key;
            this.view.game.textures.remove(textureKey); // Supprimer la texture du cache
            this.sprite.destroy();
            if (this.onDestroyed) {
                this.onDestroyed(); // Notifie GameView de la destruction
            }
        }
    }


}