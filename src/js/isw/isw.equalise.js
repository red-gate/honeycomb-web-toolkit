var Honeycomb = Honeycomb || {};

// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
Honeycomb.Equalise = function($) {
  if($.fn.equalise) {
    $('.js-equal-heights').equalise({
      itemClass: 'js-equal-heights__item',
      groupAttr: 'js-equal-heights-group'
    });
  }
};

jQuery(function(){
  Honeycomb.Equalise(jQuery);
});
