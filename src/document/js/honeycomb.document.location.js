var Honeycomb = Honeycomb || {};

Honeycomb.Document = Honeycomb.Document || {};

Honeycomb.Document.Location = (function() {

    var init = function init() {};

    var getUrlParameterByName = function getUrlParameterByName(name) {
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);

        return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var onPage = function onPage(url) {
        var on = false;

        if(typeof url === 'string') {
            url = [url];
        }

        for(var i = 0; i < url.length; i++) {
            if(window.location.href.indexOf(url[i]) !== -1) {
                on = true;
            }
        }

        return on;
    };

    return {
        init: init,
        getUrlParameterByName: getUrlParameterByName,
        onPage: onPage
    };

})();

jQuery(function() {
    Honeycomb.Document.Location.init();
});
