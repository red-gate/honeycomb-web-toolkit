const init = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so TOC functionality won\'t work as expected' );
        return;
    }

    window.jQuery('.toc-macro').each(function(){
        let $this = window.jQuery(this);
        let defaults = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        let headings = $this.data('headerelements').toLowerCase().split(',');
        let excludedHeadings = [];

        for ( let i = 0; i < defaults.length; i++ ) {
            if ( headings.indexOf( defaults[ i ] ) === -1 ) {
                excludedHeadings.push( defaults[ i ] );
            }
        }

        // Exclude H1 headings by default.
        excludedHeadings.push('h1');

        // Convert array to string.
        excludedHeadings = excludedHeadings.join( ', ' );

        $this.toc({
            exclude: excludedHeadings,
            numerate: false
        });
    });
};

export default {
    init
};