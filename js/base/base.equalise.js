var Base = Base || {};

// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
Base.Equalise = function() {
  if($.fn.equalise) {
    $('.js-equal-heights').equalise({
      itemClass: 'js-equal-heights__item',
      groupAttr: 'js-equal-heights-group'
    });
  }
};

$(function(){
  Base.Equalise();
});
