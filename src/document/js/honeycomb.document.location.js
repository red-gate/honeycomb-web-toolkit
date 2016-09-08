let getUrlParameterByName = ( name ) => {
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec( location.search );

    return results === null ? false : decodeURIComponent( results[ 1 ].replace( /\+/g, ' ' ) );
};

let onPage = ( url ) => {
    let on = false;

    if ( typeof url === 'string' ) {
        url = [ url ];
    }

    for( let i = 0; i < url.length; i++ ) {
        if ( window.location.href.indexOf( url[ i ] ) !== -1 ) {
            on = true;
        }
    }

    return on;
};

export default {
    getUrlParameterByName: getUrlParameterByName,
    onPage: onPage
};
