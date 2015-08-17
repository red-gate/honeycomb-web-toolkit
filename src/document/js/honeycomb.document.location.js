var Honeycomb = Honeycomb || {};

Honeycomb.Document = Honeycomb.Document || {};

Honeycomb.Document.Location = (function() {

    var init = function init() {};

    var getUrlParameterByName = function getUrlParameterByName(name) {
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);

        return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    return {
        init: init,
        getUrlParameterByName: getUrlParameterByName
    };

})();

jQuery(function() {
    Honeycomb.Document.Location.init();
});
