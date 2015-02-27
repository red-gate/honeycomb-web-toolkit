var Base = Base || {};

Base.Polyfill = Base.Polyfill || {};

// initTrimPolyfill - Polyfill for the string trim command.
Base.Polyfill.trim = function() {
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
};

$(function(){
  Base.Polyfill.trim();
});
