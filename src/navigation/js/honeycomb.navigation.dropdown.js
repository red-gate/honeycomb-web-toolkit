let selector = '.js-dropdown';
let classNameOpen = 'open';
let classNameClosed = 'closed';

let init = () => {
    addArrows();
    handle();
};

let addArrows = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so dropdown functionality won\'t work as expected' );
        return;
    }
    
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
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so dropdown functionality won\'t work as expected' );
        return;
    }
    
    let $body = window.jQuery( 'body' );
    $body.on( 'click', '.js-dropdown a[href="#toggle"]', function( e ) {
        let $this = window.jQuery( this );
        let $dropdown = $this.parent();

        e.preventDefault();
        if ( $dropdown.hasClass( classNameOpen ) ) {
            $dropdown.removeClass( classNameOpen ).addClass( classNameClosed );
        } else {
            $dropdown.addClass( classNameOpen ).removeClass( classNameClosed );
        }
    });

    // close all open dropdowns when clicking elsewhere in the document
    document.querySelector('body').addEventListener('click', event => {
        // Only proceed if there are any open dropdowns
        if ( document.querySelector(`.dropdown.${classNameOpen}`) ) {
            // check if click event is inside a dropdown
            let activeDropdown;
            let parent = event.target.parentElement;
            while (parent !== null) {
                if (parent.classList.contains('dropdown')) {
                    activeDropdown = parent;
                    break;
                }
                parent = parent.parentElement;
            }

            // close all open dropdowns except for the active one
            const dropdowns = document.querySelectorAll('.dropdown');
            for (let i = 0; i < dropdowns.length; i++) {
                const dropdown = dropdowns[i];
                
                if ( dropdown !== activeDropdown && dropdown.classList.contains(classNameOpen) ) {
                    dropdown.classList.remove(classNameOpen);
                    dropdown.classList.add(classNameClosed);
                }
            }
        }
    });
};

export default {
    init: init,
    addArrows: addArrows
};
