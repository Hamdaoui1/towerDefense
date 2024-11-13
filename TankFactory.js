class TankFactory {
    static createTank(type, view, index, startX, startY) {
        switch (type) {
            case 'Tank':
                return new Tank(view, index, startX);

            case 'Tank2':
                return new Tank2(view, index, startX, startY);
            default:
                throw new Error('Type de tank inconnu');
        }
    }

    static createBullet(view, x, y) {
        return new Bullet(view, x, y);
    }
}