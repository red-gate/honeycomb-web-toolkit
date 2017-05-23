let selector = '.js-dropdown';
let classNameOpen = 'open';
let classNameClosed = 'closed';

let init = () => {
    addArrows();
    handle();
};

let addArrows = () => {
    let $lis = window.jQuery( selector ).find( 'li' );
    $lis.each( function() {
        let $this = window.jQuery( this );
        if ( ( $this.find( 'ul' ).length > 0 ) && ( $this.attr( 'data-arrow-added' ) !== 'true' ) ) {
            let $a = window.jQuery( '<a/>' ).attr( 'href', '#toggle' ).addClass( 'arrow' );
            $this.addClass( `dropdown ${classNameClosed}` );
            $this.attr( 'data-arrow-added', 'true' );
            $a.appendTo( $this );
        }
    });
};

let handle = () => {
    let $body = window.jQuery( 'body' );
    $body.on( 'click', '.js-dropdown .arrow', function( e ) {
        let $this = window.jQuery( this );
        let $dropdown = $this.parent();

        e.preventDefault();
        if ( $dropdown.hasClass( classNameOpen ) ) {
            $dropdown.removeClass( classNameOpen ).addClass( classNameClosed );
        } else {
            $dropdown.addClass( classNameOpen ).removeClass( classNameClosed );
        }
    });
};

export default {
    init: init,
    addArrows: addArrows
};
