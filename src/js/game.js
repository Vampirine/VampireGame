import { Engine as GameEngine, DisplayMode as ScreenMode } from 'excalibur';
import { Assets, AssetLoader } from './resources.js';
import { StartScene } from './IntroScene.js';
import { GameScene } from './MainGameScene.js';
import { GameOverScene } from './EndScene.js';

export class MyGame extends GameEngine {
    constructor() {
        super({
            width: 1280,
            height: 700,
            displayMode: ScreenMode.FitScreen,
        });

        // Add scenes to the game
        this.add('start', new StartScene(this));
        this.add('core', new GameScene(this));
        this.add('gameOver', new GameOverScene(this));

        // Start the game with the asset loader
        this.start(AssetLoader).then(() => {
            // After loading assets, go to the start scene
            this.goToScene('start');
        });
    }

    navigateToCoreGameScene() {
        this.goToScene('core');
    }

    displayGameOverScene() {
        this.goToScene('gameOver');
    }

    showEndScene() {
        this.goToScene('gameOver');
    }
}

// Instantiate the game
new MyGame();
