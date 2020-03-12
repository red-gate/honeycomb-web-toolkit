import loadScript from '../../document/js/honeycomb.document.load-script';

const init = ( config = {} ) => {
    window.addEventListener('load', initLightbox.bind(this, config));
};

const initLightbox = ( config = {} ) => {
    let els = document.querySelectorAll( '.js-lightbox, .js-lightbox--video, .js-lightbox--iframe, .js-lightbox--image, .js-lightbox--inline, .js-lightbox--ajax, .js-lightbox--swf, .js-lightbox--html' );
    if ( els.length ) {
        if ( typeof window.jQuery.fancybox === 'undefined' ) {
            if ( typeof config.url === 'undefined') {
                config.url = 'lightbox/vendor/jquery.fancybox.pack.js';
            }

            loadScript.load( config.url, () => {
                initLightbox();
            });
        } else {
            
            // Use BEM style modifiers to set type of content for lightbox.
            window.jQuery( '.js-lightbox' ).fancybox();
            window.jQuery( '.js-lightbox--video, .js-lightbox--iframe' ).fancybox( {type: 'iframe'} );
            window.jQuery( '.js-lightbox--image' ).fancybox( {type: 'image'} );
            window.jQuery( '.js-lightbox--inline' ).fancybox( {type: 'inline'} );
            window.jQuery( '.js-lightbox--ajax' ).fancybox( {type: 'ajax'} );
            window.jQuery( '.js-lightbox--swf' ).fancybox( {type: 'swf'} );
            window.jQuery( '.js-lightbox--html' ).fancybox( {type: 'html'} );
        }    
    }
};

export default {
    init
};
