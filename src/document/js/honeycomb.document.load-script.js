/**
 * Load a script from a given URL.
 *
 * @param {string} url The URL to load
 * @param {function|undefined} callback A function to execute after the script has loaded
 * @param {object} attrs An object containing attributes to apply to the script element
 * @param {function|undefined} errorCallback A function to execute if the script errors while attempting to load the URL
 * @return {void}
 */
const load = ( url = '', callback = undefined, attrs = {}, errorCallback = undefined ) => {
    if ( url !== '' ) {
        let se = document.createElement( 'script' );
        const honeycombPath = (window.Honeycomb && window.Honeycomb.path) ? window.Honeycomb.path : '';
        se.type = 'text/javascript';
        se.src = (url.match('://') !== null) ? url : honeycombPath + url;

        let done = false;

        // When the script has loaded, apply the callback.
        se.onload = se.onreadystatechange = function () {
            if ( ! done && ( ! this.readyState || this.readyState === 'loaded' || this.readyState === 'complete' ) ) {
                done = true;

                if ( typeof callback === 'function' ) {
                    callback.apply();
                }
            }
        };

        if ( typeof errorCallback === 'function' ) {
            se.onerror = errorCallback;
        }

        // Custom attributes.
        for ( let prop in attrs ) {
            se[prop] = attrs[prop];
        }

        let s = document.getElementsByTagName( 'script' )[ 0 ];
        s.parentNode.insertBefore( se, s );
    }
};

export default {
    load
};

export {
    load,
};
