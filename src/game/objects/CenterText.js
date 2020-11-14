export default class CenterText extends Phaser.GameObjects.Text {
  constructor(scene, fontSize, yOffset, text) {
    var textOffset = (yOffset == null ? 0 : yOffset);
    
    super(scene, scene.width / 2 - 150, scene.height / 2 - 25 + textOffset, text, {
      font: `bold ${fontSize}px Arial`,
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    });

    scene.add.existing(this);

    this.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    this.setDisplaySize(300, 50);
    this.setVisible(false);
  }
}