// scrollTo - Scroll to an area on the page.
const init = () => {
    scrollOnClick();
    scrollBeforeSticky();
};

const scrollOnClick = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so scroll functionality won\'t work as expected');
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
            const hashTop = window.jQuery( hash )?.offset()?.top;
            if ( typeof hashTop === 'undefined' ) {
                window.console.warn(`Honeycomb: Element with ID "${hash}" not found, so can't scroll to it.`);
                return;
            }
            window.jQuery( 'html, body' ).animate({
                scrollTop: window.jQuery( hash ).offset().top + offset
            }, 500, function() {
                window.location.hash = hash;
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

                // It's possible for offset to be undefined, so check it exists
                const offset = elementToScrollTo.offset();
                if (offset) {
                    window.jQuery('html, body').animate({
                        scrollTop: offset.top - heightToReverse
                    }, 500);
                }

            }
        }, 1000);
    });
};

export default {
    init
};
