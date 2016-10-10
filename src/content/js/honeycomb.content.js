let updateEls = false;

const init = () => {

    let els = document.querySelectorAll( ".js-update-content" );
    if ( els && window.breakpoints ) {
        updateEls = els;
        update( true );
    }
};

const update = ( init = false ) => {
    if ( updateEls ) {

        if ( init ) {

            // Store original content.
            for ( let el of updateEls ) {
                if ( ! el.hasAttribute( "data-content-large" ) ) {
                    el.setAttribute( "data-content-large", el.innerHTML );
                }
            }
        }

        let width = window.innerWidth;

        for ( let el of updateEls ) {
            let content = false;

            for ( let bp of window.breakpoints ) {
                if ( width < bp.width ) {
                    if ( el.hasAttribute( `data-content-${bp.breakpoint}` ) ) {
                        content = el.getAttribute( `data-content-${bp.breakpoint}` );
                    }
                }
            }
            el.innerHTML = content;
        }

    }
};

window.addEventListener( "resize", () => {
    update();
});

export default {
    init
};
