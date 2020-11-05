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
    
    // Load button assets
    this.load.image('pplay_button', 'assets/Play_BTN.png')
    this.load.image('pause_button', 'assets/Pause_BTN.png')

    // Load background image
    this.load.image('background', 'assets/bg_layer1.png');

    // Load platform image
    this.load.image('platform', 'assets/ground_grass.png');
  }

  create() {
    this.pauseButton = document.getElementById('pauseBtn');

    this.pauseButton.addEventListener('click', () => {
      this.scene.isPaused() ? this.onGameResumed() : this.onGamePaused();
    });

    this.game.scale.updateBounds();

    // Draw the background image first
    this.background = this.add.image(this.centerX, this.centerY, 'background');

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

    this.pauseOverlay = this.add
        .rectangle(this.width / 2, this.height / 2, 480, 800, 'black', 0.5)
        .setActive(false)
        .setVisible(false);

    const pauseStyle = {
      font: "bold 32px Arial", 
      fill: "#fff", 
      boundsAlignH: "center", 
      boundsAlignV: "middle"
    };

    this.pauseText = this.add
        .text(this.width / 2 - 150, this.height / 2 - 25, 'Game is paused', pauseStyle)
        .setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
        .setDisplaySize(300, 50)
        .setVisible(false)
  }

  // Update game objects
  update() {
    this.player.update();
  }

  onGameResumed() {
    this.pauseOverlay.setVisible(false);
    this.pauseText.setVisible(false);
    this.scene.resume();
    this.pauseButton.innerText = 'Pause game'
  }

  onGamePaused() {
    this.pauseOverlay.setVisible(true);
    this.pauseText.setVisible(true);
    this.scene.pause();
    this.pauseButton.innerText = 'Resume game'
  }
}