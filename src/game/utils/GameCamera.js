export default class GameCamera {
  constructor(scene) {

    this.scene = scene;

    this.isAnimating = false;
    this.baseOffset = 0;
    this.cameraOffset = this.baseOffset;
    this.cameraAnimationSpeed = this.cameraOffset / 100;
  }

  updateOffset(offset) {
    this.cameraOffset = offset;
    this.cameraAnimationSpeed = offset / 100;
  }

  animate() {
    const player = this.scene.player;

    if (player.y < this.scene.height / 3) {
      this.cameraOffset = this.scene.height - player.y;
      this.cameraAnimationSpeed = this.cameraOffset / 275;
    }

    if (this.cameraOffset > 0) {
      this.isAnimating = true;
      this.animateBackground(this.cameraAnimationSpeed);
      this.animateGameObjects(this.cameraAnimationSpeed);

      this.cameraOffset -= this.cameraAnimationSpeed;

      if (this.cameraOffset <= 0) {
        this.cameraOffset = 0;
        this.isAnimating = false;
      }
    }
  }

  animateBackground(speed) {
    this.scene.bgTile.tilePositionY -= speed / 5;
  }

  animateGameObjects(speed) {
    this.scene.platforms.children.iterate((platform) => {
      platform.y += speed;
    });

    this.scene.comboItems.children.iterate((comboItem) => {
      comboItem.y += speed;
    });

    this.scene.player.y += speed;
    
  }
}