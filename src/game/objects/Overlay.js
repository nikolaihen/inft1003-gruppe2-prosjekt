import Phaser from '../lib/phaser.js';

export default class Overlay extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 480, 800, 'black', 0.5);

    scene.add.existing(this);
    
    this.setActive(false)
    this.setVisible(false);
  }
}