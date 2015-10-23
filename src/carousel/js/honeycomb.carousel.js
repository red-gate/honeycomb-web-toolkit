var Honeycomb = Honeycomb || {};

// Carousel functionality. (http://kenwheeler.github.io/slick/)
Honeycomb.Carousel = function($) {

  // TODO: Check if slick carousel plugin exists. - If $.fn.slick ?

  $('.js-carousel').each(function() {
    var $this = $(this);
    var options = {
        autoplaySpeed: 4000,
        dotsClass: 'slick-dots carousel__pagination',
        adaptiveHeight: true
    };

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

    // Fade
    if($this.attr('data-carousel-fade')) {
      options.fade = ($this.attr('data-carousel-fade') === 'true');
    }

    // Adaptive Height (Automatically update height)
    if($this.attr('data-carousel-auto-height')) {
        options.adaptiveHeight = ($this.attr('data-carousel-auto-height') === 'true');
    }

    // Autoplay speed
    if($this.attr('data-carousel-autoplay-speed')) {
        options.autoplaySpeed = $this.attr('data-carousel-autoplay-speed');
    }

    // Apply slick plugin.
    $this.slick(options);
  });
};

jQuery(function(){
  Honeycomb.Carousel(jQuery);
});
