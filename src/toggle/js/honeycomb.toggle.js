const hook = ".js-toggle";

const activeClass = "active";

let init = () => {
    let toggles = document.querySelectorAll( hook );
    if ( toggles.length > 0 ) {
        for ( let toggle of toggles ) {

            // Hide the toggle items.
            let items = toggle.querySelectorAll( `${hook}-item` );
            for ( let i = 0; i < items.length; i++ ) {
                items[ i ].style.display = "none";
            }

            // Show the first item.
            items[ 0 ].style.display = "block";

            // Add active state to the first nav item.
            let as = toggle.querySelectorAll( `${hook}-nav a` );
            for ( let a of as ) {
                a.classList.remove( activeClass );

                // Add toggle handler.
                a.addEventListener( "click", ( e ) => {
                    e.preventDefault();

                    // @TODO Work out how best to structure this.
                    // @TODO callbacks within modules?
                    window.toggle( e.target.getAttribute( "href" ) );
                });
            }
            as[ 0 ].classList.add( activeClass );
        }
    }
};

let toggle = ( target ) => {

    // Find the toggle.
    target = target.startsWith( "#" ) ? target.substr( 1 ) : target;
    let toggleItem = document.getElementById( target );
    let toggle = toggleItem.parentNode;
    while ( ! toggle.classList.contains( hook.substr( 1 ) ) ) {
        toggle = toggle.parentNode;
    }

    // Hide all the items.
    let items = toggle.querySelectorAll( `${hook}-item` );
    for ( let item of items ) {
        item.style.display = "none";
    }

    // Show the selected item.
    toggleItem.style.display = "block";

    // Update the active state.
    let links = toggle.querySelectorAll( `${hook}-nav a` );
    for ( let link of links ) {
        link.classList.remove( activeClass );

        if ( link.getAttribute( "href" ) === `#${target}` ) {
            link.classList.add( activeClass );
        }
    }
};

export default {
    init,
    toggle
};
