// scrollTo - Scroll to an area on the page.
const init = () => {
    scrollOnClick();
    scrollBeforeSticky();
};

const scrollOnClick = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.error('Honeycomb: jQuery not found, so scroll functionality won\'t work as expected');
        return;
    }

    window.jQuery( 'a.js-scroll-to' ).on( 'click', function( e ) {
        const $this = window.jQuery( this );
        const href = $this.attr( 'href' );
        const offset = parseInt( $this.attr( 'data-scroll-to-offset' ) || 0 );
        const focus = $this.attr( 'data-scroll-to-focus' ) || false;
        const hash = isHashOnThisPage( href );

        if ( hash ) {
            e.preventDefault();
            window.jQuery( 'html, body' ).animate({
                scrollTop: window.jQuery( hash ).offset().top + offset
            }, 500, function() {
                if ( focus ) {
                    window.jQuery( `#${focus}` ).focus();
                }
            });
        }
    });
};

const isHashOnThisPage = ( href ) => {
    let a = document.createElement( 'a' );
    a.href = href;

    const hash = a.hash;

    // IE doesn't include the starting / on the pathname.
    let pathname = ( a.pathname.charAt( 0 ) === '/' ) ? a.pathname : '/' + a.pathname;

    // If Href doesn't have a path, just a hash, then reset pathname.
    if ( pathname === '/' ) {
        pathname = window.location.pathname;
    }

    if ( window.location.pathname === pathname ) {
        return hash;
    }

    return false;
};

const scrollBeforeSticky = () => {
    window.addEventListener('load', () => {
        window.setTimeout(() => {
            if(window.location.hash && (window.pageYOffset > 0)) {

                // There's a hash, and we're at it. Check if there are
                // any sticky items, and if so, scroll back the height
                // of them.
                // const elementToScrollTo = document.querySelector(window.location.hash);
                const elementToScrollTo = window.jQuery(window.location.hash);
                const stickyItems = document.querySelectorAll('.js-sticky');
                let heightToReverse = 0;
                for(let i=0; i<stickyItems.length; i++) {
                    let sticky = stickyItems[i];
                    if(sticky.className.match('sticking')) {
                        heightToReverse = heightToReverse + sticky.clientHeight;
                    }
                }

                window.jQuery('html, body').animate({
                    scrollTop: elementToScrollTo.offset().top - heightToReverse
                }, 500);

            }
        }, 1000);
    });
};

export default {
    init
};
