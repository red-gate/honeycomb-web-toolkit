var Honeycomb = Honeycomb || {};
Honeycomb.Navigation = Honeycomb.Navigation || {};

var options = {
  type: 'lightbox',
  triggers: {
    open: 'nav--lightbox__open',
    close: 'nav--lightbox__close',
  }
};

Honeycomb.Navigation.Lightbox = new Honeycomb.Navigation.Base(options, jQuery);
