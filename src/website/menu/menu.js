$(document).ready(() => {
    function onGameStart() {
      $('.gameControls').addClass('visible');
      $('#game').addClass('visible');
      $('.menu').addClass('invisible')
      
      $('.menuItem').remove()
    }

    $('#startGameButton').click(onGameStart);
  });