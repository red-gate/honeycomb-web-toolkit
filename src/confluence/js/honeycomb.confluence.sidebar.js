const init = () => {
    if ( typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so the scrollTree plugin won\'t be loaded' );
        return;
    }

    if ( typeof window.jQuery.fn.scrollTree === 'undefined' ) {
        window.console.warn( 'Honeycomb: The scrollTree plugin hasn\'t been installed correctly. - Plugin undefined' );
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

export default {
    init
};