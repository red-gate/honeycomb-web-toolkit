var Honeycomb = Honeycomb || {};

Honeycomb.Polyfill = Honeycomb.Polyfill || {};

Honeycomb.Polyfill.tableCell = (function($) {

    var init = function init() {

        var rules = document.createElement('div').style;

        // Check Modernizr for display: table-cell.
        Modernizr.addTest("displaytablecell", function() {
            try {
                rules.display = 'table-cell';
                return rules.display === 'table-cell';
            } catch (e) {
                return false;
            }
        });

        // Has Modernizr applied the class?
        var hasTableCell = $('html').hasClass('displaytablecell');
        if(!hasTableCell) {
            fix();
        }
    };

    var fix = function fix() {
        var selectors = [
            '.band-logo__logo',
            '.tabs li'
        ];

        $(selectors.join(', ')).each(function() {
            var $this = $(this);
            var numItems = $this.siblings().length + 1;
            var cssWidth = (100 / numItems) -1 + '%';

            $this.css('display', 'inline');
            $this.css('zoom', '1');
            $this.css('width', cssWidth);
        });
    };

    return {
        init: init
    };
})(jQuery);

jQuery(function(){
    Honeycomb.Polyfill.tableCell.init();
});
