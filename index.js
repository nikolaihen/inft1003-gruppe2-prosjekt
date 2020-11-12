$(document).ready(() => {
  console.log('\n\ndocument ready\n\n')
  $('#menu').load("./src/website/menu/menu.html");
  $('#game-view').load("./src/game/game.html");
  $('#game-view').hide();
});