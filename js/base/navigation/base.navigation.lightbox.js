var Base = Base || {};
Base.Navigation = Base.Navigation || {};

var options = {
  type: 'lightbox',
  triggers: {
    open: 'nav--lightbox__open',
    close: 'nav--lightbox__close',
  }
};

Base.Navigation.Lightbox = new Base.Navigation.Base(options);
