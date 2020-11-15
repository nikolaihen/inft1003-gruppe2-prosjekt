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
    this.scene = scene;
    this.velocity = 5;
  }

  update({onLaserReachedTargetCallback}) {
    var comboMultiplier = (this.scene.combo == 0 ? 1 : this.scene.combo + 1);

    if (comboMultiplier > 4) {
      comboMultiplier = 4;
    }

    const velocityX = Math.cos(this.scene.laserTargetAngle) * this.velocity * comboMultiplier;
    const velocityY = Math.sin(this.scene.laserTargetAngle) * this.velocity * comboMultiplier;

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