import { Actor as GameActor, CollisionType as GameCollisionType, SpriteSheet as ExSpriteSheet, Animation as ExAnimation, range as exRange } from 'excalibur';
import { Assets } from './resources.js';

export class FlyingBat extends GameActor {
    constructor() {
        super({
            width: 20,
            height: 32,
            collisionType: GameCollisionType.Passive
        });
    }

    onInitialize(engine) {
        // Define the sprite sheet
        const batSpriteSheet = ExSpriteSheet.fromImageSource({
            image: Assets.BatImage,
            grid: {
                rows: 1,
                columns: 4,
                spriteWidth: 20,
                spriteHeight: 32
            },
        });

        // Create an animation from the sprite sheet
        const flyingAnimation = ExAnimation.fromSpriteSheet(batSpriteSheet, exRange(0, 3), 100);
        this.graphics.use(flyingAnimation);
    }
}
