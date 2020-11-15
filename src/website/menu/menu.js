$(document).ready(() => {
  $('#startGameButton').click(onGameStart);
  $('#instructionsButton').click(onInstructionsClicked);

  function onGameStart() {
    $('#game-view').show();
    $('.menu').hide();
    $('body').css("background-image", "url('./assets/background_gif_darker.gif')");
  }

  function onInstructionsClicked() {
    $(document).add('<div><div/>')
    $('#instructions-view').show();
    $('.menu').hide();
    $('body').css("background-image", "url('./assets/background_gif_darker.gif')");
  }
});