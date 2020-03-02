const init = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so lightbox functionality won\'t work' );
        return;
    }

    window.jQuery('.confluence-embedded-image').each(function(){
        let $this = window.jQuery(this);
        let $parents = $this.parents();
        let imageIsLinked = false;

        // Loop through parents to make sure image is not wrapped in a link
        $parents.each( ( index, $parent ) => {
            if ( $parent.nodeName === 'A' ) {
                imageIsLinked = true;
            }
        });

        if ( ! imageIsLinked ) {
            let $a = window.jQuery('<a/>')
                .addClass('lightbox link-image js-lightbox')
                .attr('href', $this.attr('src'))
                .attr('rel', 'lightbox');
            $this.wrap($a);
        }
    });
};

export default {
    init
};