var Honeycomb = Honeycomb || {};

Honeycomb.Polyfill = Honeycomb.Polyfill || {};

Honeycomb.Polyfill.boxSizing = (function($) {

    var init = function init() {

        // Check Modernizr for border box box sizing.
        Modernizr.addTest("boxsizing", function() {
            return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
        });

        // Has Modernizr applied the class?
        var hasBoxSizing = $('html').hasClass('boxsizing');
        if(!hasBoxSizing) {
            fix();
        }
    };

    var fix = function fix() {
        $('*').each(function() {
            var fullWidth = $(this).outerWidth();
            var actualWidth = $(this).width();
            var widthDiff = fullWidth - actualWidth;
            var newWidth = actualWidth - widthDiff;
            newWidth--; // To compensate for fractions of a pixel. (Some widths calculated on %).

            if(this.currentStyle.width !== 'auto') {

                // If the element has a width set on it, then adjust it.
                $(this).css('width', newWidth);
            }
            });
    };

    return {
        init: init
    };
})(jQuery);

jQuery(function(){
    Honeycomb.Polyfill.boxSizing.init();
});
