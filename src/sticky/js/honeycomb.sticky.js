// Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)
let init = () => {
    if ( typeof $.fn.sticky === 'function' ) {
        $( '.js-sticky' ).each( function () {
            let $this = $( this );
            let offset = ( $this.attr( 'data-sticky-offset' ) === 'auto' ) ? 'auto' : parseInt( $this.attr( 'data-sticky-offset' ), 10) || 'auto';

            $this.sticky({
                offset: offset,
                sticky: () => {
                    $this.addClass( 'sticking' );
                },
                docked: () => {
                    $this.removeClass( 'sticking' );
                },
                navActiveClass: 'active'
            });
        });
    }
};

export default {
    init
};
