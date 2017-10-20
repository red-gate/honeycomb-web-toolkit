// Filter (Hide/Show) content on a page.
const init = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.error( 'Honeycomb: jQuery not found, so filter functionality won\'t work as expected' );
        return;
    }

    // Get the filter.
    let $filter = window.jQuery('.js-filter');

    // If there's no filter on the page then stop.
    if ( $filter.length === 0 ) {
        return false;
    }

    // When the update button is clicked, update the filter.
    $filter.on( 'click", ".js-filter__update', function() {
        updateFilter.call( this );
    });

    // When any of the filter items are changed (selected/deselected), update
    // the filter.
    $filter.on( 'change', '.js-filter__item', function() {
        updateFilter.call( this );
    });

    // When the reset button is clicked, reset the filter.
    $filter.on( 'click', '.js-filter__reset', function() {
        resetFilter.call( this );
    });

    // Update the filter on init.
    updateFilter.call( $filter.get( 0 ).childNodes[ 0 ] );
};

// Update the filter.
let updateFilter = function () {
    let $this           = window.jQuery( this );
    let $filter         = $this.parents( '.js-filter' );
    let $items          = $filter.find( '.js-filter__item' );
    let $content        = window.jQuery( '[data-filter-content]' );
    let enabledItems    = [];
    let enabledContent  = [];

    // Get the enabled items.
    $items.each( function () {
        let $this = window.jQuery( this );
        if ( $this.prop( 'checked' ) ) {
            enabledItems.push( $this.attr( 'data-filter-term' ) );
        }
    });

    // Show/Hide the relevant content.
    $content.each( function () {
        let $this   = window.jQuery( this );
        let terms   = $this.attr( 'data-filter-content' ).trim().split( ' ' );
        let show    = false;

        for ( let i = 0; i < terms.length; i++ ) {
            if ( enabledItems.indexOf( terms[ i ] ) !== -1 ) {
                show = true;
            }
        }

        if ( show ) {
            enabledContent.push( $this.get( 0 ) );
        }
    });

    $content.stop().animate({
        opacity: 0
    },{
        duration: 250,
        complete: () => {
            $content.each( function () {
                let $this = window.jQuery( this );
                let enabled = ( enabledContent.indexOf( $this.get( 0 ) ) !== -1 ) ? true : false;

                if ( enabled ) {
                    $this.show();
                    $this.stop().animate({
                        opacity: 1
                    }, {
                        duration: 250
                    });
                } else {
                    $this.hide();
                }
            });
        }
    });
};

let resetFilter = function () {
    let $this = window.jQuery( this );
    let $filter = $this.parents( '.js-filter' );
    let $items = $filter.find( '.js-filter__item' );

    $items.prop( 'checked', true );

    updateFilter.call( this );
};

export default {
    init: init
};
