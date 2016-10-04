let boxSizing = () => {

    // Check Modernizr for border box box sizing.
    Modernizr.addTest( "boxsizing", function() {
        return Modernizr.testAllProps( "boxSizing" ) && ( document.documentMode === undefined || document.documentMode > 7 );
    });

    // Has Modernizr applied the class?
    let hasBoxSizing = $( 'html' ).hasClass( 'boxsizing' );
    if ( ! hasBoxSizing ) {
        fix();
    }
};

let fix = () => {
    $( '*' ).each( function() {
        let fullWidth = $( this ).outerWidth();
        let actualWidth = $( this ).width();
        let widthDiff = fullWidth - actualWidth;
        let newWidth = actualWidth - widthDiff;
        newWidth--; // To compensate for fractions of a pixel. (Some widths calculated on %).

        if ( this.currentStyle.width !== 'auto' ) {

            // If the element has a width set on it, then adjust it.
            $( this ).css( 'width', newWidth );
        }
    });
};

export default boxSizing;
