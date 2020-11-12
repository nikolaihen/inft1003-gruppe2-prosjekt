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
import GameCamera from '../utils/GameCamera.js';
import { ScoreText, ComboText } from '../objects/ScoreText.js';
import ComboItem from '../objects/ComboItem.js';

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
    this.baseDistBetweenPlatforms = 300;
    this.platformCount = 100;
    this.camera = new GameCamera(this);
    this.score = 0;
    this.combo = 0;

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

    this.load.image('background_cyberpunk', 'assets/background.jpg')

    // Load background image
    this.load.image('background', 'assets/kornbackground.jpg');

    // Load platform image
    this.load.image('platform', 'assets/ground_grass.png');

    // Load portal gun
    this.load.image('portalgun', 'assets/portal-gun-red.png');

    // Load laser
    this.load.image('laser', 'assets/laserbeam.png');

    // Load star
    this.load.image('star', '/assets/star.png');
  }

  create() {
    new InputHandler(this);

    this.bgTile = this.add.tileSprite(
      this.width / 2, 
      this.height, 
      this.width,
      8000,
      'background'
    );

    this.bgTile.setOrigin(0.5, 1.0);

    this.anims.create({
      key: 'player',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 5,
      repeat: -1
    });

    // Initialize laser object as null as there are no active lasers at initialization
    this.laser = null;

    // Create a new intance of the Player class
    // "this" here is a reference to this class (the Game scene)
    this.player = new Player(this, this.width / 2, this.height);

    this.playerPosBeforeTeleporting = {
      x: this.player.x,
      y: this.player.y
    };

    // portalgun
    this.portalgun = new Portalgun(this, this.width / 2, this.height - 50);

    // Create a group of platforms with physics, but with zero gravity
    this.platforms = this.physics.add.group({
      allowGravity: false,
    });

    // Create a group of combo items
    this.comboItems = this.physics.add.group({
      allowGravity: false
    });

    this.createPlatformsAndComboItems();

    this.pauseOverlay = new PauseOverlay(this, this.width / 2, this.height / 2);
    this.pauseText = new PauseText(this, this.width / 2 - 150, this.height / 2 - 25);

    /* this.scoreText = new ScoreText(this, this.width / 2, 20);
    this.comboText = new ComboText(this); */

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
    this.camera.animate();

    console.log(`IsAnimating: ${this.camera.isAnimating}`);

    this.platforms.children.iterate((platform) => {
      platform.update(this.camera.isAnimating);
    });

    this.isPortaling = this.laser != null;

    this.player.update();
    this.portalgun.update();

    if (this.isPortaling) {
      this.laser.update({
        onLaserReachedTargetCallback: (borderSide) => {
          this.onLaserReachedTarget(borderSide)
        }
      });
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
    const offset = this.playerPosBeforeTeleporting.y - this.player.y;
    const absOffset = Math.abs(this.playerPosBeforeTeleporting.y - this.player.y);

    
    this.score += offset;
    document.getElementById('game-score').innerHTML = Math.round(this.score);

    this.camera.updateOffset(absOffset);
    this.didTeleport = true;
    this.player.setVelocity(0, 0);
    this.laser.destroy();
    this.laser = null;
  }

  createPlatformsAndComboItems() {
    let previousPlatform;
    var densityFactor = 1;
    var startY = this.height - 200;

    for (let i = 0; i < this.platformCount; i++) {
      let x, y;
      const distBetweenPlatforms = this.baseDistBetweenPlatforms * densityFactor;

      console.log(`\nDistance: ${distBetweenPlatforms}`);

      x = Phaser.Math.Between(40, 400);

      if (previousPlatform != null) {
        y = previousPlatform.y - distBetweenPlatforms;
      } else {
        y = startY -= distBetweenPlatforms * i;
      }

      previousPlatform = new Platform(this, x, y);

      if (i > 0 && i % 3 == 0) {
        new ComboItem(this, x, y - 100);
      }

      if (i > 1 && i % 10 == 0) {
        densityFactor -= 0.1;
      }
    }
  }
}