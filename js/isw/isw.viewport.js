var ISW = ISW || {};

// Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)
ISW.Viewport = function() {
  if($.fn.inViewport) {
    $('.js-vp').inViewport(function(){
      $(this).removeClass('vp-out').addClass('vp-in');
    }, function(){
      $(this).addClass('vp-out');
      // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
    });
  }
};

$(function(){
  ISW.Viewport();
});
