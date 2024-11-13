class Tank2 {
    constructor(view, index, startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.view = view;
        this.index = index;
        this.occupe = null;
        this.life = true;
        this.level = 1;
        this.money = 100 + 50 * index;
        this.range = 120;
        this.damage = 1;
        this.rate = 1;
        this.bullets = [];
        const colors = ['#00ff7f', '#0000ff', '#ffff00', '#ff0000'];
        this.color = colors[index];
        // Générer les textures
        const circleTextureKey = this.generateTexture('circle', this.color);
        const circleTextureKey1 = this.generateTexture('circle1', this.color);
        const occupationCircle = this.createOccupationCircle(this.color, this.range - 20);

        // Créer les sprites
        this.circleSprite = this.view.game.add.sprite(startX, startY, circleTextureKey);
        this.circleSprite1 = this.view.game.add.sprite(startX, startY, circleTextureKey1);
        this.occupationCircle = this.view.game.add.sprite(startX, startY, occupationCircle);
        this.occupationCircle.setOrigin(0.5, 0.5);
        this.occupationCircle.setVisible(false); // Cacher par défaut

        // Animer les rotations
        this.animateRotation(this.circleSprite, -360, 1000);
        this.animateBorder(this.circleSprite1, 2000, this.level);
        this.rectangles = this.square();

        //this.setupMouseEvents();


    }
    setMediator(mediator) {
        this.mediator = mediator;
    }
    square() {

        let x = this.startX - 18;
        let y = this.startY + 6;
        const obj = {
            square1: null,
            square2: null,
            square3: null,

        };
        Object.keys(obj).forEach((key, indexi) => {
            let color = Phaser.Display.Color.HexStringToColor(this.color).color;

            switch (indexi) {

                case 1:
                case 2:
                    color = 0xCCCCCC;
                    break;

            }

            const rect = this.view.game.add.rectangle(x, y + 12, 11, 2, color);
            rect.setOrigin(0, 0);
            obj[key] = rect;
            x += 12;
        });
        return obj;
    }
    createOccupationCircle(color, radius) {
        const textureKey = 'occupationCircle' + Date.now(); // Assurez-vous que la clé de texture est unique
        const graphics = this.view.game.add.graphics();

        graphics.lineStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 1);
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.07); // Remplissage avec transparence

        graphics.fillCircle(radius, radius, radius);
        graphics.strokeCircle(radius, radius, radius);

        graphics.generateTexture(textureKey, radius * 2, radius * 2);
        graphics.destroy();

        return textureKey;
    }
    updateOccupationCircle() {

        const newOccupationCircleTexture = this.createOccupationCircle(this.color, this.range - 20);

        this.occupationCircle.setTexture(newOccupationCircleTexture);
    }
    generateTexture(type, color) {
        const textureKey = type + Date.now();
        const graphics = this.view.game.add.graphics();

        if (type === 'circle') {
            // Ajouter une bordure noire autour du cercle
            graphics.lineStyle(2, 0x000000, 5); // Bordure noire

            // Remplir la première moitié du cercle avec la première couleur
            graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1).setAlpha(0.4);
            graphics.beginPath();
            graphics.arc(16, 16, 14, 0, Math.PI, false); // Première moitié du cercle
            graphics.lineTo(16, 16);
            graphics.closePath();
            graphics.fillPath();

            // Remplir la deuxième moitié du cercle avec une autre couleur
            graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
            graphics.beginPath();
            graphics.arc(16, 16, 14, Math.PI, 2 * Math.PI, false); // Deuxième moitié du cercle
            graphics.lineTo(16, 16);
            graphics.closePath();
            graphics.fillPath();
            // Dessiner la bordure du cercle entier
            graphics.strokeCircle(16, 16, 18);
        } else if (type === 'circle1') {
            // Ajouter une bordure noire autour du cercle
            graphics.lineStyle(1, 0x000000, 2); // Bordure noire
            graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
            graphics.fillCircle(16, 16, 1); // Remplissage du cercle
            graphics.strokeCircle(16, 16, 3); // Dessin de la bordure

        }

        graphics.generateTexture(textureKey, 32, 32);
        graphics.destroy();

        return textureKey;
    }
    animateRotation(target, angle, duration) {
        this.view.game.tweens.add({
            targets: target,
            angle: angle,
            duration: duration,

            repeat: -1
        });

    }
    animateBorder(target, duration, level) {
        this.view.game.tweens.add({
            targets: target,
            scaleX: 2.3 * level,
            scaleY: 2.3 * level,
            duration: duration,
            yoyo: true,
            repeat: -1
        });
    }
    a(position, resistance, duration) {
        let distance = this.calculateDistance(this.startX, this.startY, position.x, position.y);
        if (distance < this.range && resistance > 0) {
            this.occupe = true;

            //let bullet = TankFactory.createBullet(this.view, this.startX - 40, this.startY);

            let facteur = 1.75;

            switch (duration / 1000) {
                case 0.25:
                    facteur = 0.75;
                    break;
                case 0.50:
                    facteur = 1.75;
                    break;
                case 1:
                    facteur = 2.5;
                    break;

            }

            let f = ((this.range - distance) / 40) > 1 ? ((this.range - distance) / 40) : 1;

            //bullet.moveTo(tank.getX(), tank.getY(), (4 * distance * facteur * f * this.rate));
            this.mediator.notify(this, {
                view: this.view,
                type: 'createAndMoveBullet',
                startX: this.startX - 40,
                startY: this.startY,
                targetX: position.x,
                targetY: position.y,
                moveDuration: (4 * distance * facteur * f * this.rate)
            });

            setTimeout(() => {
                this.mediator.notify(this, { type: 'applyDamage', target: position });
            }, (4 * distance * facteur * f));

            setTimeout(() => {
                this.occupe = null;
            }, (distance * facteur * f));

            return { hit: true };
        }
        return { hit: false };

    }
    calculateDistance(x1, y1, x2, y2) {


        let deltaX = parseInt(x2) - parseInt(x1);
        let deltaY = parseInt(y2) - parseInt(y1);

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    destroy() {

        if (this.circleSprite1 && this.circleSprite) {

            let c = this.circleSprite.texture.key;
            let cc = this.circleSprite1.texture.key;

            this.view.game.textures.remove(c);
            this.view.game.textures.remove(cc);

            // Supprimer la texture du cache
            this.circleSprite.destroy();
            this.circleSprite1.destroy();
            this.rectangles.square1.destroy();
            this.rectangles.square2.destroy();
            this.rectangles.square3.destroy();
            // Object.keys(this.rectangles).forEach((rect) => {

            //     rect.setVisible(false);

            // })
            if (this.onDestroyed) {
                this.onDestroyed();
            }
        }
        this.life = false;
    }




}