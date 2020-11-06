import BorderSide from '../enums/Borderside.js';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setRotation(scene.laserTargetAngle);
    this.setScale(0.1);
    this.setFlipX(true);
    this.body.setAllowGravity(false);
  }

  update(onLaserReachedTargetCallback) {
    const velocityX = Math.cos(this.scene.laserTargetAngle) * 5;
    const velocityY = Math.sin(this.scene.laserTargetAngle) * 5;

    this.x += velocityX;
    this.y += velocityY;

    if (this.x < 0) {
      onLaserReachedTargetCallback(BorderSide.LEFT);
    } else if (this.x > this.scene.width) {
      onLaserReachedTargetCallback(BorderSide.RIGHT);
    } else if (this.y < 0) {
      onLaserReachedTargetCallback(BorderSide.TOP);
    } else if (this.y > this.scene.height) {
      onLaserReachedTargetCallback(BorderSide.BOTTOM);
    }
  }
}