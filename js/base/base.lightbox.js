var Base = Base || {};

Base.Lightbox = (function() {

  var init = function init() {
    if(typeof $.fancybox !== 'undefined') {

      // Use BEM style modifiers to set type of content for lightbox.
      $('.js-lightbox').fancybox();
      $('.js-lightbox--video, .js-lightbox--iframe').fancybox({type: 'iframe'});
      $('.js-lightbox--image').fancybox({type: 'image'});
      $('.js-lightbox--inline').fancybox({type: 'inline'});
      $('.js-lightbox--ajax').fancybox({type: 'ajax'});
      $('.js-lightbox--swf').fancybox({type: 'swf'});
      $('.js-lightbox--html').fancybox({type: 'html'});
    }
  };

  return {
    init: init
  };
})();

$(function(){
  Base.Lightbox.init();
});
