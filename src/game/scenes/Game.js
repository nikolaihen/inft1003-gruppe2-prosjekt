import Phaser from '../lib/phaser.js';
import Platform from '../objects/Platform.js';
import Player from '../objects/Player.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.cursors = this.input.keyboard.createCursorKeys();

    // Load player images
    this.load.image('player-facing-right', 'assets/man-facing-right.png');
    this.load.image('player-facing-left', 'assets/man-facing-left.png');
    
    // Load background image
    this.load.image('background', 'assets/bg_layer1.png');

    // Load platform image
    this.load.image('platform', 'assets/ground_grass.png');
  }

  create() {
    // Draw the background image first
    this.add.image(this.centerX, this.centerY, 'background');

    // Create a new intance of the Player class

    // "this" here is a reference to this class (the Game scene)
    this.player = new Player(this, this.width / 2, this.height);

    // Create a group of platforms with physics, but with zero gravity
    this.platforms = this.physics.add.group({
      allowGravity: false,
    });
    
    // Create 5 platforms with a random x and y position
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(40, 400);
      const y = 150 * i;

      new Platform(this, x, y);
    }

    // Add a collider to this scene. This makes the platforms and the player collide
    // with each other, and we can create a custom function in response to this as
    // shown
    this.physics.add.collider(this.platforms, this.player, () => {
      console.log('Colision detected between the player and one of the platforms');
    });
  }

  // Update game objects
  update() {
    this.player.update();
  }
}