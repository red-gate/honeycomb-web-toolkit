let selector = '.js-dropdown';
let classNameOpen = 'open';
let classNameClosed = 'closed';
let classNameNoArrow = 'dropdown--no-arrow';

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
        if ( $this.hasClass(classNameNoArrow) ) return;
        
        if ( ( $this.find( 'ul' ).length > 0 ) && ( $this.attr( 'data-arrow-added' ) !== 'true' ) ) {
            let $a = window.jQuery( '<a/>' ).attr( 'href', '#toggle' ).addClass( 'arrow' );
            $this.addClass( `dropdown ${classNameClosed}` );
            $this.attr( 'data-arrow-added', 'true' );
            $a.appendTo( $this );
        }
    });
};

// check if a specified dropdown is a parent of an event target
const dropdownIsActive = (dropdown, target) => {
    let parentDropdowns = [];
    let parent = target.parentElement;

    // list all dropdowns found in the event target's ancestors
    while (parent !== null) {
        if (parent.classList.contains('dropdown')) {
            parentDropdowns.push(parent);
        }
        parent = parent.parentElement;
    }

    // return true if the specified dropdown is an event target ancestor
    for (let i = 0; i < parentDropdowns.length; i++) {
        const parentDropdown = parentDropdowns[i];
        if (dropdown === parentDropdown) {
            return true;
        }
    }

    return false;
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
            const dropdowns = document.querySelectorAll('.dropdown');
            const target = event.target;

            // loop through all dropdowns
            for (let i = 0; i < dropdowns.length; i++) {
                const dropdown = dropdowns[i];
                const dropdownIsOpen = dropdown.classList.contains(classNameOpen);
                
                // close open, inactive dropdowns
                if ( !dropdownIsActive(dropdown, target) && dropdownIsOpen ) {
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
