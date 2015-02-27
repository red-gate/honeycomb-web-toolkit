var Base = Base || {};

// initSVG - Load SVG image replacement.
Base.SVG = function() {
  $('img.js-svg').each(function() {
    var $element = $(this);
    var src = $element.attr('src').replace(/(.png)|(.gif)/,'.svg');
    var newImage = new Image();

    newImage.src = src,
    newImage.onload = function() {
      $element.attr('src', src);
    };
  });
};

$(function(){
  Base.SVG();
});
