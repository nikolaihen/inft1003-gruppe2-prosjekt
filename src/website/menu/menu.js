$(document).ready(() => {
    function onGameStart() {
      $('.gameControls').addClass('visible');
      $('#game').addClass('visible');
      $('.menu').addClass('invisible')
      $('body').css("background-image", "url('./assets/background_gif_darker.gif')")
      
      $('.menuItem').remove()
    }

    $('#startGameButton').click(onGameStart);
  });