import Phaser from './lib/phaser.js';
import Laser from './objects/Laser.js';

export default class InputHandler {
  constructor(scene) {

    /** @type {Phaser.Scene} */
    this.scene = scene;
    this.sceneManager = this.scene.scene;

    $('#startGameButton').on('click', () => {
      // Create event listeners for the game controls
      // when the game is started

      $('#restartBtn').on('click', () => {
        this.scene.resetGameStats();
        this.scene.resetHtml();
        this.sceneManager.restart();
      });
  
      $('#pauseBtn').on('click', () => {
        this.sceneManager.isPaused() ? this.onGameResumed() : this.onGamePaused();
      });
  
      $(document).on('mousemove', (event) => {
        // Get the cursor position in order to rotate the
        // portal gun for aiming
        this.scene.mousePos = this.getMousePosition(event);
      });
  
      $(document).on('mousedown', (event) => {
        this.onMouseDown(event);
      });

      $('#menuBtn').on('click', () => {
        this.sceneManager.restart();
        this.scene.resetHtml();
  
        $('#game-view').hide();
        $('.menu').show();
        $('body').css("background-image", "url('./assets/background_gif.gif')");
  
        $(document).off('mousedown');
        $(document).off('mousemove');
        $('#restartBtn').off('click');
        $('#pauseBtn').off('click');
        $('#menuBtn').off('click');
      });
    });
  }

  onGamePaused() {
    this.scene.overlay.setVisible(true);
    this.scene.pauseText.setVisible(true);
    this.sceneManager.pause();
    $('#pauseBtn').html('RESUME');
  }

  onGameResumed() {
    this.scene.overlay.setVisible(false);
    this.scene.pauseText.setVisible(false);
    this.scene.scene.resume();
    $('#pauseBtn').html('PAUSE');
  }

  onMouseDown(event) {
    // Get the target of the laser
    const laserTarget = this.getMousePosition(event);

    // If no laser is active and the cursor position was inside the game's
    // vertical bounds, create a new laser
    if (this.scene.laser == null && laserTarget.y > 0) {

      // Get the angle between the portalgun and the target
      this.scene.laserTargetAngle = this.scene.portalgun.angleToTarget(laserTarget);

      // Create the laser
      this.scene.laser = new Laser(
        this.scene,
        this.scene.portalgun.body.x,
        this.scene.portalgun.body.y
      );

      this.scene.physics.add.collider(this.scene.platforms, this.scene.laser, (_, platform) => {
        platform.destroy();

        // Reset combo count
        this.scene.combo = 0;
        
        // Reflect changes to HTML
        $('#combo-count').html('x 0');
      });

      this.scene.physics.add.collider(this.scene.comboItems, this.scene.laser, (_, comboItem) => {
        comboItem.destroy();

        // Increment combo count
        this.scene.combo++;

        // Reflect changes to HTML
        $('#combo-count').html(`x ${this.scene.combo}`);
      });

      // Save the position of the player before teleporting to
      // determine the offset to move the camera
      this.scene.playerPosBeforeTeleporting = {
        x: this.scene.player.x,
        y: this.scene.player.y
      }

      // Play a shooting-sound
      this.scene.sound.play('shoot');
    }
  }

  getMousePosition(event) {
    const rect = this.scene.game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x: x, y: y};
  }
}