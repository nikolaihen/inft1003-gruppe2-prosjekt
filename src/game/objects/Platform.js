import Phaser from '../lib/phaser.js';
import randomVelocityInRange from '../utils/number_utils.js';

/**
 * This class defines the game's platform object.
 * 
 * Since this class inherits Phaser's Physics.Arcade.Sprite -class,
 * this class will have access to all of its functions and attributes.
 * This makes it easier for us to create custom game objects which
 * is physics-enabled. This simply means that we dont have to know so
 * much math or physics to make the object behave as expected when we
 * want it to move around the screen, this is already mostly taken care
 * of in the Physics.Arcade.Sprite -class.
 * 
 * This object will be moving randomly from one side to the other, affecting
 * the player's health when a collision occurs.
 */
export default class Platform extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'platform');

    scene.add.existing(this);
    scene.platforms.add(this);
    
    this.setScale(0.15, 0.30);

    this.debugShowVelocity = true;
    
    /*
     * Upon instantiation of this object, its velocity on the x-direction is being 
     * assigned a random value between 60 and 120 (positive or negative) in the x-direction.
     * This way, every instance of this class creates an object which will have a random speed
     * in a random direction.
     */
    this.velocityX = randomVelocityInRange(60, 120);
    this.velocityXBeforeAnimating = this.velocityX;
    this.setVelocityX(this.velocityX);
  }

  update() {
    const reachedLeftBorder = this.x - this.displayWidth / 2 <= 0;
    const reachedRightBorder = this.x - this.displayWidth >= this.width;

    if (reachedLeftBorder) {
      this.velocityX = -this.body.velocity.x;
      this.setPosition(this.displayWidth / 2 + 1, this.y);
      this.setVelocityX(this.velocityX);
      this.body.updateFromGameObject();

    } else if (reachedRightBorder) {
      this.velocityX = -this.body.velocity.x;
      this.setPosition(this.x - 1, this.y);
      this.setVelocityX(this.velocityX);
      this.body.updateFromGameObject();
    }
  }
}