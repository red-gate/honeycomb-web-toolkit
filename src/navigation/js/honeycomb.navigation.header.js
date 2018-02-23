const setupCollapse = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }
    
    const $headers = window.jQuery('.js-header-primary-collapse');

    $headers.each((index, header) => {
        const $header = window.jQuery(header);
        const $nav = $header.find('.header--primary__menu--mobile');
        $header.wrapInner('<div class="header--primary__container"></div>');
        $nav.appendTo($header);
    });
};

const dropdownNotification = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }
    
    const $headers = window.jQuery('.js-header-primary-collapse');
    const openClassName = 'dropdown--open';

    $headers.each(() => {
        const $body = window.jQuery('body');

        $body.on('click', '.header--primary__container .dropdown .arrow', function(){
            const $arrow = window.jQuery(this);
            const $header = $arrow.parents('.header--primary');
            if($arrow.parent('li').hasClass('open')) {
                $header.addClass(openClassName);
            } else {
                $header.removeClass(openClassName);
            }
        });
    });
};

let init = () => {
    setupCollapse();
    dropdownNotification();

    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }
    
    let $body = window.jQuery('body');

    $body.on('click', '.header--primary__menu-button', function(e) {
        e.preventDefault();
        if ($body.hasClass( 'mobile-nav--open')) {

            // Hide
            $body.removeClass('mobile-nav--open');
        } else {

            // Open
            $body.addClass('mobile-nav--open');
        }
    });

    // When an item that has a submenu is clicked toggle the menu, rather than
    // follow the link.
    $body.on('click', '.header--primary__menu--mobile .dropdown > a', function(e) {
        if (this.getAttribute('href') !== '#toggle') {
            e.preventDefault();

            let $toggle = window.jQuery(this).siblings('a[href="#toggle"]');
            if ($toggle) {
                $toggle.trigger('click');
            }
        }
    });
};

export default {
    init: init
};
