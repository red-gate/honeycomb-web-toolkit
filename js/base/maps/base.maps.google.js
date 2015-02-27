var Base = Base || {};

Base.Maps = Base.Maps || {};

Base.Maps.Google = (function() {

  var $maps;

  var init = function init() {
    $maps = $('.js-google-map');

    if($maps.length > 0) {
      var s = document.getElementsByTagName('script')[0];
      var se = document.createElement('script');
      var done = false;

      se.type = 'text/javascript';
      se.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback=Base.Maps.Google.initialiseMap';
      s.parentNode.insertBefore(se, s);
    }
  };

  var initialiseMap = function initialiseMap() {
    $maps.each(function() {
      var $this = $(this);
      var config = getConfig($this);

      var map = new google.maps.Map(this, {
        center: new google.maps.LatLng(config.lat, config.long),
        zoom: config.zoom,
        mapTypeId: config.mapTypeId,
        disableDefaultUI: config.disableDefaultUI,
        scrollwheel: config.scrollwheel,
        draggable: config.draggable
      });
    });
  };

  var getConfig = function getConfig($map) {

    // Look at the elements data attributes to get configs and return in object.
    var config = {};
    config.lat                = $map.attr('data-google-map-lat') || 0;
    config.long               = $map.attr('data-google-map-long') || 0;
    config.zoom               = parseInt($map.attr('data-google-map-zoom'), 10) || 10;
    config.mapTypeId          = google.maps.MapTypeId.ROADMAP;
    config.disableDefaultUI   = ($map.attr('data-google-map-disable-ui') === 'true') ? true : false;
    config.scrollwheel        = ($map.attr('data-google-map-scrollwheel') === 'false') ? false : true;
    config.draggable          = ($map.attr('data-google-map-draggable') === 'false') ? false : true;

    return config;
  };

  return {
    init: init,
    initialiseMap: initialiseMap
  };
})();

$(function() {
  Base.Maps.Google.init();
});
