import Phaser from './lib/phaser.js';
import Game from'./scenes/Game.js';

export default new Phaser.Game({
  type: Phaser.CANVAS,
  width: 480,
  height: 640,
  canvas: document.querySelector('canvas'),
  scene: Game,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: true
    }
  }
});