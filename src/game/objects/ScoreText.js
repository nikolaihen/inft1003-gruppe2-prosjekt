const scoreStyle = {
  font: "bold 20px Arial",
  fill: "#fff",
  boundsAlignH: "center",
};

const comboStyle = {
  font: "bold 20px Arial",
  fill: "#00C424",
  boundsAlignH: "center",
};

class ScoreText extends Phaser.GameObjects.Text {
  constructor(scene, x, y) {
    super(scene, x, y, 'Score: 0', scoreStyle);

    scene.add.existing(this);
    this.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
  }

  update(score) {
    const newScore = Math.round(score).toString();
    this.text = `Score: ${newScore}`;
  }
}

class ComboText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(
      scene, 
      scene.scoreText.x + scene.scoreText.displayWidth + 40, 
      scene.scoreText.y, 
      '', 
      comboStyle
    );

    scene.add.existing(this);
    this.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
  }

  update(combo) {
    const newCombo = combo.toString();
    var comboText = '';

    if (combo > 0) {
      comboText = `+ ${newCombo}`;
    }

    this.text = comboText;
  }
}

export {
  ScoreText,
  ComboText,
}