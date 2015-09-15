var Honeycomb = Honeycomb || {};

Honeycomb.Analytics = Honeycomb.Analytics || {};

Honeycomb.Analytics.Pingdom = (function($) {

    var init = function init() {
        if (typeof window._prum !== 'undefined') {
            var s = document.getElementsByTagName('script')[0];
            var p = document.createElement('script');
            p.async = 'async';
            p.src = '//rum-static.pingdom.net/prum.min.js';
            s.parentNode.insertBefore(p, s);
        }
    };

    return {
        init: init
    };

})(jQuery);

jQuery(function() {
    Honeycomb.Analytics.Pingdom.init();
});
