const style = {
  font: "bold 32px Arial",
  fill: "#fff",
  boundsAlignH: "center",
  boundsAlignV: "middle"
};

export default class PauseText extends Phaser.GameObjects.Text {
  constructor(scene, x, y) {
    super(scene, x, y, 'Game is paused', style);

    scene.add.existing(this);

    this.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    this.setDisplaySize(300, 50);
    this.setVisible(false);
  }
}