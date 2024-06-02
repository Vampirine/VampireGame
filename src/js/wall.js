import { Actor as GameActor, CollisionType as GameCollisionType, Vector as ExVector } from 'excalibur';

export class Barrier extends GameActor {
    constructor(x, y, width, height) {
        super({
            pos: new ExVector(x + width / 2, y + height / 2), // Center the barrier at the given position
            width: width,
            height: height,
            collisionType: GameCollisionType.Fixed,
        });
    }
}
