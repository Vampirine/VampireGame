import { Scene as ExScene, Vector as ExVector, Random as ExRandom } from 'excalibur';
import { Assets } from './resources.js';
import { VampireCharacter as Vmp } from './vampire.js';
import { FlyingBat as Bt } from './bat.js';
import { Barrier as Wl } from './wall.js'; // Import the Barrier class

export class GameScene extends ExScene {
    constructor(gameInstance) {
        super();
        this.gameInstance = gameInstance; // Reference to the game instance
        this.wallObjects = []; // To store wall positions and dimensions
    }

    async onInitialize(engine) {
        // Ensure the Tiled map resource is loaded
        await Assets.GameMap.load();



        // Add the Tiled map to the scene
        Assets.GameMap.addToScene(this);



        // Handle the tileset
        const tilesetImage = Assets.CharacterSheet.image;
        const tilesetWidth = Assets.CharacterSheet.width;
        const tilesetHeight = Assets.CharacterSheet.height;

        const tilesetCanvas = createTilesetCanvas(tilesetImage, tilesetWidth, tilesetHeight);

        // Define map dimensions in pixels
        const mapWidth = 40 * 16;
        const mapHeight = 30 * 16;

        // Create and configure the vampire character
        const vampireCharacter = new Vmp();
        vampireCharacter.z = 2;
        vampireCharacter.pos = new ExVector(350, 350);

        // Add the vampire to the scene
        this.add(vampireCharacter);

        // Spawn bats around the vampire
        this.generateBatsAroundVampire(vampireCharacter, 100, 300, 5, mapWidth, mapHeight);

        // Set the camera to follow the vampire
        this.camera.strategy.lockToActor(vampireCharacter);

        // Scale the camera
        this.camera.zoom = 4.0;

        // Play background music
        Assets.BackgroundTrack.loop = true;
        Assets.BackgroundTrack.play();
    }

    initializeCollisionObjects(tiledMapResource) {

        const collisionLayer = tiledMapResource.layers.find(layer => layer.name === 'collision');

        if (collisionLayer && collisionLayer.objects) {
            collisionLayer.objects.forEach(object => {
                const wallInstance = new Wl(object.x, object.y, object.width, object.height);
                this.add(wallInstance);

                // Store wall position and dimensions
                this.wallObjects.push({ x: object.x, y: object.y, width: object.width, height: object.height });
            });
        } else {
            console.warn('Collision layer or collision objects not found in the Tiled map.');
        }
    }

    restartGameScene() {
        this.entities.forEach(entity => {
            entity.kill(); // Remove all entities in the scene
        });
        this.actors.forEach(actor => {
            actor.kill(); // Remove all actors in the scene
        });

        // Add the Tiled map to the scene once it's loaded
        Assets.GameMap.addToScene(this);

        // Extract collision objects from the Tiled map
        this.initializeCollisionObjects(Assets.GameMap);

        // Create and configure the vampire
        const vampireCharacter = new Vmp();
        vampireCharacter.z = 2;
        vampireCharacter.pos = new ExVector(1200, 1000);

        // Add the vampire to the scene
        this.add(vampireCharacter);

        // Map dimensions in pixels
        const mapWidth = 40 * 16;
        const mapHeight = 30 * 16;

        // Spawn bats around the vampire
        this.generateBatsAroundVampire(vampireCharacter, 100, 300, 7, mapWidth, mapHeight);

        // Set the camera to follow the vampire
        this.camera.strategy.lockToActor(vampireCharacter);

        // Scale the camera
        this.camera.zoom = 2.5;
    }

    generateBatsAroundVampire(vampire, minRadius, maxRadius, numberOfBats, mapWidth, mapHeight) {
        const random = new ExRandom();

        for (let i = 0; i < numberOfBats; i++) {
            let x, y, isValidPosition;

            do {
                const angle = random.next() * Math.PI * 2;
                const distance = minRadius + random.next() * (maxRadius - minRadius);

                x = vampire.pos.x + distance * Math.cos(angle);
                y = vampire.pos.y + distance * Math.sin(angle);

                isValidPosition = this.checkBatPosition(x, y, mapWidth, mapHeight);
            } while (!isValidPosition);

            const batInstance = new Bt();
            batInstance.pos = new ExVector(x, y);
            batInstance.z = 1;
            this.add(batInstance);
        }
    }

    checkBatPosition(x, y, mapWidth, mapHeight) {
        const buffer = 16;

        if (x < buffer || x > mapWidth - buffer || y < buffer || y > mapHeight - buffer) {
            return false;
        }

        for (const wall of this.wallObjects) {
            if (x > wall.x && x < wall.x + wall.width && y > wall.y && y < wall.y + wall.height) {
                return false;
            }
        }

        return true;
    }
}

// Utility function to create tileset canvas
function createTilesetCanvas(image, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    return canvas;
}
