var ISW = ISW || {};

ISW.Location = ISW.Location || {};

// Get a URL parameter by its name.
ISW.Location.getUrlParameterByName = function(name) {
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);

  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
