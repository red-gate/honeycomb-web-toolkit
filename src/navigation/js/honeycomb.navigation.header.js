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
};

export default {
    init: init
};
