import Phaser from './lib/phaser.js';
import Laser from './objects/Laser.js';

export default class InputHandler {
  constructor(scene) {

    /** @type {Phaser.Scene} */
    this.scene = scene;
    this.sceneManager = this.scene.scene;

    $('#startGameButton').on('click', () => {
      $('#restartBtn').on('click', () => {
        $('#game-score').append('');
        this.sceneManager.restart();
      });
  
      $('#pauseBtn').on('click', () => {
        this.sceneManager.isPaused() ? this.onGameResumed() : this.onGamePaused();
      });
  
      $(document).on('mousemove', (event) => {
        this.scene.mousePos = this.getMousePosition(event);
      });
  
      $(document).on('mousedown', (event) => {
        this.onMouseDown(event);
      });

      $('#menuBtn').on('click', () => {
        console.log('\n\n\nMenu button clicked\n\n\n');
  
        $('#game-score').html('');
  
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
    this.scene.pauseOverlay.setVisible(true);
    this.scene.pauseText.setVisible(true);
    this.sceneManager.pause();
    $('#pauseBtn').html('RESUME');
  }

  onGameResumed() {
    this.scene.pauseOverlay.setVisible(false);
    this.scene.pauseText.setVisible(false);
    this.scene.scene.resume();
    $('#pauseBtn').html('PAUSE');
  }

  onMouseDown(event) {
    const laserTarget = this.getMousePosition(event);

    if (this.scene.laser == null && laserTarget.y > 0) {
      this.scene.laserTargetAngle = Phaser.Math.Angle.Between(
        this.scene.portalgun.body.x,
        this.scene.portalgun.body.y,
        laserTarget.x,
        laserTarget.y
      );

      this.scene.laser = new Laser(
        this.scene,
        this.scene.portalgun.body.x,
        this.scene.portalgun.body.y
      );

      this.scene.physics.add.collider(this.scene.platforms, this.scene.laser, (laser, platform) => {
        platform.destroy();
        this.scene.combo = 0;
      });

      this.scene.physics.add.collider(this.scene.comboItems, this.scene.laser, (laser, comboItem) => {
        console.log('Collision between laser and combo item');
        comboItem.destroy();
        this.scene.combo++;
      });

      this.scene.playerPosBeforeTeleporting = {
        x: this.scene.player.x,
        y: this.scene.player.y
      }
    }
  }

  getMousePosition(event) {
    const rect = this.scene.game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x: x, y: y};
  }
}