let tableCell = () => {
    let rules = document.createElement( 'div' ).style;

    // Check Modernizr for display: table-cell.
    Modernizr.addTest("displaytablecell", function() {
        try {
            rules.display = 'table-cell';
            return rules.display === 'table-cell';
        } catch ( e ) {
            return false;
        }
    });

    // Has Modernizr applied the class?
    let hasTableCell = $( 'html' ).hasClass( 'displaytablecell' );
    if ( ! hasTableCell ) {
        fix();
    }
};

let fix = () => {
    let selectors = [
        '.band-logo__logo',
        '.tabs li'
    ];

    $( selectors.join( ', ' ) ).each( function() {
        let $this = $( this );
        let numItems = $this.siblings().length + 1;
        let cssWidth = ( 100 / numItems ) -1 + '%';

        $this.css( 'display', 'inline' );
        $this.css( 'zoom', '1' );
        $this.css( 'width', cssWidth );
    });
};

export default tableCell;
