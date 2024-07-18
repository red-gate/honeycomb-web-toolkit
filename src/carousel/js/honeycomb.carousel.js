import loadScript from '../../document/js/honeycomb.document.load-script';

const paginationClassName = 'carousel__pagination';

const rearrangeNav = (carousel) => {
    // selectors
    let nav = carousel.querySelector(`ul.${paginationClassName}`);
    let leftButton = carousel.querySelector('.slick-prev');
    let rightButton = carousel.querySelector('.slick-next');

    // If pagination (nav)
    if (nav && leftButton && rightButton) {

        // Give the pagination a class so can style.
        nav.className = nav.className + ' carousel-has-pagination';

        // move buttons inside <ul>
        nav.appendChild(rightButton);
        nav.appendChild(leftButton);

        // reposition buttons
        rightButton.style.transform = 'translate(0px, 0px)';

        // the left button can't be the first element in the <ul>, otherwise it messes up the navigation, which counts <ul> child elements to map the slides to the links - adding a new first-child pushes the links off by one
        // so we need to add it to the end of the list, and translate its position by working out the width of the nav, plus the width of the arrow
        let navWidth = ( nav.querySelectorAll('li').length - 1 ) * 30 + 130;
        leftButton.style.transform = `translate(-${navWidth}px, 0px)`;
    
    } else if(!nav && leftButton && rightButton) {

        // No pagination dots (nav)
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'carousel__button-container';
        buttonContainer.appendChild(leftButton);
        buttonContainer.appendChild(rightButton);
        carousel.appendChild(buttonContainer);
    }
};


const init = ( config = {} ) => {

    // If no jQuery then break;
    if ( typeof jQuery === 'undefined' ) {
        return;
    }

    let carousels = document.querySelectorAll( '.js-carousel' );

    if ( carousels.length ) {
        if ( typeof window.jQuery.fn.slick !== 'function' ) {
            if ( typeof config.url === 'undefined') {
                config.url = 'carousel/vendor/slick/slick.min.js';
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            const onInitEvent = document.createEvent('Event');
            const onBeforeChangeEvent = document.createEvent('Event');
            const onAfterChangeEvent = document.createEvent('Event');

            onInitEvent.initEvent('onCarouselInit', true, true);
            onBeforeChangeEvent.initEvent('onCarouselBeforeChange', true, true);
            onAfterChangeEvent.initEvent('onCarouselAfterChange', true, true);

            for ( let i = 0; i < carousels.length; i++ ) {
                let carousel = carousels[ i ];
                let options = {
                    autoplaySpeed: 4000,
                    dotsClass: `slick-dots ${paginationClassName}`,
                    adaptiveHeight: false,
                    dots: true
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
                if ( carousel.getAttribute( 'data-carousel-pagination' ) && carousel.getAttribute( 'data-carousel-pagination' ) === 'false' ) {
                    options.dots = false;
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
                window.jQuery( carousel ).on('init', () => {
                    rearrangeNav(carousel);
                });

                // Dispatch init event.
                window.jQuery( carousel ).on('init', slick => {
                    onInitEvent.carousel = {
                        carousel: slick.target
                    };
                    carousel.dispatchEvent(onInitEvent);
                });

                // Dispatch beforeChange event.
                window.jQuery( carousel ).on('beforeChange', ( slick, currentSlide ) => {
                    onBeforeChangeEvent.carousel = {
                        carousel: slick.target,
                        current: {
                            index: currentSlide.currentSlide,
                            element: slick.target.querySelector('.slick-slide[data-slick-index="' + currentSlide.currentSlide + '"]')
                        }
                    };
                    carousel.dispatchEvent(onBeforeChangeEvent);
                });

                // Dispatch afterChange event.
                window.jQuery( carousel ).on('afterChange', ( slick, currentSlide ) => {
                    onAfterChangeEvent.carousel = {
                        carousel: slick.target,
                        current: {
                            index: currentSlide.currentSlide,
                            element: slick.target.querySelector('.slick-slide[data-slick-index="' + currentSlide.currentSlide + '"]')
                        }
                    };
                    carousel.dispatchEvent(onAfterChangeEvent);
                });

                window.jQuery( carousel ).slick( options );

                window.jQuery( carousel ).css('visibility', 'inherit').css('height', 'auto');
            }
        }
    }
};

export default {
    init
};
