var Honeycomb = Honeycomb || {};

Honeycomb.Notifications = Honeycomb.Notifications || {};

/**
 * Notification block element
 * Usage: new Honeycomb.Notifications.Block({type: 'info', 'content': 'My notification content goes here';});
 */
Honeycomb.Notifications.Block = function(options) {

    var self = this;

    // User specified options.
    this.options = options;

    // Default settings.
    this.defaults = {
        type: 'info',
        icon: {
            type: false, // Could be either 'font' or 'image'.
            src: false // Reference to the icon.
        },
        content: '',
        duration: false,
        container: $('body')
    };

    // Customised settings.
    this.settings = {};

    // Show time.
    this.init = function init() {

        // Generate the settings array (Merging default settings and user options).
        $.extend(true, self.settings, self.defaults, self.options);

        // Build the notification.
        self.buildNotification();

        // Show the notification.
        self.show();

        // Add the close click handler.
        self.notification.on('click', '.notification__close', function(e){
            e.preventDefault();
            self.close();
        });
    };

    // Show the notification.
    this.show = function show() {

        // Hide the notification.
        self.notification.hide();

        // Display the notification.
        self.settings.container.prepend(self.notification);

        // Slide the notification down.
        self.notification.slideDown();

        if(self.settings.duration) {
            self.timeoutId = window.setTimeout(function() {
                self.close.call(self);
            }, self.settings.duration);
        }
    };

    // Build the notification HTML.
    this.buildNotification = function buildNotification() {
        notificationStr = '<div class="notification notification--block notification--' + self.settings.type + '">' +
                '<div class="notification--block__inner-container">' +
                    '<figure class="notification__icon">';

                        if(self.settings.icon.type) {
                            if(self.settings.icon.type === 'font') {

                                // Icon font
                                notificationStr += '<span class="icon icon--' + self.settings.icon.src + '"></span>';
                            } else if(self.settings.icon.type === 'image') {

                                // Image
                                notificationStr += '<img src="' + self.settings.icon.src + '" alt=""/>';
                            }
                        } else {
                            notificationStr += '<span class="icon icon--' + self.settings.type + '"></span>';
                        }

                    notificationStr += '</figure>' +
                    '<a class="notification__close" href="#">X</a>' +
                    '<div class="notification__body">' +
                        '<p>' + this.settings.content + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        self.notification = $(notificationStr);
    };

    // Close the notification.
    this.close = function close() {

        // Slide up the notification, then remove it from the DOM.
        self.notification.slideUp({
            complete: function() {
                this.remove();
            }
        });

        if(self.settings.duration) {

            // Clear the timeout.
            window.clearTimeout(self.timeoutId);
        }
    };

    // Kick off.
    self.init();
};

/**
 * Click handler for close buttons on statically built notifications.
 */
(function($) {
    $('.notification--block .notification__close').on('click', function(e) {
        e.preventDefault();
        $(this).parent().parent().slideUp({
            complete: function() {
                $(this).remove();
            }
        });
    });
})(jQuery);
