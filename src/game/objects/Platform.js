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
    
    this.setScale(0.3);
    
    /*
     * Upon instantiation of this object, its velocity on the x-direction is being 
     * assigned a random value between 60 and 120 (positive or negative) in the x-direction.
     * This way, every instance of this class creates an object which will have a random speed
     * in a random direction.
     */
    this.setVelocityX(randomVelocityInRange(60, 120))
    
    /*
     * Here we configure this object to collide with the game-borders as we do in the Player class,
     * but here we also set the bounce-multiplier for the X and Y value. By giving it 1 and 1 for
     * X and Y, it will bounce from the world borders with the exact same speed in the X and Y direction
     * as it had before, only reversed.
     */
    this.setCollideWorldBounds(true, 1, 1);
  }
}