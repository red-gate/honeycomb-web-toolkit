var Honeycomb = Honeycomb || {};

Honeycomb.Browser = (function($) {

    var init = function init() {
        if(isIE7()) {
            addClass('ie7');
        }
    };

    var addClass = function addClass(className) {
        $('html').addClass(className);
    };

    var isIE7 = function isIE7() {
        return (navigator.appVersion.indexOf('MSIE 7') !== -1) ? true : false;
    };

    return {
        init: init,
        isIE7: isIE7
    };

})(jQuery);

jQuery(function() {
    Honeycomb.Browser.init();
});
