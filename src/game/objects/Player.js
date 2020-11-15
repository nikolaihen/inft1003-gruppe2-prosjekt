import Phaser from '../lib/phaser.js';

/**
 * This class defines the game's player object.
 * 
 * Since this class inherits Phaser's Physics.Arcade.Sprite -class,
 * this class will have access to all of its functions and attributes.
 * This makes it easier for us to create custom game objects which
 * is physics-enabled. This simply means that we dont have to know so
 * much math or physics to make the object behave as expected when we
 * want it to move around the screen, this is already mostly taken care
 * of in the Physics.Arcade.Sprite -class.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {

  /*
   * The Player-class inherits (or extends) from the Phaser.Physics.Arcade.Sprite
   * -class, and it also has a constructor.
   * 
   * Therefore, we must also define a constructor on our class, such that we can pass the
   * required parameters down to the underlying class's constructor we extend from for it 
   * to work as expected. The code inside of the constructor is only called once at the time
   * of instantiation (when we call new Player(scene, x, y) inside of the Game class (src/scenes/Game.js))
   */

  /** 
   * @param {Phaser.Scene} Scene The scene this object will be used in (Must extend Phaser.Scene)
   * @param {number} x The x-value of the player's starting position on the screen
   * @param {number} y The y-value of the player's starting position on the screen
   * 
  */
  constructor(scene, x, y) {
    /*
     * The class we extend from needs to know what scene it is being used in,
     * the start-position of the object, and the object's sprite key. This key
     * is just a string-value which is cached (saved) when we load any assets
     * inside of a scene. The underlying class will then look for this key in
     * the provided scene, and that way know what image to render. We load
     * the asset 'player-facing-right' inside the preload function in the Game class 
     * inside the file src/scenes/Game.js.
     */
    super(scene, x, y, 'player');

    /*
     * "this" always refers to the class it is used in. By setting "this.scene = scene",
     * We are storing the reference to the scene value we pass into the constructor, such 
     * that it becomes available to all functions we create inside of this class.
     */

    this.scene = scene;
    
    /*
     * Here we use the scene object, and we add this object to its list of game objects.
     * We also add it to the scene's seperate list of physics-enabled game objects.
     * This is done such that all of the scene's physics-configurations such as its gravity
     * and other game objects which is physics-enabled can affect this object's physic and
     * vice-versa
     * 
     * For game objects that is mostly static and doesnt need to have physics (such as game
     * score, game menu etc), only needs to be added to the scene's game objects, and not to
     * the scene's physics-enabled game objects.
     */
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    /*
     * Here we use two of the many functions provided to us when we extend a Phaser.Physics.Arcade.Sprite
     * class. "this.setScale(1.5)" scales this object by multiplying its size with the given number 1.5.
     * "this.setCollideWorldBounds(true)" makes sure that this object cant exceed the game's borders.
     * Remember that this is only done once - when we instantiate this object using "new Player(scene, x, y)"
     */
    this.setScale(3)
    this.setCollideWorldBounds(true);
    this.anims.play('player');
  }

  /*
   * We must define this for every game object that needs to change in response to events in the game. 
   * Almost all game-objects that can be interacted with has different states it needs to reflect to 
   * the user during its life-span, and this function will be called at every frame to reflect those
   * changes smoothly to the user (default is 60 times per second). 
   */
  update(delta) {

    /*
     * The scene has a curser-object which we can access by using the stored reference to the scene this
     * object is added to. We use this here to determine what the velocity of the player should be.
     * 
     * when this.setVelocityX(300) is called, this object's x-position now equals its current x-position + the
     * given speed. Since the object is rendered with its current position every frame after the update function 
     * is called, the change of position will be reflected on the game screen as if its moving smoothly when
     * holding down the right-key or the left-key (arrow-keys).
     */
    const cursors = this.scene.cursors;

    if (this.y + this.displayHeight / 2 >= this.scene.height) {
      if (cursors.right.isDown) {
        this.setVelocityX(300 * (delta / this.scene.deltaMultiplier));
      } else if (cursors.left.isDown) {
        this.setVelocityX(-300 * (delta / this.scene.deltaMultiplier));
      } else if (cursors.right.isUp && this.body.velocity.x > 0) {
        this.setVelocityX(0);
      } else if (cursors.left.isUp && this.body.velocity.x < 0) {
        this.setVelocityX(0);
      }
    }
  }

  hitBottomBorder() {
    if (this.y + this.displayHeight / 2 > this.scene.height) {
      return true;
    }

    return false;
  }
}