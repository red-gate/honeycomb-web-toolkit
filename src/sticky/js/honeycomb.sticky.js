import loadScript from "../../document/js/honeycomb.document.load-script";

// Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)
const init = ( config = {} ) => {

    let els = document.querySelectorAll( ".js-sticky" );
    if ( els.length ) {
        if ( typeof jQuery.fn.sticky === "undefined" ) {
            if ( typeof config.url === "undefined") {
                config.url = "/src/sticky/vendor/jquery.sticky.min.js";
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            jQuery( ".js-sticky" ).each( function () {
                let $this = jQuery( this );
                let offset = ( $this.attr( "data-sticky-offset" ) === "auto" ) ? "auto" : parseInt( $this.attr( "data-sticky-offset" ), 10) || "auto";

                $this.sticky({
                    offset,
                    sticky: () => {
                        $this.addClass( "sticking" );
                    },
                    docked: () => {
                        $this.removeClass( "sticking" );
                    },
                    navActiveClass: "active"
                });
            });
        }    
    }
};

export default {
    init
};
