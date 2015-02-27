var Base = Base || {};

// scrollTo - Scroll to an area on the page.
Base.ScrollTo = (function(){

  var init = function init() {
    $('a.js-scroll-to').on('click', function(e) {
      var $this = $(this);
      var href = $this.attr('href');
      var offset = parseInt($this.attr('data-scroll-to-offset') || 0);
      var focus = $this.attr('data-scroll-to-focus') || false;
      var hash = _isHashOnThisPage(href);

      if(hash) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $(hash).offset().top + offset
        }, 500, function() {
          if(focus) {
            $('#' + focus).focus();
          }
        });
      }
    });
  };

  var _isHashOnThisPage = function _isHashOnThisPage(href) {
    var a = document.createElement('a');
    a.href = href;

    var hash = a.hash;

    // IE doesn't include the starting / on the pathname.
    var pathname = (a.pathname.charAt(0) === '/') ? a.pathname : '/' + a.pathname;

    // If Href doesn't have a path, just a hash, then reset pathname.
    if(pathname === '/') {
      pathname = window.location.pathname;
    }

    if(window.location.pathname === pathname) {
      return hash;
    }

    return false;
  };

  return {
    init: init
  };
})();

$(function(){
  Base.ScrollTo.init();
});
