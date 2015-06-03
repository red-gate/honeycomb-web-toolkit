var Honeycomb = Honeycomb || {};
Honeycomb.Navigation = Honeycomb.Navigation || {};

var options = {
  type: 'drawer',
  triggers: {
    open: 'nav--drawer__open',
    close: 'nav--drawer__close',
  }
};

Honeycomb.Navigation.Drawer = new Honeycomb.Navigation.Honeycomb(options, jQuery);
