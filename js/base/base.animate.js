var Base = Base || {};

Base.Animate = Base.Animate || {};

Base.Animate.Fade = (function() {
  var interval = 5000;
  var fadeOutDuration = 1000;
  var fadeInDuration = 2500;

  var init = function init() {
    $('.js-animate--fade').each(function(){
      var $this = $(this);
      $this.find('.js-animate--fade__item').wrapAll('<div class=\"js-animate--fade__container\"/>');
      $this.find('.js-animate--fade__item').hide().first().show();
      setInterval(step, interval);
    });
  };

  var step = function step() {
    $('.js-animate--fade').each(function(){
      var $band = $(this);
      var $current = $band.find('.js-animate--fade__item:visible');
      var $next = ($current.next('.js-animate--fade__item').length !== 0) ? $current.next('.js-animate--fade__item') : $band.find('.js-animate--fade__item').first();

      $current.fadeOut({
        duration: fadeOutDuration,
        complete: function() {
          $next.fadeIn({
            duration: fadeInDuration
          });
        }
      });
    });
  };

  return {
    init: init
  };
})();

$(function() {
  Base.Animate.Fade.init();
});
