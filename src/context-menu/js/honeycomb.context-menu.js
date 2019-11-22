const init = () => {
    // add event listeners
    const els = document.querySelectorAll( '.js-context-menu' );

    if ( els.length ) {
        for ( let i = 0; i < els.length; i++ ) {
            const el = els[i];
            el.querySelector('.js-context-menu__control').addEventListener('click', handleContextMenuControlClick);
        }

        document.addEventListener('click', handleClickAway);
    }
};

const handleContextMenuControlClick = event => {
    const contextMenu = event.target.closest('.js-context-menu');
    contextMenu.classList.toggle('js-context-menu--open'); 
};

const handleClickAway = event => {
    const openContextMenus = document.querySelectorAll('.js-context-menu--open');

    // Close all open context menus not containing the click target
    for ( let i = 0; i < openContextMenus.length; i++ ) {
        const openContextMenu = openContextMenus[i];
        
        if ( ! openContextMenu.contains(event.target) ) {
            openContextMenu.classList.remove('js-context-menu--open');
        }
    }

};

export default {
    init
};