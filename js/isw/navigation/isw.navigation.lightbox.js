var ISW = ISW || {};
ISW.Navigation = ISW.Navigation || {};

var options = {
  type: 'lightbox',
  triggers: {
    open: 'nav--lightbox__open',
    close: 'nav--lightbox__close',
  }
};

ISW.Navigation.Lightbox = new ISW.Navigation.ISW(options);
