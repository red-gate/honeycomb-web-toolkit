var Base = Base || {};
Base.Navigation = Base.Navigation || {};

var options = {
  type: 'drawer',
  triggers: {
    open: 'nav--drawer__open',
    close: 'nav--drawer__close',
  }
};

Base.Navigation.Drawer = new Base.Navigation.Base(options);
