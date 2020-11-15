import Phaser from '../lib/phaser.js';

// Enums
import BorderSide from '../enums/Borderside.js';

// Game objects
import Platform from '../objects/Platform.js';
import Player from '../objects/Player.js';
import Portalgun from '../objects/Portalgun.js';
import Laser from '../objects/Laser.js';
import Overlay from '../objects/Overlay.js';
import CenterText from '../objects/CenterText.js';
import GameCamera from '../utils/GameCamera.js';
import ComboItem from '../objects/ComboItem.js';

// Input handler
import InputHandler from '../InputHandler.js';

const scores = [];
const isMobile = window.innerWidth < 800;

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.deltaMultiplier = 7;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.baseDistBetweenPlatforms = 300;
    this.platformCount = 1000;
    this.camera = new GameCamera(this);
    this.score = 0;
    this.combo = 0;
    this.health = 3;

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

    // Load laser shoot audio
    this.load.audio('shoot', 'assets/sound/laser_shoot.mp3');

    // Load damage taken audio
    this.load.audio('damage', 'assets/sound/damage_taken.mp3');
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
    
    this.overlay = new Overlay(this, this.width / 2, this.height / 2);
    this.pauseText = new CenterText(this, 32, 0, 'Game is paused');
    this.gameOverText = new CenterText(this, 32, 0, 'Game over');

    // Add a collider to this scene. This makes the platforms and the player collide
    // with each other, and we can create a custom function in response to this as
    // shown which destroys the current platform upon collision
    this.physics.add.collider(this.platforms, this.player, (player, platform) => {

      this.sound.play('damage');

      if (this.health == 1) {
        console.log('Game over by health loss');
        this.onGameOver();
      } else {
        this.health--;
        $(`#heart-${this.health}`).hide();
      }

      platform.destroy();
    });
  }

  // Update game objects
  update(time, delta) {
    this.camera.animate(delta);

    this.platforms.children.iterate((platform) => {
      platform.update();
    });

    this.isPortaling = this.laser != null;

    this.player.update(delta);
    this.portalgun.update();

    if (this.isPortaling) {
      this.laser.update({
        onLaserReachedTargetCallback: (borderSide) => {
          this.onLaserReachedTarget(borderSide)
        },
        delta: delta
      });
    }

    if (this.didTeleport) {
      if (this.player.hitBottomBorder()) {
        this.sound.play('damage');
        this.onGameOver();
      }
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
    var scoreMultiplier = 1;
    const offset = this.playerPosBeforeTeleporting.y - this.player.y;

    if (this.combo > 3) {
      scoreMultiplier = this.combo / 2;
    }

    this.score += offset * scoreMultiplier;
    document.getElementById('game-score').innerHTML = Math.round(this.score);

    this.camera.updateOffset(Math.abs(offset));
    this.didTeleport = true;
    this.player.setVelocity(0, 0);
    this.laser.destroy();
    this.laser = null;
  }

  onGameOver() {
    console.log('onGameOver called');
    this.gameOverText.setVisible(true);
    this.overlay.setVisible(true);
    this.scene.pause();

    if (this.score != 0) {
      this.updateScoreboard();
    }

    this.resetGameStats();

    const id = setInterval(() => {
      this.scene.restart();
      this.resetHtml();

      clearInterval(id);
    }, 1000);
  }

  updateScoreboard() {
    // Add the new score to the scores array
    scores.push(this.score);

    // Sort the array from highest to lowest score
    scores.sort((currentScore, nextScore) => {
      return (currentScore > nextScore) ? -1 : (currentScore < nextScore) ? 1 : 0; 
    });

    // Clear the HTML scoreboard
    $('#scoreboard').empty();

    // Append scoreboard entries with the new score to the HTML scoreboard
    for (var i = 0; i < scores.length; i++) {
      const html = `<div id="${i + 1}" class="scoreboard-entry">
        <span class="scoreboard-entry-index">${i + 1}.</span>
        <span class="scoreboard-entry-score">${Math.round(scores[i])}</span>
      </div>`;

      $(html).appendTo('#scoreboard');
    }
  }

  resetGameStats() {
    this.didTeleport = false;
    this.score = 0;
    this.combo = 0;
    this.health = 3;
  }

  resetHtml() {
    // Reset health
    for (var i = 1; i <= 3; i++) {
      $(`#heart-${i}`).show();
    }

    // Reset score and combo
    $('#game-score').html('0');
    $('#combo-count').html(`x 0`);
  }

  createPlatformsAndComboItems() {
    let previousPlatform;
    var densityFactor = 1;
    var startY = this.height - 200;

    for (let i = 0; i < this.platformCount; i++) {
      let x, y;
      const distBetweenPlatforms = this.baseDistBetweenPlatforms * densityFactor;

      x = Phaser.Math.Between(40, 400);

      if (previousPlatform != null) {
        y = previousPlatform.y - distBetweenPlatforms;
      } else {
        y = startY -= distBetweenPlatforms * i;
      }

      // Save the previous platform
      previousPlatform = new Platform(this, x, y);

      // Create one combo item for every 3rd platform
      if (i > 0 && i % 3 == 0) {
        new ComboItem(this, x, y - 100);
      }

      // Increase the density of platforms for every 20th platform,
      // but only till the 100th pplatform
      if (i > 1 && i % 20 == 0 && i < 100) {
        densityFactor -= 0.1;
      }
    }
  }
}