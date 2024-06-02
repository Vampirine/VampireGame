import { Scene as GameScene, Sprite, Vector as ExVector, Input as GameInput, Actor as GameActor } from 'excalibur';
import { Assets } from './resources.js';

export class StartScene extends GameScene {
    constructor(gameInstance) {
        super();
        this.gameInstance = gameInstance;
    }

    onInitialize(engine) {
        console.log("Initializing Start Scene");

        // Add event listener to transition to the main game scene
        this.gameInstance.input.keyboard.on('press', (event) => {
            if (event.key === GameInput.Keys.Space) {
                console.log("Space pressed in Start Scene");
                this.gameInstance.navigateToCoreGameScene();
            }
        });

        // Create a sprite using the loaded image
        const introSprite = Assets.StartImage.toSprite();

        // Calculate the scale to fit the game screen
        const screenWidth = this.gameInstance.drawWidth;
        const screenHeight = this.gameInstance.drawHeight;
        const imageWidth = Assets.StartImage.width;
        const imageHeight = Assets.StartImage.height;

        const scaleX = screenWidth / imageWidth;
        const scaleY = screenHeight / imageHeight;

        // Position the sprite in the center of the screen
        const introActor = new GameActor({
            pos: new ExVector(screenWidth / 2, screenHeight / 2),
            anchor: new ExVector(0.5, 0.5),
            scale: new ExVector(scaleX, scaleY)
        });

        introActor.graphics.use(introSprite);
        this.add(introActor);
    }
}
