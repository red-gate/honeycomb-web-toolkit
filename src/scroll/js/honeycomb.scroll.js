// scrollTo - Scroll to an area on the page.
let init = () => {
    $( 'a.js-scroll-to' ).on( 'click', function( e ) {
        let $this = $( this );
        let href = $this.attr( 'href' );
        let offset = parseInt( $this.attr( 'data-scroll-to-offset' ) || 0 );
        let focus = $this.attr( 'data-scroll-to-focus' ) || false;
        let hash = isHashOnThisPage( href );

        if ( hash ) {
            e.preventDefault();
            $( 'html, body' ).animate({
                scrollTop: $( hash ).offset().top + offset
            }, 500, function() {
                if ( focus ) {
                    $( `#${focus}` ).focus();
                }
            });
        }
    });
};

let isHashOnThisPage = ( href ) => {
    let a = document.createElement( 'a' );
    a.href = href;

    let hash = a.hash;

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

export default {
    init
};
