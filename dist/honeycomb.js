(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var accountId = void 0;
var sites = void 0;

var init = function init() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    // If the account ID is not set, then don't carry on.
    if (!accountId || accountId === 'UA-XXX') {
        window.console.warn('Honeycomb: Google Analytics account ID is not set, therefore the Google Analytics script will not be loaded.');
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
    window.GoogleAnalyticsObject = 'ga';
    window.ga = window.ga || function () {
        (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = 1 * new Date();

    var script = document.createElement('script');
    script.async = 1;
    script.src = '//www.google-analytics.com/analytics.js';

    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
};

// Initialise the account, with the account ID.
var initAccount = function initAccount(accountId) {
    if (!accountId || accountId === 'UA-XXX') {
        return false;
    }

    if (sites) {
        window.ga('create', accountId, 'auto', { 'allowLinker': true });
        window.ga('require', 'linker');
        window.ga('linker:autoLink', sites);
    } else {
        window.ga('create', accountId, 'auto');
    }
};

// Track a page view.
var trackPageView = function trackPageView() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (url) {
        window.ga('send', 'pageview', {
            'page': url
        });
    } else {
        window.ga('send', 'pageview');
    }
};

// Track an event.
var trackEvent = function trackEvent() {
    var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    window.ga('send', 'event', category, action, label, value);
};

// Set a custom variable.
var setCustomVariable = function setCustomVariable(index, name, value) {
    var options = {};
    options['dimension' + index] = value;
    window.ga('send', 'pageview', options);
};

// Track youtube video views.
var trackYouTubeViews = function trackYouTubeViews() {
    var els = document.querySelectorAll('.lightbox--video');
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener('click', function (e) {
            var videoId = e.target.href.replace(/http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '');
            trackEvent('Video', window.location.pathname, videoId);
        });
    }
};

// Click track (helper for instead of onclick="ga(send...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
var setupTrackingAlias = function setupTrackingAlias() {
    var els = document.querySelectorAll('[data-ga-track]');
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener('click', function (e) {
            var target = e.target;
            var category = target.getAttribute('data-ga-track-category') || null;
            var action = target.getAttribute('data-ga-track-action') || null;
            var label = target.getAttribute('data-ga-track-label') || null;
            var value = target.getAttribute('data-ga-track-value') || null;

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
var interval = 9000;
var fadeOutDuration = 1000;
var fadeInDuration = 2000;

var init = function init() {
    if (typeof $ === 'undefined') return;

    window.jQuery('.js-animate--fade').each(function () {
        var $this = window.jQuery(this);
        if ($this.find('.js-animate--fade__item').length > 1) {
            $this.find('.js-animate--fade__item').wrapAll('<div class=\"js-animate--fade__container\"/>');
            $this.find('.js-animate--fade__item').hide().first().show();
            setInterval(step, interval);
        }
    });
};

var step = function step() {
    window.jQuery('.js-animate--fade').each(function () {
        var $band = window.jQuery(this);
        var $current = $band.find('.js-animate--fade__item:visible');
        var $next = $current.next('.js-animate--fade__item').length !== 0 ? $current.next('.js-animate--fade__item') : $band.find('.js-animate--fade__item').first();

        $next.css('position', 'relative');
        $current.css('position', 'absolute').css('bottom', '0').fadeOut({
            duration: fadeOutDuration
        });
        $next.fadeIn({
            duration: fadeInDuration
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
    'breakpoint': 'large',
    'width': 9999
}, {
    'breakpoint': 'medium',
    'width': 768
}, {
    'breakpoint': 'small',
    'width': 480
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

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var rearrangeNav = function rearrangeNav(carousel) {
    // selectors
    var nav = carousel.querySelector('ul');
    var leftButton = carousel.querySelector('.slick-prev');
    var rightButton = carousel.querySelector('.slick-next');

    // If pagination (nav)
    if (nav && leftButton && rightButton) {

        // Give the pagination a class so can style.
        nav.className = nav.className + ' carousel-has-pagination';

        // move buttons inside <ul>
        nav.appendChild(rightButton);
        nav.appendChild(leftButton);

        // reposition buttons
        rightButton.style.transform = 'translate(0px, 0px)';

        // the left button can't be the first element in the <ul>, otherwise it messes up the navigation, which counts <ul> child elements to map the slides to the links - adding a new first-child pushes the links off by one
        // so we need to add it to the end of the list, and translate its position by working out the width of the nav, plus the width of the arrow
        var navWidth = (carousel.querySelectorAll('ul li').length - 1) * 30 + 130;
        leftButton.style.transform = 'translate(-' + navWidth + 'px, 0px)';
    } else if (!nav && leftButton && rightButton) {

        // No pagination dots (nav)
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'carousel__button-container';
        buttonContainer.appendChild(leftButton);
        buttonContainer.appendChild(rightButton);
        carousel.appendChild(buttonContainer);
    }
};

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // If no jQuery then break;
    if (typeof jQuery === 'undefined') {
        return;
    }

    var carousels = document.querySelectorAll('.js-carousel');

    if (carousels.length) {
        if (typeof window.jQuery.fn.slick !== 'function') {
            if (typeof config.url === 'undefined') {
                config.url = 'carousel/vendor/slick/slick.min.js';
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
                if (carousel.getAttribute('data-carousel-pagination') && carousel.getAttribute('data-carousel-pagination') === 'false') {
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
                window.jQuery(carousel).on('init', function () {
                    rearrangeNav(carousel);
                });

                window.jQuery(carousel).slick(options);

                window.jQuery(carousel).css('visibility', 'inherit').css('height', 'auto');
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

},{"../../document/js/honeycomb.document.load-script":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var vendorUrl = 'https://alexgorbatchev.com/pub/sh/current/';
var scriptsDir = 'scripts/';
var cssDir = 'styles/';

var scripts = [vendorUrl + scriptsDir + 'shCore.js'];

var styles = [cssDir + 'shThemeDefault.css'];

var samples = [];

var brushes = [['applescript', 'shBrushAppleScript.js'], ['actionscript3', 'as3', 'shBrushAS3.js'], ['bash', 'shell', 'shBrushBash.js'], ['coldfusion', 'cf', 'shBrushColdFusion.js'], ['cpp', 'c', 'shBrushCpp.js'], ['c#', 'c-sharp', 'csharp', 'shBrushCSharp.js'], ['css', 'shBrushCss.js'], ['delphi', 'pascal', 'shBrushDelphi.js'], ['diff', 'patch', 'pas', 'shBrushDiff.js'], ['erl', 'erlang', 'shBrushErlang.js'], ['groovy', 'shBrushGroovy.js'], ['java', 'shBrushJava.js'], ['jfx', 'javafx', 'shBrushJavaFX.js'], ['js', 'jscript', 'javascript', 'shBrushJScript.js'], ['perl', 'pl', 'shBrushPerl.js'], ['php', 'shBrushPhp.js'], ['text', 'plain', 'shBrushPlain.js'], ['py', 'python', 'shBrushPython.js'], ['powershell', 'ps', 'posh', 'shBrushPowerShell.js'], ['ruby', 'rails', 'ror', 'rb', 'shBrushRuby.js'], ['sass', 'scss', 'shBrushSass.js'], ['scala', 'shBrushScala.js'], ['sql', 'shBrushSql.js'], ['vb', 'vbnet', 'shBrushVb.js'], ['xml', 'xhtml', 'xslt', 'html', 'shBrushXml.js']];

var isCodeSample = function isCodeSample(sample) {
    var search = 'brush:';
    if (sample.className.match(search)) {
        return true;
    }

    return false;
};

var loadStylesheet = function loadStylesheet(sheet) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = vendorUrl + sheet;
    head.appendChild(link);
};

var loadScript = function loadScript(src) {
    var scriptNodes = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
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
    var pres = document.getElementsByTagName('pre');
    var scripts = document.getElementsByTagName('script');
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
    if (typeof window.SyntaxHighlighter !== 'undefined') {
        window.SyntaxHighlighter.defaults.toolbar = false;
        window.SyntaxHighlighter.defaults.gutter = false;
        window.SyntaxHighlighter.defaults['quick-code'] = false;
        window.SyntaxHighlighter.highlight();
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
var updateEls = false;

var init = function init() {

    var els = document.querySelectorAll('.js-update-content');
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

                    if (!el.hasAttribute('data-content-' + bp.breakpoint)) {
                        el.setAttribute('data-content-' + bp.breakpoint, el.innerHTML);
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
                            if (_el.hasAttribute('data-content-' + _bp.breakpoint)) {
                                content = _el.getAttribute('data-content-' + _bp.breakpoint);
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

window.addEventListener('resize', function () {
    update();
});

exports.default = {
    init: init
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var load = function load() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (url !== false) {
        var se = document.createElement('script');
        var honeycombPath = window.Honeycomb && window.Honeycomb.path ? window.Honeycomb.path : '';
        se.type = 'text/javascript';
        se.src = honeycombPath + url;

        var done = false;

        // When the script has loaded, apply the callback.
        se.onload = se.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;

                if (typeof callback === 'function') {
                    callback.apply();
                }
            }
        };

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(se, s);
    }
};

exports.default = {
    load: load
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)
var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var vps = document.querySelectorAll('.js-vp');
    if (vps.length) {
        if (typeof window.jQuery.fn.inViewport !== 'function') {
            if (typeof config.url === 'undefined') {
                config.url = 'document/vendor/jquery.inViewport.min.js';
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            window.jQuery('.js-vp').inViewport(function () {
                window.jQuery(this).removeClass('vp-out').addClass('vp-in');
            }, function () {
                window.jQuery(this).addClass('vp-out');
                // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
            });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

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
    var els = document.querySelectorAll('.js-equal-heights');
    if (els.length) {
        if (typeof window.jQuery.fn.equalise !== 'function') {
            if (typeof config.url === 'undefined') {
                config.url = 'equalise/vendor/jquery.equalise.min.js';
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            window.jQuery('.js-equal-heights').equalise({
                itemClass: 'js-equal-heights__item',
                groupAttr: 'js-equal-heights-group'
            });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":9}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Filter (Hide/Show) content on a page.
var init = function init() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so filter functionality won\'t work as expected');
        return;
    }

    // Get the filter.
    var $filter = window.jQuery('.js-filter');

    // If there's no filter on the page then stop.
    if ($filter.length === 0) {
        return false;
    }

    // When the update button is clicked, update the filter.
    $filter.on('click", ".js-filter__update', function () {
        updateFilter.call(this);
    });

    // When any of the filter items are changed (selected/deselected), update
    // the filter.
    $filter.on('change', '.js-filter__item', function () {
        updateFilter.call(this);
    });

    // When the reset button is clicked, reset the filter.
    $filter.on('click', '.js-filter__reset', function () {
        resetFilter.call(this);
    });

    // Update the filter on init.
    updateFilter.call($filter.get(0).childNodes[0]);
};

// Update the filter.
var updateFilter = function updateFilter() {
    var $this = window.jQuery(this);
    var $filter = $this.parents('.js-filter');
    var $items = $filter.find('.js-filter__item');
    var $content = window.jQuery('[data-filter-content]');
    var enabledItems = [];
    var enabledContent = [];

    // Get the enabled items.
    $items.each(function () {
        var $this = window.jQuery(this);
        if ($this.prop('checked')) {
            enabledItems.push($this.attr('data-filter-term'));
        }
    });

    // Show/Hide the relevant content.
    $content.each(function () {
        var $this = window.jQuery(this);
        var terms = $this.attr('data-filter-content').trim().split(' ');
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
                var $this = window.jQuery(this);
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
    var $this = window.jQuery(this);
    var $filter = $this.parents('.js-filter');
    var $items = $filter.find('.js-filter__item');

    $items.prop('checked', true);

    updateFilter.call(this);
};

exports.default = {
    init: init
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    addRequiredDot();
    addHelpIcon();
};

var addElement = function addElement(selector, type, atts) {
    var fields = document.querySelectorAll(selector);
    for (var i = 0; i < fields.length; i++) {
        var el = document.createElement(type);
        for (var a = 0; a < atts.length; a++) {
            var attr = atts[a];
            var value = typeof attr.value === 'string' ? attr.value : fields[i].getAttribute(attr.value.dataAttribute);

            if (attr.attribute && value) {
                el.setAttribute(attr.attribute, value);
            }
        }
        fields[i].parentElement.insertBefore(el, fields[i].nextSibling);
    }
};

var addRequiredDot = function addRequiredDot() {
    addElement('form .js-required, form [required]', 'span', [{
        attribute: 'class',
        value: 'form__required-dot'
    }, {
        attribute: 'title',
        value: 'This field is required'
    }]);
};

var addHelpIcon = function addHelpIcon() {
    addElement('form .js-help', 'span', [{
        attribute: 'class',
        value: 'icon--help-circle form__help'
    }, {
        attribute: 'title',
        value: {
            dataAttribute: 'data-help-text'
        }
    }]);
};

exports.default = {
    init: init
};

},{}],14:[function(require,module,exports){
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

var _honeycomb8 = require('./content/js/honeycomb.content');

var _honeycomb9 = _interopRequireDefault(_honeycomb8);

var _honeycombDocument = require('./document/js/honeycomb.document.viewport');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

var _honeycomb10 = require('./equalise/js/honeycomb.equalise');

var _honeycomb11 = _interopRequireDefault(_honeycomb10);

var _honeycomb12 = require('./filter/js/honeycomb.filter');

var _honeycomb13 = _interopRequireDefault(_honeycomb12);

var _honeycomb14 = require('./forms/js/honeycomb.forms');

var _honeycomb15 = _interopRequireDefault(_honeycomb14);

var _honeycomb16 = require('./lightbox/js/honeycomb.lightbox');

var _honeycomb17 = _interopRequireDefault(_honeycomb16);

var _honeycombMaps = require('./maps/js/honeycomb.maps.google');

var _honeycombMaps2 = _interopRequireDefault(_honeycombMaps);

var _honeycombNavigation = require('./navigation/js/honeycomb.navigation.dropdown');

var _honeycombNavigation2 = _interopRequireDefault(_honeycombNavigation);

var _honeycombNavigation3 = require('./navigation/js/honeycomb.navigation.header');

var _honeycombNavigation4 = _interopRequireDefault(_honeycombNavigation3);

var _honeycombNavigation5 = require('./navigation/js/honeycomb.navigation.vertical');

var _honeycombNavigation6 = _interopRequireDefault(_honeycombNavigation5);

var _honeycombNotification = require('./notification/js/honeycomb.notification.block');

var _honeycombNotification2 = _interopRequireDefault(_honeycombNotification);

var _honeycombPolyfill = require('./polyfill/js/honeycomb.polyfill.index-of');

var _honeycombPolyfill2 = _interopRequireDefault(_honeycombPolyfill);

var _honeycombPolyfill3 = require('./polyfill/js/honeycomb.polyfill.custom-event');

var _honeycombPolyfill4 = _interopRequireDefault(_honeycombPolyfill3);

var _honeycomb18 = require('./reveal/js/honeycomb.reveal');

var _honeycomb19 = _interopRequireDefault(_honeycomb18);

var _honeycomb20 = require('./scroll/js/honeycomb.scroll');

var _honeycomb21 = _interopRequireDefault(_honeycomb20);

var _honeycomb22 = require('./sticky/js/honeycomb.sticky');

var _honeycomb23 = _interopRequireDefault(_honeycomb22);

var _honeycomb24 = require('./svg/js/honeycomb.svg');

var _honeycomb25 = _interopRequireDefault(_honeycomb24);

var _honeycomb26 = require('./tabs/js/honeycomb.tabs');

var _honeycomb27 = _interopRequireDefault(_honeycomb26);

var _honeycomb28 = require('./toggle/js/honeycomb.toggle');

var _honeycomb29 = _interopRequireDefault(_honeycomb28);

var _honeycomb30 = require('./video/js/honeycomb.video');

var _honeycomb31 = _interopRequireDefault(_honeycomb30);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

_honeycombAnalytics2.default.setAccountId('UA-XXX'); // Google analytics.

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

window.addEventListener('load', function () {
    _honeycomb5.default.init();
});

// Code

_honeycomb7.default.init();

// Content.

window.addEventListener('load', function () {
    _honeycomb9.default.init();
});

// Document.

_honeycombDocument2.default.init();

// Equalise.

_honeycomb11.default.init();

// Filter.

_honeycomb13.default.init();

// Forms.

_honeycomb15.default.init();

// Lightbox.

_honeycomb17.default.init();

// Google map.

window.initMap = _honeycombMaps2.default.initialiseMap;
_honeycombMaps2.default.init({
    callback: 'window.initMap'
});

// Navigation

_honeycombNavigation2.default.init();

_honeycombNavigation4.default.init();

_honeycombNavigation6.default.init();

// Notification

_honeycombNotification2.default.init();
window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.notifications = _honeycombNotification2.default;

// Polyfills.

(0, _honeycombPolyfill2.default)();
(0, _honeycombPolyfill4.default)();

// Reveal.

_honeycomb19.default.init();

// Scroll.

_honeycomb21.default.init();

// Sticky.

_honeycomb23.default.init();

// SVG.

_honeycomb25.default.init();

// Tabs.

_honeycomb27.default.init({
    equalise: _honeycomb11.default.init,
    googleMap: _honeycombMaps2.default.init
});

// Toggle.

_honeycomb29.default.init();

// Video.

_honeycomb31.default.init({
    analytics: _honeycombAnalytics2.default
});

// Confluence. (Only import Confluence styling for Confluence themes.)
// import confluence from './confluence/js/honeycomb.confluence';
// confluence.init();

},{"./analytics/js/honeycomb.analytics.google":1,"./analytics/js/honeycomb.analytics.pingdom":2,"./animation/js/honeycomb.animation.fade":3,"./base/js/honeycomb.base":4,"./browser/js/honeycomb.browser":5,"./carousel/js/honeycomb.carousel":6,"./code/js/honeycomb.code":7,"./content/js/honeycomb.content":8,"./document/js/honeycomb.document.viewport":10,"./equalise/js/honeycomb.equalise":11,"./filter/js/honeycomb.filter":12,"./forms/js/honeycomb.forms":13,"./lightbox/js/honeycomb.lightbox":15,"./maps/js/honeycomb.maps.google":16,"./navigation/js/honeycomb.navigation.dropdown":17,"./navigation/js/honeycomb.navigation.header":18,"./navigation/js/honeycomb.navigation.vertical":19,"./notification/js/honeycomb.notification.block":20,"./polyfill/js/honeycomb.polyfill.custom-event":21,"./polyfill/js/honeycomb.polyfill.index-of":22,"./reveal/js/honeycomb.reveal":23,"./scroll/js/honeycomb.scroll":24,"./sticky/js/honeycomb.sticky":25,"./svg/js/honeycomb.svg":26,"./tabs/js/honeycomb.tabs":27,"./toggle/js/honeycomb.toggle":28,"./video/js/honeycomb.video":29}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var els = document.querySelectorAll('.js-lightbox, .js-lightbox--video, .js-lightbox--iframe, .js-lightbox--image, .js-lightbox--inline, .js-lightbox--ajax, .js-lightbox--swf, .js-lightbox--html');
    if (els.length) {
        if (typeof window.jQuery.fancybox === 'undefined') {
            if (typeof config.url === 'undefined') {
                config.url = 'lightbox/vendor/jquery.fancybox.pack.js';
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {

            // Use BEM style modifiers to set type of content for lightbox.
            window.jQuery('.js-lightbox').fancybox();
            window.jQuery('.js-lightbox--video, .js-lightbox--iframe').fancybox({ type: 'iframe' });
            window.jQuery('.js-lightbox--image').fancybox({ type: 'image' });
            window.jQuery('.js-lightbox--inline').fancybox({ type: 'inline' });
            window.jQuery('.js-lightbox--ajax').fancybox({ type: 'ajax' });
            window.jQuery('.js-lightbox--swf').fancybox({ type: 'swf' });
            window.jQuery('.js-lightbox--html').fancybox({ type: 'html' });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":9}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var $maps = void 0;

var init = function init(options) {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so maps functionality won\'t work as expected');
        return;
    }

    $maps = window.jQuery('.js-google-map');

    if ($maps.length > 0) {
        var s = document.getElementsByTagName('script')[0];
        var se = document.createElement('script');

        se.type = 'text/javascript';
        se.src = '//maps.googleapis.com/maps/api/js?libraries=places&callback=' + options.callback;
        s.parentNode.insertBefore(se, s);
    }
};

var initialiseMap = function initialiseMap() {
    $maps.each(function () {
        var $this = window.jQuery(this);
        var config = getConfig($this);
        var map = void 0;

        if (!config.streetView) {

            // Normal map type.
            map = new window.google.maps.Map(this, {
                center: new window.google.maps.LatLng(config.lat, config.long),
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

                var placesService = new window.google.maps.places.PlacesService(map);
                placesService.textSearch(request, function (results, status) {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        var result = results[0];

                        var marker = new window.google.maps.Marker({
                            map: map,
                            position: result.geometry.location
                        });

                        var content = '<h1 class="delta spaced-bottom--tight">' + result.name + '</h1>' + '<p>' + result.formatted_address.replace(/,/gi, ',<br/>') + '</p>';

                        var infoWindow = new window.google.maps.InfoWindow({
                            content: content
                        });

                        window.google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open(map, marker);
                        });

                        infoWindow.open(map, marker);
                    }
                });
            }
        } else {

            // Street view
            map = new window.google.maps.StreetViewPanorama(this, {
                position: new window.google.maps.LatLng(config.lat, config.long),
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
    config.mapTypeId = window.google.maps.MapTypeId.ROADMAP;
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

},{}],17:[function(require,module,exports){
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
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so dropdown functionality won\'t work as expected');
        return;
    }

    var $lis = window.jQuery(selector).find('li');
    $lis.each(function () {
        var $this = window.jQuery(this);
        if ($this.find('ul').length > 0 && $this.attr('data-arrow-added') !== 'true') {
            var $a = window.jQuery('<a/>').attr('href', '#toggle').addClass('arrow');
            $this.addClass('dropdown ' + classNameClosed);
            $this.attr('data-arrow-added', 'true');
            $a.appendTo($this);
        }
    });
};

var handle = function handle() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so dropdown functionality won\'t work as expected');
        return;
    }

    var $body = window.jQuery('body');
    $body.on('click', '.js-dropdown .arrow', function (e) {
        var $this = window.jQuery(this);
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

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setupCollapse = function setupCollapse() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }

    var $headers = window.jQuery('.js-header-primary-collapse');

    $headers.each(function (index, header) {
        var $header = window.jQuery(header);
        var $nav = $header.find('.header--primary__menu--mobile');
        $header.wrapInner('<div class="header--primary__container"></div>');
        $nav.appendTo($header);
    });
};

var dropdownNotification = function dropdownNotification() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }

    var $headers = window.jQuery('.js-header-primary-collapse');
    var openClassName = 'dropdown--open';

    $headers.each(function () {
        var $body = window.jQuery('body');

        $body.on('click', '.header--primary__container .dropdown .arrow', function () {
            var $arrow = window.jQuery(this);
            var $header = $arrow.parents('.header--primary');
            if ($arrow.parent('li').hasClass('open')) {
                $header.addClass(openClassName);
            } else {
                $header.removeClass(openClassName);
            }
        });
    });
};

var init = function init() {
    setupCollapse();
    dropdownNotification();

    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so header functionality won\'t work as expected');
        return;
    }

    var $body = window.jQuery('body');

    $body.on('click', '.header--primary__menu-button', function (e) {
        e.preventDefault();
        if ($body.hasClass('mobile-nav--open')) {

            // Hide
            $body.removeClass('mobile-nav--open');
        } else {

            // Open
            $body.addClass('mobile-nav--open');
        }
    });

    // When an item that has a submenu is clicked toggle the menu, rather than
    // follow the link.
    $body.on('click', '.header--primary__menu--mobile .dropdown > a', function (e) {
        if (this.getAttribute('href') !== '#toggle') {
            e.preventDefault();

            var $toggle = window.jQuery(this).siblings('a[href="#toggle"]');
            if ($toggle) {
                $toggle.trigger('click');
            }
        }
    });
};

exports.default = {
    init: init
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var collapseClass = 'nav--vertical__collapse';
var collapsedClass = 'nav--vertical--collapsed';
var activeClass = 'nav--vertical__active';
var parentActiveClass = 'nav--vertical__active-parent';
var toggleClass = 'nav--vertical__toggle';

var init = function init() {
    var navs = document.querySelectorAll('.nav--vertical');

    var _loop = function _loop(i) {
        var nav = navs[i];

        var as = nav.querySelectorAll('a');

        var _loop2 = function _loop2(x) {
            var a = as[x];
            a.addEventListener('click', function (e) {
                if (a.parentElement.className.match(collapseClass) !== null) {
                    collapse(e, nav);
                    return;
                }

                if (e.target.className.match(toggleClass) !== null) {
                    toggle(e, a);
                    return;
                }

                var href = a.getAttribute('href');
                if (!href) {
                    toggle(e, a);
                    update(e, nav, a);
                    return;
                } else {

                    // Clicked on a link, so follow the link.
                    return;
                }
            });
        };

        for (var x = 0; x < as.length; x++) {
            _loop2(x);
        }
    };

    for (var i = 0; i < navs.length; i++) {
        _loop(i);
    }
};

var toggle = function toggle(e, a) {
    e.preventDefault();
    var parent = a.parentElement;
    if (parent.className.match(activeClass) !== null) {
        parent.className = parent.className.replace(parentActiveClass, '').replace(activeClass, '');
    } else {
        parent.className = parent.className + (' ' + parentActiveClass);
    }
};

var update = function update(e, nav, a) {
    e.preventDefault();

    // Remove all active classes.
    var items = nav.querySelectorAll('.' + activeClass);
    for (var i = 0; i < items.length; i++) {
        var re = new RegExp(activeClass, 'g');
        items[i].className = items[i].className.replace(re, '');
    }

    // Add active class to parent.
    a.parentElement.className = a.parentElement.className + (' ' + activeClass);

    // Add parent active class to parent list items.
    var el = a.parentElement.parentElement;
    while (el.className.match('nav--vertical') === null) {
        if (el.nodeName === 'LI') {
            el.className = el.className + (' ' + parentActiveClass);
        }

        el = el.parentElement;
    }
};

var collapse = function collapse(e, nav) {
    e.preventDefault();
    if (nav.className.match(collapsedClass) === null) {
        nav.className = nav.className + (' ' + collapsedClass);
    } else {
        nav.className = nav.className.replace(collapsedClass, '');
    }
};

exports.default = {
    init: init
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Click handler for close buttons on statically built notifications.
var init = function init() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so notifications won\t work as expected');
        return;
    }

    window.jQuery('body').on('click', '.notification--block .notification__close', function (e) {
        e.preventDefault();
        window.jQuery(this).parent().parent().slideUp({
            complete: function complete() {
                window.jQuery(this).remove();
            }
        });
    });
};

// Build the notification HTML.
var buildNotification = function buildNotification(settings) {
    var notificationStr = '<div class="notification notification--block notification--' + settings.type + '">' + '<div class="notification--block__inner-container">' + '<figure class="notification__icon">';

    if (typeof settings.icon !== 'undefined' && settings.icon.type) {
        if (settings.icon.type === 'font') {

            // Icon font
            notificationStr += '<span class="icon icon--' + settings.icon.src + '"></span>';
        } else if (settings.icon.type === 'image') {

            // Image
            notificationStr += '<img src="' + settings.icon.src + '" alt=""/>';
        }
    } else {
        notificationStr += '<span class="icon icon--' + settings.type + '"></span>';
    }

    notificationStr += '</figure>' + '<a class="notification__close" href="#">X</a>' + '<div class="notification__body">' + '<p>' + settings.content + '</p>' + '</div>' + '</div>' + '</div>' + '</div>';

    return notificationStr;
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
        container: window.jQuery('body')
    };

    // Customised settings.
    this.settings = {};

    // Show time.
    this.init = function init() {

        // Generate the settings array (Merging default settings and user options).
        window.jQuery.extend(true, self.settings, self.defaults, self.options);

        // Build the notification.
        self.notification = window.jQuery(buildNotification(self.settings));

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
    block: notification,
    buildNotification: buildNotification
};

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// polyfill for window.CustomEvent
// from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

// this gets used by honeycomb.tabs and honeycomb.reveal
// honeycomb.reveal fires a CustomEvent which honeycomb.tabs listens for, so that honeycomb.tabs can unset/reset its fixed heights

var CustomEvent = function CustomEvent() {
    if (typeof window.CustomEvent !== 'function') {
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = function (event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
    }
};

exports.default = CustomEvent;

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

var init = function init(callback) {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so reveal functionality won\'t work as expected');
        return;
    }

    window.jQuery('.js-reveal').each(function () {
        var $this = window.jQuery(this);

        if (!$this.attr('data-reveal-open')) {
            $this.slideUp(0);
        }
    });

    window.jQuery('.js-reveal-cta').each(function () {
        var $this = window.jQuery(this);

        // Setup cta's.
        var $button = window.jQuery(this);
        if ($this.attr('data-reveal-open')) {
            $button.attr('data-reveal-cta-close-html', $button.html());
        } else {
            $button.attr('data-reveal-cta-open-html', $button.html());
        }
    }).on('click', function (e) {

        // On click, call toggle.
        e.preventDefault();

        var that = this;
        var $button = window.jQuery(this);
        var hash = $button.attr('href');
        var $content = window.jQuery(hash);
        var group = $button.attr('data-reveal-group') || false;

        if (!$content.is(':visible')) {

            // Open content.
            if (group) {

                // In a group. Close all group content first.
                var $groupButtons = window.jQuery('.js-reveal-cta[data-reveal-group=\"' + group + '\"]');
                var closed = 0;

                for (var i = 0; i < $groupButtons.length; i++) {
                    var groupButton = $groupButtons[i];
                    var $groupContent = window.jQuery(window.jQuery(groupButton).attr('href'));

                    // If the content is visible (should only be 1), then close and open.
                    if ($groupContent.is(':visible')) {
                        close(groupButton, function () {
                            open(that, callback);
                        });
                    } else {

                        // Content's not visible, so just increase the counter for the check later.
                        closed++;
                    }
                }

                // No revealed content is open, so go ahead and open.
                if (closed === $groupButtons.length) {
                    open(that, callback);
                }
            } else {

                // Not in a group.
                open(this, callback);
            }
        } else {

            // Close content.
            close(this, callback);
        }
    });
};

var open = function open(button, callback) {
    var $button = window.jQuery(button);
    var hash = $button.attr('href');
    var $content = window.jQuery(hash);

    if ($content.is('.js-reveal')) {
        var $buttons = window.jQuery('.js-reveal-cta[href=\"' + hash + '\"]');

        $content.slideDown({
            duration: 250,
            complete: function complete() {

                $content.addClass('js-reveal-open');
                $buttons.addClass('close');

                // Update buttons.
                $buttons.each(function () {
                    var $button = window.jQuery(this);
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
    }
};

var close = function close(button, callback) {
    var $button = window.jQuery(button);
    var hash = $button.attr('href');
    var $content = window.jQuery(hash);

    if ($content.is('.js-reveal')) {
        var $buttons = window.jQuery('.js-reveal-cta[href=\"' + hash + '\"]');

        $content.slideUp({
            duration: 250,
            complete: function complete() {

                $content.removeClass('js-reveal-open');
                $buttons.removeClass('close');

                // Update buttons.
                $buttons.each(function () {
                    var $button = window.jQuery(this);
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
    }
};

var toggle = function toggle(button, callback) {
    var $content = window.jQuery(window.jQuery(button).attr('href'));
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
    scrollOnClick();
    scrollBeforeSticky();
};

var scrollOnClick = function scrollOnClick() {
    if (typeof window.jQuery === 'undefined') {
        window.console.warn('Honeycomb: jQuery not found, so scroll functionality won\'t work as expected');
        return;
    }

    window.jQuery('a.js-scroll-to').on('click', function (e) {
        var $this = window.jQuery(this);
        var href = $this.attr('href');
        var offset = parseInt($this.attr('data-scroll-to-offset') || 0);
        var focus = $this.attr('data-scroll-to-focus') || false;
        var hash = isHashOnThisPage(href);

        if (hash) {
            e.preventDefault();
            window.jQuery('html, body').animate({
                scrollTop: window.jQuery(hash).offset().top + offset
            }, 500, function () {
                if (focus) {
                    window.jQuery('#' + focus).focus();
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

var scrollBeforeSticky = function scrollBeforeSticky() {
    window.addEventListener('load', function () {
        window.setTimeout(function () {
            if (window.location.hash && window.pageYOffset > 0) {

                // There's a hash, and we're at it. Check if there are
                // any sticky items, and if so, scroll back the height
                // of them.
                // const elementToScrollTo = document.querySelector(window.location.hash);
                var elementToScrollTo = window.jQuery(window.location.hash);
                var stickyItems = document.querySelectorAll('.js-sticky');
                var heightToReverse = 0;
                for (var i = 0; i < stickyItems.length; i++) {
                    var sticky = stickyItems[i];
                    if (sticky.className.match('sticking')) {
                        heightToReverse = heightToReverse + sticky.clientHeight;
                    }
                }

                window.jQuery('html, body').animate({
                    scrollTop: elementToScrollTo.offset().top - heightToReverse
                }, 500);
            }
        }, 1000);
    });
};

exports.default = {
    init: init
};

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)
var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var els = document.querySelectorAll('.js-sticky');
    if (els.length) {
        if (typeof window.jQuery.fn.sticky === 'undefined') {
            if (typeof config.url === 'undefined') {
                config.url = 'sticky/vendor/jquery.sticky.min.js';
            }

            _honeycombDocument2.default.load(config.url, function () {
                init();
            });
        } else {
            window.jQuery('.js-sticky').each(function () {
                var $this = window.jQuery(this);
                var offset = $this.attr('data-sticky-offset') === 'auto' ? 'auto' : parseInt($this.attr('data-sticky-offset'), 10) || 'auto';

                $this.sticky({
                    offset: offset,
                    sticky: function sticky() {
                        $this.addClass('sticking');
                    },
                    docked: function docked() {
                        $this.removeClass('sticking');
                    },
                    navActiveClass: 'active'
                });
            });
        }
    }
};

exports.default = {
    init: init
};

},{"../../document/js/honeycomb.document.load-script":9}],26:[function(require,module,exports){
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _honeycomb = require('../../browser/js/honeycomb.browser');

var _honeycomb2 = _interopRequireDefault(_honeycomb);

var _honeycombDocument = require('../../document/js/honeycomb.document.load-script');

var _honeycombDocument2 = _interopRequireDefault(_honeycombDocument);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // If IE7, bail!
    if (_honeycomb2.default.isIE7()) {
        return false;
    }

    var tabbed = document.querySelectorAll('.js-tabbed');
    if (tabbed.length) {

        if (typeof window.jQuery.fn.tabs === 'undefined') {
            if (typeof config.url === 'undefined') {
                config.url = 'tabs/vendor/jquery.tabs.min.js';
            }

            _honeycombDocument2.default.load(config.url, function () {
                init(config);
            });
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var tab = _step.value;

                    var options = {
                        pagination: false,
                        template: {
                            container: {
                                atts: {},
                                classes: ['tabbed__container']
                            },
                            tab: {
                                container: {
                                    classes: ['js-tab']
                                }
                            },
                            pagination: {
                                container: {
                                    atts: {
                                        'data-ui-component': 'nav--tabs-pagination'
                                    },
                                    classes: ['pagination']
                                },
                                links: {
                                    prev: {
                                        atts: {},
                                        classes: ['pagination__prev'],
                                        preHtml: '',
                                        postHtml: ''
                                    },
                                    next: {
                                        atts: {},
                                        classes: ['pagination__next'],
                                        preHtml: '',
                                        postHtml: ''
                                    }
                                }
                            }
                        }
                    };

                    // Scroll animation
                    var scrollTo = tab.getAttribute('data-tabs-scroll-to');
                    if (scrollTo) {
                        options.scrollTo = scrollTo === 'true';
                    }

                    // Scroll animation offset
                    var scrollToOffset = tab.getAttribute('data-tabs-scroll-to-offset');
                    if (scrollToOffset) {
                        options.scrollToOffset = scrollToOffset;
                    }

                    // Pagination
                    var pagination = tab.getAttribute('data-tabs-pagination');
                    if (pagination) {
                        options.pagination = pagination === 'true';
                    }

                    // Reload ajax requests
                    var reloadAjax = tab.getAttribute('data-tabs-reload-ajax');
                    if (reloadAjax) {
                        options.reloadAjax = reloadAjax === 'true';
                    }

                    // Tab change callbacks
                    var equalHeights = tab.getAttribute('data-tabs-equal-heights');
                    var googleMap = tab.getAttribute('data-tabs-google-map');

                    if (equalHeights || googleMap) {
                        options.onTabChange = function () {

                            if (equalHeights) {
                                config.equalise();
                            }

                            if (googleMap) {
                                config.googleMap({
                                    callback: 'window.initMap'
                                });
                            }
                        };
                    }

                    // Apply tabs plugin.
                    window.jQuery(tab).tabs(options);

                    // Callback.
                    if (typeof config.callback === 'function') {
                        config.callback.call();
                    }
                };

                for (var _iterator = tabbed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        }
    }
};

exports.default = {
    init: init
};

},{"../../browser/js/honeycomb.browser":5,"../../document/js/honeycomb.document.load-script":9}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var hook = '.js-toggle';
var activeClass = 'active';

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
                var items = tog.querySelectorAll(hook + '-item');
                for (var i = 0; i < items.length; i++) {
                    items[i].style.display = 'none';
                }

                // Show the first item.
                items[0].style.display = 'block';

                // Add active state to the first nav item.
                var as = tog.querySelectorAll(hook + '-nav a');
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = as[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var a = _step2.value;

                        a.classList.remove(activeClass);

                        // Add toggle handler.
                        a.addEventListener('click', function (e) {
                            e.preventDefault();
                            toggle(e.target.getAttribute('href'));
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
    target = target.startsWith('#') ? target.substr(1) : target;
    var toggleItem = document.getElementById(target);
    var toggle = toggleItem.parentNode;
    while (!toggle.classList.contains(hook.substr(1))) {
        toggle = toggle.parentNode;
    }

    // Hide all the items.
    var items = toggle.querySelectorAll(hook + '-item');
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            item.style.display = 'none';
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

    toggleItem.style.display = 'block';

    // Update the active state.
    var links = toggle.querySelectorAll(hook + '-nav a');
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = links[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var link = _step4.value;

            link.classList.remove(activeClass);

            if (link.getAttribute('href') === '#' + target) {
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
'use strict';

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
    var videoContainer = document.querySelectorAll('.js-video-container');
    if (videoContainer.length > 0) {
        var tag = document.createElement('script');
        var firstScriptTag = document.getElementsByTagName('script')[0];
        tag.src = 'https://www.youtube.com/iframe_api';
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
};

// calculate second values for 10%, 20% etc. for event tracking
var calculatePercentages = function calculatePercentages(duration) {
    var percentage = void 0;
    var percentages = {};
    for (var i = 1; i < 10; i++) {
        percentage = i * 10 + '%';
        percentages[percentage] = duration * (i / 10);
    }
    return percentages;
};

var trackVideoEvent = function trackVideoEvent(event, videoId, value) {
    if (analytics) {
        analytics.trackEvent('Video', videoId + ' - ' + document.location.pathname, value);
    }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
var trackGoal = function trackGoal(event, videoId) {
    trackVideoEvent(event, videoId, 'goal');
    return true;
};

var addInlineVideos = function addInlineVideos() {
    var videoCounter = 0;
    var videoContainers = document.querySelectorAll('.js-video-container');
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
                var videoDiv = document.createElement('div');
                videoDiv.setAttribute('id', videoId + '-' + videoCounter);
                videoContainer.appendChild(videoDiv);

                // Get the options (data attributes)
                var _options = getOptions(videoContainer);

                var playerSettings = {
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

                            if (event.data === window.YT.PlayerState.PLAYING) {

                                // Video playing.
                                var iframe = event.target.getIframe();

                                duration = duration || event.target.getDuration();
                                percentages = percentages || calculatePercentages(duration);

                                if (!iframe.hasAttribute('data-ga-tracked') && analytics) {
                                    var container = iframe.parentElement;

                                    if (container.hasAttribute('data-ga-track')) {

                                        // Track the video in GA (Google Analytics).
                                        var category = container.getAttribute('data-ga-track-category') || null;
                                        var action = container.getAttribute('data-ga-track-action') || null;
                                        var label = container.getAttribute('data-ga-track-label') || null;
                                        var value = container.getAttribute('data-ga-track-value') || null;

                                        // Call the tracking event.
                                        analytics.trackEvent(category, action, label, value);
                                    }

                                    // Add a tracked data attribute to prevent from tracking multiple times.
                                    iframe.setAttribute('data-ga-tracked', true);

                                    trackVideoEvent(event, videoId, '0%');
                                }
                            }

                            if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                                currentTime = event.target.getCurrentTime();

                                // check goal conditions
                                if (!goalTracked) {
                                    if (currentTime > percentages['20%'] && percentages['20%'] > 30) {
                                        goalTracked = trackGoal(event, videoId);
                                    } else if (currentTime > 30 && percentages['20%'] < 30) {
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
                };

                // playlist settings
                var listId = videoContainer.getAttribute('data-video-list-id');
                if (listId) {
                    playerSettings.playerVars.listType = 'playlist';
                    playerSettings.playerVars.list = listId;
                }

                // start time
                var start = videoContainer.getAttribute('data-video-start-time');
                if (start) {
                    playerSettings.playerVars.start = start;
                }

                // Replace the empty div with the video player iframe.
                videos[videoId + '-' + videoCounter] = new window.YT.Player(videoId + '-' + videoCounter, playerSettings);
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
    var options = Object.assign({}, options);

    // Autohide.
    if (video.hasAttribute('data-video-auto-hide')) {
        options.autohide = video.getAttribute('data-video-auto-hide');
    }

    // Autoplay.
    if (video.hasAttribute('data-video-auto-play')) {
        options.autoplay = video.getAttribute('data-video-auto-play');
    }

    // Controls.
    if (video.hasAttribute('data-video-controls')) {
        options.controls = video.getAttribute('data-video-controls');
    }

    // Show info.
    if (video.hasAttribute('data-video-show-info')) {
        options.showinfo = video.getAttribute('data-video-show-info');
    }

    // Loop.
    if (video.hasAttribute('data-video-loop')) {
        options.loop = video.getAttribute('data-video-loop');
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

},{}]},{},[14]);
