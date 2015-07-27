var Honeycomb = Honeycomb || {};

Honeycomb.Font = (function($) {

    // Config for the Honeycomb web font.
    var config = {
        google: {
            families: ['Roboto:500,900,100,300,700,400:latin']
        }
    };

    var init = function init() {

        // Add the config to the global scope.
        window.WebFontConfig = config;

        // Load the webfont JS from Google.
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    };

    return {
        init: init
    };
})(jQuery);

jQuery(function() {
    Honeycomb.Font.init();
});
