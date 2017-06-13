// Reveal - Hide/Show content.

let animationStart;
let animationEnd;

let init = () => {

    animationStart = new CustomEvent('js-reveal-animation-start');
    animationEnd = new CustomEvent('js-reveal-animation-end');

    window.jQuery( '.js-reveal' ).each( function () {
        let $this = window.jQuery( this );
        $this.slideUp( 0 );
    });

    window.jQuery( '.js-reveal-cta' ).each( function () {

        // Setup cta's.
        let $button = window.jQuery( this );
        $button.attr( 'data-reveal-cta-open-html', $button.html() );
    }).on( 'click', function( e ) {

        // On click, call toggle.
        e.preventDefault();

        let that = this;
        let $button = window.jQuery( this );
        let hash = $button.attr( 'href' );
        let $content = window.jQuery( hash );
        let group = $button.attr( 'data-reveal-group' ) || false;

        if ( ! $content.is( ':visible' ) ) {

            // Open content.
            if ( group ) {

                // In a group. Close all group content first.
                let $groupButtons = window.jQuery( '.js-reveal-cta[data-reveal-group=\"' + group + '\"]' );
                let closed = 0;

                for ( let i = 0; i < $groupButtons.length; i++ ) {
                    let groupButton = $groupButtons[ i ];
                    let $groupContent = window.jQuery( window.jQuery( groupButton ).attr( 'href' ) );

                    // If the content is visible (should only be 1), then close and open.
                    if ( $groupContent.is( ':visible' ) ) {
                        close( groupButton, function () {
                            open( that );
                        });
                    } else {

                        // Content's not visible, so just increase the counter for the check later.
                        closed++;
                    }
                }

                // No revealed content is open, so go ahead and open.
                if ( closed === $groupButtons.length ) {
                    open( that );
                }
            } else {

                // Not in a group.
                open( this );
            }
        } else {

            // Close content.
            close( this );
        }
    });
};

let open = ( button, callback ) => {
    let $button = window.jQuery( button );
    let hash = $button.attr( 'href' );
    let $content = window.jQuery( hash );

    if ( $content.is( '.js-reveal' ) ) {
        let $buttons = window.jQuery( '.js-reveal-cta[href=\"' + hash + '\"]' );

        button.dispatchEvent(animationStart);

        $content.slideDown({
            duration: 250,
            complete: () => {

                $content.addClass( 'js-reveal-open' );
                $buttons.addClass( 'close' );

                // Update buttons.
                $buttons.each( function () {
                    let $button = window.jQuery( this );
                    if ( $button.attr( 'data-reveal-cta-close-html' ) ) {
                        $button.html( $button.attr( 'data-reveal-cta-close-html' ) );
                    }
                });

                // Callback
                if ( typeof callback === 'function' ) {
                    callback.call( this );
                }

                button.dispatchEvent(animationEnd);
            }
        });
    }
};

let close = ( button, callback ) => {
    let $button = window.jQuery( button );
    let hash = $button.attr( 'href' );
    let $content = window.jQuery( hash );

    if ( $content.is( '.js-reveal' ) ) {
        let $buttons = window.jQuery( '.js-reveal-cta[href=\"' + hash + '\"]' );

        button.dispatchEvent(animationStart);

        $content.slideUp({
            duration: 250,
            complete: () => {

                $content.removeClass( 'js-reveal-open' );
                $buttons.removeClass( 'close' );

                // Update buttons.
                $buttons.each( function () {
                    let $button = window.jQuery( this );
                    if ( $button.attr( 'data-reveal-cta-open-html' ) ) {
                        $button.html( $button.attr( 'data-reveal-cta-open-html' ) );
                    }
                });

                // Callback
                if ( typeof callback === 'function' ) {
                    callback.call( this );
                }

                button.dispatchEvent(animationEnd);
            }
        });
    }
};

let toggle = ( button, callback ) => {
    let $content = window.jQuery( window.jQuery( button ).attr( 'href' ) );
    let visible = $content.is( ':visible' );

    if ( visible ) {
        close( button, callback );
    } else {
        open( button, callback );
    }
};

export default {
    init,
    toggle,
    open,
    close
};
