const init = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so lightbox functionality won\'t work' );
        return;
    }

    window.jQuery('.confluence-embedded-image').each(function(){
        let $this = window.jQuery(this);
        let $parent = $this.parent().get(0);
        if ( $parent.nodeName !== 'A' ) {
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