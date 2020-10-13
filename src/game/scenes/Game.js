import Phaser from '../lib/phaser.js';
import Platform from '../objects/Platform.js';

class BaseGame extends Phaser.Scene {
  constructor(game) {
    super(game);
  }

  init() {
    this.gameWidth = this.sys.canvas.width;
    this.gameHeight = this.sys.canvas.height;
    this.centerX = this.gameWidth / 2;
    this.centerY = this.gameHeight / 2;
  }
}

export default class Game extends BaseGame {
  constructor() {
    super('game');
  }

  preload() {
    super.init();
    
    // Load background
    this.load.image('background', 'assets/bg_layer1.png');

    // Load platform
    this.load.image('platform', 'assets/ground_grass.png');
  }

  create() {
    this.add.image(this.centerX, this.centerY, 'background');

    const platform = new Platform(this, this.centerX, this.centerY);
    this.add.existing(platform);
  }

  update() {
    
  }
}