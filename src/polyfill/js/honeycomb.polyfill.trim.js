var Honeycomb = Honeycomb || {};

Honeycomb.Polyfill = Honeycomb.Polyfill || {};

// initTrimPolyfill - Polyfill for the string trim command.
Honeycomb.Polyfill.trim = function() {
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
};

jQuery(function(){
  Honeycomb.Polyfill.trim();
});
