import loadScript from "../../document/js/honeycomb.document.load-script";

const rearrangeNav = (carousel) => {
    // selectors
    let nav = carousel.querySelector('ul');
    let leftButton = carousel.querySelector('.slick-prev');
    let rightButton = carousel.querySelector('.slick-next');
    let buttons = carousel.querySelectorAll('.slick-arrow');

    // move buttons inside <ul>
    nav.appendChild(rightButton);
    nav.appendChild(leftButton);

    // reposition buttons
    rightButton.style.transform = 'translate(10px, 0px)';

    // the left button can't be the first element in the <ul>, otherwise it messes up the navigation, which counts <ul> child elements to map the slides to the links - adding a new first-child pushes the links off by one
    // so we need to add it to the end of the list, and translate its position by working out the width of the nav, plus the width of the arrow
    let navWidth = carousel.querySelectorAll('ul li').length * 40 + 57;
    leftButton.style.transform = 'translate(-' + navWidth + 'px, 0px)';
};


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

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            for ( let i = 0; i < carousels.length; i++ ) {
                let carousel = carousels[ i ];
                let options = {
                    autoplaySpeed: 4000,
                    dotsClass: 'slick-dots carousel__pagination',
                    adaptiveHeight: false
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
                
                // rearrange nav
                jQuery( carousel ).on('init', () => {
                    rearrangeNav(carousel);
                });

                jQuery( carousel ).slick( options );
            }
        }
    }
};

export default {
    init
};
