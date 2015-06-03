var Honeycomb = Honeycomb || {};

Honeycomb.Location = Honeycomb.Location || {};

// Get a URL parameter by its name.
Honeycomb.Location.getUrlParameterByName = function(name) {
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);

  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
