let interval = 9000;
let fadeOutDuration = 1000;
let fadeInDuration = 2000;

let init = () => {
    if ( typeof $ === 'undefined' ) return;

    $('.js-animate--fade').each(function() {
        let $this = $(this);
        if ( $this.find('.js-animate--fade__item').length > 1 ) {
            $this.find('.js-animate--fade__item').wrapAll('<div class=\"js-animate--fade__container\"/>');
            $this.find('.js-animate--fade__item').hide().first().show();
            setInterval(step, interval);
        }
    });
};

let step = () => {
    $('.js-animate--fade').each(function() {
        let $band = $(this);
        let $current = $band.find('.js-animate--fade__item:visible');
        let $next = ($current.next('.js-animate--fade__item').length !== 0) ? $current.next('.js-animate--fade__item') : $band.find('.js-animate--fade__item').first();

        $next.css('position', 'relative');
        $current.css('position', 'absolute')
            .css('bottom', '0')
            .fadeOut({
                duration: fadeOutDuration
            });
        $next.fadeIn({
            duration: fadeInDuration
        });
    });
};

export default {
    init: init
};
