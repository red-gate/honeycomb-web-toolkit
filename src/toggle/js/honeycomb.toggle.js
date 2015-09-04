var Honeycomb = Honeycomb || {};

Honeycomb.Toggle = (function($) {

    var hook = '.js-toggle';

    var activeClass = 'active';

    var init = function init () {
        $(hook).each(function(){
            var $this = $(this);

            // Hide the toggle items.
            $this.find(hook + '-item').hide();

            // Show the first item.
            $this.find(hook + '-item').first().show();

            // Add active state to the first nav item.
            $this.find(hook + '-nav a').removeClass(activeClass)
                .first().addClass(activeClass);

            // Add toggle handler.
            $this.find(hook + '-nav a').on('click', function(e) {
                e.preventDefault();
                toggle($(this).attr('href'));
            });
        });
    };

    var toggle = function toggle (target) {

        // Find the toggle.
        var $toggle = $(target).parents(hook).first();

        // Hide all the items.
        $toggle.find(hook + '-item').hide();

        // Show the selected item.
        $toggle.find(target).show();

        // Update the active state.
        $toggle.find(hook + '-nav a').removeClass(activeClass);
        $toggle.find(hook + '-nav a[href="' + target + '"]').addClass(activeClass);
    };

    return {
        init: init
    };

})(jQuery);

jQuery(function(){
    Honeycomb.Toggle.init();
});
