var Base = Base || {};

Base.Location = Base.Location || {};

// Get a URL parameter by its name.
Base.Location.getUrlParameterByName = function(name) {
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);

  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
