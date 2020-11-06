import Phaser from '../lib/phaser.js';

// Enums
import BorderSide from '../enums/Borderside.js';

// Game objects
import Platform from '../objects/Platform.js';
import Player from '../objects/Player.js';
import Portalgun from '../objects/Portalgun.js';
import Laser from '../objects/Laser.js';
import PauseOverlay from '../objects/PauseOverlay.js';
import PauseText from '../objects/PauseText.js';

// Input handler
import InputHandler from '../InputHandler.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.load.spritesheet({
      key: 'player', 
      url: 'assets/spritesheets/idle.png',
      frameConfig: {
        frameWidth: 19,
        frameHeight: 25,
        startFrame: 0,
        endFrame: 3
      },
    });

    // Load background image
    this.load.image('background', 'assets/bg_layer1.png');

    // Load platform image
    this.load.image('platform', 'assets/ground_grass.png');

    // Load portal gun
    this.load.image('portalgun', 'assets/portal-gun.png');

    // Load laser
    this.load.image('laser', 'assets/laserbeam.png');
  }

  create() {
    new InputHandler(this);

    this.anims.create({
      key: 'player',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 5,
      repeat: -1
    });

    // Initialize laser object as null as there are no active lasers at initialization
    this.laser = null;

    // Draw the background image first
    this.background = this.add.image(this.centerX, this.centerY, 'background');

    // Create a new intance of the Player class
    // "this" here is a reference to this class (the Game scene)
    this.player = new Player(this, this.width / 2, this.height);

    // portalgun
    this.portalgun = new Portalgun(this, this.width / 2, this.height - 50);

    // Create a group of platforms with physics, but with zero gravity
    this.platforms = this.physics.add.group({
      allowGravity: false,
    });
    
    // Create 5 platforms with a random x and y position
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(40, 400);
      const y = 200 * i;

      new Platform(this, x, y);
    }

    this.pauseOverlay = new PauseOverlay(this, this.width / 2, this.height / 2);
    this.pauseText = new PauseText(this, this.width / 2 - 150, this.height / 2 - 25);

    // Add a collider to this scene. This makes the platforms and the player collide
    // with each other, and we can create a custom function in response to this as
    // shown which destroys the current platform upon collision
    this.physics.add.collider(this.platforms, this.player, (player, platform) => {
      console.log('Collision between player and platform');
      platform.destroy();
    });
  }

  // Update game objects
  update() {
    this.player.update();

    this.portalgun.update({x: this.player.x, y: this.player.y });

    if (this.didTeleport) {

      /* 
        If the teleported height was big enough, we must move all objects
        down and spawn new platforms such that it looks like the camera just moved.
        Should be accelerated in a while loop such that it looks smooth.

        So, something like:

        if (teleport path was long enough) {
          cameraFullyMoved = false

          while (!cameraFullyMoved) {
            accelerate objects downward

            if (objects was moved to the correct offset) {
              cameraFullyMoved = true
            }
          }
        }

        this should then look like the camera naturally moves as the player progresses.
      */

      const playerBaseY = this.height - this.player.displayHeight;
      const offset = playerBaseY - this.player.y;

      console.log(`Player base y: ${playerBaseY}`);
      console.log(`Player offset: ${offset}`);

      this.platforms.children.iterate((platform) => {
        platform.y += offset;
      });

      this.didTeleport = false;
    }

    if (this.laser != null) {
      this.laser.update((borderSide) => {
        this.onLaserReachedTarget(borderSide)
      })
    }
  }

  onLaserReachedTarget(borderSide) {
    const playerWidth = this.player.displayWidth;

    if (borderSide == BorderSide.LEFT) {
      this.player.setPosition(
        0 + playerWidth / 2,
        this.laser.y
      );

      this.onPlayerTeleported();

    } else if (borderSide == BorderSide.RIGHT) {
      this.player.setPosition(
        this.width - playerWidth / 2,
        this.laser.y
      );

      this.onPlayerTeleported();

    } else {
      this.laser.destroy();
      this.laser = null;
    }
  }
  
  onPlayerTeleported() {
    this.didTeleport = true;
    this.player.setVelocity(0, 0);
    this.laser.destroy();
    this.laser = null;
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