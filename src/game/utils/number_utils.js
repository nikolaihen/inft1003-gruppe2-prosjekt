/**
 * Returns a random number between min and max, with a 50% chance
 * of being positive or negative.
 * 
 * @param {number} min The minimum number to return
 * @param {number} max The maximum number to return
 */
const randomVelocityInRange = (min, max) => {
  const value = Phaser.Math.Between(min, max);

  if (value < 2) {
    value += 5;
  }

  /*
   * Since Math.random() returns a random number between 0 and 1, the number will
   * be below 0.5 in 50% of cases, such that we can easily make the chance of getting
   * a positive/negative number 50% each.
   */
  return Math.random() > 0.5 ? -value : value;
}

export default randomVelocityInRange;