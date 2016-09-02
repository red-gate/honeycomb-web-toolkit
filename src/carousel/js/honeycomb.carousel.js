let init = () => {
    loadScript();
};

let loadScript = () => {
    let slick = document.createElement( 'script' );
    let script = document.getElementsByTagName( 'script' )[ 0 ];
    slick.async = true;
    slick.src = '//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js';
    slick.onload = () => {
        try { loadCarousel(); } catch ( e ) {}
    };
    script.parentNode.insertBefore( slick, script );
};

let loadCarousel = () => {
    let carousels = document.querySelectorAll( '.js-carousel' );

    for ( let i = 0; i < carousels.length; i++ ) {
        let carousel = carousels[ i ];
        let options = {
            autoplaySpeed: 4000,
            dotsClass: 'slick-dots carousel__pagination',
            adaptiveHeight: true
        };

        // Arrows.
        if ( carousel.getAttribute( 'data-carousel-arrows' ) ) {
            options.arrows = carousel.getAttribute( 'data-carousel-arrows' ) === 'true';
        }

        // Autoplay
        if ( carousel.getAttribute( 'data-carousel-autoplay' ) ) {
            options.autoplay = carousel.getAttribute( 'data-carousel-autoplay' ) === 'true';
        }

        // Pagination / Dots.
        if ( carousel.getAttribute( 'data-carousel-pagination' ) ) {
            options.dots = carousel.getAttribute( 'data-carousel-pagination' ) === 'true';
        }

        // Fade.
        if ( carousel.getAttribute( 'data-carousel-fade' ) ) {
            options.fade = carousel.getAttribute( 'data-carousel-fade' ) === 'true';
        }

        // Adaptive Height (Automatically update height)
        if ( carousel.getAttribute( 'data-carousel-auto-height' ) ) {
            options.adaptiveHeight = carousel.getAttribute( 'data-carousel-auto-height' ) === 'true';
        }

        // Autoplay speed.
        if ( carousel.getAttribute( 'data-carousel-autoplay-speed' ) ) {
            options.autoplaySpeed = carousel.getAttribute( 'data-carousel-autoplay-speed' );
        }

        if ( typeof $ === 'undefined' ) break;

        $( carousel ).slick( options );
    }
};

export default {
    init: init
};
