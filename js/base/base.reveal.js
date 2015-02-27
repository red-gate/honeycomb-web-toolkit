var Base = Base || {};

// Reveal - Hide/Show content.
Base.Reveal = (function(){
  var init = function init() {
    $('.js-reveal').each(function(){
      var $this = $(this);
      var buttonTextOpen = $this.attr('data-reveal-buttonOpen') || 'Open';
      var $button = $('<a/>').attr('href', '#' + this.id).addClass('reveal-cta').html(buttonTextOpen);

      $this.slideUp(0);
    });

    $('.js-reveal-cta').each(function(){

      // Setup cta's.
      var $button = $(this);
      $button.attr('data-reveal-cta-open-html', $button.html());
    }).on('click', function(e) {

      // On click, call toggle.
      e.preventDefault();

      var that = this;
      var $button = $(this);
      var hash = $button.attr('href');
      var $content = $(hash);
      var group = $button.attr('data-reveal-group') || false;

      if(!$content.is(':visible')) {

        // Open content.
        if(group) {

          // In a group. Close all group content first.
          var $groupButtons = $('.js-reveal-cta[data-reveal-group=\"' + group + '\"]');
          var closed = 0;

          for(var i=0; i<$groupButtons.length; i++) {
            var groupButton = $groupButtons[i];
            var $groupContent = $($(groupButton).attr('href'));

            // If the content is visible (should only be 1), then close and open.
            if($groupContent.is(':visible')) {
              Base.Reveal.close(groupButton, function() {
                Base.Reveal.open(that);
              });
            } else {

              // Content's not visible, so just increase the counter for the check later.
              closed++;
            }
          }

          // No revealed content is open, so go ahead and open.
          if(closed === $groupButtons.length) {
            Base.Reveal.open(that);
          }
        } else {

          // Not in a group.
          Base.Reveal.open(this);
        }
      } else {

        // Close content.
        Base.Reveal.close(this);
      }
    });
  };

  var open = function open(button, callback) {
    var $button = $(button);
    var hash = $button.attr('href');
    var $content = $(hash);

    if($content.is('.js-reveal')) {
      var $buttons = $('.js-reveal-cta[href=\"' + hash + '\"]');

      $content.slideDown({
        duration: 250,
        complete: function() {

          $content.addClass('js-reveal-open');
          $buttons.addClass('close');

          // Update buttons.
          $buttons.each(function(){
            var $button = $(this);
            if($button.attr('data-reveal-cta-close-html')) {
              $button.html($button.attr('data-reveal-cta-close-html'));
            }
          });

          // Callback
          if(typeof callback === 'function') {
            callback.call(this);
          }
        }
      });
    }
  };

  var close = function close(button, callback) {
    var $button = $(button);
    var hash = $button.attr('href');
    var $content = $(hash);

    if($content.is('.js-reveal')) {
      var $buttons = $('.js-reveal-cta[href=\"' + hash + '\"]');

      $content.slideUp({
        duration: 250,
        complete: function() {

          $content.removeClass('js-reveal-open');
          $buttons.removeClass('close');

          // Update buttons.
          $buttons.each(function() {
            var $button = $(this);
            if($button.attr('data-reveal-cta-open-html')) {
              $button.html($button.attr('data-reveal-cta-open-html'));
            }
          });

          // Callback
          if(typeof callback === 'function') {
            callback.call(this);
          }
        }
      });
    }
  };

  var toggle = function toggle(button, callback) {
    var $content = $($(button).attr('href'));
    var visible = $content.is(':visible');

    if(visible) {
      Base.Reveal.close(button, callback);
    } else {
      Base.Reveal.open(button, callback);
    }
  };

  return {
    init: init,
    toggle: toggle,
    open: open,
    close: close
  };
})();

$(function(){
  Base.Reveal.init();
});
