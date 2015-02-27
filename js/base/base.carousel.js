var Base = Base || {};

// Carousel functionality. (http://kenwheeler.github.io/slick/)
Base.Carousel = function() {

  // TODO: Check if slick carousel plugin exists. - If $.fn.slick ?

  $('.js-carousel').each(function() {
    var $this = $(this);
    var options = {};

    // Arrows
    if($this.attr('data-carousel-arrows')) {
      options.arrows = ($this.attr('data-carousel-arrows') === 'true');
    }

    // Autoplay
    if($this.attr('data-carousel-autoplay')) {
      options.autoplay = ($this.attr('data-carousel-autoplay') === 'true');
    }

    // Pagination / Dots
    if($this.attr('data-carousel-pagination')) {
      options.dots = ($this.attr('data-carousel-pagination') === 'true');
    }

    // Apply slick plugin.
    $this.slick(options);
  });
};

$(function(){
  Base.Carousel();
});
