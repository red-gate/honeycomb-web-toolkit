const load = ( url = false, callback = false ) => {
    if ( url !== false ) {
        let se = document.createElement( "script" );
        const honeycombPath = (window.Honeycomb && window.Honeycomb.path) ? window.Honeycomb.path : '';
        se.type = "text/javascript";
        se.src = honeycombPath + url;

        let done = false;

        // When the script has loaded, apply the callback.
        se.onload = se.onreadystatechange = function () {
            if ( ! done && ( ! this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) ) {
                done = true;

                if ( typeof callback === "function" ) {
                    callback.apply();
                }
            }
        };

        let s = document.getElementsByTagName( "script" )[ 0 ];
        s.parentNode.insertBefore( se, s );
    }
};

export default {
    load
};
