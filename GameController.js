class GameController {
    constructor(view) {
            // Singleton Pattern
            if (GameController.instance) {
                return GameController.instance;
            }
            this.tanks = [];
            this.tanks2 = [];
            this.view = view;
            this.isGamePlaying = false;
            this.gamePaused = false;
            this.money = 500;
            this.lives = 13;
            this.numberOfTanks = 1; // Commencer avec 3 tanks
            this.currentWave = 0;
            this.maxWaves = 20;
            this.selectionMenu = null;
            this.setOnDestroyedCallback = 0;
            this.gameSpeedFactor = 1; // Facteur de vitesse initial
            this.setupDamageEffect();
            this.couple = { x: 0, y: 0 };
            this.setupControlBar();
            this.setupInfoBar();
            this.createInteractiveGrid();
            this.mediator = new GameMediator();
            // Singleton Pattern
            GameController.instance = this;
        }
        // Singleton Pattern
    static getInstance(view) {
        if (!GameController.instance) {
            GameController.instance = new GameController(view);
        }
        return GameController.instance;
    }
    setupDamageEffect() {
        this.damageEffect = this.view.game.add.rectangle(0, 0, this.view.game.scale.width, this.view.game.scale.height, 0xff0000).setOrigin(0, 0).setAlpha(0);
        this.view.game.add.existing(this.damageEffect);

    }
    triggerDamageEffect() {
        if (this.damageEffect) {
            this.damageEffect.setAlpha(0.5);
            this.view.game.time.delayedCall(500, () => {
                this.damageEffect.setAlpha(0);
            });
        }
    }
    createTanks() {

        if ((this.currentWave >= this.maxWaves) || (this.lives <= 0)) {
            console.log("Jeu terminé !");
            // Ajoutez ici la logique pour arrêter ou terminer le jeu
            return;
        }


        this.numberOfTanks += 2;

        this.numberOfTanks = Math.min(this.numberOfTanks, 20);
        this.currentWave++;
        let tabl = [0, 0, 0, 0];
        console.log(this.v, this.b, this.j, this.r);
        //this.view.updateInfo(this.lives, this.money, this.v, this.b, this.j, this.r, this.nextWave, this.timer);

        for (let i = 0; i < 4; i++) {
            this.view.model.mapPath.unshift(
                [((this.view.model.mapPath[0][0]) - 1), 2]

            );
        }
        this.tanks.forEach(tank => {
                tank.position.index += 4;
            })
            // console.log(this.view.model.mapPath);
        let j = 0;
        this.view.model.SoundManager.playSound('soundName3');

        for (let i = 0; i < this.numberOfTanks; i++) {
            // Calculer la position en X pour chaque tank
            let random = parseInt(Math.random() * 4);
            switch (random) {
                case 0:
                    tabl[0]++;
                    break;
                case 1:
                    tabl[1]++;
                    break;
                case 2:
                    tabl[2]++;
                    break;
                case 3:
                    tabl[3]++;
                    break;
            }
            let tank = TankFactory.createTank('Tank', this.view, j, random);
            this.mediator.registerTank(tank);
            tank.move(this.tanks2);
            j += 2;
            tank.setOnDestroyedCallback(() => {
                this.setOnDestroyedCallback++;
                this.onTankDestroyed(tank);
            });
            this.tanks.push(tank);

        }

        this.v = `${tabl[0]}`;
        this.b = `${tabl[1]}`;
        this.j = `${tabl[2]}`;
        this.r = `${tabl[3]}`;
        console.log(this.v, this.b, this.j, this.r);
        console.log(tabl);
        this.view.updateInfo(this.lives, this.money, this.wave, tabl[0], tabl[1], tabl[2], tabl[3], this.nextWave, this.timer);

        this.applySpeedToCurrentTanks();

    }
    onTankDestroyed(destroyedTank) {
        // Retirer le tank détruit de la liste
        if (destroyedTank.resistance <= 0) {
            this.view.model.SoundManager.playSound('soundName2');
            switch (destroyedTank.index) {
                case 0:
                    this.money += 25;
                    break;
                case 1:
                    this.money += 50;
                    break;
                case 2:
                    this.money += 75;
                    break;
                case 3:
                    this.money += 100;
                    break;

            }
        } else if (destroyedTank.resistance > 0) {
            switch (destroyedTank.index) {
                case 0:
                    this.money -= 100;
                    break;
                case 1:
                    this.money -= 75;
                    break;
                case 2:
                    this.money -= 50;
                    break;
                case 3:
                    this.money -= 25;
                    break;

            }
            this.triggerDamageEffect();
            this.lives--;
        }

        this.tanks = this.tanks.filter(tank => tank !== destroyedTank);
        this.view.updateInfo(this.lives, this.money, this.currentWave, this.v, this.b, this.j, this.r, this.timer);
        // Vérifier si tous les tanks ont été détruits
        if (this.tanks.length === 0) {
            // Augmenter le nombre pour la prochaine vague
            this.createTanks();
        }
    }
    createSelectionMenu(selected, a, b) {
        let x = a / 40;
        let y = b / 40;
        let A = x < 12 ? x : x - 6;
        let B = x < 17 ? x : x - 2.5;
        let X = selected ? B : A;
        let C = x < 12 ? 40 : 280;
        let D = x < 17 ? 40 : 140;
        let k = selected ? D : C;
        let E = x < 12 ? 1 : 0;
        let F = x < 17 ? 1 : 0;
        let i = selected ? F : E;



        if (!this.view.isOnPath(x, y) && !this.view.selectionMenu) {
            // Initialisation de l'arrière-plan sombre
            if (!this.view.dimBackground) {
                this.view.dimBackground = this.view.game.add.rectangle(0, 0, 800, 640, 0x000000, 0.5).setOrigin(0, 0);
                this.view.dimBackground.setDepth(0.9);
                this.view.dimBackground.setVisible(false);
            }
            this.view.dimBackground.setVisible(true);

            // Définition de la largeur du menu
            this.menuWidth = selected ? 140 : 280;

            // Création du menu de sélection
            const menubgOpacity = 0.7;
            const menuHeight = (y > 11) ? -135 : 80;
            const menuXOffset = 40;

            const colors = [0x00ff7f, 0x0000ff, 0xffff00, 0xff0000];
            const colorsh = ['#00ff7f', '#0000ff', '#ffff00', '#ff0000'];

            const Nom = ['Earth', 'Water', 'Air', 'Fire'];
            console.log('y ( if y > 11)' + y);
            this.view.selectionMenu = this.view.game.add.container((40 * X) - 20, (40 * y) - 20).setDepth(1);
            this.view.background = this.view.game.add.rectangle(0, 0, this.menuWidth + menuXOffset, 80, 0x000000).setAlpha(menubgOpacity);
            this.view.background.setOrigin(0, 0);
            this.view.selectionMenu.add(this.view.background);
            const dottedSquare = this.view.game.add.rectangle(k, 40, 32, 32);
            dottedSquare.setStrokeStyle(2, 0xffffff);
            dottedSquare.setOrigin(0.5, 0.5);
            this.view.selectionMenu.add(dottedSquare);

            // Add animation to dottedSquare
            this.view.game.tweens.add({
                targets: dottedSquare,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
            const costs = [100, 150, 200, 250];

            // Ajout des éléments du menu
            if (!selected) {

                // Ajout des options de couleur avec les coûts


                colors.forEach((color, index) => {
                    const colorSquare = this.view.game.add.rectangle(menuXOffset + (index + i) * (20 + menuXOffset), 40, 32, 32, color).setInteractive();
                    colorSquare.setOrigin(0.5, 0.5);
                    if (costs[index] > this.money) {
                        colorSquare.setAlpha(0.5);

                        colorSquare.setInteractive({ cursor: 'not-allowed' });
                    }

                    const border = this.view.game.add.rectangle(colorSquare.x, colorSquare.y, 40, 40);
                    border.setStrokeStyle(2, 0xffffff);
                    border.setOrigin(0.5, 0.5);
                    border.alpha = 0;
                    const costText1 = this.view.game.add.text(40, menuHeight + 12, `${costs[index]}$`, { font: '19px Arial', fill: '#ffffff' });
                    costText1.setOrigin(0.5, 0);
                    costText1.setVisible(false);

                    const costText2 = this.view.game.add.text(90, menuHeight + 12, `${Nom[index]}`, { font: 'bold 19px Arial', fill: `${colorsh[index]}` });
                    costText2.setOrigin(0, 0);
                    costText2.setVisible(false);

                    const ligne = this.view.game.add.line(this.menuWidth - 120, menuHeight + 40, this.menuWidth, 0, 0, 0, 0xffffff);
                    ligne.setOrigin(0.5, 0);
                    ligne.setVisible(false);
                    ligne.setLineWidth(2, 2);
                    ligne.setAlpha(0.3);

                    const costText3 = this.view.game.add.text(20, menuHeight + 50, 'Damage:', { font: '15px Arial', fill: '#ffffff' });
                    const costText4 = this.view.game.add.text(32, menuHeight + 75, 'Range:', { font: '15px Arial', fill: '#ffffff' });
                    const costText5 = this.view.game.add.text(44, menuHeight + 100, 'Rate:', { font: '15px Arial', fill: '#ffffff' });
                    costText3.setOrigin(0, 0);
                    costText3.setVisible(false);
                    costText4.setOrigin(0, 0);
                    costText4.setVisible(false);
                    costText5.setOrigin(0, 0);
                    costText5.setVisible(false);


                    function square(X, Y, color, game, menu) {
                        let x = X;
                        let y = Y;
                        const obj = {
                            square1: null,
                            square2: null,
                            square3: null,
                            square4: null,
                            square5: null,
                            square6: null,
                            square7: null,
                            square8: null,
                            square9: null,
                            text1: null,
                            text2: null,
                            text3: null,



                        };

                        Object.keys(obj).forEach((key, indexi) => {

                            let Color = color;
                            let text = '';
                            switch (index) {
                                case 0:
                                    if (indexi == 2 || indexi == 5 || indexi == 8) Color = 0x282828;
                                    if (indexi == 9) text = 'Medium +50% vs Air';
                                    if (indexi == 10 || indexi == 11) text = 'Medium';
                                    break;
                                case 1:
                                    if (indexi == 2 || indexi == 4 || indexi == 5) Color = 0x282828;
                                    if (indexi == 9) text = 'Medium +50% vs Air';
                                    if (indexi == 10) text = 'Low';
                                    if (indexi == 11) text = 'High';

                                    break;
                                case 2:
                                    if (indexi == 1 || indexi == 2 || indexi == 8) Color = 0x282828;
                                    if (indexi == 9) text = 'Low';
                                    if (indexi == 10) text = 'High';
                                    if (indexi == 11) text = 'Medium +50% vs Air';
                                    break;
                                case 3:
                                    if (indexi == 5 || indexi == 7 || indexi == 8) Color = 0x282828;
                                    if (indexi == 9) text = 'Hight +50% vs Air';
                                    if (indexi == 10) text = 'Medium';
                                    if (indexi == 11) text = 'Low';
                                    break;

                            }



                            if (indexi == 3) {
                                y += 25;
                                x -= 33
                            }
                            if (indexi == 6) {
                                y += 25;
                                x -= 33
                            }
                            if (indexi == 10) Y += 25;
                            if (indexi == 11) Y += 25;

                            if (indexi < 9) {
                                const rect = game.add.rectangle(x + (indexi * 11), y, 10, 13, Color);
                                rect.setOrigin(0.5, 0);
                                rect.setVisible(false);
                                obj[key] = rect;
                            } else {
                                const rect = game.add.text(X + 115, Y, `${text}`, { font: '12px', fill: '#ffffff' });
                                rect.setOrigin(0.5, 0);
                                rect.setVisible(false);
                                obj[key] = rect;
                            }
                        });

                        return obj;
                    }
                    let obj = square(95, menuHeight + 55, color, this.view.game, this.view.selectionMenu);

                    if (!this.view.background2) {
                        this.view.background2 = this.view.game.add.rectangle(0, menuHeight + 2, this.menuWidth + menuXOffset, 130, 0x000000);
                        this.view.background2.setVisible(false);
                    } else if (this.view.background2.width != 320) {
                        this.view.background2 = this.view.game.add.rectangle(0, menuHeight + 2, this.menuWidth + menuXOffset, 130, 0x000000);
                        this.view.background2.setVisible(false);
                    }
                    this.view.background2.y = menuHeight + 2;
                    this.view.background2.setOrigin(0, 0);
                    this.view.selectionMenu.add(this.view.background2);
                    this.view.selectionMenu.add(costText1);
                    this.view.selectionMenu.add(costText2);
                    this.view.selectionMenu.add(ligne);
                    this.view.selectionMenu.add(costText3);
                    this.view.selectionMenu.add(costText4);
                    this.view.selectionMenu.add(costText5);
                    Object.keys(obj).forEach((key) => {
                        this.view.selectionMenu.add(obj[key]);
                    });

                    colorSquare.on('pointerover', () => {

                        costText1.setVisible(true);
                        costText2.setVisible(true);
                        ligne.setVisible(true);
                        costText3.setVisible(true);
                        costText4.setVisible(true);
                        costText5.setVisible(true);
                        Object.keys(obj).forEach((key) => {
                            obj[key].setVisible(true);
                        });



                        border.alpha = 1;
                        if (costs[index] > this.money) {
                            // Ajoutez la classe CSS pour changer le curseur
                            document.getElementById('gameContainer').classList.add('not-allowed');
                        }
                        this.view.background2.setVisible(true);
                    });

                    colorSquare.on('pointerout', () => {
                        costText1.setVisible(false);
                        costText2.setVisible(false);
                        ligne.setVisible(false);
                        costText3.setVisible(false);
                        costText4.setVisible(false);
                        costText5.setVisible(false);
                        Object.keys(obj).forEach((key) => {
                            obj[key].setVisible(false);
                        });


                        border.alpha = 0;
                        document.getElementById('gameContainer').classList.remove('not-allowed'); // Enlevez la classe CSS lorsque le curseur sort
                        if (this.view.background2 && this.view.background2.visible)
                            this.view.background2.setVisible(false);
                    });


                    colorSquare.on('pointerdown', () => {
                        const cost = 100 + (50 * index);
                        if (this.money >= cost) {
                            if (!selected) {

                                let tank2 = TankFactory.createTank('Tank2', this.view, index, (x * 40) + 20, (y * 40) + 20);
                                this.mediator.registerTank2(tank2);
                                this.tanks2.push(tank2);
                                this.money -= cost;
                                this.view.updateInfo(this.lives, this.money, this.currentWave, this.v, this.b, this.j, this.r, this.timer);
                                this.pointerDownHappened = true;
                            }
                        } else {
                            console.log('pas assez d argent');
                        }
                        if (this.view.selectionMenu) {
                            this.view.selectionMenu.setVisible(false);
                            this.view.selectionMenu = null;
                        }
                        if (this.view.dimBackground) {
                            this.view.dimBackground.setVisible(false);
                        }
                    });
                    this.view.selectionMenu.add(colorSquare);
                    this.view.selectionMenu.add(border);
                });
            } else {

                if (this.view.background2.width == 320) {
                    this.view.background2 = this.view.game.add.rectangle(0, menuHeight + 2, 140 + menuXOffset, 150, 0x000000);
                    this.view.background2.setVisible(false);
                }
                this.view.background2.setOrigin(0, 0);
                this.view.selectionMenu.add(this.view.background2);
                let tank2 = this.positionTankColor((x * 40) + 20, (y * 40) + 20);

                this.color = colors[tank2.index];

                for (let index = 0; index < 2; index++) {
                    const colorSquare = this.view.game.add.rectangle(40 + (index + i) * 50, 40, 32, 32, this.color).setInteractive();
                    colorSquare.setOrigin(0.5, 0.5);

                    const arrowGraphics = this.view.game.add.graphics({ fillStyle: { color: 0x000000 } });
                    const arrowX = colorSquare.x;
                    const arrowY = colorSquare.y - 10;
                    const arrowWidth = 20;
                    const arrowHeight = 20;

                    let x1, x2, x3, y1, y2, y3;

                    if (index === 0) {
                        x1 = arrowX;
                        y1 = arrowY;
                        x2 = arrowX - arrowWidth / 2;
                        y2 = arrowY + arrowHeight;
                        x3 = arrowX + arrowWidth / 2;
                        y3 = y2;
                    } else {
                        x1 = arrowX;
                        y1 = arrowY + arrowHeight;
                        x2 = arrowX - arrowWidth / 2;
                        y2 = arrowY;
                        x3 = arrowX + arrowWidth / 2;
                        y3 = y2;
                    }

                    arrowGraphics.fillTriangle(x1, y1, x2, y2, x3, y3);

                    this.view.selectionMenu.add(colorSquare);
                    this.view.selectionMenu.add(arrowGraphics);
                    const border = this.view.game.add.rectangle(colorSquare.x, colorSquare.y, 40, 40);
                    border.setStrokeStyle(2, 0xffffff);
                    border.setOrigin(0.5, 0.5);
                    border.alpha = 0;
                    const cost = tank2.money;
                    //const costreclame = (100 + 50 * (index-1) + 75 * tank2.level -75)*0.75;

                    function square(X, Y, game) {
                        const obj = {
                            text1: null,
                            text2: null,
                            text3: null,
                            text4: null,
                            text5: null,
                            text6: null,
                            text7: null,
                            text8: null,

                        };
                        let m = 0;

                        Object.keys(obj).forEach((key, indexi) => {

                            let text = '';
                            let x = X;
                            let px = '15px Arial';
                            let color = '#ffffff';
                            if (index == 0)
                                switch (tank2.level) {
                                    case 1:
                                    case 2:
                                        switch (indexi) {
                                            case 0:
                                                text = `${cost +75} $`;
                                                px = '20px Arial';
                                                break;
                                            case 1:
                                                text = `Upgrade to Leval ${tank2.level + 1}`;
                                                Y += 25;
                                                x = X + 25;

                                                color = colorsh[tank2.index];
                                                break;
                                            case 2:
                                                text = `Damage : ${tank2.damage}`;
                                                x = X;
                                                Y += 10;
                                                px = 'arial 17px';

                                                break;
                                            case 3:
                                                text = `»${tank2.damage + 2}`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];
                                                break;
                                            case 4:
                                                text = `Range : ${tank2.range}`;
                                                Y += 25;
                                                x = X + 15;
                                                px = 'arial 17px';

                                                break;
                                            case 5:
                                                text = `»${tank2.range + 25}`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];

                                                break;
                                            case 6:
                                                text = `Rate : ${tank2.rate}`;
                                                x = X + 14;
                                                Y += 25;
                                                px = 'arial 17px';

                                                break;
                                            case 7:
                                                text = `»${tank2.rate - 0.2}`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];

                                                break;
                                        }
                                        break;
                                    case 3:
                                        switch (indexi) {
                                            case 0:
                                                text = `Max Leval`;
                                                px = '20px Arial';
                                                break;
                                            case 1:
                                                text = `${Nom[index]} Leval 3`;
                                                Y += 25;
                                                x = X + 25;
                                                color = colorsh[tank2.index];
                                                break;
                                            case 2:
                                                text = `Damage : ${tank2.damage}`;
                                                x = X;
                                                Y += 10;
                                                px = 'arial 17px';

                                                break;
                                            case 3:
                                                text = `»Maxed`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];

                                                break;
                                            case 4:
                                                text = `Range : ${tank2.range}`;
                                                Y += 25;
                                                x = X + 15;
                                                px = 'arial 17px';

                                                break;
                                            case 5:
                                                text = `»Maxed`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];

                                                break;
                                            case 6:
                                                text = `Rate : ${tank2.rate}`;
                                                x = X + 14;
                                                Y += 25;
                                                px = 'arial 17px';

                                                break;
                                            case 7:
                                                text = `»Maxed`;
                                                px = 'arial 17px';

                                                color = colorsh[tank2.index];

                                                break;
                                        }
                                        break;
                                }
                            else {
                                switch (indexi) {
                                    case 0:
                                        text = `+ ${( tank2.money)*0.75 } $`;
                                        px = '20px Arial';
                                        break;
                                    case 1:
                                        text = `Reclame 75%`;
                                        Y += 25;
                                        x = X + 25;
                                        color = colorsh[tank2.index];
                                        break;
                                    case 2:
                                        text = `Damage : ${tank2.damage}`;
                                        x = X;
                                        Y += 10;
                                        px = 'arial 17px';

                                        break;
                                    case 3:
                                        text = '';
                                        break;
                                    case 4:
                                        text = `Range : ${tank2.range}`;
                                        Y += 25;
                                        x = X + 15;
                                        px = 'arial 17px';

                                        break;
                                    case 5:
                                        text = '';
                                        break;
                                    case 6:
                                        text = `Rate : ${tank2.rate}`;
                                        x = X + 14;
                                        Y += 25;
                                        px = 'arial 17px';

                                        break;
                                    case 7:
                                        text = '';
                                        break;
                                }
                            }
                            if (indexi == 2) Y += 25;
                            m = (indexi == 3 || indexi == 5 || indexi == 7) ? m : 0;
                            const rect = game.add.text(x + m, Y, `${text}`, { font: `${px}`, fill: `${color}` });
                            m = rect.width + 10;
                            rect.setOrigin(0.5, 0);
                            rect.setVisible(false);
                            obj[key] = rect;
                        });

                        return obj;
                    }
                    let obj = square(45, menuHeight + 10, this.view.game);
                    Object.keys(obj).forEach((key) => {
                        this.view.selectionMenu.add(obj[key]);
                    });
                    colorSquare.on('pointerover', () => {
                        //console.log(this.positionTankColor((x * 40) + 20, (y * 40) + 20));

                        border.alpha = 1;
                        this.view.background2.setVisible(true);
                        Object.keys(obj).forEach((key) => {
                            obj[key].setVisible(true);
                        });

                    });

                    colorSquare.on('pointerout', () => {

                        Object.keys(obj).forEach((key) => {
                            obj[key].setVisible(false);
                        });
                        border.alpha = 0;
                        if (this.view.background2 && this.view.background2.visible)
                            this.view.background2.setVisible(false);
                    });



                    colorSquare.on('pointerdown', () => {
                        // console.log('pointerdown');
                        // console.log('index : ' + index);
                        if (index == 0) {
                            if (this.money >= (cost + 75) && tank2.level < 3) {
                                if (selected) {
                                    if (tank2.level == 1) {
                                        //console.log(tank2.rectangles.square1);
                                        tank2.rectangles.square2.setFillStyle(tank2.rectangles.square1.fillColor, 1);
                                    } else if (tank2.level == 2) {
                                        tank2.rectangles.square3.setFillStyle(tank2.rectangles.square1.fillColor, 1);

                                    }
                                    tank2.level++;
                                    tank2.money += (tank2.money + 75);
                                    tank2.damage += 2;
                                    tank2.range += 25;
                                    tank2.rate -= 0.2;
                                    this.money -= (cost + 75);
                                    this.view.updateInfo(this.lives, this.money, this.currentWave, this.v, this.b, this.j, this.r, this.timer);
                                    this.pointerDownHappened = true;

                                    console.log(this.positionTankColor((this.couple.x) + 20, (this.couple.y) + 20));

                                    this.positionTankColor((this.couple.x) + 20, (this.couple.y) + 20).updateOccupationCircle();

                                }
                            } else {
                                console.log('pas assez d argent');
                            }

                        } else {

                            if (selected) {

                                this.money += (tank2.money) * 0.75;
                                this.view.updateInfo(this.lives, this.money, this.currentWave, this.v, this.b, this.j, this.r, this.timer);
                                this.pointerDownHappened = true;
                                tank2.occupationCircle.setVisible(false);
                                tank2.destroy();
                                for (let i = 0; i < this.tanks2.length; i++) {
                                    if (this.tanks2[i] === tank2) {
                                        console.log('destroy --');
                                        this.tanks2.splice(i, 1);
                                        i--;
                                    } else {
                                        console.log('no destroy --');
                                    }
                                }


                            }
                            if (this.view.selectionMenu) {
                                this.view.selectionMenu.setVisible(false);
                                this.view.selectionMenu = null;
                            }
                            if (this.view.dimBackground) {
                                this.view.dimBackground.setVisible(false);
                            }

                        }

                    });


                    this.view.selectionMenu.add(border);

                }


            }

        } else {
            if (this.view.selectionMenu != null && this.view.background != null) {
                if (((!((x) <= (((this.view.selectionMenu.getBounds().x + 320) / 40)) && (x) >= ((this.view.selectionMenu.getBounds().x / 40))) || !(y < ((this.view.selectionMenu.getBounds().y + 80) / 40) && y >= (this.view.selectionMenu.getBounds().y / 40))) && this.menuWidth == 280) ||
                    ((!(x <= ((this.view.background.getBounds().x + 160) / 40) && x >= ((this.view.background.getBounds().x - 20) / 40)) || !(y < ((this.view.background.getBounds().y + 40) / 40) && y >= (this.view.background.getBounds().y / 40))) && this.menuWidth != 280)) {
                    this.view.selectionMenu.setVisible(false);
                    this.view.selectionMenu = null;
                    this.view.dimBackground.setVisible(false);


                    if (this.existepositiontank((this.couple.x) + 20, (this.couple.y) + 20))
                        this.positionTankColor((this.couple.x) + 20, (this.couple.y) + 20).occupationCircle.setVisible(false);
                }
            }
        }
    }
    existepositiontank(x, y) {
        let i = 0;
        let existe = false;
        while (i < this.tanks2.length && !existe) {
            if (this.tanks2[i].startX == x && this.tanks2[i].startY == y) {
                existe = true;
            }
            i++;
        }
        return existe;

    }
    positionTankColor(x, y) {
        let i = 0;
        while (i < this.tanks2.length) {
            if (this.tanks2[i].startX == x && this.tanks2[i].startY == y) {
                return this.tanks2[i];
            }
            i++;
        }
        return null;

    }
    createGame() {
        this.view.createGrid(this.view.model.mapPath); // Dessiner la grille
    }
    setupControlBar() {
        this.view.createControlBar();

        // Écouter les événements des boutons de contrôle
        this.view.game.events.on('playGame', this.playGame, this);
        this.view.game.events.on('setSpeed', this.setGameSpeed, this);
    }
    start() {
        if (!this.isGamePlaying) {
            this.createTanks();
            this.isGamePlaying = true;
        }
    }
    playGame() {
        if (!this.isGamePlaying) {
            // Si le jeu n'est pas en cours, lancez les tanks
            this.start();

        } else {
            // Si le jeu est déjà en cours, activez/désactivez la pause
            this.togglePause();
        }
    }
    togglePause() {
        const currentTanks = this.tanks; // Obtenir la liste actuelle des tanks
        currentTanks.forEach(tank => {
            if (tank.tween) {
                if (this.gamePaused) {
                    tank.tween.resume(); // Reprendre le mouvement
                } else {
                    tank.tween.pause(); // Mettre en pause le mouvement
                }
            }
        });
        this.gamePaused = !this.gamePaused;
    }
    setGameSpeed(speedLabel) {
        // Mapper les labels de vitesse en facteurs de durée
        const speedMapping = { 'x1': 1, 'x2': 0.5, 'x3': 0.25 };
        this.gameSpeedFactor = speedMapping[speedLabel];
        this.applySpeedToCurrentTanks();
        if (this.gameSpeedFactor === 0.25)
            this.tanks2.forEach(tank => {
                tank.rate = 0.5;
            });
    }
    applySpeedToCurrentTanks() {
        this.tanks.forEach(tank => {
            tank.initialDuration = 1000 * this.gameSpeedFactor;
        });


    }
    setupInfoBar() {
        this.view.createInfoBar();
        this.view.game.events.on('sendNextWave', this.sendNextWave, this);
    }
    updateInfoBar(lives, money, wave, nextWave, timer) {
        this.view.updateInfo(lives, money, wave, this.v, this.b, this.j, this.r, timer);
    }
    sendNextWave() {

        console.log(this.isGamePlaying);
        if (this.isGamePlaying && !this.gamePaused) {

            this.createTanks();
        }
    }
    createInteractiveGrid() {
        const tileWidth = 40;
        const tileHeight = 40;
        const mapWidth = this.view.game.scale.width;
        const mapHeight = this.view.game.scale.height - 40; // ajusté pour la hauteur
        const hoverColor = 0xD0D3D4; // Couleur pour l'effet de survol

        for (let y = 40; y < mapHeight; y += tileHeight) {
            for (let x = 0; x < mapWidth; x += tileWidth) {
                let isPathTile = this.view.model.mapPath.some(pair => pair[0] === x / tileWidth && pair[1] === y / tileHeight);
                let fillColor = isPathTile ? 0x423e3a : 0x75726e; // Marron foncé et gris foncé en hexadécimal converti en RGB


                let tile = this.view.game.add.rectangle(x + tileWidth / 2, y + tileHeight / 2, tileWidth, tileHeight, fillColor, 40)
                    .setInteractive();

                if (!isPathTile) {
                    tile.on('pointerover', () => {

                        if (!this.view.selectionMenu) {
                            this.view.model.SoundManager.playSound('soundName4');

                            tile.setFillStyle(hoverColor, 1); // Change la couleur lors du survol
                            clearTimeout(tile.hoverTimeout);
                        }
                        if (this.existepositiontank((x + 20), (y + 20))) {

                            //console.log(this.positionTankColor((x + 20), (y + 20)));
                            this.positionTankColor((x + 20), (y + 20)).occupationCircle.setVisible(true);

                        }

                    });

                    tile.on('pointerout', () => {
                        tile.isHovered = false;
                        tile.hoverTimeout = this.view.fadeBack(tile, fillColor, 40, 300);
                        if (this.existepositiontank((x + 20), (y + 20)) && !this.view.selectionMenu) {
                            console.log(this.view.selectionMenu);
                            //console.log(this.positionTankColor((x + 20), (y + 20)));
                            this.positionTankColor((x + 20), (y + 20)).occupationCircle.setVisible(false);

                        }

                    });
                }

                tile.on('pointerdown', () => {
                    let selected = (this.tanks2 != null && this.existepositiontank((x + 20), (y + 20)));
                    this.createSelectionMenu(selected, x, y);
                    this.couple.x = x;
                    this.couple.y = y;

                    this.pointerDownHappened = false;
                    console.log(`Clicked tile at grid position (${(x / tileWidth) + 1}, ${y / tileHeight})`);
                });
            }
        }
    }
}