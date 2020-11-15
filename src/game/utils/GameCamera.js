export default class GameCamera {
  constructor(scene) {
    this.scene = scene;

    this.isAnimating = false;
    this.cameraOffset = 0;
    this.cameraAnimationSpeed = this.cameraOffset / 50;
  }

  updateOffset(offset) {
    this.cameraOffset = offset;
    this.cameraAnimationSpeed = offset / 100;
  }

  animate(delta) {
    const player = this.scene.player;

    if (player.y < this.scene.height / 2.5) {
      this.cameraOffset = this.scene.height / 4;
      this.cameraAnimationSpeed = this.cameraOffset / 50;
    }

    if (this.cameraOffset > 0) {
      this.isAnimating = true;
      this.animateBackground(this.cameraAnimationSpeed);
      this.animateGameObjects(this.cameraAnimationSpeed);

      this.cameraOffset -= this.cameraAnimationSpeed * (delta / this.scene.deltaMultiplier);

      if (this.cameraOffset <= 0) {
        this.cameraOffset = 0;
        this.isAnimating = false;
      }

      this.cameraAnimationSpeed *= 0.98;
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