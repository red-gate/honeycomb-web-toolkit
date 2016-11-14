import loadScript from "../../document/js/honeycomb.document.load-script";

const init = ( config = {} ) => {

    // If no jQuery then break;
    if ( typeof jQuery === "undefined" ) {
        return;
    }

    let carousels = document.querySelectorAll( '.js-carousel' );

    if ( carousels.length ) {
        if ( typeof jQuery.fn.slick !== "function" ) {
            if ( typeof config.url === "undefined") {
                config.url = "/src/carousel/vendor/slick/slick.min.js";
            }

            loadScript.load( config.url, function() {
                init();
            });
        } else {
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

                jQuery( carousel ).slick( options );
            }
        }
    }
};

export default {
    init
};
