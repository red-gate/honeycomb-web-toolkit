var ISW = ISW || {};

ISW.Polyfill = ISW.Polyfill || {};

// initTrimPolyfill - Polyfill for the string trim command.
ISW.Polyfill.trim = function() {
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
};

jQuery(function(){
  ISW.Polyfill.trim();
});
