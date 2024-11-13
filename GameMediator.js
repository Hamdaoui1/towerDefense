class GameMediator {
    constructor() {
        this.tanks = [];
        this.tanks2 = [];
        this.soundManager = new SoundManager();
    }

    registerTank(tank) {
        this.tanks.push(tank);
        tank.setMediator(this);
    }

    registerTank2(tank2) {
        this.tanks2.push(tank2);
        tank2.setMediator(this);
    }


    notify(sender, event) {
        if (event.type === 'move') {
            this.tanks2.forEach(tank2 => {
                if (tank2.occupe === null && tank2.life == true) {
                    const result = tank2.a(sender.position, sender.resistance, sender.duration);
                    if (result.hit) {
                        // Trouvez le tank correspondant et mettez à jour sa résistance
                        const tank = this.tanks.find(t => t === sender);
                        if (tank) {
                            tank.resistance -= tank2.damage;
                        }
                    }
                }
            });
        } else if (event.type === 'createAndMoveBullet') {
            const bullet = TankFactory.createBullet(event.view, event.startX, event.startY);
            bullet.moveTo(event.targetX, event.targetY, event.moveDuration);
            this.soundManager.playSound('soundName1');
            //this.registerBullet(bullet);
        } else if (event.type === 'applyDamage') {
            // Trouver et appliquer l'effet de dommage au tank correspondant
            const tank = this.tanks.find(t => this.calculateDistance(t.getX(), t.getY(), event.target.x, event.target.y) === 0);
            if (tank) {
                tank.applyDamageEffect();
            }
        }
        // ... autres cas
    }
    calculateDistance(x1, y1, x2, y2) {


        let deltaX = parseInt(x2) - parseInt(x1);
        let deltaY = parseInt(y2) - parseInt(y1);

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}