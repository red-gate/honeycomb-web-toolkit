import loadScript from "../../document/js/honeycomb.document.load-script";

// Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)
const init = ( config = {} ) => {

    let vps = document.querySelectorAll( ".js-vp" );
    if ( vps.length ) {
        if ( typeof jQuery.fn.inViewport !== "function" ) {
            if ( config.url === "undefined" ) {
                config.url = "/src/document/vendor/jquery.inViewport.min.js";
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            jQuery('.js-vp').inViewport( function () {
                jQuery( this ).removeClass( 'vp-out' ).addClass( 'vp-in' );
            }, function () {
                jQuery( this ).addClass( 'vp-out' );
                // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
            });
        }
    }
};

export default {
    init
};
