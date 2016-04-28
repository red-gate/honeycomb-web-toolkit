var Honeycomb = Honeycomb || {};

Honeycomb.Navigation = Honeycomb.Navigation || {};

Honeycomb.Navigation.Dropdown = (function($) {

    var $body = $('body');
    var selector = '.js-dropdown';
    var classNameOpen = 'open';
    var classNameClosed = 'closed';

    var init = function init () {
        addArrows();
        handle();
    };

    var addArrows = function addArrows () {
        var $lis = $(selector).find('li');
        $lis.each(function() {
            var $this = $(this);
            if(($this.find('ul').length > 0) && ($this.attr('data-arrow-added') !== 'true')) {
                var $a = $('<a/>').attr('href', '#toggle').addClass('arrow');
                $this.addClass('dropdown ' + classNameClosed);
                $this.attr('data-arrow-added', 'true');
                $a.appendTo($this);
            }
        });
    };

    var handle = function handle () {
        $body.on('click', '.js-dropdown .arrow', function(e) {
            var $this = $(this);
            var $dropdown = $this.parent();

            e.preventDefault();
            if($dropdown.hasClass(classNameOpen)) {
                $dropdown.removeClass(classNameOpen).addClass(classNameClosed);
            } else {
                $dropdown.addClass(classNameOpen).removeClass(classNameClosed);
            }
        });
    };

    return {
        init: init,
        addArrows: addArrows
    };

})(jQuery);

$(function() {
    Honeycomb.Navigation.Dropdown.init();
});
