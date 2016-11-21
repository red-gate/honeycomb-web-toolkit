(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var accountId = void 0;
var sites = void 0;
var settings = void 0;

var init = function init() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


    if (s) {
        settings = s;
    }

    // If the account ID is not set, then don't carry on.
    if (!accountId || accountId === "UA-XXX") {
        console.error("Google Analytics account ID is not set.");
        return false;
    }

    // Add the tracking script.
    addScript();

    // Init the analytics accounts.
    initAccount(accountId);

    // Track a page view.
    if (s.trackPageView !== false) {
        trackPageView();
    }

    // Set up tracking alias helper.
    setupTrackingAlias();

    // Track YouTube video views.
    trackYouTubeViews();
};

var setAccountId = function setAccountId(accId) {
    accountId = accId;
};

var setSites = function setSites(s) {
    sites = s;
};

// Add the Google Analytics script to the page.
// Expanded out the isogram iife.
var addScript = function addScript() {
    window.GoogleAnalyticsObject = "ga";
    window.ga = window.ga || function () {
        (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = 1 * new Date();

    var script = document.createElement("script");
    script.async = 1;
    script.src = "//www.google-analytics.com/analytics.js";

    var firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
};

// Initialise the account, with the account ID.
var initAccount = function initAccount(accountId) {
    if (!accountId || accountId === "UA-XXX") {
        console.log("Google Analytics account ID is not set.");
        return false;
    }

    if (sites) {
        ga("create", accountId, "auto", { "allowLinker": true });
        ga("require", "linker");
        ga("linker:autoLink", sites);
    } else {
        ga("create", accountId, "auto");
    }
};

// Track a page view.
var trackPageView = function trackPageView() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (url) {
        ga("send", "pageview", {
            "page": url
        });
    } else {
        ga("send", "pageview");
    }
};

// Track an event.
var trackEvent = function trackEvent() {
    var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    ga("send", "event", category, action, label, value);
};

// Set a custom variable.
var setCustomVariable = function setCustomVariable(index, name, value, scope) {
    var options = {};
    options["dimension" + index] = value;
    ga("send", "pageview", options);
};

// Track youtube video views.
var trackYouTubeViews = function trackYouTubeViews() {
    var els = document.querySelectorAll(".lightbox--video");
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener("click", function (e) {
            var videoId = e.target.href.replace(/http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, "");
            trackEvent("Video", window.location.pathname, videoId);
        });
    }
};

// Click track (helper for instead of onclick="ga(send...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
var setupTrackingAlias = function setupTrackingAlias() {
    var els = document.querySelectorAll("[data-ga-track]");
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener("click", function (e) {
            var target = e.target;
            var category = target.getAttribute("data-ga-track-category") || null;
            var action = target.getAttribute("data-ga-track-action") || null;
            var label = target.getAttribute("data-ga-track-label") || null;
            var value = target.getAttribute("data-ga-track-value") || null;

            // Process Google tracking event.
            trackEvent(category, action, label, value);
        });
    }
};

exports.default = {
    init: init,
    setAccountId: setAccountId,
    setSites: setSites,
    trackPageView: trackPageView,
    trackEvent: trackEvent,
    setCustomVariable: setCustomVariable,
    accountId: accountId
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    if (typeof window._prum !== 'undefined') {
        var s = document.getElementsByTagName('script')[0];
        var p = document.createElement('script');
        p.async = 'async';
        p.src = '//rum-static.pingdom.net/prum.min.js';
        s.parentNode.insertBefore(p, s);
    }
};

exports.default = {
    init: init
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var interval = 5000;
var fadeOutDuration = 1000;
var fadeInDuration = 2500;

var init = function init() {
    if (typeof $ === 'undefined') return;

    $('.js-animate--fade').each(function () {
        var $this = $(this);
        $this.find('.js-animate--fade__item').wrapAll('<div class=\"js-animate--fade__container\"/>');
        $this.find('.js-animate--fade__item').hide().first().show();
        setInterval(step, interval);
    });
};

var step = function step() {
    $('.js-animate--fade').each(function () {
        var $band = $(this);
        var $current = $band.find('.js-animate--fade__item:visible');
        var $next = $current.next('.js-animate--fade__item').length !== 0 ? $current.next('.js-animate--fade__item') : $band.find('.js-animate--fade__item').first();

        $current.fadeOut({
            duration: fadeOutDuration,
            complete: function complete() {
                $next.fadeIn({
                    duration: fadeInDuration
                });
            }
        });
    });
};

exports.default = {
    init: init
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var version = exports.version = 'Version goes here';
var date = exports.date = 'Date goes here';
var breakpoints = exports.breakpoints = [{
    "breakpoint": "large",
    "width": 9999
}, {
    "breakpoint": "medium",
    "width": 768
}, {
    "breakpoint": "small",
    "width": 480
}];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    if (isIE7()) {
        addClass('ie7');
    }
};

var addClass = function addClass(className) {
    document.documentElement.classList.add(className);
};

var isIE7 = function isIE7() {
    return navigator.appVersion.indexOf('MSIE 7') !== -1 ? true : false;
};

exports.default = {
    init: init,
    isIE7: isIE7
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rearrangeNav = function rearrangeNav(carousel) {
    // selectors
    var nav = carousel.querySelector('ul');
    var leftButton = carousel.querySelector('.slick-prev');
    var rightButton = carousel.querySelector('.slick-next');

    // move buttons inside <ul>
    nav.appendChild(rightButton);
    nav.appendChild(leftButton);

    // reposition buttons
    rightButton.style.transform = 'translate(10px, 0px)';

    // the left button can't be the first element in the <ul>, otherwise it messes up the navigation, which counts <ul> child elements to map the slides to the links - adding a new first-child pushes the links off by one
    // so we need to add it to the end of the list, and translate its position by working out the width of the nav, plus the width of the arrow
    var navWidth = carousel.querySelectorAll('ul li').length * 40 + 57;
    leftButton.style.transform = 'translate(-' + navWidth + ' px, 0px)';
};

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // If no jQuery then break;
    if (typeof jQuery === "undefined") {
        return;
    }

    var carousels = document.querySelectorAll('.js-carousel');

    if (carousels.length) {
        if (typeof jQuery.fn.slick !== "function") {
            if (typeof config.url === "undefined") {
                config.url = "/src/carousel/vendor/slick/slick.min.js";
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            var _loop = function _loop(i) {
                var carousel = carousels[i];
                var options = {
                    autoplaySpeed: 4000,
                    dotsClass: 'slick-dots carousel__pagination',
                    adaptiveHeight: false,
                    dots: true
                };

                // Arrows.
                if (carousel.getAttribute('data-carousel-arrows')) {
                    options.arrows = carousel.getAttribute('data-carousel-arrows') === 'true';
                }

                // Autoplay
                if (carousel.getAttribute('data-carousel-autoplay')) {
                    options.autoplay = carousel.getAttribute('data-carousel-autoplay') === 'true';
                }

                // Pagination / Dots.
                if (carousel.getAttribute('data-carousel-pagination') && carousel.getAttribute('data-carousel-pagination') === "false") {
                    options.dots = false;
                }

                // Fade.
                if (carousel.getAttribute('data-carousel-fade')) {
                    options.fade = carousel.getAttribute('data-carousel-fade') === 'true';
                }

                // Adaptive Height (Automatically update height)
                if (carousel.getAttribute('data-carousel-auto-height')) {
                    options.adaptiveHeight = carousel.getAttribute('data-carousel-auto-height') === 'true';
                }

                // Autoplay speed.
                if (carousel.getAttribute('data-carousel-autoplay-speed')) {
                    options.autoplaySpeed = carousel.getAttribute('data-carousel-autoplay-speed');
                }

                // rearrange nav
                jQuery(carousel).on('init', function () {
                    rearrangeNav(carousel);
                });

                jQuery(carousel).slick(options);
            };

            for (var i = 0; i < carousels.length; i++) {
                _loop(i);
            }
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":11}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var vendorUrl = "//alexgorbatchev.com/pub/sh/current/";
var scriptsDir = "scripts/";
var cssDir = "styles/";

var scripts = [vendorUrl + scriptsDir + "shCore.js"];

var styles = [cssDir + "shThemeDefault.css"];

var samples = [];

var brushes = [['applescript', 'shBrushAppleScript.js'], ['actionscript3', 'as3', 'shBrushAS3.js'], ['bash', 'shell', 'shBrushBash.js'], ['coldfusion', 'cf', 'shBrushColdFusion.js'], ['cpp', 'c', 'shBrushCpp.js'], ['c#', 'c-sharp', 'csharp', 'shBrushCSharp.js'], ['css', 'shBrushCss.js'], ['delphi', 'pascal', 'shBrushDelphi.js'], ['diff', 'patch', 'pas', 'shBrushDiff.js'], ['erl', 'erlang', 'shBrushErlang.js'], ['groovy', 'shBrushGroovy.js'], ['java', 'shBrushJava.js'], ['jfx', 'javafx', 'shBrushJavaFX.js'], ['js', 'jscript', 'javascript', 'shBrushJScript.js'], ['perl', 'pl', 'shBrushPerl.js'], ['php', 'shBrushPhp.js'], ['text', 'plain', 'shBrushPlain.js'], ['py', 'python', 'shBrushPython.js'], ['powershell', 'ps', 'posh', 'shBrushPowerShell.js'], ['ruby', 'rails', 'ror', 'rb', 'shBrushRuby.js'], ['sass', 'scss', 'shBrushSass.js'], ['scala', 'shBrushScala.js'], ['sql', 'shBrushSql.js'], ['vb', 'vbnet', 'shBrushVb.js'], ['xml', 'xhtml', 'xslt', 'html', 'shBrushXml.js']];

var isCodeSample = function isCodeSample(sample) {
    var search = "brush:";
    if (sample.className.match(search)) {
        return true;
    }

    return false;
};

var loadStylesheet = function loadStylesheet(sheet) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = vendorUrl + sheet;
    head.appendChild(link);
};

var loadScript = function loadScript(src) {
    var scriptNodes = document.getElementsByTagName("script")[0];
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    scriptNodes.parentNode.insertBefore(script, scriptNodes);
};

var loadBrush = function loadBrush(brush) {
    for (var i = 0; i < brushes.length; i++) {
        if (brushes[i].indexOf(brush) !== -1) {
            var ref = brushes[i][brushes[i].length - 1];
            loadScript(vendorUrl + scriptsDir + ref);
        }
    }
};

var getCodeSamples = function getCodeSamples() {
    var pres = document.getElementsByTagName("pre");
    var scripts = document.getElementsByTagName("script");
    var samples = [];

    for (var a = 0; a < pres.length; a++) {
        if (isCodeSample(pres[a])) {
            samples.push(pres[a]);
        }
    }

    for (var b = 0; b < scripts.length; b++) {
        if (isCodeSample(scripts[b])) {
            samples.push(scripts[b]);
        }
    }

    return samples;
};

var loadStylesheets = function loadStylesheets() {
    for (var i = 0; i < styles.length; i++) {
        loadStylesheet(styles[i]);
    }
};

var loadScripts = function loadScripts() {
    for (var i = 0; i < scripts.length; i++) {
        loadScript(scripts[i]);
    }
};

var autoloadBrushes = function autoloadBrushes() {
    var brushesLoaded = [];

    for (var i = 0; i < samples.length; i++) {
        var brush = samples[i].className.match(/brush:[\s]*([a-z#]*)/i)[1];

        if (brushesLoaded.indexOf(brush) === -1) {
            brushesLoaded.push(brush);
            loadBrush(brush);
        }
    }
};

var highlight = function highlight() {
    if (typeof SyntaxHighlighter !== "undefined") {
        SyntaxHighlighter.defaults.toolbar = false;
        SyntaxHighlighter.defaults.gutter = false;
        SyntaxHighlighter.defaults['quick-code'] = false;
        SyntaxHighlighter.highlight();
    }
};

var init = function init() {
    samples = getCodeSamples();

    if (samples.length > 0) {
        loadStylesheets();
        loadScripts();
        autoloadBrushes();
    }

    window.addEventListener('load', function () {
        highlight();
    });
};

exports.default = {
    init: init,
    highlight: highlight
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sidebar = function sidebar() {

    if (typeof scrollTree === 'undefined') {
        window.console.log('The scrollTree plugin hasn\'t been installed correctly. - Plugin undefined');
        return;
    }

    $(".confluence-sidebar ul").scrollTree({
        'contextPath': window.contextPath,
        'css': {
            'ancestor': 'ancestor',
            'current': 'active',
            'collapsed': 'collapsed',
            'expanded': 'expanded',
            'toggle': 'toggle'
        },
        'renderChildLi': function renderChildLi(child, opts) {
            var html = '<li class="' + opts.css[child.type] + '">';
            html += '<a href="' + child.link + '" class="' + opts.css[child.type] + '">';

            if (typeof child.children !== 'undefined') {
                html += '<span class="' + opts.css.toggle + ' ' + opts.css.toggle + '--has-children"></span>';
            } else {
                html += '<span class="' + opts.css.toggle + '"></span>';
            }

            html += child.title + '</a>';
            html += '</li>';

            return html;
        }
    });
};

var lightbox = function lightbox() {
    $(".confluence-embedded-image").each(function () {
        var $this = $(this);
        var $parent = $this.parent().get(0);
        if ($parent.nodeName !== "A") {
            var $a = $("<a/>").addClass("lightbox link-image js-lightbox").attr("href", $this.attr("src")).attr("rel", "lightbox");
            $this.wrap($a);
        }
    });
};

var notifications = function notifications() {

    // List of classes to add to.
    var classes = {
        "confluence-information-macro": "notification notification--block",
        "confluence-information-macro-tip": "notification--success",
        "confluence-information-macro-note": "notification--warning",
        "confluence-information-macro-information": "notification--info",
        "confluence-information-macro-warning": "notification--fail",
        "confluence-information-macro-body": "notification__body",
        "confluence-information-macro-icon": "notification__icon"
    };

    var icons = {
        "info": "icon--info",
        "success": "icon--success",
        "fail": "icon--fail",
        "warning": "icon--warning"
    };

    // Loop through and add the classes.
    for (var c in classes) {
        $("." + c).addClass(classes[c]);
    }

    // Add the inner container.
    $(".confluence-information-macro").wrapInner("<div class=\"notification--block__inner-container\"></div>");

    // Loop through adding in notification icons.
    $(".confluence-information-macro").each(function () {
        var $this = $(this);
        for (var i in icons) {
            if ($this.hasClass("notification--" + i)) {
                var _c = "icon " + icons[i];
                $span = $("<span/>").addClass(_c);
                $span.prependTo($this.find(".confluence-information-macro-icon"));
            }
        }
    });
};

var toc = function toc() {
    $(".toc-macro").each(function () {
        var $this = $(this);
        var defaults = ["h1", "h2", "h3", "h4", "h5", "h6"];
        var headings = $this.data("headerelements").toLowerCase().split(",");
        var excludedHeadings = [];

        for (var i = 0; i < defaults.length; i++) {
            if (headings.indexOf(defaults[i]) === -1) {
                excludedHeadings.push(defaults[i]);
            }
        }

        // Exclude H1 headings by default.
        excludedHeadings.push("h1");

        // Convert array to string.
        excludedHeadings = excludedHeadings.join(', ');

        $this.toc({
            exclude: excludedHeadings,
            numerate: false
        });
    });
};

var init = function init() {
    sidebar();
    lightbox();
    notifications();
    toc();
};

exports.default = {
    init: init
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var updateEls = false;

var init = function init() {

    var els = document.querySelectorAll(".js-update-content");
    if (els && window.breakpoints) {
        updateEls = els;
        update(true);
    }
};

var update = function update() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (updateEls) {

        if (init) {

            // Store original content.
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = updateEls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var el = _step.value;


                    // Get first breakpoint.
                    var bp = window.breakpoints[0];

                    if (!el.hasAttribute("data-content-" + bp.breakpoint)) {
                        el.setAttribute("data-content-" + bp.breakpoint, el.innerHTML);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        var width = window.innerWidth;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = updateEls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _el = _step2.value;

                var content = false;

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = window.breakpoints[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _bp = _step3.value;

                        if (width < _bp.width) {
                            if (_el.hasAttribute("data-content-" + _bp.breakpoint)) {
                                content = _el.getAttribute("data-content-" + _bp.breakpoint);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                _el.innerHTML = content;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
};

window.addEventListener("resize", function () {
    update();
});

exports.default = {
    init: init
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var get = function get(property) {
    var value = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            // let cookie = cookies[ i ].trim();    // IE9+
            var cookie = cookies[i].replace(/^\s+|\s+$/g, ''); // IE8
            if (cookie.substring(0, property.length + 1) === property + '=') {
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

exports.default = {
    get: get,
    set: set
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var load = function load() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (url !== false) {
        (function () {
            var se = document.createElement("script");
            se.type = "text/javascript";
            se.src = url;

            var done = false;

            // When the script has loaded, apply the callback.
            se.onload = se.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;

                    if (typeof callback === "function") {
                        callback.apply();
                    }
                }
            };

            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(se, s);
        })();
    }
};

exports.default = {
    load: load
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getUrlParameterByName = function getUrlParameterByName(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var onPage = function onPage(url) {
    var on = false;

    if (typeof url === 'string') {
        url = [url];
    }

    for (var i = 0; i < url.length; i++) {
        if (window.location.href.indexOf(url[i]) !== -1) {
            on = true;
        }
    }

    return on;
};

exports.default = {
    getUrlParameterByName: getUrlParameterByName,
    onPage: onPage
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require("../../document/js/honeycomb.document.load-script");

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)
var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var vps = document.querySelectorAll(".js-vp");
    if (vps.length) {
        if (typeof jQuery.fn.inViewport !== "function") {
            if (typeof config.url === "undefined") {
                config.url = "/src/document/vendor/jquery.inViewport.min.js";
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            jQuery('.js-vp').inViewport(function () {
                jQuery(this).removeClass('vp-out').addClass('vp-in');
            }, function () {
                jQuery(this).addClass('vp-out');
                // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
            });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":11}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {};

// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
var init = function init() {
	var cf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


	config = cf;

	equalise();

	window.addEventListener('resize', function () {
		equalise();
	});

	window.addEventListener('load', function () {
		equalise();
	});
};

var equalise = function equalise() {
	var els = document.querySelectorAll(".js-equal-heights");
	if (els.length) {
		if (typeof jQuery.fn.equalise !== "function") {
			if (typeof config.url === "undefined") {
				config.url = "/src/equalise/vendor/jquery.equalise.min.js";
			}

			_honeycombDocument2.default.load(config.url, function () {
				init();
			});
		} else {
			jQuery('.js-equal-heights').equalise({
				itemClass: 'js-equal-heights__item',
				groupAttr: 'js-equal-heights-group'
			});
		}
	}
};

exports.default = {
	init: init
};

},{"../../document/js/honeycomb.document.load-script":11}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Filter (Hide/Show) content on a page.
var init = function init() {

    // Get the filter.
    var $filter = $(".js-filter");

    // If there's no filter on the page then stop.
    if ($filter.length === 0) {
        return false;
    }

    // When the update button is clicked, update the filter.
    $filter.on("click", ".js-filter__update", function () {
        updateFilter.call(this);
    });

    // When any of the filter items are changed (selected/deselected), update
    // the filter.
    $filter.on("change", ".js-filter__item", function () {
        updateFilter.call(this);
    });

    // When the reset button is clicked, reset the filter.
    $filter.on("click", ".js-filter__reset", function () {
        resetFilter.call(this);
    });

    // Update the filter on init.
    updateFilter.call($filter.get(0).childNodes[0]);
};

// Update the filter.
var updateFilter = function updateFilter() {
    var $this = $(this);
    var $filter = $this.parents(".js-filter");
    var $items = $filter.find(".js-filter__item");
    var $content = $("[data-filter-content]");
    var enabledItems = [];
    var enabledContent = [];

    // Get the enabled items.
    $items.each(function () {
        var $this = $(this);
        if ($this.prop("checked")) {
            enabledItems.push($this.attr("data-filter-term"));
        }
    });

    // Show/Hide the relevant content.
    $content.each(function () {
        var $this = $(this);
        var terms = $this.attr("data-filter-content").trim().split(" ");
        var show = false;

        for (var i = 0; i < terms.length; i++) {
            if (enabledItems.indexOf(terms[i]) !== -1) {
                show = true;
            }
        }

        if (show) {
            enabledContent.push($this.get(0));
        }
    });

    $content.stop().animate({
        opacity: 0
    }, {
        duration: 250,
        complete: function complete() {
            $content.each(function () {
                var $this = $(this);
                var enabled = enabledContent.indexOf($this.get(0)) !== -1 ? true : false;

                if (enabled) {
                    $this.show();
                    $this.stop().animate({
                        opacity: 1
                    }, {
                        duration: 250
                    });
                } else {
                    $this.hide();
                }
            });
        }
    });
};

var resetFilter = function resetFilter() {
    var $this = $(this);
    var $filter = $this.parents(".js-filter");
    var $items = $filter.find(".js-filter__item");

    $items.prop("checked", true);

    updateFilter.call(this);
};

exports.default = {
    init: init
};

},{}],16:[function(require,module,exports){
'use strict';

var _honeycombAnalytics = require('./analytics/js/honeycomb.analytics.google');

var _honeycombAnalytics2 = _interopRequireDefault(_honeycombAnalytics);

var _honeycombAnalytics3 = require('./analytics/js/honeycomb.analytics.pingdom');

var _honeycombAnalytics4 = _interopRequireDefault(_honeycombAnalytics3);

var _honeycombAnimation = require('./animation/js/honeycomb.animation.fade');

var _honeycombAnimation2 = _interopRequireDefault(_honeycombAnimation);

var _honeycomb = require('./base/js/honeycomb.base');

var _honeycomb2 = require('./browser/js/honeycomb.browser');

var _honeycomb3 = _interopRequireDefault(_honeycomb2);

var _honeycomb4 = require('./carousel/js/honeycomb.carousel');

var _honeycomb5 = _interopRequireDefault(_honeycomb4);

var _honeycomb6 = require('./code/js/honeycomb.code');

var _honeycomb7 = _interopRequireDefault(_honeycomb6);

var _honeycomb8 = require('./confluence/js/honeycomb.confluence');

var _honeycomb9 = _interopRequireDefault(_honeycomb8);

var _honeycomb10 = require('./content/js/honeycomb.content');

var _honeycomb11 = _interopRequireDefault(_honeycomb10);

var _honeycomb12 = require('./cookie/js/honeycomb.cookie');

var _honeycomb13 = _interopRequireDefault(_honeycomb12);

var _honeycombDocument = require('./document/js/honeycomb.document.location');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

var _honeycombDocument3 = require('./document/js/honeycomb.document.viewport');

var _honeycombDocument4 = _interopRequireDefault(_honeycombDocument3);

var _honeycomb14 = require('./equalise/js/honeycomb.equalise');

var _honeycomb15 = _interopRequireDefault(_honeycomb14);

var _honeycomb16 = require('./filter/js/honeycomb.filter');

var _honeycomb17 = _interopRequireDefault(_honeycomb16);

var _honeycomb18 = require('./lightbox/js/honeycomb.lightbox');

var _honeycomb19 = _interopRequireDefault(_honeycomb18);

var _honeycombMaps = require('./maps/js/honeycomb.maps.google');

var _honeycombMaps2 = _interopRequireDefault(_honeycombMaps);

var _honeycombNavigation = require('./navigation/js/honeycomb.navigation.dropdown');

var _honeycombNavigation2 = _interopRequireDefault(_honeycombNavigation);

var _honeycombNavigation3 = require('./navigation/js/honeycomb.navigation.header');

var _honeycombNavigation4 = _interopRequireDefault(_honeycombNavigation3);

var _honeycombNotification = require('./notification/js/honeycomb.notification.block');

var _honeycombNotification2 = _interopRequireDefault(_honeycombNotification);

var _honeycombPolyfill = require('./polyfill/js/honeycomb.polyfill.index-of');

var _honeycombPolyfill2 = _interopRequireDefault(_honeycombPolyfill);

var _honeycomb20 = require('./reveal/js/honeycomb.reveal');

var _honeycomb21 = _interopRequireDefault(_honeycomb20);

var _honeycomb22 = require('./scroll/js/honeycomb.scroll');

var _honeycomb23 = _interopRequireDefault(_honeycomb22);

var _honeycomb24 = require('./sticky/js/honeycomb.sticky');

var _honeycomb25 = _interopRequireDefault(_honeycomb24);

var _honeycomb26 = require('./svg/js/honeycomb.svg');

var _honeycomb27 = _interopRequireDefault(_honeycomb26);

var _honeycomb28 = require('./tabs/js/honeycomb.tabs');

var _honeycomb29 = _interopRequireDefault(_honeycomb28);

var _honeycomb30 = require('./toggle/js/honeycomb.toggle');

var _honeycomb31 = _interopRequireDefault(_honeycomb30);

var _honeycomb32 = require('./video/js/honeycomb.video');

var _honeycomb33 = _interopRequireDefault(_honeycomb32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_honeycombAnalytics2.default.setAccountId('XX-AAA'); // Google analytics.

_honeycombAnalytics2.default.init();

// Pingdom.

_honeycombAnalytics4.default.init();

// Animation.

_honeycombAnimation2.default.init();

// Base.

window.breakpoints = _honeycomb.breakpoints;

// Browser.

_honeycomb3.default.init();

// Carousel.

window.addEventListener("load", function () {
    _honeycomb5.default.init();
});

// Code

_honeycomb7.default.init();

// Confluence.

_honeycomb9.default.init();

// Content.

window.addEventListener("load", function () {
    _honeycomb11.default.init();
});

// Cookie


// Document.

_honeycombDocument4.default.init();

// Equalise.

_honeycomb15.default.init();

// Filter.

_honeycomb17.default.init();

// Lightbox.

_honeycomb19.default.init();

// Google map.

window.initMap = _honeycombMaps2.default.initialiseMap;
_honeycombMaps2.default.init({
    callback: 'window.initMap'
});

// Navigation

_honeycombNavigation2.default.init();

_honeycombNavigation4.default.init();

// Notification

_honeycombNotification2.default.init();

// Polyfills.

(0, _honeycombPolyfill2.default)();

// Reveal.

_honeycomb21.default.init();

// Scroll.

_honeycomb23.default.init();

// Sticky.

_honeycomb25.default.init();

// SVG.

_honeycomb27.default.init();

// Tabs.

_honeycomb29.default.init();

// Toggle.

_honeycomb31.default.init();

// Video.

_honeycomb33.default.init({
    analytics: _honeycombAnalytics2.default
});

},{"./analytics/js/honeycomb.analytics.google":1,"./analytics/js/honeycomb.analytics.pingdom":2,"./animation/js/honeycomb.animation.fade":3,"./base/js/honeycomb.base":4,"./browser/js/honeycomb.browser":5,"./carousel/js/honeycomb.carousel":6,"./code/js/honeycomb.code":7,"./confluence/js/honeycomb.confluence":8,"./content/js/honeycomb.content":9,"./cookie/js/honeycomb.cookie":10,"./document/js/honeycomb.document.location":12,"./document/js/honeycomb.document.viewport":13,"./equalise/js/honeycomb.equalise":14,"./filter/js/honeycomb.filter":15,"./lightbox/js/honeycomb.lightbox":17,"./maps/js/honeycomb.maps.google":18,"./navigation/js/honeycomb.navigation.dropdown":19,"./navigation/js/honeycomb.navigation.header":20,"./notification/js/honeycomb.notification.block":21,"./polyfill/js/honeycomb.polyfill.index-of":22,"./reveal/js/honeycomb.reveal":23,"./scroll/js/honeycomb.scroll":24,"./sticky/js/honeycomb.sticky":25,"./svg/js/honeycomb.svg":26,"./tabs/js/honeycomb.tabs":27,"./toggle/js/honeycomb.toggle":28,"./video/js/honeycomb.video":29}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require("../../document/js/honeycomb.document.load-script");

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var els = document.querySelectorAll(".js-lightbox", ".js-lightbox--video", ".js-lightbox--iframe", ".js-lightbox--image", ".js-lightbox--inline", ".js-lightbox--ajax", ".js-lightbox--swf", ".js-lightbox--html");
    if (els.length) {
        if (typeof jQuery.fancybox === "undefined") {
            if (typeof config.url === "undefined") {
                config.url = "/src/lightbox/vendor/jquery.fancybox.pack.js";
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {

            // Use BEM style modifiers to set type of content for lightbox.
            jQuery('.js-lightbox').fancybox();
            jQuery('.js-lightbox--video, .js-lightbox--iframe').fancybox({ type: 'iframe' });
            jQuery('.js-lightbox--image').fancybox({ type: 'image' });
            jQuery('.js-lightbox--inline').fancybox({ type: 'inline' });
            jQuery('.js-lightbox--ajax').fancybox({ type: 'ajax' });
            jQuery('.js-lightbox--swf').fancybox({ type: 'swf' });
            jQuery('.js-lightbox--html').fancybox({ type: 'html' });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":11}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var $maps = void 0;

var init = function init(options) {
    $maps = $('.js-google-map');

    if ($maps.length > 0) {
        var s = document.getElementsByTagName('script')[0];
        var se = document.createElement('script');
        var done = false;

        se.type = 'text/javascript';
        se.src = '//maps.googleapis.com/maps/api/js?libraries=places&sensor=false&callback=' + options.callback;
        s.parentNode.insertBefore(se, s);
    }
};

var initialiseMap = function initialiseMap() {
    $maps.each(function () {
        var $this = $(this);
        var config = getConfig($this);
        var map = void 0;

        if (!config.streetView) {

            // Normal map type.
            map = new google.maps.Map(this, {
                center: new google.maps.LatLng(config.lat, config.long),
                zoom: config.zoom,
                mapTypeId: config.mapTypeId,
                disableDefaultUI: config.disableDefaultUI,
                scrollwheel: config.scrollwheel,
                draggable: config.draggable
            });

            if (config.place) {
                var request = {
                    location: map.getCenter(),
                    radius: '1000',
                    query: config.place
                };

                var placesService = new google.maps.places.PlacesService(map);
                placesService.textSearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        (function () {
                            var result = results[0];

                            var marker = new google.maps.Marker({
                                map: map,
                                position: result.geometry.location
                            });

                            var content = '<h1 class="delta spaced-bottom--tight">' + result.name + '</h1>' + '<p>' + result.formatted_address.replace(/,/gi, ',<br/>') + '</p>';

                            var infoWindow = new google.maps.InfoWindow({
                                content: content
                            });

                            google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.open(map, marker);
                            });

                            infoWindow.open(map, marker);
                        })();
                    }
                });
            }
        } else {

            // Street view
            map = new google.maps.StreetViewPanorama(this, {
                position: new google.maps.LatLng(config.lat, config.long),
                pov: {
                    heading: 0,
                    pitch: 0
                },
                zoom: 1,
                disableDefaultUI: config.disableDefaultUI,
                scrollwheel: config.scrollwheel
            });
            map.setVisible(true);
        }
    });
};

var getConfig = function getConfig($map) {

    // Look at the elements data attributes to get configs and return in object.
    var config = {};
    config.lat = $map.attr('data-google-map-lat') || 0;
    config.long = $map.attr('data-google-map-long') || 0;
    config.zoom = parseInt($map.attr('data-google-map-zoom'), 10) || 10;
    config.mapTypeId = google.maps.MapTypeId.ROADMAP;
    config.disableDefaultUI = $map.attr('data-google-map-disable-ui') === 'true' ? true : false;
    config.scrollwheel = $map.attr('data-google-map-scrollwheel') === 'false' ? false : true;
    config.draggable = $map.attr('data-google-map-draggable') === 'false' ? false : true;
    config.place = $map.attr('data-google-map-place') || false;
    config.streetView = $map.attr('data-google-map-street-view') || false;

    return config;
};

exports.default = {
    init: init,
    initialiseMap: initialiseMap
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var selector = '.js-dropdown';
var classNameOpen = 'open';
var classNameClosed = 'closed';

var init = function init() {
    addArrows();
    handle();
};

var addArrows = function addArrows() {
    var $lis = $(selector).find('li');
    $lis.each(function () {
        var $this = $(this);
        if ($this.find('ul').length > 0 && $this.attr('data-arrow-added') !== 'true') {
            var $a = $('<a/>').attr('href', '#toggle').addClass('arrow');
            $this.addClass('dropdown ' + classNameClosed);
            $this.attr('data-arrow-added', 'true');
            $a.appendTo($this);
        }
    });
};

var handle = function handle() {
    var $body = $('body');
    $body.on('click', '.js-dropdown .arrow', function (e) {
        var $this = $(this);
        var $dropdown = $this.parent();

        e.preventDefault();
        if ($dropdown.hasClass(classNameOpen)) {
            $dropdown.removeClass(classNameOpen).addClass(classNameClosed);
        } else {
            $dropdown.addClass(classNameOpen).removeClass(classNameClosed);
        }
    });
};

exports.default = {
    init: init,
    addArrows: addArrows
};

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    var $body = $("body");

    $body.on("click", ".header--primary__menu-button", function (e) {
        var $this = $(this);

        e.preventDefault();
        if ($body.hasClass("mobile-nav--open")) {

            // Hide
            $body.removeClass("mobile-nav--open");
        } else {

            // Open
            $body.addClass("mobile-nav--open");
        }
    });

    // When an item that has a submenu is clicked toggle the menu, rather than
    // follow the link.
    $body.on("click", ".header--primary__menu--mobile .dropdown > a", function (e) {
        if (this.getAttribute("href") !== "#toggle") {
            e.preventDefault();

            var $toggle = $(this).siblings("a[ href=\"#toggle\" ]");
            if ($toggle) {
                $toggle.trigger("click");
            }
        }
    });
};

exports.default = {
    init: init
};

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Click handler for close buttons on statically built notifications.
var init = function init() {
    $('body').on('click', '.notification--block .notification__close', function (e) {
        e.preventDefault();
        $(this).parent().parent().slideUp({
            complete: function complete() {
                $(this).remove();
            }
        });
    });
};

/*
 * Notification block element
 * Usage: new Honeycomb.Notification.Block({type: 'info', 'content': 'My notification content goes here';});
 */
var notification = function notification(options) {

    var self = this;

    // User specified options.
    this.options = options;

    // Default settings.
    this.defaults = {
        type: 'info',
        icon: {
            type: false, // Could be either 'font' or 'image'.
            src: false // Reference to the icon.
        },
        content: '',
        duration: false,
        container: $('body')
    };

    // Customised settings.
    this.settings = {};

    // Show time.
    this.init = function init() {

        // Generate the settings array (Merging default settings and user options).
        $.extend(true, self.settings, self.defaults, self.options);

        // Build the notification.
        self.buildNotification();

        // Show the notification.
        self.show();

        // Add the close click handler.
        self.notification.on('click', '.notification__close', function (e) {
            e.preventDefault();
            self.close();
        });
    };

    // Show the notification.
    this.show = function show() {

        // Hide the notification.
        self.notification.hide();

        // Display the notification.
        self.settings.container.prepend(self.notification);

        // Slide the notification down.
        self.notification.slideDown();

        if (self.settings.duration) {
            self.timeoutId = window.setTimeout(function () {
                self.close.call(self);
            }, self.settings.duration);
        }
    };

    // Build the notification HTML.
    this.buildNotification = function buildNotification() {
        var notificationStr = '<div class="notification notification--block notification--' + self.settings.type + '">' + '<div class="notification--block__inner-container">' + '<figure class="notification__icon">';

        if (self.settings.icon.type) {
            if (self.settings.icon.type === 'font') {

                // Icon font
                notificationStr += '<span class="icon icon--' + self.settings.icon.src + '"></span>';
            } else if (self.settings.icon.type === 'image') {

                // Image
                notificationStr += '<img src="' + self.settings.icon.src + '" alt=""/>';
            }
        } else {
            notificationStr += '<span class="icon icon--' + self.settings.type + '"></span>';
        }

        notificationStr += '</figure>' + '<a class="notification__close" href="#">X</a>' + '<div class="notification__body">' + '<p>' + this.settings.content + '</p>' + '</div>' + '</div>' + '</div>' + '</div>';

        self.notification = $(notificationStr);
    };

    // Close the notification.
    this.close = function close() {

        // Slide up the notification, then remove it from the DOM.
        self.notification.slideUp({
            complete: function complete() {
                this.remove();
            }
        });

        if (self.settings.duration) {

            // Clear the timeout.
            window.clearTimeout(self.timeoutId);
        }
    };

    // Kick off.
    self.init();
};

exports.default = {
    init: init,
    block: notification
};

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Polyfill for the array indexOf command.
var indexOf = function indexOf() {
    if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf = function (find, i /*opt*/) {
            if (i === undefined) i = 0;
            if (i < 0) i += this.length;
            if (i < 0) i = 0;
            for (var n = this.length; i < n; i++) {
                if (i in this && this[i] === find) {
                    return i;
                }
            }
            return -1;
        };
    }
};

exports.default = indexOf;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Reveal - Hide/Show content.
var init = function init() {
    $('.js-reveal').each(function () {
        var $this = $(this);
        var buttonTextOpen = $this.attr('data-reveal-buttonOpen') || 'Open';
        var $button = $('<a/>').attr('href', '#' + this.id).addClass('reveal-cta').html(buttonTextOpen);

        $this.slideUp(0);
    });

    $('.js-reveal-cta').each(function () {

        // Setup cta's.
        var $button = $(this);
        $button.attr('data-reveal-cta-open-html', $button.html());
    }).on('click', function (e) {

        // On click, call toggle.
        e.preventDefault();

        var that = this;
        var $button = $(this);
        var hash = $button.attr('href');
        var $content = $(hash);
        var group = $button.attr('data-reveal-group') || false;

        if (!$content.is(':visible')) {

            // Open content.
            if (group) {

                // In a group. Close all group content first.
                var $groupButtons = $('.js-reveal-cta[data-reveal-group=\"' + group + '\"]');
                var closed = 0;

                for (var i = 0; i < $groupButtons.length; i++) {
                    var groupButton = $groupButtons[i];
                    var $groupContent = $($(groupButton).attr('href'));

                    // If the content is visible (should only be 1), then close and open.
                    if ($groupContent.is(':visible')) {
                        close(groupButton, function () {
                            open(that);
                        });
                    } else {

                        // Content's not visible, so just increase the counter for the check later.
                        closed++;
                    }
                }

                // No revealed content is open, so go ahead and open.
                if (closed === $groupButtons.length) {
                    open(that);
                }
            } else {

                // Not in a group.
                open(this);
            }
        } else {

            // Close content.
            close(this);
        }
    });
};

var open = function open(button, callback) {
    var $button = $(button);
    var hash = $button.attr('href');
    var $content = $(hash);

    if ($content.is('.js-reveal')) {
        (function () {
            var $buttons = $('.js-reveal-cta[href=\"' + hash + '\"]');

            $content.slideDown({
                duration: 250,
                complete: function complete() {

                    $content.addClass('js-reveal-open');
                    $buttons.addClass('close');

                    // Update buttons.
                    $buttons.each(function () {
                        var $button = $(this);
                        if ($button.attr('data-reveal-cta-close-html')) {
                            $button.html($button.attr('data-reveal-cta-close-html'));
                        }
                    });

                    // Callback
                    if (typeof callback === 'function') {
                        callback.call(undefined);
                    }
                }
            });
        })();
    }
};

var close = function close(button, callback) {
    var $button = $(button);
    var hash = $button.attr('href');
    var $content = $(hash);

    if ($content.is('.js-reveal')) {
        (function () {
            var $buttons = $('.js-reveal-cta[href=\"' + hash + '\"]');

            $content.slideUp({
                duration: 250,
                complete: function complete() {

                    $content.removeClass('js-reveal-open');
                    $buttons.removeClass('close');

                    // Update buttons.
                    $buttons.each(function () {
                        var $button = $(this);
                        if ($button.attr('data-reveal-cta-open-html')) {
                            $button.html($button.attr('data-reveal-cta-open-html'));
                        }
                    });

                    // Callback
                    if (typeof callback === 'function') {
                        callback.call(undefined);
                    }
                }
            });
        })();
    }
};

var toggle = function toggle(button, callback) {
    var $content = $($(button).attr('href'));
    var visible = $content.is(':visible');

    if (visible) {
        close(button, callback);
    } else {
        open(button, callback);
    }
};

exports.default = {
    init: init,
    toggle: toggle,
    open: open,
    close: close
};

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// scrollTo - Scroll to an area on the page.
var init = function init() {
    $('a.js-scroll-to').on('click', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var offset = parseInt($this.attr('data-scroll-to-offset') || 0);
        var focus = $this.attr('data-scroll-to-focus') || false;
        var hash = isHashOnThisPage(href);

        if (hash) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(hash).offset().top + offset
            }, 500, function () {
                if (focus) {
                    $('#' + focus).focus();
                }
            });
        }
    });
};

var isHashOnThisPage = function isHashOnThisPage(href) {
    var a = document.createElement('a');
    a.href = href;

    var hash = a.hash;

    // IE doesn't include the starting / on the pathname.
    var pathname = a.pathname.charAt(0) === '/' ? a.pathname : '/' + a.pathname;

    // If Href doesn't have a path, just a hash, then reset pathname.
    if (pathname === '/') {
        pathname = window.location.pathname;
    }

    if (window.location.pathname === pathname) {
        return hash;
    }

    return false;
};

exports.default = {
    init: init
};

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require("../../document/js/honeycomb.document.load-script");

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)
var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var els = document.querySelectorAll(".js-sticky");
    if (els.length) {
        if (typeof jQuery.fn.sticky === "undefined") {
            if (typeof config.url === "undefined") {
                config.url = "/src/sticky/vendor/jquery.sticky.min.js";
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            jQuery(".js-sticky").each(function () {
                var $this = jQuery(this);
                var offset = $this.attr("data-sticky-offset") === "auto" ? "auto" : parseInt($this.attr("data-sticky-offset"), 10) || "auto";

                $this.sticky({
                    offset: offset,
                    sticky: function sticky() {
                        $this.addClass("sticking");
                    },
                    docked: function docked() {
                        $this.removeClass("sticking");
                    },
                    navActiveClass: "active"
                });
            });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":11}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    var imgs = document.querySelectorAll('img.js-svg');

    var _loop = function _loop(i) {
        var img = imgs[i];
        var src = img.getAttribute('src').replace(/(.png)|(.gif)/, '.svg');
        var newImage = new Image();

        newImage.src = src;
        newImage.onload = function () {
            img.setAttribute('src', src);
        };
    };

    for (var i = 0; i < imgs.length; i++) {
        _loop(i);
    }
};

exports.default = {
    init: init
};

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycomb = require("../../browser/js/honeycomb.browser");

var _honeycomb2 = _interopRequireDefault(_honeycomb);

var _honeycombDocument = require("../../document/js/honeycomb.document.load-script");

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // If IE7, bail!
    if (_honeycomb2.default.isIE7()) {
        return false;
    }

    var tabbed = document.querySelectorAll(".js-tabbed");
    if (tabbed.length) {

        if (typeof jQuery.fn.tabs === "undefined") {
            if (typeof config.url === "undefined") {
                config.url = "/src/tabs/vendor/jquery.tabs.min.js";
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {

                for (var _iterator = tabbed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tab = _step.value;

                    var options = {
                        pagination: false,
                        template: {
                            container: {
                                atts: {},
                                classes: ["tabbed__container"]
                            },
                            tab: {
                                container: {
                                    classes: ["js-tab"]
                                }
                            },
                            pagination: {
                                container: {
                                    atts: {
                                        "data-ui-component": "nav--tabs-pagination"
                                    },
                                    classes: ["pagination"]
                                },
                                links: {
                                    prev: {
                                        atts: {},
                                        classes: ["pagination__prev"],
                                        preHtml: "",
                                        postHtml: ""
                                    },
                                    next: {
                                        atts: {},
                                        classes: ["pagination__next"],
                                        preHtml: "",
                                        postHtml: ""
                                    }
                                }
                            }
                        }
                    };

                    // Scroll animation
                    var scrollTo = tab.getAttribute("data-tabs-scroll-to");
                    if (scrollTo) {
                        options.scrollTo = scrollTo === "true";
                    }

                    // Scroll animation offset
                    var scrollToOffset = tab.getAttribute("data-tabs-scroll-to-offset");
                    if (scrollToOffset) {
                        options.scrollToOffset = scrollToOffset;
                    }

                    // Pagination
                    var pagination = tab.getAttribute("data-tabs-pagination");
                    if (pagination) {
                        options.pagination = pagination === "true";
                    }

                    // Reload ajax requests
                    var reloadAjax = tab.getAttribute("data-tabs-reload-ajax");
                    if (reloadAjax) {
                        options.reloadAjax = reloadAjax === "true";
                    }

                    // Apply tabs plugin.
                    var $tabs = $(tab).tabs(options);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }
};

exports.default = {
    init: init
};

},{"../../browser/js/honeycomb.browser":5,"../../document/js/honeycomb.document.load-script":11}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var hook = ".js-toggle";

var activeClass = "active";

var init = function init() {
    var toggles = document.querySelectorAll(hook);
    if (toggles.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = toggles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var tog = _step.value;


                // Hide the toggle items.
                var items = tog.querySelectorAll(hook + "-item");
                for (var i = 0; i < items.length; i++) {
                    items[i].style.display = "none";
                }

                // Show the first item.
                items[0].style.display = "block";

                // Add active state to the first nav item.
                var as = tog.querySelectorAll(hook + "-nav a");
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = as[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var a = _step2.value;

                        a.classList.remove(activeClass);

                        // Add toggle handler.
                        a.addEventListener("click", function (e) {
                            e.preventDefault();
                            toggle(e.target.getAttribute("href"));
                        });
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                as[0].classList.add(activeClass);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
};

var toggle = function toggle(target) {

    // Find the toggle.
    target = target.startsWith("#") ? target.substr(1) : target;
    var toggleItem = document.getElementById(target);
    var toggle = toggleItem.parentNode;
    while (!toggle.classList.contains(hook.substr(1))) {
        toggle = toggle.parentNode;
    }

    // Hide all the items.
    var items = toggle.querySelectorAll(hook + "-item");
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            item.style.display = "none";
        }

        // Show the selected item.
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    toggleItem.style.display = "block";

    // Update the active state.
    var links = toggle.querySelectorAll(hook + "-nav a");
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = links[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var link = _step4.value;

            link.classList.remove(activeClass);

            if (link.getAttribute("href") === "#" + target) {
                link.classList.add(activeClass);
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
};

exports.default = {
    init: init
};

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Default options for video playback.
var options = {
    autohide: 1,
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    loop: 0
};

var videos = {};

var analytics = void 0;

var init = function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    analytics = options.analytics || false;
    loadYouTubeIframeAPI();
};

var loadYouTubeIframeAPI = function loadYouTubeIframeAPI() {
    var videoContainer = document.querySelectorAll(".js-video-container");
    if (videoContainer.length > 0) {
        var tag = document.createElement("script");
        var firstScriptTag = document.getElementsByTagName("script")[0];

        tag.src = "https://www.youtube.com/iframe_api";
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
};

// calculate second values for 10%, 20% etc. for event tracking
var calculatePercentages = function calculatePercentages(duration) {
    var percentage = void 0;
    var percentages = {};
    for (var i = 1; i < 10; i++) {
        percentage = i * 10 + "%";
        percentages[percentage] = duration * (i / 10);
    }
    return percentages;
};

var trackVideoEvent = function trackVideoEvent(event, videoId, value) {
    if (analytics) {
        analytics.trackEvent("Video", videoId + " - " + document.location.pathname, value);
    }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
var trackGoal = function trackGoal(event, videoId) {
    trackVideoEvent(event, videoId, "goal");
    return true;
};

var addInlineVideos = function addInlineVideos() {
    var videoCounter = 0;
    var videoContainers = document.querySelectorAll(".js-video-container");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var videoContainer = _step.value;

            var videoId = videoContainer.getAttribute('data-video-id');
            var duration = void 0;
            var currentTime = void 0;
            var percentages = void 0;
            var goalTracked = false;

            if (videoId) {

                // Append empty div which will get replaced by video.
                var videoDiv = document.createElement("div");
                videoDiv.setAttribute("id", videoId + "-" + videoCounter);
                videoContainer.appendChild(videoDiv);

                // Get the options (data attributes)
                var _options = getOptions(videoContainer);

                // Replace the empty div with the video player iframe.
                videos[videoId + "-" + videoCounter] = new YT.Player(videoId + "-" + videoCounter, {
                    width: 640,
                    height: 360,
                    videoId: videoId,
                    playerVars: {
                        rel: 0,
                        autohide: _options.autohide,
                        autoplay: _options.autoplay,
                        controls: _options.controls,
                        showinfo: _options.showinfo,
                        loop: _options.loop,
                        enablejsapi: 1
                    },
                    events: {
                        onStateChange: function onStateChange(event) {

                            // Reset the video ID.
                            videoId = event.target.getVideoData().video_id;

                            if (event.data === YT.PlayerState.PLAYING) {

                                // Video playing.
                                var iframe = event.target.getIframe();

                                duration = duration || event.target.getDuration();
                                percentages = percentages || calculatePercentages(duration);

                                if (!iframe.hasAttribute("data-ga-tracked") && analytics) {
                                    var container = iframe.parentElement;

                                    if (container.hasAttribute("data-ga-track")) {

                                        // Track the video in GA (Google Analytics).
                                        var category = container.getAttribute("data-ga-track-category") || null;
                                        var action = container.getAttribute("data-ga-track-action") || null;
                                        var label = container.getAttribute("data-ga-track-label") || null;
                                        var value = container.getAttribute("data-ga-track-value") || null;

                                        // Call the tracking event.
                                        analytics.trackEvent(category, action, label, value);
                                    }

                                    // Add a tracked data attribute to prevent from tracking multiple times.
                                    iframe.setAttribute("data-ga-tracked", true);

                                    trackVideoEvent(event, videoId, "0%");
                                }
                            }

                            if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                                currentTime = event.target.getCurrentTime();

                                // check goal conditions
                                if (!goalTracked) {
                                    if (currentTime > percentages["20%"] && percentages["20%"] > 30) {
                                        goalTracked = trackGoal(event, videoId);
                                    } else if (currentTime > 30 && percentages["20%"] < 30) {
                                        goalTracked = trackGoal(event, videoId);
                                    }
                                }

                                // check what percentages the playhead has passed
                                for (var i in percentages) {
                                    if (currentTime > percentages[i]) {
                                        trackVideoEvent(event, videoId, i);
                                        delete percentages[i];
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Increase the counter.
            videoCounter++;
        };

        for (var _iterator = videoContainers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

var getOptions = function getOptions(video) {

    // Copy the defaults.
    // let options = jQuery.extend({}, Honeycomb.Video.options);
    var options = Object.assign({}, options);

    // Autohide.
    if (video.hasAttribute("data-video-auto-hide")) {
        options.autohide = video.getAttribute("data-video-auto-hide");
    }

    // Autoplay.
    if (video.hasAttribute("data-video-auto-play")) {
        options.autoplay = video.getAttribute("data-video-auto-play");
    }

    // Controls.
    if (video.hasAttribute("data-video-controls")) {
        options.controls = video.getAttribute("data-video-controls");
    }

    // Show info.
    if (video.hasAttribute("data-video-show-info")) {
        options.showinfo = video.getAttribute("data-video-show-info");
    }

    // Loop.
    if (video.hasAttribute("data-video-loop")) {
        options.loop = video.getAttribute("data-video-loop");
    }

    // Return the options object.
    return options;
};

// Add the video when the iframe API library has loaded.
window.onYouTubeIframeAPIReady = function () {
    addInlineVideos();
};

exports.default = {
    init: init,
    options: options,
    addInlineVideos: addInlineVideos,
    videos: videos
};

},{}]},{},[16]);
