import { Scene as GameScene, Sprite, Vector as ExVector, Input as GameInput, Actor as GameActor } from 'excalibur';
import { Assets } from './resources.js';

export class GameOverScene extends GameScene {
    constructor(gameInstance) {
        super();
        this.gameInstance = gameInstance;
        // Add scene initialization code here
    }

    onInitialize(engine) {
        // Add event listener to transition to the intro scene
        this.gameInstance.input.keyboard.on('press', (event) => {
            if (event.key === GameInput.Keys.Space) {
                this.gameInstance.goToScene('start');
            }
        });

        // Create a sprite using the loaded image
        const endGameSprite = Assets.EndGameScreen.toSprite();

        // Calculate the scale to fit the game screen
        const screenWidth = this.gameInstance.drawWidth;
        const screenHeight = this.gameInstance.drawHeight;
        const spriteWidth = Assets.EndGameScreen.width;
        const spriteHeight = Assets.EndGameScreen.height;

        const scaleX = screenWidth / spriteWidth;
        const scaleY = screenHeight / spriteHeight;

        // Position the sprite in the center of the screen
        const endGameActor = new GameActor({
            pos: new ExVector(screenWidth / 2, screenHeight / 2),
            anchor: new ExVector(0.5, 0.5),
            scale: new ExVector(scaleX, scaleY)
        });

        endGameActor.graphics.use(endGameSprite);
        this.add(endGameActor);
    }
}
