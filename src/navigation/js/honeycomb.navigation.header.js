var Honeycomb = Honeycomb || {};

Honeycomb.Navigation = Honeycomb.Navigation || {};

Honeycomb.Navigation.Header = (function($) {

    var init = function init () {
        var $body = $("body");

        $body.on("click", ".header--primary__menu-button", function(e) {
            var $this = $(this);

            e.preventDefault();
            if($body.hasClass("mobile-nav--open")) {

                // Hide
                $body.removeClass("mobile-nav--open");
            } else {

                // Open
                $body.addClass("mobile-nav--open");
            }
        });
    };

    return {
        init: init
    };

})(jQuery);

jQuery(function() {
    Honeycomb.Navigation.Header.init();
});
