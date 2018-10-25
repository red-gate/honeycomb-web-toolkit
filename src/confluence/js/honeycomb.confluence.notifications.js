const init = () => {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn( 'Honeycomb: jQuery not found, so notification functionality won\'t work as expected' );
        return;
    }

    // List of classes to add to.
    let classes = {
        'confluence-information-macro': 'notification notification--block notification--block--minimal',
        'confluence-information-macro-tip': 'notification--success',
        'confluence-information-macro-note': 'notification--warning',
        'confluence-information-macro-information': 'notification--info',
        'confluence-information-macro-warning': 'notification--fail',
        'confluence-information-macro-body': 'notification__body',
        'confluence-information-macro-icon': 'notification__icon'
    };

    let icons = {
        'info': 'icon--info',
        'success': 'icon--success',
        'fail': 'icon--fail',
        'warning': 'icon--warning'
    };

    // Loop through and add the classes.
    for ( let c in classes ) {
        window.jQuery('.' + c).addClass(classes[c]);
    }

    // Add the inner container.
    window.jQuery('.confluence-information-macro').wrapInner('<div class="notification--block__inner-container"></div>');

    // Loop through adding in notification icons.
    window.jQuery('.confluence-information-macro').each(function(){
        let $this = window.jQuery(this);
        for ( let i in icons ) {
            if ( $this.hasClass('notification--' + i ) ) {
                let c = 'icon ' + icons[i];
                let $span = window.jQuery('<span/>').addClass(c);
                $span.prependTo($this.find('.confluence-information-macro-icon'));
            }
        }
    });
};

export default {
    init
};