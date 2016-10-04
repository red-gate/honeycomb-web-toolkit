let init = () => {
    let imgs = document.querySelectorAll( 'img.js-svg' );
    for ( let i = 0; i < imgs.length; i++ ) {
        let img = imgs[ i ];
        let src = img.getAttribute( 'src' ).replace( /(.png)|(.gif)/, '.svg' );
        let newImage = new Image();

        newImage.src = src;
        newImage.onload = () => {
            img.setAttribute( 'src', src );
        };
    }
};

export default {
    init
};
