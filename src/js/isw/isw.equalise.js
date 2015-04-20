var ISW = ISW || {};

// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
ISW.Equalise = function($) {
  if($.fn.equalise) {
    $('.js-equal-heights').equalise({
      itemClass: 'js-equal-heights__item',
      groupAttr: 'js-equal-heights-group'
    });
  }
};

jQuery(function(){
  ISW.Equalise(jQuery);
});
