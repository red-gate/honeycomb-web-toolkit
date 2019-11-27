const init = () => {
    const els = document.querySelectorAll('.js-context-menu');

    // Add event handlers
    if (els.length) {

        // Polyfill Element.prototype.closest for IE
        if (!Element.prototype.closest) {
            Element.prototype.matches = Element.prototype.msMatchesSelector;
            Element.prototype.closest = function(s) {
                var el = this;

                do {
                    if (el.matches(s)) return el;
                    el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }

        for (let i = 0; i < els.length; i++) {
            const el = els[i];
            el.querySelector('.js-context-menu__control').addEventListener('click', handleContextMenuControlClick);
        }

        document.addEventListener('click', handleClickAway);

        // Close context menus when resizing window (rather than recalculating positioning)
        window.addEventListener('resize', closeMenus);
    }
};

// Get the position of an element relative to the document
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { 
        top: rect.top + scrollTop, 
        left: rect.left + scrollLeft,
        height: rect.height,
        width: rect.width
    };
}

// Handler for clicking on the context menu control
const handleContextMenuControlClick = event => {
    event.preventDefault();
    const contextMenu = event.target.closest('.js-context-menu');

    // Toggle context menu open state
    if ( contextMenu.classList.contains('js-context-menu--open') ) {
        closeMenu(contextMenu);
    } else {
        openMenu(contextMenu);
    }
};

const openMenu = contextMenu => {
    contextMenu.classList.add('js-context-menu--open');

    // In order to overlay the context menu list over the other document content
    // and avoid problems with parent container overflow,
    // we create a copy of the context menu list and append it to the body, 
    // absolutely positioned in the correct position. 
    // The copied node is destroyed when we close the menu. 
    const contextMenuListCopy = contextMenu.querySelector('.js-context-menu__list').cloneNode(true);
    const control = contextMenu.querySelector('.js-context-menu__control');
    const offset = getOffset( control );

    // Set position and classes
    const top = offset.top + offset.height + 10;
    let left = offset.left + 20;

    if ( contextMenu.classList.contains('js-context-menu--right') ) {
        contextMenuListCopy.classList.add('js-context-menu__list--right');
        left -= offset.width + 20;
    }

    contextMenuListCopy.style.top = `${top}px`;
    contextMenuListCopy.style.left = `${left}px`;

    contextMenuListCopy.classList.add('js-context-menu__list--open');

    // create unique identifier to associate the context menu with the floating element 
    const id = Date.now() + Math.random();
    contextMenu.setAttribute('data-context-menu-id', id);
    contextMenuListCopy.setAttribute('data-context-menu-id', id);
    
    // Add menu to DOM
    document.body.appendChild(contextMenuListCopy);
};

const closeMenu = contextMenu => {
    contextMenu.classList.remove('js-context-menu--open');

    // remove any open lists from the body
    const id = contextMenu.getAttribute('data-context-menu-id');
    if ( id ) {
        const openList = document.querySelector(`.js-context-menu__list[data-context-menu-id='${id}'`);
        if ( openList ) {
            openList.parentElement.removeChild(openList);
        }
    }
};

// Close all context menus
const closeMenus = () => {
    const els = document.querySelectorAll( '.js-context-menu--open' );
    if ( els.length ) {
        for ( let i = 0; i < els.length; i++ ) {
            closeMenu( els[i] );
        }
    }
};

// Handler for clicking away from the context menu
const handleClickAway = event => {
    const openContextMenus = document.querySelectorAll('.js-context-menu--open');
    
    // Close all open context menus when clicking away
    for ( let i = 0; i < openContextMenus.length; i++ ) {
        const openContextMenu = openContextMenus[i];
        const control = openContextMenu.querySelector('.js-context-menu__control');
        const list = openContextMenu.querySelector('.js-context-menu__list');
        
        // make sure the user is not clicking on the context menu control or list
        if ( ! ( control.contains(event.target) || list.contains(event.target) ) ) {
            closeMenu(openContextMenu);
        }
    }

};

export default {
    init
};