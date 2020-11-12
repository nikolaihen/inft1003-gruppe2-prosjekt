$(document).ready(() => {
    $('#startGameButton').click(onGameStart);

    function onGameStart() {
      $('#game-view').show();
      $('.menu').hide();
      $('body').css("background-image", "url('./assets/background_gif_darker.gif')");
    }
  });