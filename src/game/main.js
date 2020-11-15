import Phaser from './lib/phaser.js';
import Game from'./scenes/Game.js';

$('canvas').ready(() => {
  new Phaser.Game({
    type: Phaser.CANVAS,
    width: 480,
    height: 800,
    canvas: document.querySelector('canvas'),
    scene: Game,
    scale: {
      parent: 'game-canvas',
      mode: Phaser.Scale.NO_CENTER,
      width: 480,
      height: 800,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 50
        },
        debug: false
      },
    },
  });
});