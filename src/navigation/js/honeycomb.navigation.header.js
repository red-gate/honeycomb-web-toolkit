let init = () => {
    let $body = $("body");

    $body.on( "click", ".header--primary__menu-button", function( e ) {
        let $this = $( this );

        e.preventDefault();
        if ( $body.hasClass( "mobile-nav--open" ) ) {

            // Hide
            $body.removeClass( "mobile-nav--open" );
        } else {

            // Open
            $body.addClass( "mobile-nav--open" );
        }
    });

    // When an item that has a submenu is clicked toggle the menu, rather than
    // follow the link.
    $body.on( "click", ".header--primary__menu--mobile .dropdown > a", function( e ) {
        if ( this.getAttribute( "href" ) !== "#toggle" ) {
            e.preventDefault();

            let $toggle = $( this ).siblings( `a[ href="#toggle" ]` );
            if ( $toggle ) {
                $toggle.trigger( "click" );
            }
        }
    });
};

export default {
    init: init
};
