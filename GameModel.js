// GameModel.js
class GameModel {
    constructor(SoundManager) {
            // Singleton Pattern
            if (GameModel.instance) {
                return GameModel.instance;
            }
            this.SoundManager = SoundManager;
            this.lives = 13;
            this.waveNumber = 0;
            this.mapPath = [

                [-1, 2],
                [0, 2],
                [1, 2],
                [2, 2],
                [3, 2],
                [4, 2],
                [5, 2],
                [6, 2],
                [7, 2],
                [8, 2],
                [8, 3],
                [9, 3],
                [10, 3],
                [10, 2],
                [11, 2],
                [12, 2],
                [12, 1],
                [13, 1],
                [14, 1],
                [14, 2],
                [15, 2],
                [16, 2],
                [17, 2],
                [18, 2],
                [18, 3],
                [18, 4],
                [18, 5],
                [17, 5],
                [16, 5],
                [15, 5],
                [14, 5],
                [14, 6],
                [13, 6],
                [12, 6],
                [11, 6],
                [10, 6],
                [10, 5],
                [9, 5],
                [8, 5],
                [7, 5],
                [7, 6],
                [7, 7],
                [7, 8],
                [8, 8],
                [9, 8],
                [10, 8],
                [11, 8],
                [11, 9],
                [11, 10],
                [12, 10],
                [13, 10],
                [13, 9],
                [13, 8],
                [14, 8],
                [15, 8],
                [16, 8],
                [17, 8],
                [17, 9],
                [17, 10],
                [18, 10],
                [19, 10],
                [19, 11],
                [19, 12],
                [18, 12],
                [17, 12],
                [16, 12],
                [15, 12],
                [14, 12],
                [13, 12],
                [13, 13],
                [12, 13],
                [11, 13],
                [10, 13],
                [9, 13],
                [8, 13],
                [8, 12],
                [8, 11],
                [8, 10],
                [7, 10],
                [6, 10],
                [5, 10],
                [5, 9],
                [5, 8],
                [5, 7],
                [5, 6],
                [5, 5],
                [5, 4],
                [4, 4],
                [3, 4],
                [2, 4],
                [1, 4],
                [1, 5],
                [1, 6],
                [2, 6],
                [3, 6],
                [3, 7],
                [3, 8],
                [2, 8],
                [1, 8],
                [0, 8],
                [0, 9],
                [0, 10],
                [1, 10],
                [1, 11],
                [1, 12],
                [2, 12],
                [3, 12],
                [4, 12],
                [5, 12],
                [6, 12],
                [6, 13],
                [6, 14]

            ];
            this.controlBarHeight = 40;
            this.infoBarHeight = 40;
            this.gameHeight = 640;
            this.squareTank = [
                '1111111111111111',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1222222222222221',
                '1111111111111111'
            ];

            this.squareTankColors = {
                '1': '#000000', // Noir pour les chenilles
                '2': '#ff0000' // Vert foncé pour le corps du tank
            };
            // Singleton Pattern
            GameModel.instance = this;


        }
        // Singleton Pattern
    static getInstance(SoundManager) {
        if (!GameModel.instance) {
            GameModel.instance = new GameModel(SoundManager);
        }
        return GameModel.instance;
    }
    isValidLocation(x, y) {
        // Convertissez les coordonnées en indices de grille
        let gridX = Math.floor(x / 40); // Supposons que 40 est la taille d'un carré de grille
        let gridY = Math.floor(y / 40);

        // Vérifiez si le point (gridX, gridY) est sur le chemin
        const isOnPath = this.mapPath.some(point => point[0] === gridX && point[1] === gridY);

        const isOnControlBar = y <= this.controlBarHeight;
        // Vérifiez si le clic est dans la zone de la barre d'information en bas
        const isOnInfoBar = y >= (this.gameHeight - this.infoBarHeight);

        // L'emplacement est valide s'il n'est pas sur le chemin, ni sur les barres de contrôle et d'information
        return !isOnPath && !isOnControlBar && !isOnInfoBar;
    }
}