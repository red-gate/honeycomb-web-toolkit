var Base = Base || {};

Base.Cookie = (function(){

  var get = function get(property) {
    var value = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, property.length + 1) === (property + '=')) {
          value = decodeURIComponent(cookie.substring(property.length + 1));
          break;
        }
      }
    }
    return value;
  };

  // TODO: Write cookie set functionality.
  var set = function set() {
    return '@todo - Need to write cookie set functionality';
  };

  return {
    get: get,
    set: set
  };
})();
