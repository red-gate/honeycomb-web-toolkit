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

// TODO: Write cookie set functionality.
let set = () => {
    return '@todo - Need to write cookie set functionality';
};

export default {
    get,
    set,
};
