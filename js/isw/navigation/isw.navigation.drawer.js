var ISW = ISW || {};
ISW.Navigation = ISW.Navigation || {};

var options = {
  type: 'drawer',
  triggers: {
    open: 'nav--drawer__open',
    close: 'nav--drawer__close',
  }
};

ISW.Navigation.Drawer = new ISW.Navigation.ISW(options);
