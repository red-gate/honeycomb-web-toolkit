import loadScript from '../../document/js/honeycomb.document.load-script';

// Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)
const init = ( config = {} ) => {

    let vps = document.querySelectorAll( '.js-vp' );
    if ( vps.length ) {
        if ( typeof window.jQuery.fn.inViewport !== 'function' ) {
            if ( typeof config.url === 'undefined' ) {
                config.url = 'document/vendor/jquery.inViewport.min.js';
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            window.jQuery('.js-vp').inViewport( function () {
                window.jQuery( this ).removeClass( 'vp-out' ).addClass( 'vp-in' );
            }, function () {
                window.jQuery( this ).addClass( 'vp-out' );
                // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
            });
        }
    }
};

export default {
    init
};
