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
            let $a = window.jQuery( `<a>${getArrowSvg()}</a>` )
                .attr( 'href', '#toggle' )
                .attr( 'tabindex', '-1' ) // Remove the dropdown arrow from the tab index, as it just duplicates the original anchor
                .addClass( 'arrow' );
            $this.addClass( `dropdown ${classNameClosed}` );
            $this.attr( 'data-arrow-added', 'true' );
            $a.appendTo( $this );
        }
    });
};

/**
 * Get the string of SVG to use for the arrow.
 * 
 * @returns {String} The string of SVG to use for the arrow
 */
const getArrowSvg = () => {
    return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 8.79l1-1c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l4.6 4.6 4.6-4.6c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l1 1c0.088 0.090 0.143 0.214 0.143 0.35s-0.055 0.26-0.143 0.35l-7 7-7-7c-0.095-0.091-0.153-0.219-0.153-0.36 0-0.131 0.051-0.251 0.134-0.34l-0 0z"></path></svg>';
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
    $body.on( 'click', 'li[data-arrow-added] > a', function( e ) {
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
