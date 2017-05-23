import loadScript from '../../document/js/honeycomb.document.load-script';

let config = {};

// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
const init = ( cf = {} ) => {
    config = cf;

    equalise();

    window.addEventListener( 'resize', () => {
        equalise();
    });

    window.addEventListener( 'load', () => {
        equalise();
    });
};

const equalise = () => {
    const els = document.querySelectorAll( '.js-equal-heights' );
    if ( els.length ) {
        if ( typeof window.jQuery.fn.equalise !== 'function' ) {
            if ( typeof config.url === 'undefined') {
                config.url = 'equalise/vendor/jquery.equalise.min.js';
            }

            loadScript.load( config.url, () => {
                init();
            });
        } else {
            window.jQuery( '.js-equal-heights' ).equalise({
                itemClass: 'js-equal-heights__item',
                groupAttr: 'js-equal-heights-group'
            });
        }
    }
};

export default {
    init
};
