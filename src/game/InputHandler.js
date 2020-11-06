import Phaser from './lib/phaser.js';
import Laser from './objects/Laser.js';

export default class InputHandler {
  constructor(scene) {
    /** @type {Phaser.Scene} */
    this.scene = scene;
    this.sceneManager = this.scene.scene;

    this.pauseButton = document.getElementById('pauseBtn');
    this.startButton = document.getElementById('startGameButton');

    this.startButton.addEventListener('click', () => {
      this.sceneManager.restart();
    });

    this.pauseButton.addEventListener('click', () => {
      this.sceneManager.isPaused() ? this.onGameResumed() : this.onGamePaused();
    });

    document.addEventListener('mousemove', (event) => {
      this.scene.mousePos = this.getMousePosition(event);
    });

    document.addEventListener('mousedown', (event) => {
      this.onMouseDown(event);
    });
  }

  onGamePaused() {
    this.scene.pauseOverlay.setVisible(true);
    this.scene.pauseText.setVisible(true);
    this.sceneManager.pause();
    this.pauseButton.innerText = 'Resume game'
  }

  onGameResumed() {
    this.scene.pauseOverlay.setVisible(false);
    this.scene.pauseText.setVisible(false);
    this.scene.scene.resume();
    this.pauseButton.innerText = 'Pause game'
  }

  onMouseDown(event) {
    if (this.scene.laser == null) {
      const laserTarget = this.getMousePosition(event);

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
    }
  }

  getMousePosition(event) {
    const rect = this.scene.game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x: x, y: y};
  }
}