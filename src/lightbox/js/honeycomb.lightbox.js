import loadScript from "../../document/js/honeycomb.document.load-script";

const init = ( config = {} ) => {
    let els = document.querySelectorAll( ".js-lightbox, .js-lightbox--video, .js-lightbox--iframe, .js-lightbox--image, .js-lightbox--inline, .js-lightbox--ajax, .js-lightbox--swf, .js-lightbox--html" );
    if ( els.length ) {
        if ( typeof jQuery.fancybox === "undefined" ) {
            if ( typeof config.url === "undefined") {
                config.url = "lightbox/vendor/jquery.fancybox.pack.js";
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            
            // Use BEM style modifiers to set type of content for lightbox.
            jQuery( '.js-lightbox' ).fancybox();
            jQuery( '.js-lightbox--video, .js-lightbox--iframe' ).fancybox( {type: 'iframe'} );
            jQuery( '.js-lightbox--image' ).fancybox( {type: 'image'} );
            jQuery( '.js-lightbox--inline' ).fancybox( {type: 'inline'} );
            jQuery( '.js-lightbox--ajax' ).fancybox( {type: 'ajax'} );
            jQuery( '.js-lightbox--swf' ).fancybox( {type: 'swf'} );
            jQuery( '.js-lightbox--html' ).fancybox( {type: 'html'} );
        }    
    }
};

export default {
    init
};
