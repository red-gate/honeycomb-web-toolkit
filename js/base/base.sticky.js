var Base = Base || {};

// Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)
Base.Sticky = function() {
  if(typeof $.fn.sticky === 'function') {
    $('.js-sticky').each(function() {
      var $this = $(this);
      var offset = ($this.attr('data-sticky-offset') === 'auto') ? 'auto' : parseInt($this.attr('data-sticky-offset'), 10) || 'auto';

      $this.sticky({
        offset: offset,
        sticky: function() {
          $this.addClass('sticking');
        },
        docked: function() {
          $this.removeClass('sticking');
        }
      });
    });
  }
};

$(function(){
  Base.Sticky();
});
