import { ImageSource, Loader, Sound } from 'excalibur';
import { TiledResource } from '@excaliburjs/plugin-tiled';

const Assets = {
    StartImage: new ImageSource('images/Intro.png'),
    BatImage: new ImageSource('images/bat.png'),
    CharacterSheet: new ImageSource('src/assets/characters/Amelia_run_16x16.png'),
    GameMap: new TiledResource('src/assets/maps/mapnew.tmx'),
    EndGameScreen: new ImageSource('images/EndScene.png'), // Game over screen image
    BackgroundTrack: new Sound('images/background.mp3'), // Background audio
    CollectSound: new Sound('images/Collectin.mp3'), // Sound for bat collection
};

// Adjust the audio volume
Assets.BackgroundTrack.volume = 0.05; // 5% volume
Assets.CollectSound.volume = 3.00; // 300% volume

const AssetLoader = new Loader([
    Assets.StartImage,
    Assets.BatImage,
    Assets.CharacterSheet,
    Assets.GameMap,
    Assets.EndGameScreen, // Add to the loader
    Assets.BackgroundTrack,
    Assets.CollectSound
]);

export { Assets, AssetLoader };