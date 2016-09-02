let init = () => {
    if ( typeof window._prum !== 'undefined' ) {
        let s = document.getElementsByTagName( 'script' )[ 0 ];
        let p = document.createElement( 'script' );
        p.async = 'async';
        p.src = '//rum-static.pingdom.net/prum.min.js';
        s.parentNode.insertBefore( p, s );
    }
};

export default {
    init: init
};
