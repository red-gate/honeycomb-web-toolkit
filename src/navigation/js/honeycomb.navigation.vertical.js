const collapseClass = 'nav--vertical__collapse';
const collapsedClass = 'nav--vertical--collapsed';
const activeClass = 'nav--vertical__active';
const parentActiveClass = 'nav--vertical__active-parent';

const init = () => {
    const navs = document.querySelectorAll('.nav--vertical');
    for(let i=0; i<navs.length; i++) {
        let nav = navs[i];

        let as = nav.querySelectorAll('a');
        for(let a=0; a<as.length; a++) {
            let a = as[a];
            let href = a.getAttribute('href');
            if (!href) {
                a.addEventListener('click', e => {
                    e.preventDefault();

                    if (a.parentElement.className.match(collapseClass) !== null) {

                        // Toggle the collapsed state of the nav.
                        if (nav.className.match(collapsedClass) === null) {
                            nav.className = nav.className + ` ${collapsedClass}`;
                        } else {
                            nav.className = nav.className.replace(collapsedClass, '');
                        }
                    } else if (a.parentElement.className.match(activeClass) !== null) {

                        // Clicked on active item, so disable.
                        a.parentElement.className = a.parentElement.className.replace(parentActiveClass, '').replace(activeClass, '');
                    } else {

                        // Remove all active and parent active classes.
                        let items = nav.querySelectorAll(`.${activeClass}, .${parentActiveClass}`);
                        for (let i=0; i<items.length; i++) {
                            items[i].className = items[i].className.replace(parentActiveClass, '').replace(activeClass, '');
                        }

                        // Add active class to parent.
                        a.parentElement.className = a.parentElement.className + ` ${activeClass}`;

                        // Add parent active class to parent list items.
                        let el = a.parentElement.parentElement;
                        while (el.className.match('nav--vertical') === null) {
                            if (el.nodeName === 'LI') {
                                el.className = el.className + ` ${parentActiveClass}`;
                            }

                            el = el.parentElement;
                        }
                    }
                });
            }
        }
    }
};

export default {
    init: init
};
