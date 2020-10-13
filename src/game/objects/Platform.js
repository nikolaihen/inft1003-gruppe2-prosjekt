import Phaser from '../lib/phaser.js';

export default class Platform extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'platform');
  }

  update() {
    
  }
}