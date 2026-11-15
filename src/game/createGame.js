import * as Phaser from 'phaser';
import ParkScene from './ParkScene';

// Loaded lazily (dynamic import) only when a visitor enters the park, so the
// portfolio page never downloads Phaser.
export const createGame = (parent) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#0f1f3d',
    pixelArt: true,
    roundPixels: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    // The canvas fills its container; ParkScene picks a whole-number zoom.
    scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
    scene: [ParkScene],
  });
