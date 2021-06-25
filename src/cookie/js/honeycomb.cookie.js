/**
 * Get the value of a cookie.
 * 
 * @param {String} property The name of the cookie to get the value for
 * @returns {String} The value of the cookie
 */
const get = property => {
    let value = null;
    
    if ( document.cookie && document.cookie !== '' ) {
        const cookies = document.cookie.split(';');
        for ( let i = 0; i < cookies.length; i++ ) {
            let cookie = cookies[i].trim();
            if ( cookie.substring(0, property.length + 1) === (property + '=') ) {
                value = decodeURIComponent(cookie.substring(property.length + 1));
                break;
            }
        }
    }
    
    return value;
};

/**
 * Set a cookie.
 * 
 * @param {String} property The name of the cookie to set the value of
 * @param {String} value The value to set
 * @param {Object} options An object of options where key is the name and value is the value
 */
const set = ( property, value = '', options = {} ) => {

    // Spread default options with user defined.
    options = {
        path: '/',
        ...options
    };

    // Set the property and value.
    let updatedCookie = `${property}=${encodeURIComponent(value)}`;

    // Set the options.
    for ( let optionKey in options ) {
        updatedCookie += `; ${optionKey}`;
        let optionValue = options[optionKey];
        if ( optionValue !== true ) {
            updatedCookie += `= ${optionValue}`;
        }
    }

    // Set the cookie.
    document.cookie = updatedCookie;
};
};

export default {
    get,
    set,
};
