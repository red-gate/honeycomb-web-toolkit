let init = () => {
    if ( isIE7() ) {
        addClass( 'ie7' );
    }
};

let addClass = ( className ) => {
    document.documentElement.classList.add( className );
};

let isIE7 = () => {
    return ( navigator.appVersion.indexOf( 'MSIE 7' ) !== -1 ) ? true : false;
};

export default {
    init: init,
    isIE7: isIE7
};
