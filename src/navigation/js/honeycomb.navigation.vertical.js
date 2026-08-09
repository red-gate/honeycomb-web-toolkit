const collapseClass = 'nav--vertical__collapse';
const collapsedClass = 'nav--vertical--collapsed';
const activeClass = 'nav--vertical__active';
const parentActiveClass = 'nav--vertical__active-parent';
const toggleClass = 'nav--vertical__toggle';

const init = () => {
    const navs = document.querySelectorAll('.nav--vertical');
    for(let i=0; i<navs.length; i++) {
        let nav = navs[i];

        let as = nav.querySelectorAll('a');
        for(let x=0; x<as.length; x++) {
            let a = as[x];
            a.addEventListener('click', e => {
                if (a.parentElement.className.match(collapseClass) !== null) {
                    collapse(e, nav);
                    return;
                }

                if (e.target.className.match(toggleClass) !== null) {
                    toggle(e, a);
                    return;
                }

                let href = a.getAttribute('href');
                if (!href) {
                    toggle(e, a);
                    update(e, nav, a);
                    return;
                } else {

                    // Clicked on a link, so follow the link.
                    return;
                }
            });
        }
    }
};

const toggle = ( e, a ) => {
    e.preventDefault();
    const parent = a.parentElement;
    if (parent.className.match(activeClass) !== null) {
        $(parent).removeClass(parentActiveClass + " " + activeClass);
    } else {
        $(parent).addClass(parentActiveClass + " " + activeClass);
    }
};

const update = ( e, nav, a ) => {
    e.preventDefault();

    // Remove all active classes.
    let items = nav.querySelectorAll(`.${activeClass}`);
    for (let i=0; i<items.length; i++) {
        $(items[i]).removeClass(parentActiveClass + " " + activeClass);
    }

    var parent = a.parentElement;
    // Add active class to parent.
    $(parent).addClass (activeClass);

    // Add parent active class to parent list items.
    let el = a.parentElement.parentElement;
    while (el.className.match('nav--vertical') === null) {
        if (el.nodeName === 'LI') {
            $(el).addClass(parentActiveClass);
        }

        el = el.parentElement;
    }
};

const collapse = ( e, nav ) => {
    e.preventDefault();
    if (nav.className.match(collapsedClass) === null) {
        nav.className = nav.className + ` ${collapsedClass}`;
    } else {
        nav.className = nav.className.replace(collapsedClass, '');
    }
};

export default {
    init: init
};
