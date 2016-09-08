let get = ( property ) => {
    let value = null;
    if ( document.cookie && document.cookie !== '' ) {
        let cookies = document.cookie.split( ';' );
        for ( let i = 0; i < cookies.length; i++ ) {
            // let cookie = cookies[ i ].trim();    // IE9+
            let cookie = cookies[ i ].replace( /^\s+|\s+$/g, '' );  // IE8
            if ( cookie.substring( 0, property.length + 1 ) === ( property + '=' ) ) {
                value = decodeURIComponent( cookie.substring( property.length + 1 ) );
                break;
            }
        }
    }
    return value;
};

// TODO: Write cookie set functionality.
let set = () => {
    return '@todo - Need to write cookie set functionality';
};

export default {
    get: get,
    set: set
};
