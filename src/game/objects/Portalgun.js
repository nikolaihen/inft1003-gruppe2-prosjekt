export default class Portalgun extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'portalgun');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
  
    this.setOrigin(0.0, 0.5);
    this.setScale(0.09);
  }

  update() {
    const mousePos = this.scene.mousePos;

    if (mousePos != null) {
      const angle = Phaser.Math.Angle.Between(
        this.body.x,
        this.body.y,
        mousePos.x,
        mousePos.y
      );
  
      this.setRotation(angle);
      this.setPosition(this.scene.player.x, this.scene.player.y);
      this.body.updateFromGameObject();
    }
  }

  angleToTarget(target) {
    return Phaser.Math.Angle.Between(
      this.body.x,
      this.body.y,
      target.x,
      target.y
    );
  }
}