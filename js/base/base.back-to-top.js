var Base = Base || {};

// Back to top functionality - Use CSS for presentation.
// {activeClass} class name is toggled when the window scrolls past the
// {displayOffset} value.
Base.BackToTop = (function() {

  var $element      = $('.js-back-to-top');
  var activeClass   = 'back-to-top--active';
  var displayOffset = 100;
  var $window       = $(window);

  var init = function init() {

    // Set offset if user-set.
    var userOffset = $element.attr('data-back-to-top-offset');
    displayOffset = (userOffset) ? userOffset : displayOffset;

    $(window).on('scroll', check);
  };

  var check = function check() {
    if(!$element.length) {
      return false;
    }

    // Store how far the window has scrolled.
    var scrolled = $window.scrollTop();

    // If the element is visible, then check to see if we need to hide it.
    if($element.hasClass(activeClass)) {
      if(scrolled < displayOffset) {
        $element.removeClass(activeClass);
      }

    // Else, it's hidden, and we need to see if it needs activating.
    } else {
      if(scrolled >= displayOffset) {
        $element.addClass(activeClass);
      }
    }
  };

  return {
    init: init
  }
})();

$(function(){
  Base.BackToTop.init();
});
