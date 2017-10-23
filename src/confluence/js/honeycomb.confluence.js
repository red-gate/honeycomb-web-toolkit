const sidebar = () => {

    if ( typeof window.jQuery === 'undefined') {
        window.console.error( 'Honeycomb: jQuery not found, so the scrollTree plugin won\'t be loaded' );
        return;
    }

    if ( typeof window.jQuery.fn.scrollTree === 'undefined' ) {
        window.console.error( 'Honeycomb: The scrollTree plugin hasn\'t been installed correctly. - Plugin undefined' );
        return;
    }

    window.jQuery('.confluence-sidebar ul').scrollTree({
        'contextPath': window.contextPath,
        'css': {
            'ancestor': 'nav--vertical__active-parent',
            'current': 'nav--vertical__active',
            'collapsed': 'collapsed',
            'expanded': 'nav--vertical__active-parent',
            'toggle': 'nav--vertical__toggle',
            'normal': ''
        },
        'renderChildLi': function (child, opts) {
            let html = '<li class="' + opts.css[child.type] + '">';
            html += '<a href="' + child.link + '" class="' + opts.css[child.type] + '">';

            if ( typeof child.children !== 'undefined' ) {
                html += '<span class="' + opts.css.toggle + ' ' + opts.css.toggle + '--has-children"></span>';
            }

            html += child.title + '</a>';
            html += '</li>';

            return html;
        }
    });
};

const lightbox = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.error( 'Honeycomb: jQuery not found, so lightbox functionality won\'t work' );
        return;
    }

    window.jQuery('.confluence-embedded-image').each(function(){
        let $this = window.jQuery(this);
        let $parent = $this.parent().get(0);
        if ( $parent.nodeName !== 'A' ) {
            let $a = window.jQuery('<a/>')
            .addClass('lightbox link-image js-lightbox')
            .attr('href', $this.attr('src'))
            .attr('rel', 'lightbox');
            $this.wrap($a);
        }
    });
};

const notifications = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.error( 'Honeycomb: jQuery not found, so notification functionality won\'t work as expected' );
        return;
    }

    // List of classes to add to.
    let classes = {
        'confluence-information-macro': 'notification notification--block notification--block--minimal',
        'confluence-information-macro-tip': 'notification--success',
        'confluence-information-macro-note': 'notification--warning',
        'confluence-information-macro-information': 'notification--info',
        'confluence-information-macro-warning': 'notification--fail',
        'confluence-information-macro-body': 'notification__body',
        'confluence-information-macro-icon': 'notification__icon'
    };

    let icons = {
        'info': 'icon--info',
        'success': 'icon--success',
        'fail': 'icon--fail',
        'warning': 'icon--warning'
    };

    // Loop through and add the classes.
    for ( let c in classes ) {
        window.jQuery('.' + c).addClass(classes[c]);
    }

    // Add the inner container.
    window.jQuery('.confluence-information-macro').wrapInner('<div class="notification--block__inner-container"></div>');

    // Loop through adding in notification icons.
    window.jQuery('.confluence-information-macro').each(function(){
        let $this = window.jQuery(this);
        for ( let i in icons ) {
            if ( $this.hasClass('notification--' + i ) ) {
                let c = 'icon ' + icons[i];
                let $span = window.jQuery('<span/>').addClass(c);
                $span.prependTo($this.find('.confluence-information-macro-icon'));
            }
        }
    });
};

const toc = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.error( 'Honeycomb: jQuery not found, so TOC functionality won\'t work as expected' );
        return;
    }

    window.jQuery('.toc-macro').each(function(){
        let $this = window.jQuery(this);
        let defaults = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        let headings = $this.data('headerelements').toLowerCase().split(',');
        let excludedHeadings = [];

        for ( let i = 0; i < defaults.length; i++ ) {
            if ( headings.indexOf( defaults[ i ] ) === -1 ) {
                excludedHeadings.push( defaults[ i ] );
            }
        }

        // Exclude H1 headings by default.
        excludedHeadings.push('h1');

        // Convert array to string.
        excludedHeadings = excludedHeadings.join( ', ' );

        $this.toc({
            exclude: excludedHeadings,
            numerate: false
        });
    });
};

const tables = () => {
    const tables = document.querySelectorAll('table');
    for (var i=0; i<tables.length; i++) {
        const table = tables[i];
        const wrapper = table.parentElement;

        if (wrapper.className === 'table-wrap') {
            if (table.clientWidth > wrapper.clientWidth) {
                table.className += ' table--fixed';
            }
        }
    }
};

// Convert classes to IDs (as ID's get stripped out when added
// via the editor)
// Usage: set class="class-a class-b id--this-is-my-id class-c"
const convertIds = () => {
    const els = document.querySelectorAll('[class*=id--]');
    for (var i=0; i<els.length; i++) {
        let id = false;
        const el = els[i];
        const cls = el.getAttribute('class').match(/id--[a-z0-9\-]*/ig);
        if (cls) {
            const c = cls[0];
            id = c.replace('id--', '');
        }

        if (id) {
            el.setAttribute('id', id);
        }
    }
};

const displayVersions = () => {
    const version = window.Confluence.Space.key.replace(/[^0-9]/g, '');
    if ((version !== '') && (parseInt(version) > 1)) {
        const oldVersions = document.querySelector('.js-older-versions');
        if (oldVersions) {
            oldVersions.style.display = 'block';
        }
    }
};

const code = (() => {
    const titles = document.querySelectorAll('.code__title');

    const init = () => {
        collapseAll();

        for (var i=0; i<titles.length; i++) {
            titles[i].addEventListener('click', function() {       
                const code = this.nextElementSibling;               
                if (code.style.display === 'none') {

                    // Display code
                    code.style.display = 'block';

                    this.style.marginBottom = '0';
                    this.setAttribute('data-code-open', 'true');

                } else {

                    // Hide code
                    code.style.display = 'none';

                    this.style.marginBottom = '1rem';
                    this.setAttribute('data-code-open', 'false');
                }
            });
        }
    };

    const collapseAll = () => {
        const codes = document.querySelectorAll('.code__title + .prettyprint');
        
        for (let i=0; i<codes.length; i++) {
            codes[i].style.display = 'none';
        }
        
        for (let a=0; a<titles.length; a++) {
            titles[a].style.marginBottom = '1rem';
            titles[a].setAttribute('data-code-open', 'false');
            titles[a].innerHTML += ' <small class="float-right">Toggle source code</small>';
        }
    };

    return {
        init
    };
})();

const nav = (() => {
    const nav = document.querySelector('.nav--vertical--minimal');
    const container = document.querySelector('.content-container');
    
    const init = () => {
        if (!nav || !container) return false;
        nav.style.minHeight = '0';     
        if (window.innerWidth < 600) return false;
        nav.style.minHeight = `${container.clientHeight}px`;
    };
  
    return {
        init
    };
})();
window.addEventListener('resize', nav.init);  

const init = () => {
    sidebar();
    lightbox();
    notifications();
    toc();
    tables();
    convertIds();
    displayVersions();
    code.init();
    nav.init();
};

export default {
    init
};
