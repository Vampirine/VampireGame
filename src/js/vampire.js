import { Actor as ExActor, Vector as ExVector, Keys as ExKeys, CollisionType as ExCollisionType, SpriteSheet as ExSpriteSheet, Animation as ExAnimation, range as exRange } from 'excalibur';
import { Assets } from './resources.js';
import { ScoreTracker } from './score.js';
import { FlyingBat } from './bat.js';

export class VampireCharacter extends ExActor {
    points = 0;
    activeAnimation = null;
    gameInstance = null; // Reference to the game instance

    constructor() {
        super({
            width: 12,
            height: 32,
            collisionType: ExCollisionType.Active
        });
        this.movementVector = new ExVector(0, 0); // Initialize movement vector
        this.scoreDisplay = new ScoreTracker();
        this.scoreDisplay.pos = new ExVector(-30, -40);
        this.scoreDisplay.z = 4;
        this.addChild(this.scoreDisplay);
    }

    onInitialize(engine) {
        // Store the game instance
        this.gameInstance = engine;

        // Define the sprite sheet
        const charSpriteSheet = ExSpriteSheet.fromImageSource({
            image: Assets.CharacterSheet,
            grid: {
                rows: 1,
                columns: 24,
                spriteWidth: 16,
                spriteHeight: 32
            },
        });

        // Create animations from the sprite sheet
        this.moveRightAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(0, 5), 100);
        this.moveUpAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(6, 11), 100);
        this.moveLeftAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(12, 17), 100);
        this.moveDownAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(18, 23), 100);
        this.idleRightAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(2, 2), 100);
        this.idleUpAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(9, 9), 100);
        this.idleLeftAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(14, 14), 100);
        this.idleDownAnimation = ExAnimation.fromSpriteSheet(charSpriteSheet, exRange(20, 20), 100);
        this.graphics.use(this.idleDownAnimation);
        this.activeAnimation = this.idleDownAnimation;

        // Set the initial position and scale of the actor
        this.scale = new ExVector(1.5, 1.5);
        this.on('collisionstart', (event) => this.handleCollision(event));
    }

    noMovementKeysPressed(engine) {
        return !(
            engine.input.keyboard.isHeld(ExKeys.W) ||
            engine.input.keyboard.isHeld(ExKeys.A) ||
            engine.input.keyboard.isHeld(ExKeys.S) ||
            engine.input.keyboard.isHeld(ExKeys.D) ||
            engine.input.keyboard.isHeld(ExKeys.Up) ||
            engine.input.keyboard.isHeld(ExKeys.Left) ||
            engine.input.keyboard.isHeld(ExKeys.Down) ||
            engine.input.keyboard.isHeld(ExKeys.Right)
        );
    }

    onPreUpdate(engine, delta) {
        let xSpeed = 0;
        let ySpeed = 0;

        if (engine.input.keyboard.isHeld(ExKeys.W) || engine.input.keyboard.isHeld(ExKeys.Up)) {
            ySpeed = -1;
            if (this.activeAnimation !== this.moveUpAnimation) {
                this.graphics.use(this.moveUpAnimation);
                this.activeAnimation = this.moveUpAnimation;
            }
        } else if (engine.input.keyboard.isHeld(ExKeys.S) || engine.input.keyboard.isHeld(ExKeys.Down)) {
            ySpeed = 1;
            if (this.activeAnimation !== this.moveDownAnimation) {
                this.graphics.use(this.moveDownAnimation);
                this.activeAnimation = this.moveDownAnimation;
            }
        } else {
            ySpeed = 0;
        }

        if (engine.input.keyboard.isHeld(ExKeys.D) || engine.input.keyboard.isHeld(ExKeys.Right)) {
            xSpeed = 1;
            if (this.activeAnimation !== this.moveRightAnimation) {
                this.graphics.use(this.moveRightAnimation);
                this.activeAnimation = this.moveRightAnimation;
            }
        } else if (engine.input.keyboard.isHeld(ExKeys.A) || engine.input.keyboard.isHeld(ExKeys.Left)) {
            xSpeed = -1;
            if (this.activeAnimation !== this.moveLeftAnimation) {
                this.graphics.use(this.moveLeftAnimation);
                this.activeAnimation = this.moveLeftAnimation;
            }
        } else {
            xSpeed = 0;
        }

        // Adjust movement speed if Shift key is held
        if (engine.input.keyboard.isHeld(ExKeys.ShiftLeft)) {
            xSpeed *= 2;
            ySpeed *= 2;
        }

        if (this.noMovementKeysPressed(engine)) {
            if (this.activeAnimation === this.moveRightAnimation) {
                this.graphics.use(this.idleRightAnimation);
                this.activeAnimation = this.idleRightAnimation;
            } else if (this.activeAnimation === this.moveLeftAnimation) {
                this.graphics.use(this.idleLeftAnimation);
                this.activeAnimation = this.idleLeftAnimation;
            } else if (this.activeAnimation === this.moveUpAnimation) {
                this.graphics.use(this.idleUpAnimation);
                this.activeAnimation = this.idleUpAnimation;
            } else if (this.activeAnimation === this.moveDownAnimation) {
                this.graphics.use(this.idleDownAnimation);
                this.activeAnimation = this.idleDownAnimation;
            }
        }

        this.movementVector = new ExVector(xSpeed, ySpeed);

        // Apply movement speed to the direction
        const movementSpeed = 100; // Define a constant movement speed
        this.vel = this.movementVector.scale(movementSpeed);
    }

    handleCollision(event) {
        if (event.other instanceof FlyingBat) {
            this.points++;
            this.scoreDisplay.updateScore(this.points);
            Assets.CollectSound.play(); // Play the sound effect when collecting a bat
            event.other.kill();
            if (this.points >= 5) {
                this.gameInstance.showEndScene();
            }
        }
    }
}
