export default class ComboItem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'star');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.comboItems.add(this);

    this.body.setAllowGravity(false);
    this.setScale(0.15);
  }
}