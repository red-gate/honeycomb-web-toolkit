(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackPageView = exports.trackEvent = exports.setupTrackingAlias = exports.isExcludedEnvironment = exports["default"] = exports.accountId = void 0;
var _honeycomb = _interopRequireDefault(require("../../cookie-consent/js/honeycomb.cookie-consent"));
var _honeycombDocument = require("../../document/js/honeycomb.document.load-script");
var _honeycombNotification = require("../../notification/js/honeycomb.notification.log-deprecated-function");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var accountId;
var crossDomainAccountId;
var init = function init() {
  // If the account ID is not set, then don't carry on.
  if (!accountId || accountId === 'G-XXX') {
    window.console.warn('Honeycomb: Google Analytics account ID is not set, therefore the Google Analytics script will not be loaded.');
    return false;
  }

  // Add the tracking script.
  addScript().then(function () {
    // Init the analytics accounts.
    initAccount(accountId, crossDomainAccountId);

    // Set up tracking alias helper.
    setupTrackingAlias();

    // Track lightbox video views.
    trackLightboxVideoViews();

    // Do console error if window.ga called, but doesn't exist, as V4 is now window.gtag().
    window.ga = window.ga || function () {
      window.console.error('Honeycomb web toolkit has now been updated to use Google Analytics V4 (gtag). Please update any `window.ga()` references to use the new V4 API.', arguments);
    };
  });
};
var isExcludedEnvironment = exports.isExcludedEnvironment = function isExcludedEnvironment() {
  var excludedEnvironments = ['localhost', 'local.red-gate.com', 'local.honeycomb.com', 'local.simple-talk.com', 'webstaging.red-gate.com', 'coredev-uat'];
  var isExcluded = false;
  excludedEnvironments.forEach(function (environment) {
    if (window.location.host.includes(environment)) {
      isExcluded = true;
    }
  });
  return isExcluded;
};
var setAccountId = function setAccountId(accId) {
  exports.accountId = accountId = accId;
};
var setCrossDomainAccountId = function setCrossDomainAccountId(accId) {
  crossDomainAccountId = accId;
};

// Add the Google Analytics script to the page.
// Expanded out the isogram iife.
var addScript = function addScript() {
  return new Promise(function (resolve, reject) {
    (0, _honeycombDocument.load)("https://www.googletagmanager.com/gtag/js?id=".concat(accountId), function () {
      resolve();
    }, {
      async: true
    }, function () {
      reject('Google Analytics script not loaded');
    });
  });
};

// Initialise the account, with the account ID.
var initAccount = function initAccount(accountId) {
  var crossDomainAccountId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!accountId || accountId === 'G-XXX') {
    return false;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // Set default values of consent to denied.
  window.gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });
  window.gtag('js', new Date());

  // Add account IDs.
  var configOptions = {};
  if (isExcludedEnvironment()) {
    configOptions['debug_mode'] = true;
  }
  window.gtag('config', accountId, configOptions);
  if (crossDomainAccountId) {
    window.gtag('config', crossDomainAccountId, configOptions);
  }

  // Update consent for storing cookies if targeting consent given.
  var hasTargetingConsent = _honeycomb["default"].hasConsent('targeting');
  if (hasTargetingConsent) {
    window.gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });
  }
};

// Track a page view on all trackers.
var trackPageView = exports.trackPageView = function trackPageView() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = url !== '' ? {
    page_location: url
  } : {};
  trackEvent('page_view', options);
};

// Track an event.
var trackEvent = exports.trackEvent = function trackEvent() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (event === '') return false;
  if (typeof window.gtag === 'undefined') return false;
  window.gtag('event', event, params);
};

// Track youtube video views.
var trackLightboxVideoViews = function trackLightboxVideoViews() {
  var els = document.querySelectorAll('.lightbox--video, .js-lightbox--video');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', function (e) {
      var target = e.target;

      // Ensure target is the link, rather than a child element.
      while (!target.hasAttribute('href')) {
        target = target.parentElement;
      }
      var videoId = target.href.replace(/http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '');
      var url = new URL(target.href);
      trackEvent('video_start', {
        video_current_time: 0,
        video_percent: 0,
        video_url: url.origin + url.pathname,
        video_id: videoId,
        lightbox: true
      });
    });
  }
};

// Click track (helper for instead of onclick="gtag('event', ...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
var setupTrackingAlias = exports.setupTrackingAlias = function setupTrackingAlias() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var els = element.querySelectorAll('[data-ga-track]');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', function (e) {
      var target = e.target;

      // Ensure that the target is the element with the tracking info,
      // rather than a child of it. E.g. image within a link would be target
      // rather than the link. This prevents that from happening.
      while (!target.hasAttribute('data-ga-track')) {
        target = target.parentElement;
      }
      var event = target.getAttribute('data-ga-track-event');
      if (event === null) return;

      // Get attributes that match 'data-ga-track-'.
      var eventParams = {};
      var _iterator = _createForOfIteratorHelper(target.attributes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var attr = _step.value;
          if (attr.name.match('data-ga-track-') && !attr.name.match('data-ga-track-event')) {
            eventParams[attr.name.substring('data-ga-track-'.length)] = attr.value;
          }
        }

        // Process the Google tracking event.
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      trackEvent(event, eventParams);
    });
  }
};
var setCustomVariable = function setCustomVariable() {
  (0, _honeycombNotification.logDeprecatedFunctionToConsole)('setCustomVariable', 'Google Analytics', '14.2.0');
};
var setOptimizeId = function setOptimizeId() {
  (0, _honeycombNotification.logDeprecatedFunctionToConsole)('setOptimizeId', 'Google Analytics', '14.2.0');
};
var setSites = function setSites() {
  (0, _honeycombNotification.logDeprecatedFunctionToConsole)('setSites', 'Google Analytics', '14.2.0');
};
var _default = exports["default"] = {
  init: init,
  accountId: accountId,
  isExcludedEnvironment: isExcludedEnvironment,
  setupTrackingAlias: setupTrackingAlias,
  setAccountId: setAccountId,
  setCrossDomainAccountId: setCrossDomainAccountId,
  trackEvent: trackEvent,
  trackPageView: trackPageView,
  setCustomVariable: setCustomVariable,
  setOptimizeId: setOptimizeId,
  setSites: setSites
};

},{"../../cookie-consent/js/honeycomb.cookie-consent":13,"../../document/js/honeycomb.document.load-script":16,"../../notification/js/honeycomb.notification.log-deprecated-function":30}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var init = function init() {
  if (typeof window._prum !== 'undefined') {
    var s = document.getElementsByTagName('script')[0];
    var p = document.createElement('script');
    p.async = 'async';
    p.src = '//rum-static.pingdom.net/prum.min.js';
    s.parentNode.insertBefore(p, s);
  }
};
var _default = exports["default"] = {
  init: init
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var interval = 9000;
var fadeOutDuration = 1000;
var fadeInDuration = 2000;
var init = function init() {
  if (typeof $ === 'undefined') return;
  window.jQuery('.js-animate--fade').each(function () {
    var $this = window.jQuery(this);
    if ($this.find('.js-animate--fade__item').length > 1) {
      $this.find('.js-animate--fade__item').wrapAll('<div class="js-animate--fade__container"/>');
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
var _default = exports["default"] = {
  init: init
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.date = exports.breakpoints = void 0;
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = exports["default"] = {
  init: init,
  isIE7: isIE7
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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
    leftButton.style.transform = "translate(-".concat(navWidth, "px, 0px)");
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
      _honeycombDocument["default"].load(config.url, function () {
        init();
      });
    } else {
      var onInitEvent = document.createEvent('Event');
      var onBeforeChangeEvent = document.createEvent('Event');
      var onAfterChangeEvent = document.createEvent('Event');
      onInitEvent.initEvent('onCarouselInit', true, true);
      onBeforeChangeEvent.initEvent('onCarouselBeforeChange', true, true);
      onAfterChangeEvent.initEvent('onCarouselAfterChange', true, true);
      var _loop = function _loop() {
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

        // Dispatch init event.
        window.jQuery(carousel).on('init', function (slick) {
          onInitEvent.carousel = {
            carousel: slick.target
          };
          carousel.dispatchEvent(onInitEvent);
        });

        // Dispatch beforeChange event.
        window.jQuery(carousel).on('beforeChange', function (slick, currentSlide) {
          onBeforeChangeEvent.carousel = {
            carousel: slick.target,
            current: {
              index: currentSlide.currentSlide,
              element: slick.target.querySelector('.slick-slide[data-slick-index="' + currentSlide.currentSlide + '"]')
            }
          };
          carousel.dispatchEvent(onBeforeChangeEvent);
        });

        // Dispatch afterChange event.
        window.jQuery(carousel).on('afterChange', function (slick, currentSlide) {
          onAfterChangeEvent.carousel = {
            carousel: slick.target,
            current: {
              index: currentSlide.currentSlide,
              element: slick.target.querySelector('.slick-slide[data-slick-index="' + currentSlide.currentSlide + '"]')
            }
          };
          carousel.dispatchEvent(onAfterChangeEvent);
        });
        window.jQuery(carousel).slick(options);
        window.jQuery(carousel).css('visibility', 'inherit').css('height', 'auto');
      };
      for (var i = 0; i < carousels.length; i++) {
        _loop();
      }
    }
  }
};
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
var _this = void 0;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
// Default colours if not supplied.
var colours = ['204, 0, 0',
// Red
'60, 133, 223',
// Blue
'26, 172, 30',
// Green
'252, 144, 3',
// Orange
'254, 209, 0',
// Yellow
'118, 118, 118' // Grey
];
var init = function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var charts = document.querySelectorAll('.js-chart');
  if (charts.length > 0) {
    if (typeof window.Chart === 'function') {
      setGlobalSettings();
      for (var i = 0; i < charts.length; i++) {
        var chart = charts[i];
        chart = ensureIsCanvas(chart);
        renderChart(chart);
      }
    } else {
      if (typeof config.url === 'undefined') {
        config.url = 'chart/vendor/chart.js.4.4.0.min.js';
      }
      _honeycombDocument["default"].load(config.url, init);
    }
  }
};
var getColour = function getColour(dataSet) {
  return typeof dataSet.colour !== 'undefined' ? dataSet.colour : getRandomColour();
};
var getRandomColour = function getRandomColour() {
  var randomNumber = Math.ceil(Math.random() * colours.length) - 1;
  return colours[randomNumber];
};
var setBackgroundColour = function setBackgroundColour(type, opacity, dataSets, dataSet) {
  if (type === 'doughnut' || type === 'pie' || type === 'polarArea') {
    return dataSets.map(function (ds) {
      return "rgba(".concat(getColour(ds), ", ").concat(opacity, ")");
    });
  }
  if (type === 'scatter') {
    return 'rgba(0, 0, 0, 0)';
  }
  return "rgba(".concat(getColour(dataSet), ", ").concat(opacity, ")");
};
var setBorderColour = function setBorderColour(type, opacity, dataSets, dataSet) {
  if (type === 'doughnut' || type === 'pie' || type === 'polarArea') {
    return dataSets.map(function (ds) {
      return "rgb(".concat(getColour(ds), ")");
    });
  }
  return "rgb(".concat(getColour(dataSet), ")");
};
var ensureIsCanvas = function ensureIsCanvas(chart) {
  var chartNodeName = chart.nodeName.toLowerCase();
  if (chartNodeName !== 'canvas') {
    var chartAttributes = [];
    for (var i = 0; i < chart.attributes.length; i++) {
      chartAttributes.push({
        attr: chart.attributes[i].nodeName,
        value: chart.attributes[i].nodeValue
      });
    }
    var canvas = document.createElement('canvas');
    for (var _i = 0; _i < chartAttributes.length; _i++) {
      canvas.setAttribute(chartAttributes[_i].attr, chartAttributes[_i].value);
    }
    canvas.innerHTML = chart.innerHTML;
    chart.parentElement.insertBefore(canvas, chart);
    if (typeof chart.remove === 'function') {
      chart.remove();
    } else {
      chart.removeNode(true);
    }
    chart = canvas;
  }
  return chart;
};
var renderChart = function renderChart(chart) {
  window.jQuery.when(getData(chart)).then(function (data) {
    if (!data) {
      window.console.warn('Honeycomb: No data supplied for the chart, so the chart will therefore not render.');
      return false;
    }
    var type = chart.getAttribute('data-chart-type') || 'bar';

    // Add support for legacy type.
    if (type === 'horizontalBar') {
      type = 'bar';
    }
    var config = setConfig(chart, data);
    var options = setOptions(chart);
    if (typeof chart.getContext !== 'function') {
      window.console.warn('Honeycomb: The chart element doesn\'t have a context, so therefore will not render.');
      return false;
    }
    window.Honeycomb.charts.push(new window.Chart(chart.getContext('2d'), {
      type: type,
      data: config,
      options: options
    }));
  });
};
var setConfig = function setConfig(chart, data) {
  var type = chart.getAttribute('data-chart-type') || 'bar';
  var colourOpacity = chart.hasAttribute('data-chart-colour-opacity') ? chart.getAttribute('data-chart-colour-opacity') : 0.25;
  var borderWidth = chart.hasAttribute('data-chart-border-width') ? chart.getAttribute('data-chart-border-width') : 1;
  var pointRadius = chart.hasAttribute('data-chart-point-radius') ? chart.getAttribute('data-chart-point-radius') : 3;
  var config = {
    labels: data.labels,
    datasets: data.dataSets.map(function (dataSet) {
      return {
        label: dataSet.label,
        data: dataSet.data,
        borderWidth: borderWidth,
        backgroundColor: setBackgroundColour(type, colourOpacity, data.dataSets, dataSet),
        borderColor: setBorderColour(type, colourOpacity, data.dataSets, dataSet),
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius,
        fill: true,
        tension: 0.2
      };
    })
  };
  return config;
};
var setOptions = function setOptions(chart) {
  var type = chart.getAttribute('data-chart-type') || 'bar';
  var stacked = chart.getAttribute('data-chart-stacked') === 'true' ? true : false;
  var verticalGridlines = chart.getAttribute('data-chart-vertical-gridLines') === 'false' ? false : true;
  var horizontalGridlines = chart.getAttribute('data-chart-horizontal-gridLines') === 'false' ? false : true;
  var legendPosition = chart.hasAttribute('data-chart-legend-position') ? chart.getAttribute('data-chart-legend-position') : false;
  var legendOnClick = chart.hasAttribute('data-chart-legend-click') ? chart.getAttribute('data-chart-legend-click') : false;
  var legend = chart.hasAttribute('data-chart-legend') ? chart.getAttribute('data-chart-legend') : true;
  var animation = chart.hasAttribute('data-chart-animation') ? chart.getAttribute('data-chart-animation') : true;
  var verticalAxis = chart.getAttribute('data-chart-vertical-axis') ? chart.getAttribute('data-chart-vertical-axis') : true;
  var horizontalAxis = chart.getAttribute('data-chart-horizontal-axis') ? chart.getAttribute('data-chart-horizontal-axis') : true;
  var tooltips = chart.hasAttribute('data-chart-tooltips') ? chart.getAttribute('data-chart-tooltips') : null;
  var options = {};

  // Horizontal bar chart.
  if (type === 'horizontalBar') {
    options.indexAxis = 'y';
  }

  // Stacked bar chart.
  if ((type === 'bar' || type === 'horizontalBar') && stacked) {
    options.scales = options.scales || {};
    options.scales.x = options.scales.x || {};
    options.scales.y = options.scales.y || {};
    options.scales.x.stacked = true;
    options.scales.y.stacked = true;
  }

  // Gridlines (on by default).
  if (!verticalGridlines) {
    options.scales = options.scales || {};
    options.scales.x = options.scales.x || {};
    options.scales.x.grid = options.scales.x.grid || {};
    options.scales.x.grid.display = false;
  }
  if (!horizontalGridlines) {
    options.scales = options.scales || {};
    options.scales.y = options.scales.y || {};
    options.scales.y.grid = options.scales.y.grid || {};
    options.scales.y.grid.display = false;
  }

  // Legend.
  if (legend === 'false') {
    options.plugins = options.plugins || {};
    options.plugins.legend = options.plugins.legend || {};
    options.plugins.legend.display = false;
  }

  // Legend position.
  if (legendPosition) {
    options.plugins = options.plugins || {};
    options.plugins.legend = options.plugins.legend || {};
    options.plugins.legend.display = true;
    options.plugins.legend.position = legendPosition;
    options.plugins.legend.align = 'start';
  }

  // Legend callback.
  if (legendOnClick !== 'true') {
    options.legend = options.legend || {};
    options.legend.onClick = function () {};
  }

  // Animation.
  if (animation === 'false') {
    options.animation = options.animation || {};
    options.animation.duration = 0;
  }

  // Vertical axis
  if (verticalAxis === 'false') {
    options.scales = options.scales || {};
    options.scales.x = options.scales.x || {};
    options.scales.x.display = false;
  }

  // Horizontal axis
  if (horizontalAxis === 'false') {
    options.scales = options.scales || {};
    options.scales.y = options.scales.y || {};
    options.scales.y.display = false;
  }

  // Tooltips
  if (tooltips && tooltips === 'false') {
    options.plugins = options.plugins || {};
    options.plugins.tooltip = options.plugins.tooltip || {};
    options.plugins.tooltip.enabled = false;
  }
  return options;
};
var setGlobalSettings = function setGlobalSettings() {
  window.Chart.defaults.font.family = 'Roboto';
  window.Chart.defaults.plugins.legend.position = 'bottom';
  window.Honeycomb = window.Honeycomb || {};
  window.Honeycomb.charts = window.Honeycomb.charts || [];
};
var getData = function getData(chart) {
  var $deferred = window.jQuery.Deferred();

  // Get data from inline JavaScript.
  if (chart.hasAttribute('data-chart-source')) {
    var dataSource = chart.getAttribute('data-chart-source');
    $deferred.resolve(typeof window[dataSource] !== 'undefined' ? window[dataSource] : typeof _this[dataSource] !== 'undefined' ? _this[dataSource] : null);

    // Get data from an ajax request (JSON).
  } else if (chart.hasAttribute('data-chart-url')) {
    var _dataSource = chart.getAttribute('data-chart-url');
    window.jQuery.getJSON(_dataSource, function (data) {
      $deferred.resolve(data);
    });

    // No data source, return null.
  } else {
    $deferred.resolve(null);
  }
  return $deferred;
};
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
var _this = void 0;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var init = function init(callback) {
  if (typeof window.intercomSettings !== 'undefined') {
    if (typeof window.Intercom !== 'undefined') {
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings);

      // Execute init callback if there is one, and it's a function.
      if (callback && typeof callback === 'function') {
        callback.call(_this);
      }
    } else {
      var i = function i() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      window.Intercom = i;
      _honeycombDocument["default"].load("https://widget.intercom.io/widget/".concat(window.intercomSettings.app_id), init.bind(_this, callback));
    }
  }
};
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
var _honeycombDocument2 = _interopRequireDefault(require("../../document/js/honeycomb.document.load-style"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var isCodeSample = function isCodeSample(sample) {
  var search = 'brush:';
  if (sample.className.match(search)) {
    return true;
  }
  return false;
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
var loadVendorScript = function loadVendorScript(config) {
  if (typeof config.url === 'undefined') {
    config.url = 'code/vendor/syntaxhighlighter.js';
  }
  _honeycombDocument["default"].load(config.url);
};
var loadVendorStyle = function loadVendorStyle(config) {
  if (typeof config.style === 'undefined') {
    config.style = 'code/vendor/theme.css';
  }
  _honeycombDocument2["default"].load(config.style);
};
var init = function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var samples = getCodeSamples();
  if (samples.length > 0) {
    loadVendorScript(config);
    loadVendorStyle(config);
  }
};
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16,"../../document/js/honeycomb.document.load-style":17}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
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
      var _iterator = _createForOfIteratorHelper(updateEls),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          // Get first breakpoint.
          var bp = window.breakpoints[0];
          if (!el.hasAttribute("data-content-".concat(bp.breakpoint))) {
            el.setAttribute("data-content-".concat(bp.breakpoint), el.innerHTML);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    var width = window.innerWidth;
    var _iterator2 = _createForOfIteratorHelper(updateEls),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _el = _step2.value;
        var content = false;
        var _iterator3 = _createForOfIteratorHelper(window.breakpoints),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _bp = _step3.value;
            if (width < _bp.width) {
              if (_el.hasAttribute("data-content-".concat(_bp.breakpoint))) {
                content = _el.getAttribute("data-content-".concat(_bp.breakpoint));
              }
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        _el.innerHTML = content;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
};
window.addEventListener('resize', function () {
  update();
});
var _default = exports["default"] = {
  init: init
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var init = function init() {
  var els = document.querySelectorAll('.js-context-menu');

  // Add event handlers
  if (els.length) {
    // Polyfill Element.prototype.closest for IE
    if (!Element.prototype.closest) {
      Element.prototype.matches = Element.prototype.msMatchesSelector;
      Element.prototype.closest = function (s) {
        var el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.querySelector('.js-context-menu__control').addEventListener('click', handleContextMenuControlClick);
    }
    document.addEventListener('click', handleClickAway);

    // Close context menus when resizing window (rather than recalculating positioning)
    window.addEventListener('resize', closeMenus);
  }
};

// Get the position of an element relative to the document
function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    height: rect.height,
    width: rect.width
  };
}

// Handler for clicking on the context menu control
var handleContextMenuControlClick = function handleContextMenuControlClick(event) {
  event.preventDefault();
  var contextMenu = event.target.closest('.js-context-menu');

  // Toggle context menu open state
  if (contextMenu.classList.contains('js-context-menu--open')) {
    closeMenu(contextMenu);
  } else {
    openMenu(contextMenu);
  }
};
var openMenu = function openMenu(contextMenu) {
  contextMenu.classList.add('js-context-menu--open');

  // In order to overlay the context menu list over the other document content
  // and avoid problems with parent container overflow,
  // we move the context menu list up to the body, 
  // absolutely positioned in the correct position. 
  // We replace the list in its original parent when the menu is closed. 
  var contextMenuList = contextMenu.querySelector('.js-context-menu__list');
  var control = contextMenu.querySelector('.js-context-menu__control');
  var offset = getOffset(control);

  // Set position and classes
  var top = offset.top + offset.height + 10;
  var left = offset.left + 20;
  if (contextMenu.classList.contains('js-context-menu--right')) {
    contextMenuList.classList.add('js-context-menu__list--right');
    left -= offset.width + 20;
  }
  contextMenuList.style.top = "".concat(top, "px");
  contextMenuList.style.left = "".concat(left, "px");
  contextMenuList.classList.add('js-context-menu__list--open');

  // create unique identifier to associate the context menu with the floating element 
  var id = Date.now() + Math.random();
  contextMenu.setAttribute('data-context-menu-id', id);
  contextMenuList.setAttribute('data-context-menu-id', id);

  // Add menu to DOM
  document.body.appendChild(contextMenuList);
};
var closeMenu = function closeMenu(contextMenu) {
  contextMenu.classList.remove('js-context-menu--open');

  // remove any floating open lists from the body and replace them in their parent container
  var id = contextMenu.getAttribute('data-context-menu-id');
  if (id) {
    var floatingList = document.querySelector(".js-context-menu__list[data-context-menu-id=\"".concat(id, "\""));
    if (floatingList) {
      floatingList.classList.remove('js-context-menu__list--open');
      contextMenu.appendChild(floatingList);
    }
  }
};

// Close all context menus
var closeMenus = function closeMenus() {
  var els = document.querySelectorAll('.js-context-menu--open');
  if (els.length) {
    for (var i = 0; i < els.length; i++) {
      closeMenu(els[i]);
    }
  }
};

// Handler for clicking away from the context menu
var handleClickAway = function handleClickAway(event) {
  var openContextMenus = document.querySelectorAll('.js-context-menu--open');

  // Close all open context menus when clicking away
  for (var i = 0; i < openContextMenus.length; i++) {
    var openContextMenu = openContextMenus[i];
    var control = openContextMenu.querySelector('.js-context-menu__control');
    var id = openContextMenu.getAttribute('data-context-menu-id');
    var list = document.querySelector(".js-context-menu__list[data-context-menu-id=\"".concat(id, "\"]"));

    // make sure the user is not clicking on the context menu control or list
    if (!(control.contains(event.target) || list.contains(event.target))) {
      closeMenu(openContextMenu);
    }
  }
};
var _default = exports["default"] = {
  init: init
};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = exports.close = void 0;
var dialog = null;

/**
 * Open the dialog, and display the cookie groups, with the consent values (as
 * toggles).
 * 
 * @param {Object|Array} consentGroups An object containing the groups and
 *                                     their consent values, or an array of
 *                                     group names.
 * @param {Function} setHasConsent A function to use to set consent, passing in
 *                                 object of groups and their consent values
 * @return {Void}
 */
var open = exports.open = function open() {
  var consentGroups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var setHasConsent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (dialog) return;

  // Convert groups array into object.
  if (Array.isArray(consentGroups)) {
    var groupsObject = {};
    for (var i = 0; i < consentGroups.length; i++) {
      groupsObject[consentGroups[i]] = 0;
    }
    consentGroups = groupsObject;
  }

  // Container.
  dialog = document.createElement('div');
  dialog.setAttribute('class', 'cookie-dialog');
  dialog.addEventListener('click', function (e) {
    var _e$target;
    // If the user clicks outside of the inner container, then close the dialog.
    if (((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.getAttribute('class')) === 'cookie-dialog') {
      close();
    }
  });

  // Inner container.
  var inner = document.createElement('div');
  inner.setAttribute('class', 'cookie-dialog__inner');

  // Heading.
  var heading = document.createElement('h1');
  heading.setAttribute('class', 'beta text--redgate');
  heading.innerHTML = 'Cookie settings';
  inner.appendChild(heading);

  // Intro para.
  var intro = document.createElement('p');
  intro.innerHTML = 'When you visit a website, it may store or retrieve information on your browser, mostly in the form of cookies. This information could be about you, your preferences, or your device. Typically, it does not identify you personally.<br/>If you prefer, you can choose not to allow some types of cookies. To disallow all cookies, except essential cookies that our site needs to function, click Save settings. Otherwise, you can enable certain types of cookies by checking the appropriate box under Manage cookie groups.<br/>Blocking some types of cookies may affect your experience of our site and what we can offer you.';
  inner.appendChild(intro);

  // Allow all button.
  var acceptAll = document.createElement('button');
  acceptAll.setAttribute('class', 'button button--primary button--small spaced-bottom--tight spaced-right--tight');
  acceptAll.innerHTML = 'Accept all';
  acceptAll.addEventListener('click', function (e) {
    e.preventDefault();
    setHasConsent(null);
  });
  inner.appendChild(acceptAll);

  // Reject all button.
  var rejectAll = document.createElement('button');
  rejectAll.setAttribute('class', 'button button--small spaced-bottom--tight');
  rejectAll.innerHTML = 'Reject all';
  rejectAll.addEventListener('click', function (e) {
    e.preventDefault();
    var rejections = {};
    for (var consentGroup in consentGroups) {
      rejections[consentGroup] = 0;
    }
    setHasConsent(rejections);
  });
  inner.appendChild(rejectAll);

  // Group heading.
  var groupHeading = document.createElement('h2');
  groupHeading.setAttribute('class', 'gamma text--redgate');
  groupHeading.innerHTML = 'Manage cookie groups';
  inner.appendChild(groupHeading);

  // Group intro.
  var groupIntro = document.createElement('p');
  groupIntro.innerHTML = 'Performance cookies include Google Analytics and similar platforms that help us see how people are using our site. Targeting cookies let us deliver content and ads relevant to your interests on our sites and third-party ones.';
  inner.appendChild(groupIntro);

  // Groups.
  var groups = document.createElement('ul');
  groups.setAttribute('class', 'cookie-dialog__groups');
  for (var consentGroup in consentGroups) {
    var group = document.createElement('li');

    // Checkbox.
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'groups[]');
    checkbox.setAttribute('id', "group-".concat(consentGroup));
    checkbox.setAttribute('value', consentGroup);
    if (consentGroups[consentGroup] == 1) {
      checkbox.setAttribute('checked', 'checked');
    }

    // Label.
    var label = document.createElement('label');
    label.setAttribute('for', "group-".concat(consentGroup));
    label.innerHTML = consentGroup;
    group.appendChild(checkbox);
    group.appendChild(label);
    groups.appendChild(group);
  }
  inner.appendChild(groups);

  // Controls.
  var controls = document.createElement('div');
  controls.setAttribute('class', 'cookie-dialog__controls');

  // Save button.
  var saveButton = document.createElement('button');
  saveButton.setAttribute('class', 'button button--primary button--small');
  saveButton.innerHTML = 'Save settings';
  saveButton.addEventListener('click', function (e) {
    // Build the selections object from the checkboxes and pass into the
    // setHasConsent function to pass back to the calling function.
    e.preventDefault();
    var groups = dialog.querySelectorAll('input[type="checkbox"]');
    var selections = {};
    for (var _i = 0; _i < groups.length; _i++) {
      var name = groups[_i].getAttribute('value');
      selections[name] = groups[_i].checked === true ? 1 : 0;
    }
    setHasConsent(selections);
  });
  controls.appendChild(saveButton);

  // Close button?
  var closeButton = document.createElement('button');
  closeButton.setAttribute('class', 'button button--transparent button--small');
  closeButton.innerHTML = 'Close settings';
  closeButton.addEventListener('click', function (e) {
    e.preventDefault();
    close();
  });
  controls.appendChild(closeButton);
  inner.appendChild(controls);

  // Close button in the corner of the dialog.
  var closeButton2 = document.createElement('button');
  closeButton2.setAttribute('class', 'button button--transparent button--small cookie-dialog__close--corner');
  closeButton2.innerHTML = 'Close';
  closeButton2.addEventListener('click', function (e) {
    e.preventDefault();
    close();
  });
  inner.appendChild(closeButton2);

  // Append the dialog to the DOM.
  dialog.appendChild(inner);
  document.body.appendChild(dialog);

  // Set focus to the dialog box.
  acceptAll.focus();
};

/**
 * Close the dialog.
 */
var close = exports.close = function close() {
  if (dialog) {
    dialog.parentElement.removeChild(dialog);
    dialog = null;
  }
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycomb = _interopRequireDefault(require("../../cookie/js/honeycomb.cookie"));
var _crawlerUserAgents = _interopRequireDefault(require("../json/crawler-user-agents.json"));
var _honeycombCookieConsent = require("./honeycomb.cookie-consent.dialog");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
/**
 * The name of the consent cookie.
 * 
 * @var {String} The name of the consent cookie.
 */
var consentCookieName = 'hccookieconsent';

/**
 * The domain used when setting the cookie.
 *
 * @var {String} consentCookieDomain The domain
 */
var consentCookieDomain = window.location.hostname;

/**
 * The groups that can be consented to.
 * 
 * @var {Array} consentGroups The groups
 */
var consentGroups = ['functional', 'performance', 'targeting'];

/**
 * The heading used on the banner.
 *
 * @var {String} bannerHeading The heading
 */
var bannerHeading = 'Cookies';

/**
 * The intro content used on the banner.
 *
 * @var {String} bannerIntro The intro content
 */
var bannerIntro = "\n    <p class=\"spaced-bottom--none\">We use some essential cookies to make this website work.</p>\n    <p>We'd like to set additional ones to see how you use our site and for advertising.</p>\n";

/**
 * The links to display in the banner.
 * 
 * @var {Array} links An array of link objects
 */
var links = [];

/**
 * Set the consent cookie name.
 * 
 * @param {String} name The name of the consent cookie
 * @returns {Void}
 */
var setConsentCookieName = function setConsentCookieName(name) {
  consentCookieName = name;
};

/**
 * Set the domain used for the cookie.
 *
 * @param {String} domain The domain to use for the cookie
 * @returns {Void}
 */
var setConsentCookieDomain = function setConsentCookieDomain(domain) {
  consentCookieDomain = domain;
};

/**
 * Set the consent groups.
 * 
 * @param {Array|Null} groups The groups to consent to
 */
var setConsentGroups = function setConsentGroups() {
  var groups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (Array.isArray(groups)) {
    consentGroups = groups;
  }
};

/**
 * Set the heading to use on the banner.
 *
 * @param {String} heading The heading to use on the banner
 * @returns {Void}
 */
var setBannerHeading = function setBannerHeading(heading) {
  bannerHeading = heading;
};

/**
 * Set the intro content to use on the banner.
 *
 * @param {String} intro The intro content
 * @returns {Void}
 */
var setBannerIntro = function setBannerIntro(intro) {
  bannerIntro = intro;
};

/**
 * Set links to display on the banner.
 * 
 * @param {Array|Null} links The links to display on the banner
 */
var setLinks = function setLinks() {
  var l = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (Array.isArray(l)) {
    links = l;
  }
};

/**
 * Get the name of the Redgate consent cookie
 * 
 * @returns {String} The name of the consent cookie
 */
var getConsentCookieName = function getConsentCookieName() {
  return consentCookieName;
};

/**
 * Get the domain to use when setting the consent cookie.
 *
 * @returns {String} The domain to use for the consent cookie
 */
var getConsentCookieDomain = function getConsentCookieDomain() {
  return consentCookieDomain;
};

/**
 * Get the consent groups.
 * 
 * @returns {Array} An array of consent groups
 */
var getConsentGroups = function getConsentGroups() {
  return consentGroups;
};

/**
 * Get the heading to use on the banner.
 *
 * @returns {String} The heading to use on the banner
 */
var getBannerHeading = function getBannerHeading() {
  return bannerHeading;
};

/**
 * Get the intro content to use on the banner.
 *
 * @returns {String} The intro to use on the banner
 */
var getBannerIntro = function getBannerIntro() {
  return bannerIntro;
};

/**
 * Get the custom links to display on the banner.
 * 
 * @returns {Array} An array of custom links
 */
var getLinks = function getLinks() {
  return links;
};

/**
 * Get the groups from the cookie if they exist. If they don't exist, then
 * return null.
 * 
 * @returns {Object|Null} The consent groups with their consent value, or null if not found
 */
var getConsentGroupsFromCookie = function getConsentGroupsFromCookie() {
  var consentCookieGroups = JSON.parse(_honeycomb["default"].get(getConsentCookieName()));
  return _typeof(consentCookieGroups) !== 'object' || consentCookieGroups === null ? null : consentCookieGroups;
};

/**
 * Check if there is consent to use cookies by checking for the value of the
 * consent cookie.
 * 
 * @param {String|Null} group The group to check consent for
 * @returns {Boolean} Whether consent is given to use cookies
 */
var hasConsent = function hasConsent() {
  var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (group !== null) {
    group = group.toLowerCase();
  }
  var consentCookie = JSON.parse(_honeycomb["default"].get(getConsentCookieName()));

  // Legacy.
  if (_typeof(consentCookie) !== 'object' || consentCookie === null) {
    return consentCookie === null || consentCookie == 0 ? false : true;
  }

  // By default, consent is NOT given.
  var consent = false;

  // If no group specified, then check if any of the groups have consent, and
  // return true if so.
  if (group === null) {
    for (var g in consentCookie) {
      if (consentCookie[g] == 1) {
        consent = true;
      }
    }
    return consent;
  }

  // Check cookie for group status
  if (Object.prototype.hasOwnProperty.call(consentCookie, group)) {
    if (consentCookie[group] == 1) {
      consent = true;
    }
  }
  return consent;
};

/**
 * Set the consent cookie with the groups consent statuses, and for it to
 * expire in 31 days if cookies accepted, and 6 months if rejected.
 *
 * @param {Object|Null} groups The groups object with the group as the property,
 *                             and the consent status as the value (0|1)
 * @param {Boolean} status The status to set consent to if groups is null.
 *                         Defaults to true (accepted)
 */
var setHasConsent = function setHasConsent() {
  var groups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // If no groups info is passed in, then set all groups to have consent.
  if (groups === null) {
    groups = {};
    getConsentGroups().forEach(function (group) {
      groups[group] = status === true ? 1 : 0;
    });
  }
  _honeycomb["default"].set(getConsentCookieName(), JSON.stringify(groups), {
    'max-age': status === 1 ? 2678400 : 16070400,
    domain: getConsentCookieDomain()
  });
};

/**
 * Set the consent cookie with a value of 0, valid for the session only, so the
 * notification doesn't get shown on every page load.
 * 
 */
var setNoConsent = function setNoConsent() {
  _honeycomb["default"].set(getConsentCookieName(), 0, {
    domain: getConsentCookieDomain()
  });
};

/**
 * Check if the notification should be displayed.
 * 
 * If the cookie is set, then we know that the user has made a decision, and
 * we no longer need to display the notification.
 * 
 * We also check if it's a crawler crawling the page, if so, we don't want to
 * display the cookie notification.
 * 
 * @returns {Boolean} True to display the notifcation, False if not
 */
var isDisplayNotification = function isDisplayNotification() {
  var consentCookie = _honeycomb["default"].get(getConsentCookieName());
  return consentCookie === null && !isCrawler() ? true : false;
};

/**
 * Display the cookie notification, and ask the user to either accept or
 * reject the setting of additional cookies.
 * 
 */
var displayNotification = function displayNotification() {
  // Container.
  var container = document.createElement('div');
  container.className = 'band cookie-consent';

  // Inner container.
  var innerContainer = document.createElement('div');
  innerContainer.className = 'band__inner-container grid padded-v--tight';

  // Grid column.
  var column = document.createElement('div');
  column.className = 'grid__col grid__col--span-9-of-12';

  // Heading.
  var heading = document.createElement('h1');
  heading.className = 'beta spaced-bottom--none';
  heading.innerHTML = getBannerHeading();

  // Intro.
  var introContainer = null;
  var introContent = getBannerIntro();
  if (introContent && introContent !== '') {
    introContainer = document.createElement('div');
    introContainer.className = 'gamma text--normal spaced-bottom--tight';
    introContainer.innerHTML = introContent;
  }

  // List.
  var list = document.createElement('ul');
  list.className = 'list--bare list--horizontal';

  // Accept button.
  var acceptButtonListItem = document.createElement('li');
  acceptButtonListItem.className = 'spaced-right--tight';
  var acceptButton = document.createElement('button');
  acceptButton.className = 'button button--primary button--small';
  acceptButton.innerHTML = 'Accept additional cookies';
  acceptButton.addEventListener('click', function () {
    setHasConsent();
    hideNotification();
  });
  acceptButtonListItem.appendChild(acceptButton);
  list.appendChild(acceptButtonListItem);

  // Reject button.
  var rejectButtonListItem = document.createElement('li');
  rejectButtonListItem.className = 'spaced-right--tight';
  var rejectButton = document.createElement('button');
  rejectButton.className = 'button button--small';
  rejectButton.innerHTML = 'Reject additional cookies';
  rejectButton.addEventListener('click', function () {
    setHasConsent(null, false);
    hideNotification();
  });
  rejectButtonListItem.appendChild(rejectButton);
  list.appendChild(rejectButtonListItem);

  // Customise link.
  var customiseLinkItem = document.createElement('li');
  customiseLinkItem.className = 'spaced-right--tight';
  var customiseLink = document.createElement('a');
  customiseLink.setAttribute('href', '#');
  customiseLink.innerHTML = 'Customize additional cookies';
  customiseLink.addEventListener('click', function (e) {
    e.preventDefault();
    (0, _honeycombCookieConsent.open)(getConsentGroupsFromCookie() || getConsentGroups(), function (groups) {
      setHasConsent(groups);
      hideNotification();
      (0, _honeycombCookieConsent.close)();
    });
  });
  customiseLinkItem.appendChild(customiseLink);
  list.appendChild(customiseLinkItem);

  // Links.
  getLinks().forEach(function (link) {
    var linkListItem = document.createElement('li');
    linkListItem.className = 'spaced-right--tight';
    var a = document.createElement('a');
    a.setAttribute('href', link.href);
    a.innerHTML = link.title;
    linkListItem.appendChild(a);
    list.appendChild(linkListItem);
  });

  // Add all the nodes to each other.
  column.appendChild(heading);
  introContainer && column.appendChild(introContainer);
  column.appendChild(list);
  innerContainer.appendChild(column);
  container.appendChild(innerContainer);

  // Add the container to the body of the page.
  document.body.appendChild(container);
};

/**
 * Hide the notification if it exists.
 * 
 */
var hideNotification = function hideNotification() {
  var notification = document.querySelector('.cookie-consent');
  if (notification) {
    notification.parentElement.removeChild(notification);
  }
};

/**
 * Check if the current request's user agent belongs to a list of crawler user
 * agents.
 * 
 * @see https://github.com/monperrus/crawler-user-agents/blob/master/crawler-user-agents.json
 * @returns {Boolean}
 */
var isCrawler = function isCrawler() {
  var ua = window.navigator.userAgent;
  var patterns = _crawlerUserAgents["default"].map(function (ua) {
    return ua.pattern;
  });

  // Loop over the patterns checking for a match.
  patterns.forEach(function (pattern) {
    if (ua.match(pattern) !== null) {
      return true;
    }
  });
  return false;
};

/**
 * Update the consent value for a group.
 * 
 * If the group doesn't exist, it will create it.
 * 
 * @param {String} group The consent group to update the value of
 * @param {Number} value The value to set the consent group to
 * @returns {Boolean} True if the consent was updated, false it not
 */
var updateConsent = function updateConsent() {
  var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Get groups from cookie with their values (defaulting to 0 if no cookie found).
  var groups = getConsentGroupsFromCookie() || Object.fromEntries(getConsentGroups().map(function (group) {
    return [group, 0];
  }));

  // If the group exists, and the value is the same, then exit early.
  if (group in groups && groups[group] === value) return false;

  // Update the group's value and update the consent cookie.
  groups[group] = value;
  setHasConsent(groups);
  return true;
};

/**
 * Initialise the module and its functionality.
 * 
 * @param {Object} settings An object containing settings to override the defaults. * 
 */
var init = function init() {
  var _settings$cookie, _settings$cookie2, _settings$banner, _settings$banner2, _settings$banner3;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // Update the cookie consent name if set in settings.
  if ((_settings$cookie = settings.cookie) !== null && _settings$cookie !== void 0 && _settings$cookie.name) {
    setConsentCookieName(settings.cookie.name);
  }

  // Update the cookie consent domain if set in settings.
  if ((_settings$cookie2 = settings.cookie) !== null && _settings$cookie2 !== void 0 && _settings$cookie2.domain) {
    setConsentCookieDomain(settings.cookie.domain);
  }

  // Set the consent groups if set in settings.
  if (settings.consentGroups) {
    setConsentGroups(settings.consentGroups);
  }

  // Set the banner heading if set in settings.
  if ((_settings$banner = settings.banner) !== null && _settings$banner !== void 0 && _settings$banner.heading) {
    setBannerHeading(settings.banner.heading);
  }

  // Set the banner intro content if set in settings.
  if ((_settings$banner2 = settings.banner) !== null && _settings$banner2 !== void 0 && _settings$banner2.intro) {
    setBannerIntro(settings.banner.intro);
  }

  // Set the links to display in the banner if set in settings.
  if ((_settings$banner3 = settings.banner) !== null && _settings$banner3 !== void 0 && _settings$banner3.links) {
    setLinks(settings.banner.links);
  }

  // Check if notification should be displayed.
  if (isDisplayNotification()) {
    displayNotification();
  }

  // If user has given consent previously, then reset cookie so it's a
  // rolling expiration date.
  // If the user doesn't visit for a period after 31 days then they'll see
  // the notification, however if they keep revisiting then they'll never
  // see it again.
  if (hasConsent()) {
    setHasConsent(getConsentGroupsFromCookie());
  }
};
var _default = exports["default"] = {
  init: init,
  hasConsent: hasConsent,
  updateConsent: updateConsent
};

},{"../../cookie/js/honeycomb.cookie":15,"../json/crawler-user-agents.json":14,"./honeycomb.cookie-consent.dialog":12}],14:[function(require,module,exports){
module.exports=[
  {
    "pattern": "Googlebot\\/",
    "url": "http://www.google.com/bot.html",
    "instances": [
      "Googlebot/2.1 (+http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1.4 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1.4 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "Googlebot-Mobile",
    "instances": [
      "DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)",
      "Nokia6820/2.0 (4.83) Profile/MIDP-1.0 Configuration/CLDC-1.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)",
      "SAMSUNG-SGH-E250/1.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Browser/6.2.3.3.c.1.101 (GUI) MMP/2.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "Googlebot-Image",
    "instances": [
      "Googlebot-Image/1.0"
    ]
  }
  ,
  {
    "pattern": "Googlebot-News",
    "instances": [
      "Googlebot-News"
    ]
  }
  ,
  {
    "pattern": "Googlebot-Video",
    "instances": [
      "Googlebot-Video/1.0"
    ]
  }
  ,
  {
    "pattern": "AdsBot-Google([^-]|$)",
    "url": "https://support.google.com/webmasters/answer/1061943?hl=en",
    "instances": [
      "AdsBot-Google (+http://www.google.com/adsbot.html)"
    ]
  }
  ,
  {
    "pattern": "AdsBot-Google-Mobile",
    "addition_date": "2017/08/21",
    "url": "https://support.google.com/adwords/answer/2404197",
    "instances": [
      "AdsBot-Google-Mobile-Apps",
      "Mozilla/5.0 (Linux; Android 5.0; SM-G920A) AppleWebKit (KHTML, like Gecko) Chrome Mobile Safari (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)"
    ]
  }
  ,
  {
    "pattern": "Feedfetcher-Google",
    "addition_date": "2018/06/27",
    "url": "https://support.google.com/webmasters/answer/178852",
    "instances": [
      "Feedfetcher-Google; (+http://www.google.com/feedfetcher.html; 1 subscribers; feed-id=728742641706423)"
    ]
  }
  ,
  {
    "pattern": "Mediapartners-Google",
    "url": "https://support.google.com/webmasters/answer/1061943?hl=en",
    "instances": [
      "Mediapartners-Google",
      "Mozilla/5.0 (compatible; MSIE or Firefox mutant; not on Windows server;) Daumoa/4.0 (Following Mediapartners-Google)",
      "Mozilla/5.0 (iPhone; U; CPU iPhone OS 10_0 like Mac OS X; en-us) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1 (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7 (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "Mediapartners \\(Googlebot\\)",
    "addition_date": "2017/08/08",
    "url": "https://support.google.com/webmasters/answer/1061943?hl=en",
    "instances": []
  }
  ,
  {
    "pattern": "APIs-Google",
    "addition_date": "2017/08/08",
    "url": "https://support.google.com/webmasters/answer/1061943?hl=en",
    "instances": [
      "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)"
    ]
  }
  ,
  {
    "pattern": "bingbot",
    "url": "http://www.bing.com/bingbot.htm",
    "instances": [
      "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 530) like Gecko (compatible; adidxbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; adidxbot/2.0;  http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; adidxbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; bingbot/2.0;  http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) SitemapProbe",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; adidxbot/2.0;  http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; adidxbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; bingbot/2.0;  http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 (seoanalyzer; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "Slurp",
    "url": "http://help.yahoo.com/help/us/ysearch/slurp",
    "instances": [
      "Mozilla/5.0 (compatible; Yahoo! Slurp/3.0; http://help.yahoo.com/help/us/ysearch/slurp)",
      "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
      "Mozilla/5.0 (compatible; Yahoo! Slurp China; http://misc.yahoo.com.cn/help.html)"
    ]
  }
  ,
  {
    "pattern": "[wW]get",
    "instances": [
      "WGETbot/1.0 (+http://wget.alanreed.org)",
      "Wget/1.14 (linux-gnu)",
      "Wget/1.20.3 (linux-gnu)"
    ]
  }
  ,
  {
    "pattern": "LinkedInBot",
    "instances": [
      "LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/3.1 +http://www.linkedin.com)",
      "LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/4.3 +http://www.linkedin.com)",
      "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)"
    ]
  }
  ,
  {
    "pattern": "Python-urllib",
    "instances": [
      "Python-urllib/1.17",
      "Python-urllib/2.5",
      "Python-urllib/2.6",
      "Python-urllib/2.7",
      "Python-urllib/3.1",
      "Python-urllib/3.2",
      "Python-urllib/3.3",
      "Python-urllib/3.4",
      "Python-urllib/3.5",
      "Python-urllib/3.6",
      "Python-urllib/3.7"
     ]
  }
  ,
  {
    "pattern": "python-requests",
    "addition_date": "2018/05/27",
    "instances": [
      "python-requests/2.9.2",
      "python-requests/2.11.1",
      "python-requests/2.18.4",
      "python-requests/2.19.1",
      "python-requests/2.20.0",
      "python-requests/2.21.0",
      "python-requests/2.22.0"
    ]
  }
  ,
  {
    "pattern": "aiohttp",
    "addition_date": "2019/12/23",
    "instances": [
      "Python/3.9 aiohttp/3.7.3",
      "Python/3.8 aiohttp/3.7.2",
      "Python/3.7 aiohttp/3.6.2a2"
    ],
    "url": "https://docs.aiohttp.org/en/stable/"
  }
  ,
  {
    "pattern": "httpx",
    "addition_date":" 2019/12/23",
    "instances": [
      "python-httpx/0.16.1",
      "python-httpx/0.13.0.dev1"
      
    ],
    "url": "https://www.python-httpx.org"
  }
  ,
  {
    "pattern": "libwww-perl",
    "instances": [
      "2Bone_LinkChecker/1.0 libwww-perl/6.03",
      "2Bone_LinkChkr/1.0 libwww-perl/6.03",
      "amibot - http://www.amidalla.de - tech@amidalla.com libwww-perl/5.831"
    ]
  }
  ,
  {
    "pattern": "httpunit",
    "instances": [
      "httpunit/1.x"
    ]
  }
  ,
  {
    "pattern": "nutch",
    "instances": [
      "NutchCVS/0.7.1 (Nutch; http://lucene.apache.org/nutch/bot.html; nutch-agent@lucene.apache.org)",
      "istellabot-nutch/Nutch-1.10"
    ]
  }
  ,
  {
    "pattern": "Go-http-client",
    "addition_date": "2016/03/26",
    "url": "https://golang.org/pkg/net/http/",
    "instances": [
      "Go-http-client/1.1",
      "Go-http-client/2.0"
    ]
  }
  ,
  {
    "pattern": "phpcrawl",
    "addition_date": "2012-09/17",
    "url": "http://phpcrawl.cuab.de/",
    "instances": [
      "phpcrawl"
    ]
  }
  ,
  {
    "pattern": "msnbot",
    "url": "http://search.msn.com/msnbot.htm",
    "instances": [
      "adidxbot/1.1 (+http://search.msn.com/msnbot.htm)",
      "adidxbot/2.0 (+http://search.msn.com/msnbot.htm)",
      "librabot/1.0 (+http://search.msn.com/msnbot.htm)",
      "librabot/2.0 (+http://search.msn.com/msnbot.htm)",
      "msnbot-NewsBlogs/2.0b (+http://search.msn.com/msnbot.htm)",
      "msnbot-UDiscovery/2.0b (+http://search.msn.com/msnbot.htm)",
      "msnbot-media/1.0 (+http://search.msn.com/msnbot.htm)",
      "msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)",
      "msnbot-media/2.0b (+http://search.msn.com/msnbot.htm)",
      "msnbot/1.0 (+http://search.msn.com/msnbot.htm)",
      "msnbot/1.1 (+http://search.msn.com/msnbot.htm)",
      "msnbot/2.0b (+http://search.msn.com/msnbot.htm)",
      "msnbot/2.0b (+http://search.msn.com/msnbot.htm).",
      "msnbot/2.0b (+http://search.msn.com/msnbot.htm)._"
    ]
  }
  ,
  {
    "pattern": "jyxobot",
    "instances": []
  }
  ,
  {
    "pattern": "FAST-WebCrawler",
    "instances": [
      "FAST-WebCrawler/3.6/FirstPage (atw-crawler at fast dot no;http://fast.no/support/crawler.asp)",
      "FAST-WebCrawler/3.7 (atw-crawler at fast dot no; http://fast.no/support/crawler.asp)",
      "FAST-WebCrawler/3.7/FirstPage (atw-crawler at fast dot no;http://fast.no/support/crawler.asp)",
      "FAST-WebCrawler/3.8"
    ]
  }
  ,
  {
    "pattern": "FAST Enterprise Crawler",
    "instances": [
      "FAST Enterprise Crawler 6 / Scirus scirus-crawler@fast.no; http://www.scirus.com/srsapp/contactus/",
      "FAST Enterprise Crawler 6 used by Schibsted (webcrawl@schibstedsok.no)"
    ]
  }
  ,
  {
    "pattern": "BIGLOTRON",
    "instances": [
      "BIGLOTRON (Beta 2;GNU/Linux)"
    ]
  }
  ,
  {
    "pattern": "Teoma",
    "instances": [
      "Mozilla/2.0 (compatible; Ask Jeeves/Teoma; +http://sp.ask.com/docs/about/tech_crawling.html)",
      "Mozilla/2.0 (compatible; Ask Jeeves/Teoma; +http://about.ask.com/en/docs/about/webmasters.shtml)"
    ],
    "url": "http://about.ask.com/en/docs/about/webmasters.shtml"
  }
  ,
  {
    "pattern": "convera",
    "instances": [
      "ConveraCrawler/0.9e (+http://ews.converasearch.com/crawl.htm)"
    ],
    "url": "http://ews.converasearch.com/crawl.htm"
  }
  ,
  {
    "pattern": "seekbot",
    "instances": [
      "Seekbot/1.0 (http://www.seekbot.net/bot.html) RobotsTxtFetcher/1.2"
    ],
    "url": "http://www.seekbot.net/bot.html"
  }
  ,
  {
    "pattern": "Gigabot",
    "instances": [
      "Gigabot/1.0",
      "Gigabot/2.0 (http://www.gigablast.com/spider.html)"
    ],
    "url": "http://www.gigablast.com/spider.html"
  }
  ,
  {
    "pattern": "Gigablast",
    "instances": [
      "GigablastOpenSource/1.0"
    ],
    "url": "https://github.com/gigablast/open-source-search-engine"
  }
  ,
  {
    "pattern": "exabot",
    "instances": [
      "Mozilla/5.0 (compatible; Alexabot/1.0; +http://www.alexa.com/help/certifyscan; certifyscan@alexa.com)",
      "Mozilla/5.0 (compatible; Exabot PyExalead/3.0; +http://www.exabot.com/go/robot)",
      "Mozilla/5.0 (compatible; Exabot-Images/3.0; +http://www.exabot.com/go/robot)",
      "Mozilla/5.0 (compatible; Exabot/3.0 (BiggerBetter); +http://www.exabot.com/go/robot)",
      "Mozilla/5.0 (compatible; Exabot/3.0; +http://www.exabot.com/go/robot)",
      "Mozilla/5.0 (compatible; Exabot/3.0;  http://www.exabot.com/go/robot)"
    ]
  }
  ,
  {
    "pattern": "ia_archiver",
    "instances": [
      "ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)",
      "ia_archiver-web.archive.org"
    ]
  }
  ,
  {
    "pattern": "GingerCrawler",
    "instances": [
      "GingerCrawler/1.0 (Language Assistant for Dyslexics; www.gingersoftware.com/crawler_agent.htm; support at ginger software dot com)"
    ]
  }
  ,
  {
    "pattern": "webmon ",
    "instances": []
  }
  ,
  {
    "pattern": "HTTrack",
    "instances": [
      "Mozilla/4.5 (compatible; HTTrack 3.0x; Windows 98)"
    ]
  }
  ,
  {
    "pattern": "grub.org",
    "instances": [
      "Mozilla/4.0 (compatible; grub-client-0.3.0; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.0.4; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.0.5; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.0.6; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.0.7; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.1.1; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.2.1; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.3.1; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.3.7; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.4.3; Crawl your own stuff with http://grub.org)",
      "Mozilla/4.0 (compatible; grub-client-1.5.3; Crawl your own stuff with http://grub.org)"
    ]
  }
  ,
  {
    "pattern": "UsineNouvelleCrawler",
    "instances": []
  }
  ,
  {
    "pattern": "antibot",
    "instances": []
  }
  ,
  {
    "pattern": "netresearchserver",
    "instances": []
  }
  ,
  {
    "pattern": "speedy",
    "instances": [
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) Speedy Spider (http://www.entireweb.com/about/search_tech/speedy_spider/)",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) Speedy Spider for SpeedyAds (http://www.entireweb.com/about/search_tech/speedy_spider/)",
      "Mozilla/5.0 (compatible; Speedy Spider; http://www.entireweb.com/about/search_tech/speedy_spider/)",
      "Speedy Spider (Entireweb; Beta/1.2; http://www.entireweb.com/about/search_tech/speedyspider/)",
      "Speedy Spider (http://www.entireweb.com/about/search_tech/speedy_spider/)"
    ]
  }
  ,
  {
    "pattern": "fluffy",
    "instances": []
  }
  ,
  {
    "pattern": "findlink",
    "instances": [
      "findlinks/1.0 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.3-beta8 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.3-beta9 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.5-beta7 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta1 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta1 (+http://wortschatz.uni-leipzig.de/findlinks/; YaCy 0.1; yacy.net)",
      "findlinks/1.1.6-beta2 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta3 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta4 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta5 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/1.1.6-beta6 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0.1 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0.2 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0.4 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0.5 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.0.9 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.1 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.1.3 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.1.5 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.2 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.5 (+http://wortschatz.uni-leipzig.de/findlinks/)",
      "findlinks/2.6 (+http://wortschatz.uni-leipzig.de/findlinks/)"
    ]
  }
  ,
  {
    "pattern": "msrbot",
    "instances": []
  }
  ,
  {
    "pattern": "panscient",
    "instances": [
      "panscient.com"
    ]
  }
  ,
  {
    "pattern": "yacybot",
    "instances": [
      "yacybot (/global; amd64 FreeBSD 10.3-RELEASE; java 1.8.0_77; GMT/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 FreeBSD 10.3-RELEASE-p7; java 1.7.0_95; GMT/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 FreeBSD 9.2-RELEASE-p10; java 1.7.0_65; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 2.6.32-042stab093.4; java 1.7.0_65; Etc/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 2.6.32-042stab094.8; java 1.7.0_79; America/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 2.6.32-042stab108.8; java 1.7.0_91; America/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 2.6.32-042stab111.11; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 2.6.32-042stab116.1; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 2.6.32-573.3.1.el6.x86_64; java 1.7.0_85; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.10.0-229.4.2.el7.x86_64; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.10.0-229.4.2.el7.x86_64; java 1.8.0_45; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.10.0-229.7.2.el7.x86_64; java 1.8.0_45; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.10.0-327.22.2.el7.x86_64; java 1.7.0_101; Etc/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.11.10-21-desktop; java 1.7.0_51; America/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.12.1; java 1.7.0_65; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-042stab093.4; java 1.7.0_79; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-042stab093.4; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-45-generic; java 1.7.0_75; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.13.0-61-generic; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-74-generic; java 1.7.0_91; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-83-generic; java 1.7.0_95; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-83-generic; java 1.7.0_95; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-85-generic; java 1.7.0_101; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-85-generic; java 1.7.0_95; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.13.0-88-generic; java 1.7.0_101; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.14-0.bpo.1-amd64; java 1.7.0_55; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.14.32-xxxx-grs-ipv6-64; java 1.7.0_75; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.14.32-xxxx-grs-ipv6-64; java 1.8.0_111; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_111; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_75; America/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_75; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_75; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_79; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_79; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_91; Europe/de) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.7.0_95; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16.0-4-amd64; java 1.8.0_111; Europe/en) http://yacy.net/bot.html",
      "yacybot (/global; amd64 Linux 3.16-0.bpo.2-amd64; java 1.7.0_65; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.19.0-15-generic; java 1.8.0_45-internal; Europe/de) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.2.0-4-amd64; java 1.7.0_65; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 3.2.0-4-amd64; java 1.7.0_67; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 4.4.0-57-generic; java 9-internal; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Windows 8.1 6.3; java 1.7.0_55; Europe/de) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Windows 8 6.2; java 1.7.0_55; Europe/de) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 5.2.8-Jinsol; java 12.0.2; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 5.2.9-Jinsol; java 12.0.2; Europe/en) http://yacy.net/bot.html",
      "yacybot (-global; amd64 Linux 5.2.11-Jinsol; java 12.0.2; Europe/en) http://yacy.net/bot.html"
    ]
  }
  ,
  {
    "pattern": "AISearchBot",
    "instances": []
  }
  ,
  {
    "pattern": "ips-agent",
    "instances": [
      "BlackBerry9000/4.6.0.167 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/102 ips-agent",
      "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.12; ips-agent) Gecko/20050922 Fedora/1.0.7-1.1.fc4 Firefox/1.0.7",
      "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1.3; ips-agent) Gecko/20090824 Fedora/1.0.7-1.1.fc4  Firefox/3.5.3",
      "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.24; ips-agent) Gecko/20111107 Ubuntu/10.04 (lucid) Firefox/3.6.24",
      "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:14.0; ips-agent) Gecko/20100101 Firefox/14.0.1"
    ]
  }
  ,
  {
    "pattern": "tagoobot",
    "instances": []
  }
  ,
  {
    "pattern": "MJ12bot",
    "instances": [
      "MJ12bot/v1.2.0 (http://majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.2.1; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.2.3; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.2.4; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.2.5; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.3.0; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.3.1; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.3.2; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.3.3; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.0; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.1; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.2; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.3; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.4 (domain ownership verifier); http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.4; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.5; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.6; http://mj12bot.com/)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.7; http://mj12bot.com/)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.7; http://www.majestic12.co.uk/bot.php?+)",
      "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)"
    ]
  }
  ,
  {
    "pattern": "woriobot",
    "instances": [
      "Mozilla/5.0 (compatible; woriobot +http://worio.com)",
      "Mozilla/5.0 (compatible; woriobot support [at] zite [dot] com +http://zite.com)"
    ]
  }
  ,
  {
    "pattern": "yanga",
    "instances": [
      "Yanga WorldSearch Bot v1.1/beta (http://www.yanga.co.uk/)"
    ]
  }
  ,
  {
    "pattern": "buzzbot",
    "instances": [
      "Buzzbot/1.0 (Buzzbot; http://www.buzzstream.com; buzzbot@buzzstream.com)"
    ]
  }
  ,
  {
    "pattern": "mlbot",
    "instances": [
      "MLBot (www.metadatalabs.com/mlbot)"
    ]
  }
  ,
  {
    "pattern": "YandexBot",
    "url": "http://yandex.com/bots",
    "instances": [
      "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexBot/3.0; MirrorDetector; +http://yandex.com/bots)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4 (compatible; YandexBot/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2015/04/14"
  }
  ,
  {
    "pattern": "YandexImages",
    "url": "http://yandex.com/bots",
    "instances": [
      "Mozilla/5.0 (compatible; YandexImages/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2015/04/14"
  }
  ,
  {
    "pattern": "YandexAccessibilityBot",
    "url": "http://yandex.com/bots",
    "instances": [
      "Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots"
    ],
    "addition_date": "2019/03/01"
  }
  ,
  {
    "pattern": "YandexMobileBot",
    "url": "https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4 (compatible; YandexMobileBot/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2016/12/01"
  }
  ,
  {
    "pattern": "YandexMetrika",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots yabs01)",
      "Mozilla/5.0 (compatible; YandexMetrika/3.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexMetrika/4.0; +http://yandex.com/bots)"
    ],
    "url": "https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml#robot-in-logs"
  }
  ,
  {
    "pattern": "YandexTurbo",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; YandexTurbo/1.0; +http://yandex.com/bots)"
    ],
    "url": "https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml#robot-in-logs"
  }
  ,
  {
    "pattern": "YandexImageResizer",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; YandexImageResizer/2.0; +http://yandex.com/bots)"
    ],
    "url": "https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml#robot-in-logs"
  }
  ,
  {
    "pattern": "YandexVideo",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; YandexVideoParser/1.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexVideo/3.0; +http://yandex.com/bots)"
    ],
    "url": "https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml#robot-in-logs"
  }
  ,
  {
    "pattern": "YandexAdNet",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexAdNet/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexBlogs",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexBlogs/0.99; robot; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexCalendar",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexCalendar/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexDirect",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexDirect/3.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexDirectDyn/1.0; +http://yandex.com/bots"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexFavicons",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexFavicons/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YaDirectFetcher",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YaDirectFetcher/1.0; Dyatel; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexForDomain",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexForDomain/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexMarket",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexMarket/1.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexMarket/2.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexMedia",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexMedia/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexMobileScreenShotBot",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexMobileScreenShotBot/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexNews",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexNews/4.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexOntoDB",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexOntoDB/1.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (compatible; YandexOntoDBAPI/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexPagechecker",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexPagechecker/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexPartner",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexPartner/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexRCA",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexRCA/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexSearchShop",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexSearchShop/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexSitelinks",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexSitelinks; Dyatel; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexSpravBot",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexSpravBot/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexTracker",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexTracker/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexVertis",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexVertis/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexVerticals",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexVerticals/1.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexWebmaster",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (compatible; YandexWebmaster/2.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "YandexScreenshotBot",
    "url": "https://yandex.ru/support/webmaster/robot-workings/check-yandex-robots.html#robot-in-logs",
    "instances": [
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36 (compatible; YandexScreenshotBot/3.0; +http://yandex.com/bots)"
    ],
    "addition_date": "2020/11/30"
  }
  ,
  {
    "pattern": "purebot",
    "addition_date": "2010/01/19",
    "instances": []
  }
  ,
  {
    "pattern": "Linguee Bot",
    "addition_date": "2010/01/26",
    "url": "http://www.linguee.com/bot",
    "instances": [
      "Linguee Bot (http://www.linguee.com/bot)",
      "Linguee Bot (http://www.linguee.com/bot; bot@linguee.com)"
    ]
  }
  ,
  {
    "pattern": "CyberPatrol",
    "addition_date": "2010/02/11",
    "url": "http://www.cyberpatrol.com/cyberpatrolcrawler.asp",
    "instances": [
      "CyberPatrol SiteCat Webbot (http://www.cyberpatrol.com/cyberpatrolcrawler.asp)"
    ]
  }
  ,
  {
    "pattern": "voilabot",
    "addition_date": "2010/05/18",
    "instances": [
      "Mozilla/5.0 (Windows NT 5.1; U; Win64; fr; rv:1.8.1) VoilaBot BETA 1.2 (support.voilabot@orange-ftgroup.com)",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; fr; rv:1.8.1) VoilaBot BETA 1.2 (support.voilabot@orange-ftgroup.com)"
    ]
  }
  ,
  {
    "pattern": "Baiduspider",
    "addition_date": "2010/07/15",
    "url": "http://www.baidu.jp/spider/",
    "instances": [
      "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
      "Mozilla/5.0 (compatible; Baiduspider-render/2.0; +http://www.baidu.com/search/spider.html)"
    ]
  }
  ,
  {
    "pattern": "citeseerxbot",
    "addition_date": "2010/07/17",
    "instances": []
  }
  ,
  {
    "pattern": "spbot",
    "addition_date": "2010/07/31",
    "url": "http://www.seoprofiler.com/bot",
    "instances": [
      "Mozilla/5.0 (compatible; spbot/1.0; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/1.1; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/1.2; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/2.0.1; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/2.0.2; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/2.0.3; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/2.0.4; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/2.0; +http://www.seoprofiler.com/bot/ )",
      "Mozilla/5.0 (compatible; spbot/2.1; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/3.0; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/3.1; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.1; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.2; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.3; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.4; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.5; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.6; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.7; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.7; +https://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.8; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0.9; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0a; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.0b; +http://www.seoprofiler.com/bot )",
      "Mozilla/5.0 (compatible; spbot/4.1.0; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.2.0; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.3.0; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.4.0; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.4.1; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/4.4.2; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/5.0.1; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/5.0.2; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/5.0.3; +http://OpenLinkProfiler.org/bot )",
      "Mozilla/5.0 (compatible; spbot/5.0; +http://OpenLinkProfiler.org/bot )"
    ]
  }
  ,
  {
    "pattern": "twengabot",
    "addition_date": "2010/08/03",
    "url": "http://www.twenga.com/bot.html",
    "instances": []
  }
  ,
  {
    "pattern": "postrank",
    "addition_date": "2010/08/03",
    "url": "http://www.postrank.com",
    "instances": [
      "PostRank/2.0 (postrank.com)",
      "PostRank/2.0 (postrank.com; 1 subscribers)"
    ]
  }
  ,
  {
    "pattern": "TurnitinBot",
    "addition_date": "2010/09/26",
    "url": "http://www.turnitin.com",
    "instances": [
      "TurnitinBot (https://turnitin.com/robot/crawlerinfo.html)"
    ]
  }
  ,
  {
    "pattern": "scribdbot",
    "addition_date": "2010/09/28",
    "url": "http://www.scribd.com",
    "instances": []
  }
  ,
  {
    "pattern": "page2rss",
    "addition_date": "2010/10/07",
    "url": "http://www.page2rss.com",
    "instances": [
      "Mozilla/5.0 (compatible;  Page2RSS/0.7; +http://page2rss.com/)"
    ]
  }
  ,
  {
    "pattern": "sitebot",
    "addition_date": "2010/12/15",
    "url": "http://www.sitebot.org",
    "instances": [
      "Mozilla/5.0 (compatible; Whoiswebsitebot/0.1; +http://www.whoiswebsite.net)"
    ]
  }
  ,
  {
    "pattern": "linkdex",
    "addition_date": "2011/01/06",
    "url": "http://www.linkdex.com",
    "instances": [
      "Mozilla/5.0 (compatible; linkdexbot/2.0; +http://www.linkdex.com/about/bots/)",
      "Mozilla/5.0 (compatible; linkdexbot/2.0; +http://www.linkdex.com/bots/)",
      "Mozilla/5.0 (compatible; linkdexbot/2.1; +http://www.linkdex.com/about/bots/)",
      "Mozilla/5.0 (compatible; linkdexbot/2.1; +http://www.linkdex.com/bots/)",
      "Mozilla/5.0 (compatible; linkdexbot/2.2; +http://www.linkdex.com/bots/)",
      "linkdex.com/v2.0",
      "linkdexbot/Nutch-1.0-dev (http://www.linkdex.com/; crawl at linkdex dot com)"
    ]
  }
  ,
  {
    "pattern": "Adidxbot",
    "url": "http://onlinehelp.microsoft.com/en-us/bing/hh204496.aspx",
    "instances": []
  }
  ,
  {
    "pattern": "ezooms",
    "addition_date": "2011/04/27",
    "url": "http://www.phpbb.com/community/viewtopic.php?f=64&t=935605&start=450#p12948289",
    "instances": [
      "Mozilla/5.0 (compatible; Ezooms/1.0; ezooms.bot@gmail.com)"
    ]
  }
  ,
  {
    "pattern": "dotbot",
    "addition_date": "2011/04/27",
    "instances": [
      "Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)",
      "dotbot"
    ]
  }
  ,
  {
    "pattern": "Mail.RU_Bot",
    "addition_date": "2011/04/27",
    "instances": [
      "Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +http://go.mail.ru/help/robots)",
      "Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +http://go.mail.ru/",
      "Mozilla/5.0 (compatible; Mail.RU_Bot/2.0; +http://go.mail.ru/",
      "Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/Robots/2.0; +http://go.mail.ru/help/robots)"
    ]
  }
  ,
  {
    "pattern": "discobot",
    "addition_date": "2011/05/03",
    "url": "http://discoveryengine.com/discobot.html",
    "instances": [
      "Mozilla/5.0 (compatible; discobot/1.0; +http://discoveryengine.com/discobot.html)",
      "Mozilla/5.0 (compatible; discobot/2.0; +http://discoveryengine.com/discobot.html)",
      "mozilla/5.0 (compatible; discobot/1.1; +http://discoveryengine.com/discobot.html)"
    ]
  }
  ,
  {
    "pattern": "heritrix",
    "addition_date": "2011/06/21",
    "url": "https://github.com/internetarchive/heritrix3/wiki",
    "instances": [
      "Mozilla/5.0 (compatible; heritrix/1.12.1 +http://www.webarchiv.cz)",
      "Mozilla/5.0 (compatible; heritrix/1.12.1b +http://netarkivet.dk/website/info.html)",
      "Mozilla/5.0 (compatible; heritrix/1.14.2 +http://rjpower.org)",
      "Mozilla/5.0 (compatible; heritrix/1.14.2 +http://www.webarchiv.cz)",
      "Mozilla/5.0 (compatible; heritrix/1.14.3 +http://archive.org)",
      "Mozilla/5.0 (compatible; heritrix/1.14.3 +http://www.accelobot.com)",
      "Mozilla/5.0 (compatible; heritrix/1.14.3 +http://www.webarchiv.cz)",
      "Mozilla/5.0 (compatible; heritrix/1.14.3.r6601 +http://www.buddybuzz.net/yptrino)",
      "Mozilla/5.0 (compatible; heritrix/1.14.4 +http://parsijoo.ir)",
      "Mozilla/5.0 (compatible; heritrix/1.14.4 +http://www.exif-search.com)",
      "Mozilla/5.0 (compatible; heritrix/2.0.2 +http://aihit.com)",
      "Mozilla/5.0 (compatible; heritrix/2.0.2 +http://seekda.com)",
      "Mozilla/5.0 (compatible; heritrix/3.0.0-SNAPSHOT-20091120.021634 +http://crawler.archive.org)",
      "Mozilla/5.0 (compatible; heritrix/3.1.0-RC1 +http://boston.lti.cs.cmu.edu/crawler_12/)",
      "Mozilla/5.0 (compatible; heritrix/3.1.1 +http://places.tomtom.com/crawlerinfo)",
      "Mozilla/5.0 (compatible; heritrix/3.1.1 +http://www.mixdata.com)",
      "Mozilla/5.0 (compatible; heritrix/3.1.1; UniLeipzigASV +http://corpora.informatik.uni-leipzig.de/crawler_faq.html)",
      "Mozilla/5.0 (compatible; heritrix/3.2.0 +http://www.crim.ca)",
      "Mozilla/5.0 (compatible; heritrix/3.2.0 +http://www.exif-search.com)",
      "Mozilla/5.0 (compatible; heritrix/3.2.0 +http://www.mixdata.com)",
      "Mozilla/5.0 (compatible; heritrix/3.3.0-SNAPSHOT-20160309-0050; UniLeipzigASV +http://corpora.informatik.uni-leipzig.de/crawler_faq.html)",
      "Mozilla/5.0 (compatible; sukibot_heritrix/3.1.1 +http://suki.ling.helsinki.fi/eng/webmasters.html)"
    ]
  }
  ,
  {
    "pattern": "findthatfile",
    "addition_date": "2011/06/21",
    "url": "http://www.findthatfile.com/",
    "instances": []
  }
  ,
  {
    "pattern": "europarchive.org",
    "addition_date": "2011/06/21",
    "url": "",
    "instances": [
      "Mozilla/5.0 (compatible; MSIE 7.0 +http://www.europarchive.org)"
    ]
  }
  ,
  {
    "pattern": "NerdByNature.Bot",
    "addition_date": "2011/07/12",
    "url": "http://www.nerdbynature.net/bot",
    "instances": [
      "Mozilla/5.0 (compatible; NerdByNature.Bot; http://www.nerdbynature.net/bot)"
    ]
  }
  ,
  {
    "pattern": "sistrix crawler",
    "addition_date": "2011/08/02",
    "instances": []
  }
  ,
  {
    "pattern": "Ahrefs(Bot|SiteAudit)",
    "addition_date": "2011/08/28",
    "instances": [
      "Mozilla/5.0 (compatible; AhrefsBot/6.1; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsSiteAudit/6.1; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsBot/5.2; News; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsBot/5.2; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsSiteAudit/5.2; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsBot/6.1; News; +http://ahrefs.com/robot/)"
    ]
  }
  ,
  {
    "pattern": "fuelbot",
    "addition_date": "2018/06/28",
    "instances": [
      "fuelbot"
    ]
  }
  ,
  {
    "pattern": "CrunchBot",
    "addition_date": "2018/06/28",
    "instances": [
      "CrunchBot/1.0 (+http://www.leadcrunch.com/crunchbot)"
    ]
  }
  ,
  {
    "pattern": "IndeedBot",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0 (IndeedBot 1.1)"
    ]
  }
  ,
  {
    "pattern": "mappydata",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; Mappy/1.0; +http://mappydata.net/bot/)"
    ]
  }
  ,
  {
    "pattern": "woobot",
    "addition_date": "2018/06/28",
    "instances": [
      "woobot"
    ]
  }
  ,
  {
    "pattern": "ZoominfoBot",
    "addition_date": "2018/06/28",
    "instances": [
      "ZoominfoBot (zoominfobot at zoominfo dot com)"
    ]
  }
  ,
  {
    "pattern": "PrivacyAwareBot",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; PrivacyAwareBot/1.1; +http://www.privacyaware.org)"
    ]
  }
  ,
  {
    "pattern": "Multiviewbot",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Multiviewbot"
    ]
  }
  ,
  {
    "pattern": "SWIMGBot",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36 SWIMGBot"
    ]
  }
  ,
  {
    "pattern": "Grobbot",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; Grobbot/2.2; +https://grob.it)"
    ]
  }
  ,
  {
    "pattern": "eright",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; eright/1.0; +bot@eright.com)"
    ]
  }
  ,
  {
    "pattern": "Apercite",
    "addition_date": "2018/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; Apercite; +http://www.apercite.fr/robot/index.html)"
    ]
  }
  ,
  {
    "pattern": "semanticbot",
    "addition_date": "2018/06/28",
    "instances": [
      "semanticbot",
      "semanticbot (info@semanticaudience.com)"
    ]
  }
  ,
  {
    "pattern": "Aboundex",
    "addition_date": "2011/09/28",
    "url": "http://www.aboundex.com/crawler/",
    "instances": [
      "Aboundex/0.2 (http://www.aboundex.com/crawler/)",
      "Aboundex/0.3 (http://www.aboundex.com/crawler/)"
    ]
  }
  ,
  {
    "pattern": "domaincrawler",
    "addition_date": "2011/10/21",
    "instances": [
      "CipaCrawler/3.0 (info@domaincrawler.com; http://www.domaincrawler.com/www.example.com)"
    ]
  }
  ,
  {
    "pattern": "wbsearchbot",
    "addition_date": "2011/12/21",
    "url": "http://www.warebay.com/bot.html",
    "instances": []
  }
  ,
  {
    "pattern": "summify",
    "addition_date": "2012/01/04",
    "url": "http://summify.com",
    "instances": [
      "Summify (Summify/1.0.1; +http://summify.com)"
    ]
  }
  ,
  {
    "pattern": "CCBot",
    "addition_date": "2012/02/05",
    "url": "http://www.commoncrawl.org/bot.html",
    "instances": [
      "CCBot/2.0 (http://commoncrawl.org/faq/)",
      "CCBot/2.0 (https://commoncrawl.org/faq/)"
    ]
  }
  ,
  {
    "pattern": "edisterbot",
    "addition_date": "2012/02/25",
    "instances": []
  }
  ,
  {
    "pattern": "seznambot",
    "addition_date": "2012/03/14",
    "instances": [
      "Mozilla/5.0 (compatible; SeznamBot/3.2-test1-1; +http://napoveda.seznam.cz/en/seznambot-intro/)",
      "Mozilla/5.0 (compatible; SeznamBot/3.2-test1; +http://napoveda.seznam.cz/en/seznambot-intro/)",
      "Mozilla/5.0 (compatible; SeznamBot/3.2-test2; +http://napoveda.seznam.cz/en/seznambot-intro/)",
      "Mozilla/5.0 (compatible; SeznamBot/3.2-test4; +http://napoveda.seznam.cz/en/seznambot-intro/)",
      "Mozilla/5.0 (compatible; SeznamBot/3.2; +http://napoveda.seznam.cz/en/seznambot-intro/)"
    ]
  }
  ,
  {
    "pattern": "ec2linkfinder",
    "addition_date": "2012/03/22",
    "instances": [
      "ec2linkfinder"
    ]
  }
  ,
  {
    "pattern": "gslfbot",
    "addition_date": "2012/04/03",
    "instances": []
  }
  ,
  {
    "pattern": "aiHitBot",
    "addition_date": "2012/04/16",
    "instances": [
      "Mozilla/5.0 (compatible; aiHitBot/2.9; +https://www.aihitdata.com/about)"
    ]
  }
  ,
  {
    "pattern": "intelium_bot",
    "addition_date": "2012/05/07",
    "instances": []
  }
  ,
  {
    "pattern": "facebookexternalhit",
    "addition_date": "2012/05/07",
    "instances": [
      "facebookexternalhit/1.0 (+http://www.facebook.com/externalhit_uatext.php)",
      "facebookexternalhit/1.1",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
    ],
    "url": "https://developers.facebook.com/docs/sharing/webmasters/crawler/"
  }
  ,
  {
    "pattern": "Yeti",
    "addition_date": "2012/05/07",
    "url": "http://naver.me/bot",
    "instances": [
      "Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)"
    ]
  }
  ,
  {
    "pattern": "RetrevoPageAnalyzer",
    "addition_date": "2012/05/07",
    "instances": [
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; RetrevoPageAnalyzer; +http://www.retrevo.com/content/about-us)"
    ]
  }
  ,
  {
    "pattern": "lb-spider",
    "addition_date": "2012/05/07",
    "instances": []
  }
  ,
  {
    "pattern": "Sogou",
    "addition_date": "2012/05/13",
    "url": "http://www.sogou.com/docs/help/webmasters.htm#07",
    "instances": [
      "Sogou News Spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
      "Sogou Pic Spider/3.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
      "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)"
    ]
  }
  ,
  {
    "pattern": "lssbot",
    "addition_date": "2012/05/15",
    "instances": []
  }
  ,
  {
    "pattern": "careerbot",
    "addition_date": "2012/05/23",
    "url": "http://www.career-x.de/bot.html",
    "instances": []
  }
  ,
  {
    "pattern": "wotbox",
    "addition_date": "2012/06/12",
    "url": "http://www.wotbox.com",
    "instances": [
      "Wotbox/2.0 (bot@wotbox.com; http://www.wotbox.com)",
      "Wotbox/2.01 (+http://www.wotbox.com/bot/)"
    ]
  }
  ,
  {
    "pattern": "wocbot",
    "addition_date": "2012/07/25",
    "url": "http://www.wocodi.com/crawler",
    "instances": []
  }
  ,
  {
    "pattern": "ichiro",
    "addition_date": "2012/08/28",
    "url": "http://help.goo.ne.jp/help/article/1142",
    "instances": [
      "DoCoMo/2.0 P900i(c100;TB;W24H11) (compatible; ichiro/mobile goo; +http://help.goo.ne.jp/help/article/1142/)",
      "DoCoMo/2.0 P900i(c100;TB;W24H11) (compatible; ichiro/mobile goo; +http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
      "DoCoMo/2.0 P900i(c100;TB;W24H11) (compatible; ichiro/mobile goo;+http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
      "DoCoMo/2.0 P900i(c100;TB;W24H11)(compatible; ichiro/mobile goo;+http://help.goo.ne.jp/door/crawler.html)",
      "DoCoMo/2.0 P901i(c100;TB;W24H11) (compatible; ichiro/mobile goo; +http://help.goo.ne.jp/door/crawler.html)",
      "KDDI-CA31 UP.Browser/6.2.0.7.3.129 (GUI) MMP/2.0 (compatible; ichiro/mobile goo; +http://help.goo.ne.jp/help/article/1142/)",
      "KDDI-CA31 UP.Browser/6.2.0.7.3.129 (GUI) MMP/2.0 (compatible; ichiro/mobile goo; +http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
      "KDDI-CA31 UP.Browser/6.2.0.7.3.129 (GUI) MMP/2.0 (compatible; ichiro/mobile goo;+http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
      "ichiro/2.0 (http://help.goo.ne.jp/door/crawler.html)",
      "ichiro/2.0 (ichiro@nttr.co.jp)",
      "ichiro/3.0 (http://help.goo.ne.jp/door/crawler.html)",
      "ichiro/3.0 (http://help.goo.ne.jp/help/article/1142)",
      "ichiro/3.0 (http://search.goo.ne.jp/option/use/sub4/sub4-1/)",
      "ichiro/4.0 (http://help.goo.ne.jp/door/crawler.html)",
      "ichiro/5.0 (http://help.goo.ne.jp/door/crawler.html)"
    ]
  }
  ,
  {
    "pattern": "DuckDuckBot",
    "addition_date": "2012/09/19",
    "url": "http://duckduckgo.com/duckduckbot.html",
    "instances": [
      "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
      "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)",
      "Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; https://duckduckgo.com/duckduckbot)",
      "'Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; https://duckduckgo.com/duckduckbot)'"
    ]
  }
  ,
  {
    "pattern": "lssrocketcrawler",
    "addition_date": "2012/09/24",
    "instances": []
  }
  ,
  {
    "pattern": "drupact",
    "addition_date": "2012/09/27",
    "url": "http://www.arocom.de/drupact",
    "instances": [
      "drupact/0.7; http://www.arocom.de/drupact"
    ]
  }
  ,
  {
    "pattern": "webcompanycrawler",
    "addition_date": "2012/10/03",
    "instances": []
  }
  ,
  {
    "pattern": "acoonbot",
    "addition_date": "2012/10/07",
    "url": "http://www.acoon.de/robot.asp",
    "instances": []
  }
  ,
  {
    "pattern": "openindexspider",
    "addition_date": "2012/10/26",
    "url": "http://www.openindex.io/en/webmasters/spider.html",
    "instances": []
  }
  ,
  {
    "pattern": "gnam gnam spider",
    "addition_date": "2012/10/31",
    "instances": []
  }
  ,
  {
    "pattern": "web-archive-net.com.bot",
    "instances": []
  }
  ,
  {
    "pattern": "backlinkcrawler",
    "addition_date": "2013/01/04",
    "instances": []
  }
  ,
  {
    "pattern": "coccoc",
    "addition_date": "2013/01/04",
    "url": "http://help.coccoc.vn/",
    "instances": [
      "Mozilla/5.0 (compatible; coccoc/1.0; +http://help.coccoc.com/)",
      "Mozilla/5.0 (compatible; coccoc/1.0; +http://help.coccoc.com/searchengine)",
      "Mozilla/5.0 (compatible; coccocbot-image/1.0; +http://help.coccoc.com/searchengine)",
      "Mozilla/5.0 (compatible; coccocbot-web/1.0; +http://help.coccoc.com/searchengine)",
      "Mozilla/5.0 (compatible; image.coccoc/1.0; +http://help.coccoc.com/)",
      "Mozilla/5.0 (compatible; imagecoccoc/1.0; +http://help.coccoc.com/)",
      "Mozilla/5.0 (compatible; imagecoccoc/1.0; +http://help.coccoc.com/searchengine)",
      "coccoc",
      "coccoc/1.0 ()",
      "coccoc/1.0 (http://help.coccoc.com/)",
      "coccoc/1.0 (http://help.coccoc.vn/)"
    ]
  }
  ,
  {
    "pattern": "integromedb",
    "addition_date": "2013/01/10",
    "url": "http://www.integromedb.org/Crawler",
    "instances": [
      "www.integromedb.org/Crawler"
    ]
  }
  ,
  {
    "pattern": "content crawler spider",
    "addition_date": "2013/01/11",
    "instances": []
  }
  ,
  {
    "pattern": "toplistbot",
    "addition_date": "2013/02/05",
    "instances": []
  }
  ,
  {
    "pattern": "it2media-domain-crawler",
    "addition_date": "2013/03/12",
    "instances": [
      "it2media-domain-crawler/1.0 on crawler-prod.it2media.de",
      "it2media-domain-crawler/2.0"
    ]
  }
  ,
  {
    "pattern": "ip-web-crawler.com",
    "addition_date": "2013/03/22",
    "instances": []
  }
  ,
  {
    "pattern": "siteexplorer.info",
    "addition_date": "2013/05/01",
    "instances": [
      "Mozilla/5.0 (compatible; SiteExplorer/1.0b; +http://siteexplorer.info/)",
      "Mozilla/5.0 (compatible; SiteExplorer/1.1b; +http://siteexplorer.info/Backlink-Checker-Spider/)"
    ]
  }
  ,
  {
    "pattern": "elisabot",
    "addition_date": "2013/06/27",
    "instances": []
  }
  ,
  {
    "pattern": "proximic",
    "addition_date": "2013/09/12",
    "url": "http://www.proximic.com/info/spider.php",
    "instances": [
      "Mozilla/5.0 (compatible; proximic; +http://www.proximic.com)",
      "Mozilla/5.0 (compatible; proximic; +http://www.proximic.com/info/spider.php)"
    ]
  }
  ,
  {
    "pattern": "changedetection",
    "addition_date": "2013/09/13",
    "url": "http://www.changedetection.com/bot.html",
    "instances": [
      "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1;  http://www.changedetection.com/bot.html )"
    ]
  }
  ,
  {
    "pattern": "arabot",
    "addition_date": "2013/10/09",
    "instances": []
  }
  ,
  {
    "pattern": "WeSEE:Search",
    "addition_date": "2013/11/18",
    "instances": [
      "WeSEE:Search",
      "WeSEE:Search/0.1 (Alpha, http://www.wesee.com/en/support/bot/)"
    ]
  }
  ,
  {
    "pattern": "niki-bot",
    "addition_date": "2014/01/01",
    "instances": []
  }
  ,
  {
    "pattern": "CrystalSemanticsBot",
    "addition_date": "2014/02/17",
    "url": "http://www.crystalsemantics.com/user-agent/",
    "instances": []
  }
  ,
  {
    "pattern": "rogerbot",
    "addition_date": "2014/02/28",
    "url": "http://moz.com/help/pro/what-is-rogerbot-",
    "instances": [
      "Mozilla/5.0 (compatible; rogerBot/1.0; UrlCrawler; http://www.seomoz.org/dp/rogerbot)",
      "rogerbot/1.0 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-crawler+partager@moz.com)",
      "rogerbot/1.0 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-crawler+shiny@moz.com)",
      "rogerbot/1.0 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-wherecat@moz.com",
      "rogerbot/1.0 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-wherecat@moz.com)",
      "rogerbot/1.0 (http://www.moz.com/dp/rogerbot, rogerbot-crawler@moz.com)",
      "rogerbot/1.0 (http://www.seomoz.org/dp/rogerbot, rogerbot-crawler+shiny@seomoz.org)",
      "rogerbot/1.0 (http://www.seomoz.org/dp/rogerbot, rogerbot-crawler@seomoz.org)",
      "rogerbot/1.0 (http://www.seomoz.org/dp/rogerbot, rogerbot-wherecat@moz.com)",
      "rogerbot/1.1 (http://moz.com/help/guides/search-overview/crawl-diagnostics#more-help, rogerbot-crawler+pr2-crawler-05@moz.com)",
      "rogerbot/1.1 (http://moz.com/help/guides/search-overview/crawl-diagnostics#more-help, rogerbot-crawler+pr4-crawler-11@moz.com)",
      "rogerbot/1.1 (http://moz.com/help/guides/search-overview/crawl-diagnostics#more-help, rogerbot-crawler+pr4-crawler-15@moz.com)",
      "rogerbot/1.2 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-crawler+phaser-testing-crawler-01@moz.com)"
    ]
  }
  ,
  {
    "pattern": "360Spider",
    "addition_date": "2014/03/14",
    "url": "http://needs-be.blogspot.co.uk/2013/02/how-to-block-spider360.html",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1; 360Spider",
      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1; 360Spider(compatible; HaosouSpider; http://www.haosou.com/help/help_3_2.html)",
      "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 QIHU 360SE; 360Spider",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; )  Firefox/1.5.0.11; 360Spider",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.8.0.11)  Firefox/1.5.0.11; 360Spider",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.8.0.11) Firefox/1.5.0.11 360Spider;",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.8.0.11) Gecko/20070312 Firefox/1.5.0.11; 360Spider",
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0); 360Spider",
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0); 360Spider(compatible; HaosouSpider; http://www.haosou.com/help/help_3_2.html)",
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36; 360Spider"
    ]
  }
  ,
  {
    "pattern": "psbot",
    "addition_date": "2014/03/31",
    "url": "http://www.picsearch.com/bot.html",
    "instances": [
      "psbot-image (+http://www.picsearch.com/bot.html)",
      "psbot-page (+http://www.picsearch.com/bot.html)",
      "psbot/0.1 (+http://www.picsearch.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "InterfaxScanBot",
    "addition_date": "2014/03/31",
    "url": "http://scan-interfax.ru",
    "instances": []
  }
  ,
  {
    "pattern": "CC Metadata Scaper",
    "addition_date": "2014/04/01",
    "url": "http://wiki.creativecommons.org/Metadata_Scraper",
    "instances": [
      "CC Metadata Scaper http://wiki.creativecommons.org/Metadata_Scraper"
    ]
  }
  ,
  {
    "pattern": "g00g1e.net",
    "addition_date": "2014/04/01",
    "url": "http://www.g00g1e.net/",
    "instances": []
  }
  ,
  {
    "pattern": "GrapeshotCrawler",
    "addition_date": "2014/04/01",
    "url": "http://www.grapeshot.co.uk/crawler.php",
    "instances": [
      "Mozilla/5.0 (compatible; GrapeshotCrawler/2.0; +http://www.grapeshot.co.uk/crawler.php)"
    ]
  }
  ,
  {
    "pattern": "urlappendbot",
    "addition_date": "2014/05/10",
    "url": "http://www.profound.net/urlappendbot.html",
    "instances": [
      "Mozilla/5.0 (compatible; URLAppendBot/1.0; +http://www.profound.net/urlappendbot.html)"
    ]
  }
  ,
  {
    "pattern": "brainobot",
    "addition_date": "2014/06/24",
    "instances": []
  }
  ,
  {
    "pattern": "fr-crawler",
    "addition_date": "2014/07/31",
    "instances": [
      "Mozilla/5.0 (compatible; fr-crawler/1.1)"
    ]
  }
  ,
  {
    "pattern": "binlar",
    "addition_date": "2014/09/12",
    "instances": [
      "binlar_2.6.3 binlar2.6.3@unspecified.mail",
      "binlar_2.6.3 binlar_2.6.3@unspecified.mail",
      "binlar_2.6.3 larbin2.6.3@unspecified.mail",
      "binlar_2.6.3 phanendra_kalapala@McAfee.com",
      "binlar_2.6.3 test@mgmt.mic"
    ]
  }
  ,
  {
    "pattern": "SimpleCrawler",
    "addition_date": "2014/09/12",
    "instances": [
      "SimpleCrawler/0.1"
    ]
  }
  ,
  {
    "pattern": "Twitterbot",
    "addition_date": "2014/09/12",
    "url": "https://dev.twitter.com/cards/getting-started",
    "instances": [
      "Twitterbot/0.1",
      "Twitterbot/1.0"
    ]
  }
  ,
  {
    "pattern": "cXensebot",
    "addition_date": "2014/10/05",
    "instances": [
      "cXensebot/1.1a"
    ],
    "url": "http://www.cxense.com/bot.html"
  }
  ,
  {
    "pattern": "smtbot",
    "addition_date": "2014/10/04",
    "instances": [
      "Mozilla/5.0 (compatible; SMTBot/1.0; +http://www.similartech.com/smtbot)",
      "SMTBot (similartech.com/smtbot)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko)                 Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; SMTBot/1.0; +http://www.similartech.com/smtbot)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36 (compatible; SMTBot/1.0; +http://www.similartech.com/smtbot)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36 (compatible; SMTBot/1.0; http://www.similartech.com/smtbot)"
    ],
    "url": "http://www.similartech.com/smtbot"
  }
  ,
  {
    "pattern": "bnf.fr_bot",
    "addition_date": "2014/11/18",
    "url": "http://www.bnf.fr/fr/outils/a.dl_web_capture_robot.html",
    "instances": [
      "Mozilla/5.0 (compatible; bnf.fr_bot; +http://bibnum.bnf.fr/robot/bnf.html)",
      "Mozilla/5.0 (compatible; bnf.fr_bot; +http://www.bnf.fr/fr/outils/a.dl_web_capture_robot.html)"
    ]
  }
  ,
  {
    "pattern": "A6-Indexer",
    "addition_date": "2014/12/05",
    "url": "http://www.a6corp.com/a6-web-scraping-policy/",
    "instances": [
      "A6-Indexer"
    ]
  }
  ,
  {
    "pattern": "ADmantX",
    "addition_date": "2014/12/05",
    "url": "http://www.admantx.com",
    "instances": [
      "ADmantX Platform Semantic Analyzer - ADmantX Inc. - www.admantx.com - support@admantx.com"
    ]
  }
  ,
  {
    "pattern": "Facebot",
    "url": "https://developers.facebook.com/docs/sharing/best-practices#crawl",
    "addition_date": "2014/12/30",
    "instances": [
      "Facebot/1.0"
    ]
  }
  ,
  {
    "pattern": "OrangeBot\\/",
    "instances": [
      "Mozilla/5.0 (compatible; OrangeBot/2.0; support.orangebot@orange.com"
    ],
    "addition_date": "2015/01/12"
  }
  ,
  {
    "pattern": "memorybot",
    "url": "http://mignify.com/bot.htm",
    "instances": [
      "Mozilla/5.0 (compatible; memorybot/1.21.14 +http://mignify.com/bot.html)"
    ],
    "addition_date": "2015/02/01"
  }
  ,
  {
    "pattern": "AdvBot",
    "url": "http://advbot.net/bot.html",
    "instances": [
      "Mozilla/5.0 (compatible; AdvBot/2.0; +http://advbot.net/bot.html)"
    ],
    "addition_date": "2015/02/01"
  }
  ,
  {
    "pattern": "MegaIndex",
    "url": "https://www.megaindex.ru/?tab=linkAnalyze",
    "instances": [
      "Mozilla/5.0 (compatible; MegaIndex.ru/2.0; +https://www.megaindex.ru/?tab=linkAnalyze)",
      "Mozilla/5.0 (compatible; MegaIndex.ru/2.0; +http://megaindex.com/crawler)"
    ],
    "addition_date": "2015/03/28"
  }
  ,
  {
    "pattern": "SemanticScholarBot",
    "url": "https://www.semanticscholar.org/crawler",
    "instances": [
      "SemanticScholarBot/1.0 (+http://s2.allenai.org/bot.html)",
      "Mozilla/5.0 (compatible) SemanticScholarBot (+https://www.semanticscholar.org/crawler)"
    ],
    "addition_date": "2015/03/28"
  }
  ,
  {
    "pattern": "ltx71",
    "url": "http://ltx71.com/",
    "instances": [
      "ltx71 - (http://ltx71.com/)"
    ],
    "addition_date": "2015/04/04"
  }
  ,
  {
    "pattern": "nerdybot",
    "url": "http://nerdybot.com/",
    "instances": [
      "nerdybot"
    ],
    "addition_date": "2015/04/05"
  }
  ,
  {
    "pattern": "xovibot",
    "url": "http://www.xovibot.net/",
    "instances": [
      "Mozilla/5.0 (compatible; XoviBot/2.0; +http://www.xovibot.net/)"
    ],
    "addition_date": "2015/04/05"
  }
  ,
  {
    "pattern": "BUbiNG",
    "url": "http://law.di.unimi.it/BUbiNG.html",
    "instances": [
      "BUbiNG (+http://law.di.unimi.it/BUbiNG.html)"
    ],
    "addition_date": "2015/04/06"
  }
  ,
  {
    "pattern": "Qwantify",
    "url": "https://www.qwant.com/",
    "instances": [
      "Mozilla/5.0 (compatible; Qwantify/2.0n; +https://www.qwant.com/)/*",
      "Mozilla/5.0 (compatible; Qwantify/2.4w; +https://www.qwant.com/)/2.4w",
      "Mozilla/5.0 (compatible; Qwantify/Bleriot/1.1; +https://help.qwant.com/bot)",
      "Mozilla/5.0 (compatible; Qwantify/Bleriot/1.2.1; +https://help.qwant.com/bot)"
    ],
    "addition_date": "2015/04/06"
  }
  ,
  {
    "pattern": "archive.org_bot",
    "url": "http://www.archive.org/details/archive.org_bot",
    "depends_on": ["heritrix"],
    "instances": [
      "Mozilla/5.0 (compatible; heritrix/3.1.1-SNAPSHOT-20120116.200628 +http://www.archive.org/details/archive.org_bot)",
      "Mozilla/5.0 (compatible; archive.org_bot/heritrix-1.15.4 +http://www.archive.org)",
      "Mozilla/5.0 (compatible; heritrix/3.3.0-SNAPSHOT-20140702-2247 +http://archive.org/details/archive.org_bot)",
      "Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/details/archive.org_bot)",
      "Mozilla/5.0 (compatible; archive.org_bot +http://archive.org/details/archive.org_bot)",
      "Mozilla/5.0 (compatible; special_archiver/3.1.1 +http://www.archive.org/details/archive.org_bot)"
    ],
    "addition_date": "2015/04/14"
  }
  ,
  {
    "pattern": "Applebot",
    "url": "http://www.apple.com/go/applebot",
    "addition_date": "2015/04/15",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1; +http://www.apple.com/go/applebot)",
      "Mozilla/5.0 (compatible; Applebot/0.3; +http://www.apple.com/go/applebot)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Applebot/0.3; +http://www.apple.com/go/applebot)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4 (Applebot/0.1; +http://www.apple.com/go/applebot)"
    ]
  }
  ,
  {
    "pattern": "TweetmemeBot",
    "url": "http://datasift.com/bot.html",
    "instances": [
      "Mozilla/5.0 (TweetmemeBot/4.0; +http://datasift.com/bot.html) Gecko/20100101 Firefox/31.0"
    ],
    "addition_date": "2015/04/15"
  }
  ,
  {
    "pattern": "crawler4j",
    "url": "https://github.com/yasserg/crawler4j",
    "instances": [
      "crawler4j (http://code.google.com/p/crawler4j/)",
      "crawler4j (https://github.com/yasserg/crawler4j/)"
    ],
    "addition_date": "2015/05/07"
  }
  ,
  {
    "pattern": "findxbot",
    "url": "http://www.findxbot.com",
    "instances": [
      "Mozilla/5.0 (compatible; Findxbot/1.0; +http://www.findxbot.com)"
    ],
    "addition_date": "2015/05/07"
  }
  ,
  {
    "pattern": "S[eE][mM]rushBot",
    "url": "http://www.semrush.com/bot.html",
    "instances": [
      "Mozilla/5.0 (compatible; SemrushBot-SA/0.97; +http://www.semrush.com/bot.html)",
      "Mozilla/5.0 (compatible; SemrushBot-SI/0.97; +http://www.semrush.com/bot.html)",
      "Mozilla/5.0 (compatible; SemrushBot/3~bl; +http://www.semrush.com/bot.html)",
      "Mozilla/5.0 (compatible; SemrushBot/0.98~bl; +http://www.semrush.com/bot.html)",
      "Mozilla/5.0 (compatible; SemrushBot-BA; +http://www.semrush.com/bot.html)",
      "Mozilla/5.0 (compatible; SemrushBot/6~bl; +http://www.semrush.com/bot.html)",
      "SEMrushBot"
    ],
    "addition_date": "2015/05/26"
  }
  ,
  {
    "pattern": "yoozBot",
    "url": "http://yooz.ir",
    "instances": [
      "Mozilla/5.0 (compatible; yoozBot-2.2; http://yooz.ir; info@yooz.ir)"
    ],
    "addition_date": "2015/05/26"
  }
  ,
  {
    "pattern": "lipperhey",
    "url": "http://www.lipperhey.com/",
    "instances": [
      "Mozilla/5.0 (compatible; Lipperhey Link Explorer; http://www.lipperhey.com/)",
      "Mozilla/5.0 (compatible; Lipperhey SEO Service; http://www.lipperhey.com/)",
      "Mozilla/5.0 (compatible; Lipperhey Site Explorer; http://www.lipperhey.com/)",
      "Mozilla/5.0 (compatible; Lipperhey-Kaus-Australis/5.0; +https://www.lipperhey.com/en/about/)"
    ],
    "addition_date": "2015/08/26"
  }
  ,
  {
    "pattern": "Y!J",
    "url": "https://www.yahoo-help.jp/app/answers/detail/p/595/a_id/42716/~/%E3%82%A6%E3%82%A7%E3%83%96%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%99%E3%82%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6",
    "instances": [
      "Y!J-ASR/0.1 crawler (http://www.yahoo-help.jp/app/answers/detail/p/595/a_id/42716/)",
      "Y!J-BRJ/YATS crawler (http://help.yahoo.co.jp/help/jp/search/indexing/indexing-15.html)",
      "Y!J-PSC/1.0 crawler (http://help.yahoo.co.jp/help/jp/search/indexing/indexing-15.html)",
      "Y!J-BRW/1.0 crawler (http://help.yahoo.co.jp/help/jp/search/indexing/indexing-15.html)",
      "Mozilla/5.0 (iPhone; Y!J-BRY/YATSH crawler; http://help.yahoo.co.jp/help/jp/search/indexing/indexing-15.html)",
      "Mozilla/5.0 (compatible; Y!J SearchMonkey/1.0 (Y!J-AGENT; http://help.yahoo.co.jp/help/jp/search/indexing/indexing-15.html))"
    ],
    "addition_date": "2015/05/26"
  }
  ,
  {
    "pattern": "Domain Re-Animator Bot",
    "url": "http://domainreanimator.com",
    "instances": [
      "Domain Re-Animator Bot (http://domainreanimator.com) - support@domainreanimator.com"
    ],
    "addition_date": "2015/04/14"
  }
  ,
  {
    "pattern": "AddThis",
    "url": "https://www.addthis.com",
    "instances": [
      "AddThis.com robot tech.support@clearspring.com"
    ],
    "addition_date": "2015/06/02"
  }
  ,
  {
    "pattern": "Screaming Frog SEO Spider",
    "url": "http://www.screamingfrog.co.uk/seo-spider",
    "instances": [
      "Screaming Frog SEO Spider/5.1"
    ],
    "addition_date": "2016/01/08"
  }
  ,
  {
    "pattern": "MetaURI",
    "url": "http://www.useragentstring.com/MetaURI_id_17683.php",
    "instances": [
      "MetaURI API/2.0 +metauri.com"
    ],
    "addition_date": "2016/01/02"
  }
  ,
  {
    "pattern": "Scrapy",
    "url": "http://scrapy.org/",
    "instances": [
      "Scrapy/1.0.3 (+http://scrapy.org)"
    ],
    "addition_date": "2016/01/02"
  }
  ,
  {
    "pattern": "Livelap[bB]ot",
    "url": "http://site.livelap.com/crawler",
    "instances": [
      "LivelapBot/0.2 (http://site.livelap.com/crawler)",
      "Livelapbot/0.1"
    ],
    "addition_date": "2016/01/02"
  }
  ,
  {
    "pattern": "OpenHoseBot",
    "url": "http://www.openhose.org/bot.html",
    "instances": [
      "Mozilla/5.0 (compatible; OpenHoseBot/2.1; +http://www.openhose.org/bot.html)"
    ],
    "addition_date": "2016/01/02"
  }
  ,
  {
    "pattern": "CapsuleChecker",
    "url": "http://www.capsulink.com/about",
    "instances": [
      "CapsuleChecker (http://www.capsulink.com/)"
    ],
    "addition_date": "2016/01/02"
  }
  ,
  {
    "pattern": "collection@infegy.com",
    "url": "http://infegy.com/",
    "instances": [
      "Mozilla/5.0 (compatible) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36 collection@infegy.com"
    ],
    "addition_date": "2016/01/03"
  }
  ,
  {
    "pattern": "IstellaBot",
    "url": "http://www.tiscali.it/",
    "instances": [
      "Mozilla/5.0 (compatible; IstellaBot/1.23.15 +http://www.tiscali.it/)"
    ],
    "addition_date": "2016/01/09"
  }
  ,
  {
    "pattern": "DeuSu\\/",
    "addition_date": "2016/01/23",
    "url": "https://deusu.de/robot.html",
    "instances": [
      "Mozilla/5.0 (compatible; DeuSu/0.1.0; +https://deusu.org)",
      "Mozilla/5.0 (compatible; DeuSu/5.0.2; +https://deusu.de/robot.html)"
    ]
  }
  ,
  {
    "pattern": "betaBot",
    "addition_date": "2016/01/23",
    "instances": []
  }
  ,
  {
    "pattern": "Cliqzbot\\/",
    "addition_date": "2016/01/23",
    "url": "http://cliqz.com/company/cliqzbot",
    "instances": [
      "Mozilla/5.0 (compatible; Cliqzbot/2.0; +http://cliqz.com/company/cliqzbot)",
      "Cliqzbot/0.1 (+http://cliqz.com +cliqzbot@cliqz.com)",
      "Cliqzbot/0.1 (+http://cliqz.com/company/cliqzbot)",
      "Mozilla/5.0 (compatible; Cliqzbot/0.1 +http://cliqz.com/company/cliqzbot)",
      "Mozilla/5.0 (compatible; Cliqzbot/1.0 +http://cliqz.com/company/cliqzbot)"
    ]
  }
  ,
  {
    "pattern": "MojeekBot\\/",
    "addition_date": "2016/01/23",
    "url": "https://www.mojeek.com/bot.html",
    "instances": [
      "MojeekBot/0.2 (archi; http://www.mojeek.com/bot.html)",
      "Mozilla/5.0 (compatible; MojeekBot/0.2; http://www.mojeek.com/bot.html#relaunch)",
      "Mozilla/5.0 (compatible; MojeekBot/0.2; http://www.mojeek.com/bot.html)",
      "Mozilla/5.0 (compatible; MojeekBot/0.5; http://www.mojeek.com/bot.html)",
      "Mozilla/5.0 (compatible; MojeekBot/0.6; +https://www.mojeek.com/bot.html)",
      "Mozilla/5.0 (compatible; MojeekBot/0.6; http://www.mojeek.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "netEstate NE Crawler",
    "addition_date": "2016/01/23",
    "url": "+http://www.website-datenbank.de/",
    "instances": [
      "netEstate NE Crawler (+http://www.sengine.info/)",
      "netEstate NE Crawler (+http://www.website-datenbank.de/)"
    ]
  }
  ,
  {
    "pattern": "SafeSearch microdata crawler",
    "addition_date": "2016/01/23",
    "url": "https://safesearch.avira.com",
    "instances": [
      "SafeSearch microdata crawler (https://safesearch.avira.com, safesearch-abuse@avira.com)"
    ]
  }
  ,
  {
    "pattern": "Gluten Free Crawler\\/",
    "addition_date": "2016/01/23",
    "url": "http://glutenfreepleasure.com/",
    "instances": [
      "Mozilla/5.0 (compatible; Gluten Free Crawler/1.0; +http://glutenfreepleasure.com/)"
    ]
  }
  ,
  {
    "pattern": "Sonic",
    "addition_date": "2016/02/08",
    "url": "http://www.yama.info.waseda.ac.jp/~crawler/info.html",
    "instances": [
      "Mozilla/5.0 (compatible; RankSonicSiteAuditor/1.0; +https://ranksonic.com/ranksonic_sab.html)",
      "Mozilla/5.0 (compatible; Sonic/1.0; http://www.yama.info.waseda.ac.jp/~crawler/info.html)",
      "Mozzila/5.0 (compatible; Sonic/1.0; http://www.yama.info.waseda.ac.jp/~crawler/info.html)"
    ]
  }
  ,
  {
    "pattern": "Sysomos",
    "addition_date": "2016/02/08",
    "url": "http://www.sysomos.com",
    "instances": [
      "Mozilla/5.0 (compatible; Sysomos/1.0; +http://www.sysomos.com/; Sysomos)"
    ]
  }
  ,
  {
    "pattern": "Trove",
    "addition_date": "2016/02/08",
    "url": "http://www.trove.com",
    "instances": []
  }
  ,
  {
    "pattern": "deadlinkchecker",
    "addition_date": "2016/02/08",
    "url": "http://www.deadlinkchecker.com",
    "instances": [
      "www.deadlinkchecker.com Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36",
      "www.deadlinkchecker.com XMLHTTP/1.0",
      "www.deadlinkchecker.com XMLHTTP/1.0 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "Slack-ImgProxy",
    "addition_date": "2016/04/25",
    "url": "https://api.slack.com/robots",
    "instances": [
      "Slack-ImgProxy (+https://api.slack.com/robots)",
      "Slack-ImgProxy 0.59 (+https://api.slack.com/robots)",
      "Slack-ImgProxy 0.66 (+https://api.slack.com/robots)",
      "Slack-ImgProxy 1.106 (+https://api.slack.com/robots)",
      "Slack-ImgProxy 1.138 (+https://api.slack.com/robots)",
      "Slack-ImgProxy 149 (+https://api.slack.com/robots)"
    ]
  }
  ,
  {
    "pattern": "Embedly",
    "addition_date": "2016/04/25",
    "url": "http://support.embed.ly",
    "instances": [
      "Embedly +support@embed.ly",
      "Mozilla/5.0 (compatible; Embedly/0.2; +http://support.embed.ly/)",
      "Mozilla/5.0 (compatible; Embedly/0.2; snap; +http://support.embed.ly/)"
    ]
  }
  ,
  {
    "pattern": "RankActiveLinkBot",
    "addition_date": "2016/06/20",
    "url": "https://rankactive.com/resources/rankactive-linkbot",
    "instances": [
      "Mozilla/5.0 (compatible; RankActiveLinkBot; +https://rankactive.com/resources/rankactive-linkbot)"
    ]
  }
  ,
  {
    "pattern": "iskanie",
    "addition_date": "2016/09/02",
    "url": "http://www.iskanie.com",
    "instances": [
      "iskanie (+http://www.iskanie.com)"
    ]
  }
  ,
  {
    "pattern": "SafeDNSBot",
    "addition_date": "2016/09/10",
    "url": "https://www.safedns.com/searchbot",
    "instances": [
      "SafeDNSBot (https://www.safedns.com/searchbot)"
    ]
  }
  ,
  {
    "pattern": "SkypeUriPreview",
    "addition_date": "2016/10/10",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5"
    ]
  }
  ,
  {
    "pattern": "Veoozbot",
    "addition_date": "2016/11/03",
    "url": "http://www.veooz.com/veoozbot.html",
    "instances": [
      "Mozilla/5.0 (compatible; Veoozbot/1.0; +http://www.veooz.com/veoozbot.html)"
    ]
  }
  ,
  {
    "pattern": "Slackbot",
    "addition_date": "2016/11/03",
    "url": "https://api.slack.com/robots",
    "instances": [
      "Slackbot-LinkExpanding (+https://api.slack.com/robots)",
      "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
      "Slackbot 1.0 (+https://api.slack.com/robots)"
    ]
  }
  ,
  {
    "pattern": "redditbot",
    "addition_date": "2016/11/03",
    "url": "http://www.reddit.com/feedback",
    "instances": [
      "Mozilla/5.0 (compatible; redditbot/1.0; +http://www.reddit.com/feedback)"
    ]
  }
  ,
  {
    "pattern": "datagnionbot",
    "addition_date": "2016/11/03",
    "url": "http://www.datagnion.com/bot.html",
    "instances": [
      "datagnionbot (+http://www.datagnion.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "Google-Adwords-Instant",
    "addition_date": "2016/11/03",
    "url": "http://www.google.com/adsbot.html",
    "instances": [
      "Google-Adwords-Instant (+http://www.google.com/adsbot.html)"
    ]
  }
  ,
  {
    "pattern": "adbeat_bot",
    "addition_date": "2016/11/04",
    "instances": [
      "Mozilla/5.0 (compatible; adbeat_bot; +support@adbeat.com; support@adbeat.com)",
      "adbeat_bot"
    ]
  }
  ,
  {
    "pattern": "WhatsApp",
    "addition_date": "2016/11/15",
    "url": "https://www.whatsapp.com/",
    "instances": [
      "WhatsApp",
      "WhatsApp/0.3.4479 N",
      "WhatsApp/0.3.4679 N",
      "WhatsApp/0.3.4941 N",
      "WhatsApp/2.12.15/i",
      "WhatsApp/2.12.16/i",
      "WhatsApp/2.12.17/i",
      "WhatsApp/2.12.449 A",
      "WhatsApp/2.12.453 A",
      "WhatsApp/2.12.510 A",
      "WhatsApp/2.12.540 A",
      "WhatsApp/2.12.548 A",
      "WhatsApp/2.12.555 A",
      "WhatsApp/2.12.556 A",
      "WhatsApp/2.16.1/i",
      "WhatsApp/2.16.13 A",
      "WhatsApp/2.16.2/i",
      "WhatsApp/2.16.42 A",
      "WhatsApp/2.16.57 A",
      "WhatsApp/2.19.92 i",
      "WhatsApp/2.19.175 A",
      "WhatsApp/2.19.244 A",
      "WhatsApp/2.19.258 A",
      "WhatsApp/2.19.308 A",
      "WhatsApp/2.19.330 A"
    ]
  }
  ,
  {
    "pattern": "contxbot",
    "addition_date": "2017/02/25",
    "instances": [
      "Mozilla/5.0 (compatible;contxbot/1.0)"
    ]
  }
  ,
  {
    "pattern": "pinterest.com.bot",
    "addition_date": "2017/03/03",
    "instances": [
      "Mozilla/5.0 (compatible; Pinterestbot/1.0; +http://www.pinterest.com/bot.html)",
      "Pinterest/0.2 (+http://www.pinterest.com/bot.html)"
    ],
    "url": "http://www.pinterest.com/bot.html"
  }
  ,
  {
    "pattern": "electricmonk",
    "addition_date": "2017/03/04",
    "instances": [
      "Mozilla/5.0 (compatible; electricmonk/3.2.0 +https://www.duedil.com/our-crawler/)"
    ],
    "url": "https://www.duedil.com/our-crawler/"
  }
  ,
  {
    "pattern": "GarlikCrawler",
    "addition_date": "2017/03/18",
    "instances": [
      "GarlikCrawler/1.2 (http://garlik.com/, crawler@garlik.com)"
    ],
    "url": "http://garlik.com/"
  }
  ,
  {
    "pattern": "BingPreview\\/",
    "addition_date": "2017/04/23",
    "url": "https://www.bing.com/webmaster/help/which-crawlers-does-bing-use-8c184ec0",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b",
      "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0; BingPreview/1.0b) like Gecko",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0;  WOW64;  Trident/6.0;  BingPreview/1.0b)",
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;  WOW64;  Trident/5.0;  BingPreview/1.0b)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 BingPreview/1.0b"
    ]
  }
  ,
  {
    "pattern": "vebidoobot",
    "addition_date": "2017/05/08",
    "instances": [
      "Mozilla/5.0 (compatible; vebidoobot/1.0; +https://blog.vebidoo.de/vebidoobot/"
    ],
    "url": "https://blog.vebidoo.de/vebidoobot/"
  }
  ,
  {
    "pattern": "FemtosearchBot",
    "addition_date": "2017/05/16",
    "instances": [
      "Mozilla/5.0 (compatible; FemtosearchBot/1.0; http://femtosearch.com)"
    ],
    "url": "http://femtosearch.com"
  }
  ,
  {
    "pattern": "Yahoo Link Preview",
    "addition_date": "2017/06/28",
    "instances": [
      "Mozilla/5.0 (compatible; Yahoo Link Preview; https://help.yahoo.com/kb/mail/yahoo-link-preview-SLN23615.html)"
    ],
    "url": "https://help.yahoo.com/kb/mail/yahoo-link-preview-SLN23615.html"
  }
  ,
  {
    "pattern": "MetaJobBot",
    "addition_date": "2017/08/16",
    "instances": [
      "Mozilla/5.0 (compatible; MetaJobBot; http://www.metajob.de/crawler)"
    ],
    "url": "http://www.metajob.de/the/crawler"
  }
  ,
  {
    "pattern": "DomainStatsBot",
    "addition_date": "2017/08/16",
    "instances": [
      "DomainStatsBot/1.0 (http://domainstats.io/our-bot)"
    ],
    "url": "http://domainstats.io/our-bot"
  }
  ,
  {
    "pattern": "mindUpBot",
    "addition_date": "2017/08/16",
    "instances": [
      "mindUpBot (datenbutler.de)"
    ],
    "url": "http://www.datenbutler.de/"
  }
  ,
  {
    "pattern": "Daum\\/",
    "addition_date": "2017/08/16",
    "instances": [
      "Mozilla/5.0 (compatible; Daum/4.1; +http://cs.daum.net/faq/15/4118.html?faqId=28966)"
    ],
    "url": "http://cs.daum.net/faq/15/4118.html?faqId=28966"
  }
  ,
  {
    "pattern": "Jugendschutzprogramm-Crawler",
    "addition_date": "2017/08/16",
    "instances": [
      "Jugendschutzprogramm-Crawler; Info: http://www.jugendschutzprogramm.de"
    ],
    "url": "http://www.jugendschutzprogramm.de"
  }
  ,
  {
    "pattern": "Xenu Link Sleuth",
    "addition_date": "2017/08/19",
    "instances": [
      "Xenu Link Sleuth/1.3.8"
    ],
    "url": "http://home.snafu.de/tilman/xenulink.html"
  }
  ,
  {
    "pattern": "Pcore-HTTP",
    "addition_date": "2017/08/19",
    "instances": [
      "Pcore-HTTP/v0.40.3",
      "Pcore-HTTP/v0.44.0"
    ],
    "url": "https://bitbucket.org/softvisio/pcore/overview"
  }
  ,
  {
    "pattern": "moatbot",
    "addition_date": "2017/09/16",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36 moatbot",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4 moatbot"
    ],
    "url": "https://moat.com"
  }
  ,
  {
    "pattern": "KosmioBot",
    "addition_date": "2017/09/16",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36 (compatible; KosmioBot/1.0; +http://kosm.io/bot.html)"
    ],
    "url": "http://kosm.io/bot.html"
  }
  ,
  {
    "pattern": "pingdom",
    "addition_date": "2017/09/16",
    "instances": [
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/59.0.3071.109 Chrome/59.0.3071.109 Safari/537.36 PingdomPageSpeed/1.0 (pingbot/2.0; +http://www.pingdom.com/)",
      "Mozilla/5.0 (compatible; pingbot/2.0; +http://www.pingdom.com/)"
    ],
    "url": "http://www.pingdom.com"
  }
  ,
  {
    "pattern": "AppInsights",
    "addition_date": "2019/03/09",
    "instances": [
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; AppInsights)"
    ],
    "url": "https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview"
  }
  ,
  {
    "pattern": "PhantomJS",
    "addition_date": "2017/09/18",
    "instances": [
      "Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1 bl.uk_lddc_renderbot/2.0.0 (+ http://www.bl.uk/aboutus/legaldeposit/websites/websites/faqswebmaster/index.html)"
    ],
    "url": "http://phantomjs.org/"
  }
  ,
  {
    "pattern": "Gowikibot",
    "addition_date": "2017/10/26",
    "instances": [
      "Mozilla/5.0 (compatible; Gowikibot/1.0; +http://www.gowikibot.com)"
    ],
    "url": "http://www.gowikibot.com"
  }
  ,
  {
    "pattern": "PiplBot",
    "addition_date": "2017/10/30",
    "instances": [
      "PiplBot (+http://www.pipl.com/bot/)",
      "Mozilla/5.0+(compatible;+PiplBot;+http://www.pipl.com/bot/)"
    ],
    "url": "http://www.pipl.com/bot/"
  }
  ,
  {
    "pattern": "Discordbot",
    "addition_date": "2017/09/22",
    "url": "https://discordapp.com",
    "instances": [
      "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"
    ]
  }
  ,
  {
    "pattern": "TelegramBot",
    "addition_date": "2017/10/01",
    "instances": [
      "TelegramBot (like TwitterBot)"
    ]
  }
  ,
  {
    "pattern": "Jetslide",
    "addition_date": "2017/09/27",
    "url": "http://jetsli.de/crawler",
    "instances": [
      "Mozilla/5.0 (compatible; Jetslide; +http://jetsli.de/crawler)"
    ]
  }
  ,
  {
    "pattern": "newsharecounts",
    "addition_date": "2017/09/30",
    "url": "http://newsharecounts.com/crawler",
    "instances": [
      "Mozilla/5.0 (compatible; NewShareCounts.com/1.0; +http://newsharecounts.com/crawler)"
    ]
  }
  ,
  {
    "pattern": "James BOT",
    "addition_date": "2017/10/12",
    "url": "http://cognitiveseo.com/bot.html",
    "instances": [
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6 - James BOT - WebCrawler http://cognitiveseo.com/bot.html"
    ]
  }
  ,
  {
    "pattern": "Bark[rR]owler",
    "addition_date": "2017/10/09",
    "url": "http://www.exensa.com/crawl",
    "instances": [
      "Barkrowler/0.5.1 (experimenting / debugging - sorry for your logs ) http://www.exensa.com/crawl - admin@exensa.com -- based on BuBiNG",
      "Barkrowler/0.7 (+http://www.exensa.com/crawl)",
      "BarkRowler/0.7 (+http://www.exensa.com/crawling)",
      "Barkrowler/0.9 (+http://www.exensa.com/crawl)"
    ]
  }
  ,
  {
    "pattern": "TinEye",
    "addition_date": "2017/10/14",
    "url": "http://www.tineye.com/crawler.html",
    "instances": [
      "Mozilla/5.0 (compatible; TinEye-bot/1.31; +http://www.tineye.com/crawler.html)",
      "TinEye/1.1 (http://tineye.com/crawler.html)"
    ]
  }
  ,
  {
    "pattern": "SocialRankIOBot",
    "addition_date": "2017/10/19",
    "url": "http://socialrank.io/about",
    "instances": [
      "SocialRankIOBot; http://socialrank.io/about"
    ]
  }
  ,
  {
    "pattern": "trendictionbot",
    "addition_date": "2017/10/30",
    "url": "http://www.trendiction.de/bot",
    "instances": [
      "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-GB; rv:1.0; trendictionbot0.5.0; trendiction search; http://www.trendiction.de/bot; please let us know of any problems; web at trendiction.com) Gecko/20071127 Firefox/3.0.0.11",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; trendictionbot0.5.0; trendiction search; http://www.trendiction.de/bot; please let us know of any problems; web at trendiction.com) Gecko/20170101 Firefox/67.0"
    ]
  }
  ,
  {
    "pattern": "Ocarinabot",
    "addition_date": "2017/09/27",
    "instances": [
      "Ocarinabot"
    ]
  }
  ,
  {
    "pattern": "epicbot",
    "addition_date": "2017/10/31",
    "url": "http://www.epictions.com/epicbot",
    "instances": [
      "Mozilla/5.0 (compatible; epicbot; +http://www.epictions.com/epicbot)"
    ]
  }
  ,
  {
    "pattern": "Primalbot",
    "addition_date": "2017/09/27",
    "url": "https://www.primal.com",
    "instances": [
      "Mozilla/5.0 (compatible; Primalbot; +https://www.primal.com;)"
    ]
  }
  ,
  {
    "pattern": "DuckDuckGo-Favicons-Bot",
    "addition_date": "2017/10/06",
    "url": "http://duckduckgo.com",
    "instances": [
      "Mozilla/5.0 (compatible; DuckDuckGo-Favicons-Bot/1.0; +http://duckduckgo.com)"
    ]
  }
  ,
  {
    "pattern": "GnowitNewsbot",
    "addition_date": "2017/10/30",
    "url": "http://www.gnowit.com",
    "instances": [
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0 / GnowitNewsbot / Contact information at http://www.gnowit.com"
    ]
  }
  ,
  {
    "pattern": "Leikibot",
    "addition_date": "2017/09/24",
    "url": "http://www.leiki.com",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.3;compatible; Leikibot/1.0; +http://www.leiki.com)"
    ]
  }
  ,
  {
    "pattern": "LinkArchiver",
    "addition_date": "2017/09/24",
    "instances": [
      "@LinkArchiver twitter bot"
    ]
  }
  ,
  {
    "pattern": "YaK\\/",
    "addition_date": "2017/09/25",
    "url": "http://linkfluence.com",
    "instances": [
      "Mozilla/5.0 (compatible; YaK/1.0; http://linkfluence.com/; bot@linkfluence.com)"
    ]
  }
  ,
  {
    "pattern": "PaperLiBot",
    "addition_date": "2017/09/25",
    "url": "http://support.paper.li/entries/20023257-what-is-paper-li",
    "instances": [
      "Mozilla/5.0 (compatible; PaperLiBot/2.1; http://support.paper.li/entries/20023257-what-is-paper-li)",
      "Mozilla/5.0 (compatible; PaperLiBot/2.1; https://support.paper.li/entries/20023257-what-is-paper-li)"

    ]
  }
  ,
  {
    "pattern": "Digg Deeper",
    "addition_date": "2017/09/26",
    "url": "http://digg.com/about",
    "instances": [
      "Digg Deeper/v1 (http://digg.com/about)"
    ]
  }
  ,
  {
    "pattern": "dcrawl",
    "addition_date": "2017/09/22",
    "instances": [
      "dcrawl/1.0"
    ]
  }
  ,
  {
    "pattern": "Snacktory",
    "addition_date": "2017/09/23",
    "url": "https://github.com/karussell/snacktory",
    "instances": [
      "Mozilla/5.0 (compatible; Snacktory; +https://github.com/karussell/snacktory)"
    ]
  }
  ,
  {
    "pattern": "AndersPinkBot",
    "addition_date": "2017/09/24",
    "url": "http://anderspink.com/bot.html",
    "instances": [
      "Mozilla/5.0 (compatible; AndersPinkBot/1.0; +http://anderspink.com/bot.html)"
    ]
  }
  ,
  {
    "pattern": "Fyrebot",
    "addition_date": "2017/09/22",
    "instances": [
      "Fyrebot/1.0"
    ]
  }
  ,
  {
    "pattern": "EveryoneSocialBot",
    "addition_date": "2017/09/22",
    "url": "http://everyonesocial.com",
    "instances": [
      "Mozilla/5.0 (compatible; EveryoneSocialBot/1.0; support@everyonesocial.com http://everyonesocial.com/)"
    ]
  }
  ,
  {
    "pattern": "Mediatoolkitbot",
    "addition_date": "2017/10/06",
    "url": "http://mediatoolkit.com",
    "instances": [
      "Mediatoolkitbot (complaints@mediatoolkit.com)"
    ]
  }
  ,
  {
    "pattern": "Luminator-robots",
    "addition_date": "2017/09/22",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/30.0.1599.66 Safari/537.13 Luminator-robots/2.0"
    ]
  }
  ,
  {
    "pattern": "ExtLinksBot",
    "addition_date": "2017/11/02",
    "url": "https://extlinks.com/Bot.html",
    "instances": [
      "Mozilla/5.0 (compatible; ExtLinksBot/1.5 +https://extlinks.com/Bot.html)"
    ]
  }
  ,
  {
    "pattern": "SurveyBot",
    "addition_date": "2017/11/02",
    "instances": [
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en; rv:1.9.0.13) Gecko/2009073022 Firefox/3.5.2 (.NET CLR 3.5.30729) SurveyBot/2.3 (DomainTools)"
    ]
  }
  ,
  {
    "pattern": "NING\\/",
    "addition_date": "2017/11/02",
    "instances": [
      "NING/1.0"
    ]
  }
  ,
  {
    "pattern": "okhttp",
    "addition_date": "2017/11/02",
    "instances": [
      "okhttp/2.5.0",
      "okhttp/2.7.5",
      "okhttp/3.2.0",
      "okhttp/3.5.0",
      "okhttp/4.1.0"
    ]
  }
  ,
  {
    "pattern": "Nuzzel",
    "addition_date": "2017/11/02",
    "instances": [
      "Nuzzel"
    ]
  }
  ,
  {
    "pattern": "omgili",
    "addition_date": "2017/11/02",
    "url": "http://omgili.com",
    "instances": [
      "omgili/0.5 +http://omgili.com"
    ]
  }
  ,
  {
    "pattern": "PocketParser",
    "addition_date": "2017/11/02",
    "url": "https://getpocket.com/pocketparser_ua",
    "instances": [
      "PocketParser/2.0 (+https://getpocket.com/pocketparser_ua)"
    ]
  }
  ,
  {
    "pattern": "YisouSpider",
    "addition_date": "2017/11/02",
    "instances": [
      "YisouSpider",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 YisouSpider/5.0 Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "um-LN",
    "addition_date": "2017/11/02",
    "instances": [
      "Mozilla/5.0 (compatible; um-LN/1.0; mailto: techinfo@ubermetrics-technologies.com)"
    ]
  }
  ,
  {
    "pattern": "ToutiaoSpider",
    "addition_date": "2017/11/02",
    "url": "http://web.toutiao.com/media_cooperation/",
    "instances": [
      "Mozilla/5.0 (compatible; ToutiaoSpider/1.0; http://web.toutiao.com/media_cooperation/;)"
    ]
  }
  ,
  {
    "pattern": "MuckRack",
    "addition_date": "2017/11/02",
    "url": "http://muckrack.com",
    "instances": [
      "Mozilla/5.0 (compatible; MuckRack/1.0; +http://muckrack.com)"
    ]
  }
  ,
  {
    "pattern": "Jamie's Spider",
    "addition_date": "2017/11/02",
    "url": "http://jamiembrown.com/",
    "instances": [
      "Jamie's Spider (http://jamiembrown.com/)"
    ]
  }
  ,
  {
    "pattern": "AHC\\/",
    "addition_date": "2017/11/02",
    "instances": [
      "AHC/2.0"
    ]
  }
  ,
  {
    "pattern": "NetcraftSurveyAgent",
    "addition_date": "2017/11/02",
    "instances": [
      "Mozilla/5.0 (compatible; NetcraftSurveyAgent/1.0; +info@netcraft.com)"
    ]
  }
  ,
  {
    "pattern": "Laserlikebot",
    "addition_date": "2017/11/02",
    "instances": [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1.4 (compatible; Laserlikebot/0.1)"
    ]
  }
  ,
  {
    "pattern": "^Apache-HttpClient",
    "addition_date": "2017/11/02",
    "instances": [
      "Apache-HttpClient/4.2.3 (java 1.5)",
      "Apache-HttpClient/4.2.5 (java 1.5)",
      "Apache-HttpClient/4.3.1 (java 1.5)",
      "Apache-HttpClient/4.3.3 (java 1.5)",
      "Apache-HttpClient/4.3.5 (java 1.5)",
      "Apache-HttpClient/4.4.1 (Java/1.8.0_65)",
      "Apache-HttpClient/4.5.2 (Java/1.8.0_65)",
      "Apache-HttpClient/4.5.2 (Java/1.8.0_151)",
      "Apache-HttpClient/4.5.2 (Java/1.8.0_161)",
      "Apache-HttpClient/4.5.2 (Java/1.8.0_181)",
      "Apache-HttpClient/4.5.3 (Java/1.8.0_121)",
      "Apache-HttpClient/4.5.3-SNAPSHOT (Java/1.8.0_152)",
      "Apache-HttpClient/4.5.7 (Java/11.0.3)",
      "Apache-HttpClient/4.5.10 (Java/1.8.0_201)"
    ]
  }
  ,
  {
    "pattern": "AppEngine-Google",
    "addition_date": "2017/11/02",
    "instances": [
      "AppEngine-Google; (+http://code.google.com/appengine; appid: example)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 AppEngine-Google; (+http://code.google.com/appengine; appid: s~feedly-nikon3)"
    ]
  }
  ,
  {
    "pattern": "Jetty",
    "addition_date": "2017/11/02",
    "instances": [
      "Jetty/9.3.z-SNAPSHOT"
    ]
  }
  ,
  {
    "pattern": "Upflow",
    "addition_date": "2017/11/02",
    "instances": [
      "Upflow/1.0"
    ]
  }
  ,
  {
    "pattern": "Thinklab",
    "addition_date": "2017/11/02",
    "url": "thinklab.com",
    "instances": [
      "Thinklab (thinklab.com)"
    ]
  }
  ,
  {
    "pattern": "Traackr.com",
    "addition_date": "2017/11/02",
    "url": "Traackr.com",
    "instances": [
      "Traackr.com"
    ]
  }
  ,
  {
    "pattern": "Twurly",
    "addition_date": "2017/11/02",
    "url": "http://twurly.org",
    "instances": [
      "Ruby, Twurly v1.1 (http://twurly.org)"
    ]
  }
  ,
  {
    "pattern": "Mastodon",
    "addition_date": "2017/11/02",
    "instances": [
      "http.rb/2.2.2 (Mastodon/1.5.1; +https://example-masto-instance.org/)"
    ]
  }
  ,
  {
    "pattern": "http_get",
    "addition_date": "2017/11/02",
    "instances": [
      "http_get"
    ]
  }
  ,
  {
    "pattern": "DnyzBot",
    "addition_date": "2017/11/20",
    "instances": [
      "Mozilla/5.0 (compatible; DnyzBot/1.0)"
    ]
  }
  ,
  {
    "pattern": "botify",
    "addition_date": "2018/02/01",
    "instances": [
      "Mozilla/5.0 (compatible; botify; http://botify.com)"
    ]
  }
  ,
  {
    "pattern": "007ac9 Crawler",
    "addition_date": "2018/02/09",
    "instances": [
      "Mozilla/5.0 (compatible; 007ac9 Crawler; http://crawler.007ac9.net/)"
    ]
  }
  ,
  {
    "pattern": "BehloolBot",
    "addition_date": "2018/02/09",
    "instances": [
      "Mozilla/5.0 (compatible; BehloolBot/beta; +http://www.webeaver.com/bot)"
    ]
  }
  ,
  {
    "pattern": "BrandVerity",
    "addition_date": "2018/02/27",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/55.0 BrandVerity/1.0 (http://www.brandverity.com/why-is-brandverity-visiting-me)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 Twitter for iPhone BrandVerity/1.0 (http://www.brandverity.com/why-is-brandverity-visiting-me)"
    ],
    "url": "http://www.brandverity.com/why-is-brandverity-visiting-me"
  }
  ,
  {
    "pattern": "check_http",
    "addition_date": "2018/02/09",
    "instances": [
      "check_http/v2.2.1 (nagios-plugins 2.2.1)"
    ]
  }
  ,
  {
    "pattern": "BDCbot",
    "addition_date": "2018/02/09",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1; compatible; BDCbot/1.0; +http://bigweb.bigdatacorp.com.br/faq.aspx) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; BDCbot/1.0; +http://bigweb.bigdatacorp.com.br/faq.aspx) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "ZumBot",
    "addition_date": "2018/02/09",
    "instances": [
      "Mozilla/5.0 (compatible; ZumBot/1.0; http://help.zum.com/inquiry)"
    ]
  }
  ,
  {
    "pattern": "EZID",
    "addition_date": "2018/02/09",
    "instances": [
      "EZID (EZID link checker; https://ezid.cdlib.org/)"
    ]
  }
  ,
  {
    "pattern": "ICC-Crawler",
    "addition_date": "2018/02/28",
    "instances": [
      "ICC-Crawler/2.0 (Mozilla-compatible; ; http://ucri.nict.go.jp/en/icccrawler.html)"
    ],
    "url": "http://ucri.nict.go.jp/en/icccrawler.html"
  }
  ,
  {
    "pattern": "ArchiveBot",
    "addition_date": "2018/02/28",
    "instances": [
      "ArchiveTeam ArchiveBot/20170106.02 (wpull 2.0.2)"
    ],
    "url": "https://github.com/ArchiveTeam/ArchiveBot"
  }
  ,
  {
    "pattern": "^LCC ",
    "addition_date": "2018/02/28",
    "instances": [
      "LCC (+http://corpora.informatik.uni-leipzig.de/crawler_faq.html)"
    ],
    "url": "http://corpora.informatik.uni-leipzig.de/crawler_faq.html"
  }
  ,
  {
    "pattern": "filterdb.iss.net\\/crawler",
    "addition_date": "2018/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; oBot/2.3.1; +http://filterdb.iss.net/crawler/)"
    ],
    "url": "http://filterdb.iss.net/crawler/"
  }
  ,
  {
    "pattern": "BLP_bbot",
    "addition_date": "2018/03/27",
    "instances": [
      "BLP_bbot/0.1"
    ]
  }
  ,
  {
    "pattern": "BomboraBot",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0 (compatible; BomboraBot/1.0; +http://www.bombora.com/bot)"
    ],
    "url": "http://www.bombora.com/bot"
  }
  ,
  {
    "pattern": "Buck\\/",
    "addition_date": "2018/03/27",
    "instances": [
      "Buck/2.2; (+https://app.hypefactors.com/media-monitoring/about.html)"
    ],
    "url": "https://app.hypefactors.com/media-monitoring/about.html"
  }
  ,
  {
    "pattern": "Companybook-Crawler",
    "addition_date": "2018/03/27",
    "instances": [
      "Companybook-Crawler (+https://www.companybooknetworking.com/)"
    ],
    "url": "https://www.companybooknetworking.com/"
  }
  ,
  {
    "pattern": "Genieo",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0 (compatible; Genieo/1.0 http://www.genieo.com/webfilter.html)"
    ],
    "url": "http://www.genieo.com/webfilter.html"
  }
  ,
  {
    "pattern": "magpie-crawler",
    "addition_date": "2018/03/27",
    "instances": [
      "magpie-crawler/1.1 (U; Linux amd64; en-GB; +http://www.brandwatch.net)"
    ],
    "url": "http://www.brandwatch.net"
  }
  ,
  {
    "pattern": "MeltwaterNews",
    "addition_date": "2018/03/27",
    "instances": [
      "MeltwaterNews www.meltwater.com"
    ],
    "url": "http://www.meltwater.com"
  }
  ,
  {
    "pattern": "Moreover",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0 Moreover/5.1 (+http://www.moreover.com)"
    ],
    "url": "http://www.moreover.com"
  }
  ,
  {
    "pattern": "newspaper\\/",
    "addition_date": "2018/03/27",
    "instances": [
      "newspaper/0.1.0.7",
      "newspaper/0.2.5",
      "newspaper/0.2.6",
      "newspaper/0.2.8"
    ]
  }
  ,
  {
    "pattern": "ScoutJet",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0 (compatible; ScoutJet; +http://www.scoutjet.com/)"
    ],
    "url": "http://www.scoutjet.com/"
  }
  ,
  {
    "pattern": "(^| )sentry\\/",
    "addition_date": "2018/03/27",
    "instances": [
      "sentry/8.22.0 (https://sentry.io)"
    ],
    "url": "https://sentry.io"
  }
  ,
  {
    "pattern": "StorygizeBot",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0 (compatible; StorygizeBot; http://www.storygize.com)"
    ],
    "url": "http://www.storygize.com"
  }
  ,
  {
    "pattern": "UptimeRobot",
    "addition_date": "2018/03/27",
    "instances": [
      "Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)"
    ],
    "url": "http://www.uptimerobot.com/"
  }
  ,
  {
    "pattern": "OutclicksBot",
    "addition_date": "2018/04/21",
    "instances": [
      "OutclicksBot/2 +https://www.outclicks.net/agent/VjzDygCuk4ubNmg40ZMbFqT0sIh7UfOKk8s8ZMiupUR",
      "OutclicksBot/2 +https://www.outclicks.net/agent/gIYbZ38dfAuhZkrFVl7sJBFOUhOVct6J1SvxgmBZgCe",
      "OutclicksBot/2 +https://www.outclicks.net/agent/PryJzTl8POCRHfvEUlRN5FKtZoWDQOBEvFJ2wh6KH5J",
      "OutclicksBot/2 +https://www.outclicks.net/agent/p2i4sNUh7eylJF1S6SGgRs5mP40ExlYvsr9GBxVQG6h"
    ],
    "url": "https://www.outclicks.net"
  }
  ,
  {
    "pattern": "seoscanners",
    "addition_date": "2018/05/27",
    "instances": [
      "Mozilla/5.0 (compatible; seoscanners.net/1; +spider@seoscanners.net)"
    ],
    "url": "http://www.seoscanners.net/"
  }
  ,
  {
    "pattern": "Hatena",
    "addition_date": "2018/05/29",
    "instances": [
      "Hatena Antenna/0.3",
      "Hatena::Russia::Crawler/0.01",
      "Hatena-Favicon/2 (http://www.hatena.ne.jp/faq/)",
      "Hatena::Scissors/0.01",
      "HatenaBookmark/4.0 (Hatena::Bookmark; Analyzer)",
      "Hatena::Fetcher/0.01 (master) Furl/3.13"
    ]
  }
  ,
  {
    "pattern": "Google Web Preview",
    "addition_date": "2018/05/31",
    "instances": [
      "Mozilla/5.0 (Linux; U; Android 2.3.4; generic) AppleWebKit/537.36 (KHTML, like Gecko; Google Web Preview) Version/4.0 Mobile Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; Google Web Preview) Chrome/27.0.1453 Safari/537.36"
    ]
  }
  ,
  {
    "pattern": "MauiBot",
    "addition_date": "2018/06/06",
    "instances": [
      "MauiBot (crawler.feedback+wc@gmail.com)"
    ]
  }
  ,
  {
    "pattern": "AlphaBot",
    "addition_date": "2018/05/27",
    "instances": [
      "Mozilla/5.0 (compatible; AlphaBot/3.2; +http://alphaseobot.com/bot.html)"
    ],
    "url": "http://alphaseobot.com/bot.html"
  }
  ,
  {
    "pattern": "SBL-BOT",
    "addition_date": "2018/06/06",
    "instances": [
      "SBL-BOT (http://sbl.net)"
    ],
    "url": "http://sbl.net",
    "description" : "Bot of SoftByte BlackWidow"
  }
  ,
  {
    "pattern": "IAS crawler",
    "addition_date": "2018/06/06",
    "instances": [
      "IAS crawler (ias_crawler; http://integralads.com/site-indexing-policy/)"
    ],
    "url": "http://integralads.com/site-indexing-policy/",
    "description" : "Bot of Integral Ad Science, Inc."
  }
  ,
  {
    "pattern": "adscanner",
    "addition_date": "2018/06/24",
    "instances": [
      "Mozilla/5.0 (compatible; adscanner/)"
    ]
  }
  ,
  {
    "pattern": "Netvibes",
    "addition_date": "2018/06/24",
    "instances": [
      "Netvibes (crawler/bot; http://www.netvibes.com",
      "Netvibes (crawler; http://www.netvibes.com)"
    ],
    "url": "http://www.netvibes.com"
  }
  ,
  {
    "pattern": "acapbot",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/5.0 (compatible;acapbot/0.1;treat like Googlebot)",
      "Mozilla/5.0 (compatible;acapbot/0.1.;treat like Googlebot)"
    ]
  }
  ,
  {
    "pattern": "Baidu-YunGuanCe",
    "addition_date": "2018/06/27",
    "instances": [
      "Baidu-YunGuanCe-Bot(ce.baidu.com)",
      "Baidu-YunGuanCe-SLABot(ce.baidu.com)",
      "Baidu-YunGuanCe-ScanBot(ce.baidu.com)",
      "Baidu-YunGuanCe-PerfBot(ce.baidu.com)",
      "Baidu-YunGuanCe-VSBot(ce.baidu.com)"
    ],
    "url": "https://ce.baidu.com/topic/topic20150908",
    "description": "Baidu Cloud Watch"
  }
  ,
  {
    "pattern": "bitlybot",
    "addition_date": "2018/06/27",
    "instances": [
      "bitlybot/3.0 (+http://bit.ly/)",
      "bitlybot/2.0",
      "bitlybot"
    ],
    "url": "http://bit.ly/"
  }
  ,
  {
    "pattern": "blogmuraBot",
    "addition_date": "2018/06/27",
    "instances": [
      "blogmuraBot (+http://www.blogmura.com)"
    ],
    "url": "http://www.blogmura.com",
    "description": "A blog ranking site which links to blogs on just about every theme possible."
  }
  ,
  {
    "pattern": "Bot.AraTurka.com",
    "addition_date": "2018/06/27",
    "instances": [
      "Bot.AraTurka.com/0.0.1"
    ],
    "url": "http://www.araturka.com"
  }
  ,
  {
    "pattern": "bot-pge.chlooe.com",
    "addition_date": "2018/06/27",
    "instances": [
      "bot-pge.chlooe.com/1.0.0 (+http://www.chlooe.com/)"
    ]
  }
  ,
  {
    "pattern": "BoxcarBot",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/5.0 (compatible; BoxcarBot/1.1; +awesome@boxcar.io)"
    ],
    "url": "https://boxcar.io/"
  }
  ,
  {
    "pattern": "BTWebClient",
    "addition_date": "2018/06/27",
    "instances": [
      "BTWebClient/180B(9704)"
    ],
    "url": "http://www.utorrent.com/",
    "description": "µTorrent BitTorrent Client"
  }
  ,
  {
    "pattern": "ContextAd Bot",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0;.NET CLR 1.0.3705; ContextAd Bot 1.0)",
      "ContextAd Bot 1.0"
    ]
  }
  ,
  {
    "pattern": "Digincore bot",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/5.0 (compatible; Digincore bot; https://www.digincore.com/crawler.html for rules and instructions.)"
    ],
    "url": "http://www.digincore.com/crawler.html"
  }
  ,
  {
    "pattern": "Disqus",
    "addition_date": "2018/06/27",
    "instances": [
      "Disqus/1.0"
    ],
    "url": "https://disqus.com/",
    "description": "validate and quality check pages."
  }
  ,
  {
    "pattern": "Feedly",
    "addition_date": "2018/06/27",
    "instances": [
      "Feedly/1.0 (+http://www.feedly.com/fetcher.html; like FeedFetcher-Google)",
      "FeedlyBot/1.0 (http://feedly.com)"
    ],
    "url": "https://www.feedly.com/fetcher.html",
    "description": "Feedly Fetcher is how Feedly grabs RSS or Atom feeds when users choose to add them to their Feedly or any of the other applications built on top of the feedly cloud."
  }
  ,
  {
    "pattern": "Fetch\\/",
    "addition_date": "2018/06/27",
    "instances": [
      "Fetch/2.0a (CMS Detection/Web/SEO analysis tool, see http://guess.scritch.org)"
    ]
  }
  ,
  {
    "pattern": "Fever",
    "addition_date": "2018/06/27",
    "instances": [
      "Fever/1.38 (Feed Parser; http://feedafever.com; Allow like Gecko)"
    ],
    "url": "http://feedafever.com"
  }
  ,
  {
    "pattern": "Flamingo_SearchEngine",
    "addition_date": "2018/06/27",
    "instances": [
      "Flamingo_SearchEngine (+http://www.flamingosearch.com/bot)"
    ]
  }
  ,
  {
    "pattern": "FlipboardProxy",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/5.0 (compatible; FlipboardProxy/1.1; +http://flipboard.com/browserproxy)",
      "Mozilla/5.0 (compatible; FlipboardProxy/1.2; +http://flipboard.com/browserproxy)",
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2) Gecko/20100115 Firefox/3.6 (FlipboardProxy/1.1; +http://flipboard.com/browserproxy)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0 (FlipboardProxy/1.1; +http://flipboard.com/browserproxy)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:49.0) Gecko/20100101 Firefox/49.0 (FlipboardProxy/1.2; +http://flipboard.com/browserproxy)"
    ],
    "url": "https://about.flipboard.com/browserproxy/",
    "description": "a proxy service to fetch, validate, and prepare certain elements of websites for presentation through the Flipboard Application"
  }
  ,
  {
    "pattern": "g2reader-bot",
    "addition_date": "2018/06/27",
    "instances": [
      "g2reader-bot/1.0 (+http://www.g2reader.com/)"
    ],
    "url": "http://www.g2reader.com/"
  }
  ,
  {
    "pattern": "G2 Web Services",
    "addition_date": "2019/03/01",
    "instances": [
      "G2 Web Services/1.0 (built with StormCrawler Archetype 1.8; https://www.g2webservices.com/; developers@g2llc.com)"
    ],
    "url": "https://www.g2webservices.com/"
  }
  ,
  {
    "pattern": "imrbot",
    "addition_date": "2018/06/27",
    "instances": [
      "Mozilla/5.0 (compatible; imrbot/1.10.8 +http://www.mignify.com)"
    ],
    "url": "http://www.mignify.com"
  }
  ,
  {
    "pattern": "K7MLWCBot",
    "addition_date": "2018/06/27",
    "instances": [
      "K7MLWCBot/1.0 (+http://www.k7computing.com)"
    ],
    "url": "http://www.k7computing.com",
    "description": "Virus scanner"
  }
  ,
  {
    "pattern": "Kemvibot",
    "addition_date": "2018/06/27",
    "instances": [
      "Kemvibot/1.0 (http://kemvi.com, marco@kemvi.com)"
    ],
    "url": "http://kemvi.com"
  }
  ,
  {
    "pattern": "Landau-Media-Spider",
    "addition_date": "2018/06/27",
    "instances": [
      "Landau-Media-Spider/1.0(http://bots.landaumedia.de/bot.html)"
    ],
    "url": "http://bots.landaumedia.de/bot.html"
  }
  ,
  {
    "pattern": "linkapediabot",
    "addition_date": "2018/06/27",
    "instances": [
      "linkapediabot (+http://www.linkapedia.com)"
    ],
    "url": "http://www.linkapedia.com"
  }
  ,
  {
    "pattern": "vkShare",
    "addition_date": "2018/07/02",
    "instances": [
      "Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)"
    ],
    "url": "http://vk.com/dev/Share"
  }
  ,
  {
    "pattern": "Siteimprove.com",
    "addition_date": "2018/06/22",
    "instances": [
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0) LinkCheck by Siteimprove.com",
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.0) Match by Siteimprove.com",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0) SiteCheck-sitecrawl by Siteimprove.com",
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.0) LinkCheck by Siteimprove.com"
    ]
  }
  ,
  {
     "pattern": "BLEXBot\\/",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/)"
     ],
     "url": "http://webmeup-crawler.com"
  }
  ,
  {
     "pattern": "DareBoost",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 DareBoost"
     ],
     "url": "https://www.dareboost.com/",
     "description": "Bot to test, Analyze and Optimize website"
  }
  ,
  {
     "pattern": "ZuperlistBot\\/",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (compatible; ZuperlistBot/1.0)"
     ]
  }
  ,
  {
     "pattern": "Miniflux\\/",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (compatible; Miniflux/2.0.x-dev; +https://miniflux.net)",
       "Mozilla/5.0 (compatible; Miniflux/2.0.3; +https://miniflux.net)",
       "Mozilla/5.0 (compatible; Miniflux/2.0.7; +https://miniflux.net)",
       "Mozilla/5.0 (compatible; Miniflux/2.0.10; +https://miniflux.net)",
       "Mozilla/5.0 (compatibl$; Miniflux/2.0.x-dev; +https://miniflux.app)",
       "Mozilla/5.0 (compatible; Miniflux/2.0.11; +https://miniflux.app)",
       "Mozilla/5.0 (compatible; Miniflux/2.0.12; +https://miniflux.app)",
       "Mozilla/5.0 (compatible; Miniflux/ae1dc1a; +https://miniflux.app)",
       "Mozilla/5.0 (compatible; Miniflux/3b6e44c; +https://miniflux.app)"
     ],
     "url": "https://miniflux.net",
     "description": "Miniflux is a minimalist and opinionated feed reader."
  }
  ,
  {
     "pattern": "Feedspot",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (compatible; Feedspotbot/1.0; +http://www.feedspot.com/fs/bot)",
       "Mozilla/5.0 (compatible; Feedspot/1.0 (+https://www.feedspot.com/fs/fetcher; like FeedFetcher-Google)"
     ],
     "url": "http://www.feedspot.com/fs/bot"
  }
  ,
  {
     "pattern": "Diffbot\\/",
     "addition_date": "2018/07/07",
     "instances": [
       "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729; Diffbot/0.1; +http://www.diffbot.com)"
     ],
     "url": "http://www.diffbot.com"
  }
  ,
  {
     "pattern": "SEOkicks",
     "addition_date": "2018/08/22",
     "instances": [
       "Mozilla/5.0 (compatible; SEOkicks; +https://www.seokicks.de/robot.html)"
     ],
     "url": "https://www.seokicks.de/robot.html"
  }
  ,
  {
     "pattern": "tracemyfile",
     "addition_date": "2018/08/23",
     "instances": [
       "Mozilla/5.0 (compatible; tracemyfile/1.0; +bot@tracemyfile.com)"
     ]
  }
  ,
  {
     "pattern": "Nimbostratus-Bot",
     "addition_date": "2018/08/29",
     "instances": [
       "Mozilla/5.0 (compatible; Nimbostratus-Bot/v1.3.2; http://cloudsystemnetworks.com)"
     ]
  }
  ,
  {
     "pattern": "zgrab",
     "addition_date": "2018/08/30",
     "instances": [
       "Mozilla/5.0 zgrab/0.x"
     ],
    "url": "https://zmap.io/"
  }
  ,
  {
     "pattern": "PR-CY.RU",
     "addition_date": "2018/08/30",
     "instances": [
       "Mozilla/5.0 (compatible; PR-CY.RU; + https://a.pr-cy.ru)"
     ],
    "url": "https://a.pr-cy.ru/"
  }
  ,
  {
     "pattern": "AdsTxtCrawler",
     "addition_date": "2018/08/30",
     "instances": [
       "AdsTxtCrawler/1.0"
     ]
  },
  {
    "pattern": "Datafeedwatch",
    "addition_date": "2018/09/05",
    "instances": [
      "Datafeedwatch/2.1.x"
    ],
    "url": "https://www.datafeedwatch.com/"
  }
  ,
  {
    "pattern": "Zabbix",
    "addition_date": "2018/09/05",
    "instances": [
      "Zabbix"
    ],
    "url": "https://www.zabbix.com/documentation/3.4/manual/web_monitoring"
  }
  ,
  {
    "pattern": "TangibleeBot",
    "addition_date": "2018/09/05",
    "instances": [
      "TangibleeBot/1.0.0.0 (http://tangiblee.com/bot)"
    ],
    "url": "http://tangiblee.com/bot"
  }
  ,
  {
    "pattern": "google-xrawler",
    "addition_date": "2018/09/05",
    "instances": [
      "google-xrawler"
    ],
    "url": "https://webmasters.stackexchange.com/questions/105560/what-is-the-google-xrawler-user-agent-used-for"
  }
  ,
  {
    "pattern": "axios",
    "addition_date": "2018/09/06",
    "instances": [
      "axios/0.18.0",
      "axios/0.19.0"
    ],
    "url": "https://github.com/axios/axios"
  }
  ,
  {
    "pattern": "Amazon CloudFront",
    "addition_date": "2018/09/07",
    "instances": [
      "Amazon CloudFront"
    ],
    "url": "https://aws.amazon.com/cloudfront/"
  }
  ,
  {
    "pattern": "Pulsepoint",
    "addition_date": "2018/09/24",
    "instances": [
      "Pulsepoint XT3 web scraper"
    ]
  }
  ,
  {
    "pattern": "CloudFlare-AlwaysOnline",
    "addition_date": "2018/09/27",
    "instances": [
      "Mozilla/5.0 (compatible; CloudFlare-AlwaysOnline/1.0; +http://www.cloudflare.com/always-online) AppleWebKit/534.34",
      "Mozilla/5.0 (compatible; CloudFlare-AlwaysOnline/1.0; +https://www.cloudflare.com/always-online) AppleWebKit/534.34"
    ],
    "url" : "https://www.cloudflare.com/always-online/"
  }
  ,
  {
   "pattern": "Google-Structured-Data-Testing-Tool",
    "addition_date": "2018/10/02",
    "instances": [
      "Mozilla/5.0 (compatible; Google-Structured-Data-Testing-Tool +https://search.google.com/structured-data/testing-tool)",
      "Mozilla/5.0 (compatible; Google-Structured-Data-Testing-Tool +http://developers.google.com/structured-data/testing-tool/)"
    ],
    "url": "https://search.google.com/structured-data/testing-tool"
  }
  ,
  {
   "pattern": "WordupInfoSearch",
    "addition_date": "2018/10/07",
    "instances": [
      "WordupInfoSearch/1.0"
    ]
  }
  ,
  {
    "pattern": "WebDataStats",
    "addition_date": "2018/10/08",
    "instances": [
      "Mozilla/5.0 (compatible; WebDataStats/1.0 ; +https://webdatastats.com/policy.html)"
    ],
    "url": "https://webdatastats.com/"
  }
  ,
  {
    "pattern": "HttpUrlConnection",
    "addition_date": "2018/10/08",
    "instances": [
      "Jersey/2.25.1 (HttpUrlConnection 1.8.0_141)"
    ]
  }
  ,
  {
    "pattern": "Seekport Crawler",
    "addition_date": "2018/10/08",
    "instances": [
      "Mozilla/5.0 (compatible; Seekport Crawler; http://seekport.com/)"
    ],
    "url": "http://seekport.com/"
  }
  ,
  {
    "pattern": "ZoomBot",
    "addition_date": "2018/10/10",
    "instances": [
      "ZoomBot (Linkbot 1.0 http://suite.seozoom.it/bot.html)"
    ],
    "url": "http://suite.seozoom.it/bot.html"
  }
  ,
  {
    "pattern": "VelenPublicWebCrawler",
    "addition_date": "2018/10/09",
    "instances": [
      "VelenPublicWebCrawler (velen.io)"
    ]
  }
  ,
  {
    "pattern": "MoodleBot",
    "addition_date": "2018/10/10",
    "instances": [
      "MoodleBot/1.0"
    ]
  }
  ,
  {
    "pattern": "jpg-newsbot",
    "addition_date": "2018/10/10",
    "instances": [
      "jpg-newsbot/2.0; (+https://vipnytt.no/bots/)"
    ],
    "url": "https://vipnytt.no/bots/"
  }
  ,
  {
    "pattern": "outbrain",
    "addition_date": "2018/10/14",
    "instances": [
      "Mozilla/5.0 (Java) outbrain"
    ],
    "url": "https://www.outbrain.com/help/advertisers/invalid-url/"
  }
  ,
  {
    "pattern": "W3C_Validator",
    "addition_date": "2018/10/14",
    "instances": [
      "W3C_Validator/1.3"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "Validator\\.nu",
    "addition_date": "2018/10/14",
    "instances": [
      "Validator.nu/LV"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "W3C-checklink",
    "addition_date": "2018/10/14",
    "depends_on": ["libwww-perl"],
    "instances": [
      "W3C-checklink/2.90 libwww-perl/5.64",
      "W3C-checklink/3.6.2.3 libwww-perl/5.64",
      "W3C-checklink/4.2 [4.20] libwww-perl/5.803",
      "W3C-checklink/4.2.1 [4.21] libwww-perl/5.803",
      "W3C-checklink/4.3 [4.42] libwww-perl/5.805",
      "W3C-checklink/4.3 [4.42] libwww-perl/5.808",
      "W3C-checklink/4.3 [4.42] libwww-perl/5.820",
      "W3C-checklink/4.5 [4.154] libwww-perl/5.823",
      "W3C-checklink/4.5 [4.160] libwww-perl/5.823"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "W3C-mobileOK",
    "addition_date": "2018/10/14",
    "instances": [
      "W3C-mobileOK/DDC-1.0"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "W3C_I18n-Checker",
    "addition_date": "2018/10/14",
    "instances": [
      "W3C_I18n-Checker/1.0"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "FeedValidator",
    "addition_date": "2018/10/14",
    "instances": [
      "FeedValidator/1.3"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "W3C_CSS_Validator",
    "addition_date": "2018/10/14",
    "instances": [
      "Jigsaw/2.3.0 W3C_CSS_Validator_JFouffa/2.0"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "W3C_Unicorn",
    "addition_date": "2018/10/14",
    "instances": [
      "W3C_Unicorn/1.0"
    ],
    "url": "https://validator.w3.org/services"
  }
  ,
  {
    "pattern": "Google-PhysicalWeb",
    "addition_date": "2018/10/21",
    "instances": [
      "Mozilla/5.0 (Google-PhysicalWeb)"
    ]
  }
  ,
  {
    "pattern": "Blackboard",
    "addition_date": "2018/10/28",
    "instances": [
      "Blackboard Safeassign"
    ],
    "url": "https://help.blackboard.com/Learn/Administrator/Hosting/Tools_Management/SafeAssign"
  },
  {
    "pattern": "ICBot\\/",
    "addition_date": "2018/10/23",
    "instances": [
      "Mozilla/5.0 (compatible; ICBot/0.1; +https://ideasandcode.xyz"
    ],
    "url": "https://ideasandcode.xyz"
  },
  {
    "pattern": "BazQux",
    "addition_date": "2018/10/23",
    "instances": [
      "Mozilla/5.0 (compatible; BazQux/2.4; +https://bazqux.com/fetcher; 1 subscribers)"
    ],
    "url": "https://bazqux.com/fetcher"
  },
  {
    "pattern": "Twingly",
    "addition_date": "2018/10/23",
    "instances": [
      "Mozilla/5.0 (compatible; Twingly Recon; twingly.com)"
    ],
    "url": "https://twingly.com"
  },
  {
    "pattern": "Rivva",
    "addition_date": "2018/10/23",
    "instances": [
      "Mozilla/5.0 (compatible; Rivva; http://rivva.de)"
    ],
    "url": "http://rivva.de"
  },
  {
    "pattern": "Experibot",
    "addition_date": "2018/11/03",
    "instances": [
      "Experibot-v2 http://goo.gl/ZAr8wX",
      "Experibot-v3 http://goo.gl/ZAr8wX"
    ],
    "url": "https://amirkr.wixsite.com/experibot"
  },
  {
    "pattern": "awesomecrawler",
    "addition_date": "2018/11/24",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.5 Safari/537.22 +awesomecrawler"
    ]
  },
  {
    "pattern": "Dataprovider.com",
    "addition_date": "2018/11/24",
    "instances": [
      "Mozilla/5.0 (compatible; Dataprovider.com)"
    ],
    "url": "https://www.dataprovider.com/"
  },
  {
    "pattern": "GroupHigh\\/",
    "addition_date": "2018/11/24",
    "instances": [
      "Mozilla/5.0 (compatible; GroupHigh/1.0; +http://www.grouphigh.com/"
    ],
    "url": "http://www.grouphigh.com/"
  },
  {
    "pattern": "theoldreader.com",
    "addition_date": "2018/12/02",
    "instances": [
      "Mozilla/5.0 (compatible; theoldreader.com)"
    ],
    "url": "https://www.theoldreader.com/"
  }
  ,
  {
    "pattern": "AnyEvent",
    "addition_date": "2018/12/07",
    "instances": [
      "Mozilla/5.0 (compatible; U; AnyEvent-HTTP/2.24; +http://software.schmorp.de/pkg/AnyEvent)"
    ],
    "url": "http://software.schmorp.de/pkg/AnyEvent.html"
  }
  ,
  {
    "pattern": "Uptimebot\\.org",
    "addition_date": "2019/01/17",
    "instances": [
      "Uptimebot.org - Free website monitoring"
    ],
    "url": "http://uptimebot.org/"
  }
  ,
  {
    "pattern": "Nmap Scripting Engine",
    "addition_date": "2019/02/04",
    "instances": [
      "Mozilla/5.0 (compatible; Nmap Scripting Engine; https://nmap.org/book/nse.html)"
    ],
    "url": "https://nmap.org/book/nse.html"
  }
  ,
  {
    "pattern": "2ip.ru",
    "addition_date": "2019/02/12",
    "instances": [
      "2ip.ru CMS Detector (https://2ip.ru/cms/)"
    ],
    "url": "https://2ip.ru/cms/"
  },
  {
    "pattern": "Clickagy",
    "addition_date": "2019/02/19",
    "instances": [
      "Clickagy Intelligence Bot v2"
    ],
    "url": "https://www.clickagy.com"
  },
  {
    "pattern": "Caliperbot",
    "addition_date": "2019/03/02",
    "instances": [
      "Caliperbot/1.0 (+http://www.conductor.com/caliperbot)"
    ],
    "url": "http://www.conductor.com/caliperbot"
  },
  {
    "pattern": "MBCrawler",
    "addition_date": "2019/03/02",
    "instances": [
      "MBCrawler/1.0 (https://monitorbacklinks.com)"
    ],
    "url": "https://monitorbacklinks.com"
  },
  {
    "pattern": "online-webceo-bot",
    "addition_date": "2019/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; online-webceo-bot/1.0; +http://online.webceo.com)"
    ],
    "url": "http://online.webceo.com"
  },
  {
    "pattern": "B2B Bot",
    "addition_date": "2019/03/02",
    "instances": [
      "B2B Bot"
    ]
  },
  {
    "pattern": "AddSearchBot",
    "addition_date": "2019/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; AddSearchBot/0.9; +http://www.addsearch.com/bot; info@addsearch.com)"
    ],
    "url": "http://www.addsearch.com/bot"
  },
  {
    "pattern": "Google Favicon",
    "addition_date": "2019/03/14",
    "instances": [
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon"
    ]
  },
  {
    "pattern": "HubSpot",
    "addition_date": "2019/04/15",
    "instances": [
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 HubSpot Webcrawler - web-crawlers@hubspot.com",
      "Mozilla/5.0 (X11; Linux x86_64; HubSpot Single Page link check; web-crawlers+links@hubspot.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
      "Mozilla/5.0 (compatible; HubSpot Crawler; web-crawlers@hubspot.com)",
      "HubSpot Connect 2.0 (http://dev.hubspot.com/) - BizOpsCompanies-Tq2-BizCoDomainValidationAudit"
    ]
  },
  {
    "pattern": "Chrome-Lighthouse",
    "addition_date": "2019/03/15",
    "instances": [
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36(KHTML, like Gecko) Chrome/69.0.3464.0 Mobile Safari/537.36 Chrome-Lighthouse",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/69.0.3464.0 Safari/537.36 Chrome-Lighthouse",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Safari/537.36 Chrome-Lighthouse",
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Mobile Safari/537.36 Chrome-Lighthouse"
    ],
    "url": "https://developers.google.com/speed/pagespeed/insights"
  },
  {
    "pattern": "HeadlessChrome",
    "url": "https://developers.google.com/web/updates/2017/04/headless-chrome",
    "addition_date": "2019/06/17",
    "instances": [
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/74.0.3729.169 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/69.0.3494.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/76.0.3803.0 Safari/537.36"
    ]
  },
  {
    "pattern": "CheckMarkNetwork\\/",
    "addition_date": "2019/06/30",
    "instances": [
      "CheckMarkNetwork/1.0 (+http://www.checkmarknetwork.com/spider.html)"
    ],
    "url": "https://www.checkmarknetwork.com/"
  },
  {
    "pattern": "www\\.uptime\\.com",
    "addition_date": "2019/07/21",
    "instances": [
      "Mozilla/5.0 (compatible; Uptimebot/1.0; +http://www.uptime.com/uptimebot)"
    ],
    "url": "http://www.uptime.com/uptimebot"
  }
  ,
  {
    "pattern": "Streamline3Bot\\/",
    "addition_date": "2019/07/21",
    "instances": [
      "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1) Streamline3Bot/1.0",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64; +https://www.ubtsupport.com/legal/Streamline3Bot.php) Streamline3Bot/1.0"
    ],
    "url": "https://www.ubtsupport.com/legal/Streamline3Bot.php"
  }
  ,
  {
    "pattern": "serpstatbot\\/",
    "addition_date": "2019/07/25",
    "instances": [
      "serpstatbot/1.0 (advanced backlink tracking bot; http://serpstatbot.com/; abuse@serpstatbot.com)",
      "serpstatbot/1.0 (advanced backlink tracking bot; curl/7.58.0; http://serpstatbot.com/; abuse@serpstatbot.com)"
    ],
    "url": "http://serpstatbot.com"
  }
  ,
  {
    "pattern": "MixnodeCache\\/",
    "addition_date": "2019/08/04",
    "instances": [
      "MixnodeCache/1.8(+https://cache.mixnode.com/)"
    ],
    "url": "https://cache.mixnode.com/"
  }
  ,
  {
    "pattern": "^curl",
    "addition_date": "2019/08/15",
    "instances": [
      "curl",
      "curl/7.29.0",
      "curl/7.47.0",
      "curl/7.54.0",
      "curl/7.55.1",
      "curl/7.64.0",
      "curl/7.64.1",
      "curl/7.65.3"
    ],
    "url": "https://curl.haxx.se/"
  }
  ,
  {
    "pattern": "SimpleScraper",
    "addition_date": "2019/08/16",
    "instances": [
      "Mozilla/5.0 (compatible; SimpleScraper)"
    ],
    "url": "https://github.com/ramonkcom/simple-scraper/"
  }
  ,
  {
    "pattern": "RSSingBot",
    "addition_date": "2019/09/15",
    "instances": [
      "RSSingBot (http://www.rssing.com)"
    ],
    "url": "http://www.rssing.com"
  }
  ,
  {
    "pattern": "Jooblebot",
    "addition_date": "2019/09/25",
    "instances": [
      "Mozilla/5.0 (compatible; Jooblebot/2.0; Windows NT 6.1; WOW64; +http://jooble.org/jooble-bot) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36"
    ],
    "url": "http://jooble.org/jooble-bot"
  }
  ,
  {
    "pattern": "fedoraplanet",
    "addition_date": "2019/09/28",
    "instances": [
      "venus/fedoraplanet"
    ],
    "url": "http://fedoraplanet.org/"
  }
  ,
  {
    "pattern": "Friendica",
    "addition_date": "2019/09/28",
    "instances": [
      "Friendica 'The Tazmans Flax-lily' 2019.01-1293; https://hoyer.xyz"
    ],
    "url": "https://hoyer.xyz"
  }
  ,
  {
    "pattern": "NextCloud",
    "addition_date": "2019/09/30",
    "instances": [
      "NextCloud-News/1.0"
    ],
    "url": "https://nextcloud.com/"
  }
  ,
  {
    "pattern": "Tiny Tiny RSS",
    "addition_date": "2019/10/04",
    "instances": [
      "Tiny Tiny RSS/1.15.3 (http://tt-rss.org/)",
      "Tiny Tiny RSS/17.12 (a2d1fa5) (http://tt-rss.org/)",
      "Tiny Tiny RSS/19.2 (b68db2d) (http://tt-rss.org/)",
      "Tiny Tiny RSS/19.8 (http://tt-rss.org/)"
    ],
    "url": "http://tt-rss.org/"
  }
  ,
  {
    "pattern": "RegionStuttgartBot",
    "addition_date": "2019/10/17",
    "instances": [
      "Mozilla/5.0 (compatible; RegionStuttgartBot/1.0; +http://it.region-stuttgart.de/competenzatlas/unternehmen-suchen/)"
    ],
    "url": "http://it.region-stuttgart.de/competenzatlas/unternehmen-suchen/"
  }
  ,
  {
    "pattern": "Bytespider",
    "addition_date": "2019/11/11",
    "instances": [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.3754.1902 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.4454.1745 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.7597.1164 Mobile Safari/537.36; Bytespider;bytespider@bytedance.com",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2988.1545 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.4141.1682 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.3478.1649 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.5267.1259 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.7990.1979 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.2268.1523 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2576.1836 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.9681.1227 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.6023.1635 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.4944.1981 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.3613.1739 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.4022.1033 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.3248.1547 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.5527.1507 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.5216.1326 Mobile Safari/537.36; Bytespider",
        "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.9038.1080 Mobile Safari/537.36; Bytespider"
    ],
    "url": "https://stackoverflow.com/questions/57908900/what-is-the-bytespider-user-agent"
  }
  ,
  {
    "pattern": "Datanyze",
    "addition_date": "2019/11/17",
    "instances": [
      "Mozilla/5.0 (X11; Datanyze; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
    ],
    "url": "https://www.datanyze.com/dnyzbot/"
  }
  ,
  {
    "pattern": "Google-Site-Verification",
    "addition_date": "2019/12/11",
    "instances": [
      "Mozilla/5.0 (compatible; Google-Site-Verification/1.0)"
    ],
    "url": "https://support.google.com/webmasters/answer/9008080"
  }
  ,
  {
    "pattern": "TrendsmapResolver",
    "addition_date": "2020/02/24",
    "instances": [
      "Mozilla/5.0 (compatible; TrendsmapResolver/0.1)"
    ],
    "url": "https://www.trendsmap.com/"
  }
  ,
  {
    "pattern": "tweetedtimes",
    "addition_date": "2020/02/24",
    "instances": [
      "Mozilla/5.0 (compatible; +http://tweetedtimes.com)"
    ],
    "url": "https://tweetedtimes.com/"
  },
  {
    "pattern": "NTENTbot",
    "addition_date": "2020/02/24",
    "instances": [
      "Mozilla/5.0 (compatible; NTENTbot; +http://www.ntent.com/ntentbot)"
    ],
    "url": "https://ntent.com/ntentbot/"
  },
  {
    "pattern": "Gwene",
    "addition_date": "2020/02/24",
    "instances": [
      "Gwene/1.0 (The gwene.org rss-to-news gateway) Googlebot"
    ],
    "url": "https://gwene.org"
  },
  {
    "pattern": "SimplePie",
    "addition_date": "2020/02/24",
    "instances": [
      "SimplePie/1.3-dev (Feed Parser; http://simplepie.org; Allow like Gecko)"
    ],
    "url": "http://simplepie.org"
  },
  {
    "pattern": "SearchAtlas",
    "addition_date": "2020/03/02",
    "instances": [
      "SearchAtlas.com SEO Crawler"
    ],
    "url": "http://SearchAtlas.com"
  },
  {
    "pattern": "Superfeedr",
    "addition_date": "2020/03/02",
    "instances": [
      "Superfeedr bot/2.0 http://superfeedr.com - Make your feeds realtime: get in touch - feed-id:1162088860"
    ],
    "url": "http://superfeedr.com"
  },
  {
    "pattern": "feedbot",
    "addition_date": "2020/03/02",
    "instances": [
      "wp.com feedbot/1.0 (+https://wp.com)"
    ],
    "url": "http://wp.com"
  },
  {
    "pattern": "UT-Dorkbot",
    "addition_date": "2020/03/02",
    "instances": [
      "UT-Dorkbot/1.0"
    ],
    "url": "https://security.utexas.edu/dorkbot"
  },
  {
    "pattern": "Amazonbot",
    "addition_date": "2020/03/02",
    "instances": [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)"
    ],
    "url": "https://developer.amazon.com/support/amazonbot"
  },
  {
    "pattern": "SerendeputyBot",
    "addition_date": "2020/03/02",
    "instances": [
      "SerendeputyBot/0.8.6 (http://serendeputy.com/about/serendeputy-bot)"
    ],
    "url": "http://serendeputy.com/about/serendeputy-bot"
  },
  {
    "pattern": "Eyeotabot",
    "addition_date": "2020/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; Eyeotabot/1.0; +http://www.eyeota.com)"
    ],
    "url": "http://www.eyeota.com"
  },
  {
    "pattern": "officestorebot",
    "addition_date": "2020/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; officestorebot/1.0; +https://aka.ms/officestorebot)"
    ],
    "url": "https://aka.ms/officestorebot"
  },
  {
    "pattern": "Neticle Crawler",
    "addition_date": "2020/03/02",
    "instances": [
      "Neticle Crawler v1.0 ( https://neticle.com/bot/en/ )"
    ],
    "url": "https://neticle.com/bot/en/"
  },
  {
    "pattern": "SurdotlyBot",
    "addition_date": "2020/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; SurdotlyBot/1.0; +http://sur.ly/bot.html; Linux; Android 4; iPhone; CPU iPhone OS 6_0_1 like Mac OS X)"
    ],
    "url": "http://sur.ly/bot.html"
  },
  {
    "pattern": "LinkisBot",
    "addition_date": "2020/03/02",
    "instances": [
      "Mozilla/5.0 (compatible; LinkisBot/1.0; bot@linkis.com) (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) Mobile/12H321"
    ]
  },
  {
    "pattern": "AwarioSmartBot",
    "addition_date": "2020/03/02",
    "instances": [
      "AwarioSmartBot/1.0 (+https://awario.com/bots.html; bots@awario.com)"
    ],
    "url": "https://awario.com/bots.html"
  },
  {
    "pattern": "AwarioRssBot",
    "addition_date": "2020/03/02",
    "instances": [
      "AwarioRssBot/1.0 (+https://awario.com/bots.html; bots@awario.com)"
    ],
    "url": "https://awario.com/bots.html"
  },
  {
    "pattern": "RyteBot",
    "addition_date": "2020/03/02",
    "instances": [
      "RyteBot/1.0.0 (+https://bot.ryte.com/)"
    ],
    "url": "https://bot.ryte.com/"
  },
  {
    "pattern": "FreeWebMonitoring SiteChecker",
    "addition_date": "2020/03/02",
    "instances": [
      "FreeWebMonitoring SiteChecker/0.2 (+https://www.freewebmonitoring.com/bot.html)"
    ],
    "url": "https://www.freewebmonitoring.com/bot.html"
  },
  {
    "pattern": "AspiegelBot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; AspiegelBot)"
    ],
    "url": "https://aspiegel.com"
  },
  {
    "pattern": "NAVER Blog Rssbot",
    "addition_date": "2020/03/16",
    "instances": [
      "NAVER Blog Rssbot"
    ],
    "url": "http://www.naver.com"
  },
  {
    "pattern": "zenback bot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; zenback bot; powered by logly +http://corp.logly.co.jp/)"
    ],
    "url": "http://corp.logly.co.jp/"
  },
  {
    "pattern": "SentiBot",
    "addition_date": "2020/03/16",
    "instances": [
      "SentiBot www.sentibot.eu (compatible with Googlebot)"
    ],
    "url": "https://www.sentibot.eu"
  },
  {
    "pattern": "Domains Project\\/",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; Domains Project/1.0.3; +https://github.com/tb0hdan/domains)"
    ],
    "url": "https://github.com/tb0hdan/domains"
  },
  {
    "pattern": "Pandalytics",
    "addition_date": "2020/03/16",
    "instances": [
      "Pandalytics/1.0 (https://domainsbot.com/pandalytics/)"
    ],
    "url": "https://domainsbot.com/pandalytics/"
  },
  {
    "pattern": "VKRobot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; VKRobot/1.0)"
    ]
  },
  {
    "pattern": "bidswitchbot",
    "addition_date": "2020/03/16",
    "instances": [
      "bidswitchbot/1.0"
    ],
    "url": "https://www.bidswitch.com/about-us/"
  },
  {
    "pattern": "tigerbot",
    "addition_date": "2020/03/16",
    "instances": [
      "tigerbot"
    ]
  },
  {
    "pattern": "NIXStatsbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; NIXStatsbot/1.1; +http://www.nixstats.com/bot.html)"
    ],
    "url": "http://www.nixstats.com/bot.html"
  },
  {
    "pattern": "Atom Feed Robot",
    "addition_date": "2020/03/16",
    "instances": [
      "RSSMicro.com RSS/Atom Feed Robot"
    ],
    "url": "https://rssmicro.com"
  },
  {
    "pattern": "Curebot",
    "addition_date": "2020/03/16",
    "instances": [
      "Curebot/1.0"
    ]
  },
  {
    "pattern": "PagePeeker\\/",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36 (compatible; PagePeeker/3.0; +https://pagepeeker.com/robots/)"
    ],
    "url": "https://pagepeeker.com/robots/"
  },
  {
    "pattern": "Vigil\\/",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; Vigil/1.0; +http://vigil-app.com/bot.html)"
    ],
    "url": "http://vigil-app.com/bot.html"
  },
  {
    "pattern": "rssbot\\/",
    "addition_date": "2020/03/16",
    "instances": [
      "rssbot/1.4.3 (+https://t.me/RustRssBot)"
    ],
    "url": "https://t.me/RustRssBot"
  },
  {
    "pattern": "startmebot\\/",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; startmebot/1.0; +https://start.me/bot)"
    ],
    "url": "https://start.me/bot"
  },
  {
    "pattern": "JobboerseBot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (X11; U; Linux Core i7-4980HQ; de; rv:32.0; compatible; JobboerseBot; http://www.jobboerse.com/bot.htm) Gecko/20100101 Firefox/38.0"
    ],
    "url": "http://www.jobboerse.com/bot.htm"
  },
  {
    "pattern": "seewithkids",
    "addition_date": "2020/03/16",
    "instances": [
      "http://seewithkids.com/bot"
    ],
    "url": "http://seewithkids.com/bot"
  },
  {
    "pattern": "NINJA bot",
    "addition_date": "2020/03/16",
    "instances": [
      "NINJA bot"
    ]
  },
  {
    "pattern": "Cutbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Cutbot; 1.5; http://cutbot.net/"
    ],
    "url": "http://cutbot.net/"
  },
  {
    "pattern": "BublupBot",
    "addition_date": "2020/03/16",
    "instances": [
      "BublupBot (+https://www.bublup.com/bublup-bot.html)"
    ],
    "url": "https://www.bublup.com/bublup-bot.html"
  },
  {
    "pattern": "BrandONbot",
    "addition_date": "2020/03/16",
    "instances": [
      "BrandONbot (http://brandonmedia.net)"
    ],
    "url": "http://brandonmedia.net"
  },
  {
    "pattern": "RidderBot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; RidderBot/1.0; bot@ridder.co)",
      "Mozilla/5.0 (compatible; RidderBot/1.0; bot@ridder.co) (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) Mobile/12H321"
    ],
    "url": "http://brandonmedia.net"
  },
  {
    "pattern": "Taboolabot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; Taboolabot/3.7; +http://www.taboola.com)"
    ],
    "url": "http://www.taboola.com"
  },
  {
    "pattern": "Dubbotbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; Dubbotbot/0.2; +http://dubbot.com)"
    ],
    "url": "http://dubbot.com"
  },
  {
    "pattern": "FindITAnswersbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible;FindITAnswersbot/1.0;+http://search.it-influentials.com/bot.htm)"
    ],
    "url": "http://search.it-influentials.com/bot.htm"
  },
  {
    "pattern": "infoobot",
    "addition_date": "2020/03/16",
    "instances": [
      "infoobot/0.1 (https://www.infoo.nl/bot.html)"
    ],
    "url": "https://www.infoo.nl/bot.html"
  },
  {
    "pattern": "Refindbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 (Refindbot/1.0)"
    ],
    "url": "https://refind.com/about"
  },
  {
    "pattern": "BlogTraffic\\/\\d\\.\\d+ Feed-Fetcher",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; BlogTraffic/1.4 Feed-Fetcher; +http://www.blogtraffic.de/rss-bot.html)"
    ],
    "url": "http://www.blogtraffic.de/rss-bot.html"
  },
  {
    "pattern": "SeobilityBot",
    "addition_date": "2020/03/16",
    "instances": [
      "SeobilityBot (SEO Tool; https://www.seobility.net/sites/bot.html)"
    ],
    "url": "https://www.seobility.net/sites/bot.html"
  },
  {
    "pattern": "Cincraw",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; Cincraw/1.0; +http://cincrawdata.net/bot/)"
    ],
    "url": "http://cincrawdata.net/bot/"
  },
  {
    "pattern": "Dragonbot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (Windows NT 6.1; rv:34.0) Gecko/20100101 Firefox/34.0; Dragonbot; http://www.dragonmetrics.com"
    ],
    "url": "http://www.dragonmetrics.com"
  },
  {
    "pattern": "VoluumDSP-content-bot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; VoluumDSP-content-bot/2.0; +dsp-dev@codewise.com)"
    ],
    "url": "https://codewise.com"
  },
  {
    "pattern": "FreshRSS",
    "addition_date": "2020/03/16",
    "instances": [
      "FreshRSS/1.11.2 (Linux; https://freshrss.org) like Googlebot"
    ],
    "url": "https://freshrss.org"
  },
  {
    "pattern": "BitBot",
    "addition_date": "2020/03/16",
    "instances": [
      "Mozilla/5.0 (compatible; BitBot/v1.19.0; +https://bitbot.dev)"
    ],
    "url": "https://bitbot.dev"
  },
  {
    "pattern": "^PHP-Curl-Class",
    "addition_date": "2020/12/10",
    "instances": [
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.2.24 curl/7.61.1",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.3.19 curl/7.66.0",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.3.23 curl/7.66.0",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.4.7 curl/7.69.1",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.4.9 curl/7.69.1",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.4.10 curl/7.69.1",
      "PHP-Curl-Class/4.13.0 (+https://github.com/php-curl-class/php-curl-class) PHP/7.4.11 curl/7.69.1"
    ],
    "url": "https://github.com/php-curl-class/php-curl-class"
  },
  {
    "pattern": "Google-Certificates-Bridge",
    "addition_date": "2020/12/23",
    "instances": [
      "Google-Certificates-Bridge"
    ]
  },
  {
    "pattern": "Viber",
    "addition_date": "2021/04/27",
    "instances": [
      "Viber"
    ],
    "url": "https://www.viber.com/"
  },
  {
    "pattern": "e\\.ventures Investment Crawler",
    "addition_date": "2021/06/05",
    "instances": [
      "e.ventures Investment Crawler (eventures.vc)"
    ]
  },
  {
    "pattern": "evc-batch",
    "addition_date": "2021/06/07",
    "instances": [
      "Mozilla/5.0 (compatible; evc-batch/2.0)"
    ]
  },
  {
    "pattern": "PetalBot",
    "addition_date": "2021/06/07",
    "instances": [
      "Mozilla/5.0 (compatible;PetalBot;+https://webmaster.petalsearch.com/site/petalbot)",
      "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)"
    ],
    "url": "https://webmaster.petalsearch.com/site/petalbot"
  },
  {
    "pattern": "Pingdom",
	"addition_date": "2021/07/07",    
    "instances": [
      "Pingdom.com_bot_version_1.4_(http://www.pingdom.com/)",
	  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.100 Chrome/61.0.3163.100 Safari/537.36 PingdomPageSpeed/1.0 (pingbot/2.0; +http://www.pingdom.com/)",
	  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) browser/2020.2.1 Chrome/78.0.3904.130 Electron/7.3.2 Safari/537.36 PingdomTMS/2020.2",
	  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) browser/2020.2.5 Chrome/78.0.3904.130 Electron/7.3.15 Safari/537.36 PingdomTMS/2020.2",
	  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) browser/2020.2.0 Chrome/78.0.3904.130 Electron/7.1.7 Safari/537.36 PingdomTMS/2020.2",
	  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) renderer/2020.2.0 Chrome/78.0.3904.130 Electron/7.1.7 Safari/537.36 PingdomTMS/2020.2",
	  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.100 Chrome/61.0.3163.100 Safari/537.36 PingdomPageSpeed/1.0 (pingbot/2.0; http://www.pingdom.com/)"
    ],
	"url": "http://www.pingdom.com/"
	
  }
]

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
/**
 * Get the value of a cookie.
 * 
 * @param {String} property The name of the cookie to get the value for
 * @returns {String} The value of the cookie
 */
var get = function get(property) {
  var value = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, property.length + 1) === property + '=') {
        value = decodeURIComponent(cookie.substring(property.length + 1));
        break;
      }
    }
  }
  return value;
};

/**
 * Set a cookie.
 * 
 * @param {String} property The name of the cookie to set the value of
 * @param {String} value The value to set
 * @param {Object} options An object of options where key is the name and value is the value
 */
var set = function set(property) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Spread default options with user defined.
  options = _objectSpread({
    path: '/'
  }, options);

  // Set the property and value.
  var updatedCookie = "".concat(property, "=").concat(encodeURIComponent(value));

  // Set the options.
  for (var optionKey in options) {
    updatedCookie += "; ".concat(optionKey);
    var optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "= ".concat(optionValue);
    }
  }

  // Set the cookie.
  document.cookie = updatedCookie;
};

/**
 * Remove a cookie.
 * 
 * @param {String} property The name of the cookie to remove
 */
var remove = function remove(property) {
  set(property, '', {
    'max-age': -1
  });
};
var _default = exports["default"] = {
  get: get,
  set: set,
  remove: remove
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = exports["default"] = void 0;
/**
 * Load a script from a given URL.
 *
 * @param {string} url The URL to load
 * @param {function|undefined} callback A function to execute after the script has loaded
 * @param {object} attrs An object containing attributes to apply to the script element
 * @param {function|undefined} errorCallback A function to execute if the script errors while attempting to load the URL
 * @return {void}
 */
var load = exports.load = function load() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var errorCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  if (url !== '') {
    var se = document.createElement('script');
    var honeycombPath = window.Honeycomb && window.Honeycomb.path ? window.Honeycomb.path : '';
    se.type = 'text/javascript';
    se.src = url.match('://') !== null ? url : honeycombPath + url;
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
    if (typeof errorCallback === 'function') {
      se.onerror = errorCallback;
    }

    // Custom attributes.
    for (var prop in attrs) {
      se.setAttribute(prop, attrs[prop]);
    }
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
  }
};
var _default = exports["default"] = {
  load: load
};

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var load = function load() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (url !== false) {
    var link = document.createElement('link');
    var honeycombPath = window.Honeycomb && window.Honeycomb.path ? window.Honeycomb.path : '';
    link.setAttribute('rel', 'stylesheet');
    link.href = honeycombPath + url;
    var done = false;

    // When the stylesheet has loaded, apply the callback.
    link.onload = link.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true;
        if (typeof callback === 'function') {
          callback.apply(this);
        }
      }
    };

    // Custom attributes.
    for (var prop in attrs) {
      link[prop] = attrs[prop];
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
  }
};
var _default = exports["default"] = {
  load: load
};

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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
      _honeycombDocument["default"].load(config.url, function () {
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
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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
      _honeycombDocument["default"].load(config.url, function () {
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
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = exports["default"] = {
  init: init
};

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = exports["default"] = {
  init: init
};

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports["default"] = void 0;
var _honeycombAnalytics = _interopRequireDefault(require("../../analytics/js/honeycomb.analytics.google"));
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
var _this = void 0;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
/**
 * The default form settings.
 * 
 * Exported so they can be imported by the React implementation.
 */
var defaults = exports.defaults = {
  callback: function callback() {},
  formId: '',
  formsJavaScriptUrl: 'https://content.red-gate.com/js/forms2/js/forms2.min.js',
  munchkinId: '808-ITG-788',
  rootUrl: '//content.red-gate.com',
  success: {
    callback: null,
    message: null
  },
  followUpUrl: null,
  submit: {
    callback: null
  },
  customValidation: true
};

/**
 * Create a custom config object by merging the default 
 * with the user supplied config.
 * 
 * @param {object} c The user supplied config.
 * @return {object} The defaults merged with the user supplied config.
 */
var createConfig = function createConfig(c) {
  return _objectSpread(_objectSpread({}, defaults), c);
};
var removeDefaultStyles = function removeDefaultStyles() {
  // Remove all the Marketo form stylesheets and embedded style tags.
  var formStyles = document.querySelectorAll("\n        .mktoForm style,\n        link#mktoForms2BaseStyle,\n        link#mktoForms2ThemeStyle,\n        link#mktoFontUrl\n    ");
  for (var i = 0; i < formStyles.length; i++) {
    var style = formStyles[i];
    if (Object.prototype.hasOwnProperty.call(style, 'remove')) {
      style.remove();
    } else {
      style.parentElement.removeChild(style);
    }
  }

  // Remove all the Marketo form embedded style attributes.
  var formElements = document.querySelectorAll("\n        .mktoForm,\n        .mktoForm *\n    ");
  for (var _i = 0; _i < formElements.length; _i++) {
    var formElement = formElements[_i];
    formElement.removeAttribute('style');
  }
};

/**
 * Check the config to find out if the form has custom submit functionality or
 * not.
 *
 * @param {Object} config The config object, to check for custom submit against.
 * @returns {Boolean} Whether the form has custom submit functionality or not.
 */
var hasCustomSubmit = function hasCustomSubmit(config) {
  var _config$submit, _config$submit2;
  var customSubmit = false;
  if ((_config$submit = config.submit) !== null && _config$submit !== void 0 && _config$submit.callback && typeof ((_config$submit2 = config.submit) === null || _config$submit2 === void 0 ? void 0 : _config$submit2.callback) === 'function') {
    customSubmit = true;
  }
  return customSubmit;
};

/**
 * Check the config to find out if the form has custom 
 * success functionality or not.
 * 
 * @param {object} config The config object, to check for custom success values against.
 * @return {bool} Whether the form has custom success functionality or not.
 */
var hasCustomSuccess = function hasCustomSuccess(config) {
  var customSuccess = false;

  // Is there a follow up URL supplied?
  if (config.followUpUrl !== null) {
    customSuccess = true;
  }

  // Is there a custom success callback?
  if (config.success.callback !== null && typeof config.success.callback !== 'undefined') {
    customSuccess = true;
  }

  // Is there a custom success message?
  if (config.success.message !== null && typeof config.success.message !== 'undefined') {
    customSuccess = true;
  }
  return customSuccess;
};

/**
 * Error logging if the script fails to load 
 * 
 * Sends an event to Google Analytics
 */
var handleError = function handleError() {
  if (typeof _honeycombAnalytics["default"].trackEvent !== 'function') return false;
  _honeycombAnalytics["default"].trackEvent('Marketo', 'Marketo forms javascript failed to load', window.location.path);
};

/*
 * Format checkboxes so that the label is alongside the input.
 * 
 * @param {HTMLElement} form The Marketo form being formatted.
 */
var formatCheckboxes = function formatCheckboxes(form) {
  var checkboxes = form.querySelectorAll('.mktoCheckboxList');
  if (checkboxes) {
    for (var i = 0; i < checkboxes.length; i++) {
      var checkbox = checkboxes[i];
      checkbox.parentElement.insertBefore(checkbox, checkbox.parentElement.firstChild);
    }
  }
};
var create = function create(c) {
  // Get the config for the form.
  var config = createConfig(c);

  // Load the Marketo form script, and once loaded, load the 
  // form, and apply any callbacks.
  // See API documentation at https://developers.marketo.com/javascript-api/forms/api-reference/ .
  _honeycombDocument["default"].load(config.formsJavaScriptUrl, function () {
    if (typeof window.MktoForms2 === 'undefined') return;

    // If there's no form ID, then don't go any further.
    if (config.formId === '') return;
    window.MktoForms2.loadForm(config.rootUrl, config.munchkinId, config.formId, function (marketoForm) {
      var marketoFormElement = marketoForm.getFormElem().get(0);
      removeDefaultStyles();
      formatCheckboxes(marketoFormElement);

      // Replicate default Google Analytics `form_submit` event.
      marketoForm.onSuccess(function () {
        _honeycombAnalytics["default"].trackEvent('form_submit', {
          form_id: marketoForm.getFormElem().get(0).getAttribute('id'),
          marketo_form_id: marketoForm.getId()
        });
      });
      if (typeof config.callback === 'function') {
        config.callback.call(_this, marketoForm);
      }
      if (hasCustomSubmit(config)) {
        marketoForm.onSubmit(function () {
          var _config$submit3;
          if (typeof ((_config$submit3 = config.submit) === null || _config$submit3 === void 0 ? void 0 : _config$submit3.callback) === 'function') {
            config.submit.callback.call(_this, marketoForm);
          }
        });
      }
      if (hasCustomSuccess(config)) {
        marketoForm.onSuccess(function (formValues, followUpUrl) {
          // Redirect to follow up URL if one set.
          if (config.followUpUrl) {
            window.location.assign(config.followUpUrl);
          }
          var $form = marketoForm.getFormElem(); // $form is a jQuery object.

          // If there's a callback, and it's a function, then call it, passing 
          // in the form values so that they can be used client side if needed.
          if (typeof config.success.callback === 'function') {
            config.success.callback.call(_this, marketoForm, formValues, followUpUrl);
          }

          // If there's a custom message, then replace the form wit this message.
          if (config.success.message !== null) {
            $form.html(config.success.message);
          }

          // Add a class to describe the form has been successfully submitted.
          $form.addClass('mktoFormSubmitted mktoFormSubmitted--successful');

          // Return false to stop the form from reloading the page.
          return false;
        });
      }
      if (config.customValidation) {
        marketoForm.onValidate(function (successful) {
          if (!successful) {
            marketoForm.submittable(false);
          } else {
            // Do some custom validation.

            // Get the fields and their values from the form.
            var fields = marketoForm.vals();

            // Custom object for storing info about the fail.
            var fail = {
              isFail: false,
              message: '',
              element: null
            };

            // Email validation.
            if (typeof fields.Email !== 'undefined') {
              // Email regex provided by https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/using_regular_expressions_to_validate_email_addresses.htm.
              // Check that the format is acceptable to Salesforce (only valid salesforce characters, single @, at least one . character in domain).
              var emailRegex = RegExp('^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$');
              if (emailRegex.test(fields.Email.toLowerCase()) === false) {
                fail.isFail = true;
                fail.message = 'Please enter a valid email address.';
                fail.element = marketoForm.getFormElem().find('input[name="Email"]');
              }
            }

            // If form validation fails.
            if (fail.isFail) {
              // Stop the form from being submittable.
              marketoForm.submittable(false);

              // Show an error message against the invalid field.
              marketoForm.showErrorMessage(fail.message, fail.element);

              //Scroll to the highest erroring field.
              var invalidSection = fail.element.get(0).previousSibling;
              invalidSection.scrollIntoView({
                block: 'center'
              });

              // Display the field as invalid using the Marketo class.
              fail.element.get(0).classList.add('mktoInvalid');
            } else {
              // All is good, continue as normal.
              marketoForm.submittable(true);
            }
          }
        });
      }
    });
  }, {}, handleError);
};
var init = function init(callback) {
  if (typeof callback === 'function') {
    callback.call(_this);
  }
};
var _default = exports["default"] = {
  create: create,
  init: init
};

},{"../../analytics/js/honeycomb.analytics.google":1,"../../document/js/honeycomb.document.load-script":16}],23:[function(require,module,exports){
"use strict";

var _honeycombAnalytics = _interopRequireDefault(require("./analytics/js/honeycomb.analytics.google"));
var _honeycombAnalytics2 = _interopRequireDefault(require("./analytics/js/honeycomb.analytics.pingdom"));
var _honeycombAnimation = _interopRequireDefault(require("./animation/js/honeycomb.animation.fade"));
var _honeycomb = require("./base/js/honeycomb.base");
var _honeycomb2 = _interopRequireDefault(require("./browser/js/honeycomb.browser"));
var _honeycomb3 = _interopRequireDefault(require("./carousel/js/honeycomb.carousel"));
var _honeycomb4 = _interopRequireDefault(require("./chart/js/honeycomb.chart"));
var _honeycombChat = _interopRequireDefault(require("./chat/js/honeycomb.chat.intercom"));
var _honeycomb5 = _interopRequireDefault(require("./code/js/honeycomb.code"));
var _honeycomb6 = _interopRequireDefault(require("./content/js/honeycomb.content"));
var _honeycomb7 = _interopRequireDefault(require("./context-menu/js/honeycomb.context-menu"));
var _honeycombDocument = _interopRequireDefault(require("./document/js/honeycomb.document.viewport"));
var _honeycomb8 = _interopRequireDefault(require("./equalise/js/honeycomb.equalise"));
var _honeycomb9 = _interopRequireDefault(require("./filter/js/honeycomb.filter"));
var _honeycomb10 = _interopRequireDefault(require("./forms/js/honeycomb.forms"));
var _honeycombForms = _interopRequireDefault(require("./forms/js/honeycomb.forms.marketo"));
var _honeycomb11 = _interopRequireDefault(require("./lightbox/js/honeycomb.lightbox"));
var _honeycombMaps = _interopRequireDefault(require("./maps/js/honeycomb.maps.google"));
var _honeycombNavigation = _interopRequireDefault(require("./navigation/js/honeycomb.navigation.dropdown"));
var _honeycombNavigation2 = _interopRequireDefault(require("./navigation/js/honeycomb.navigation.header"));
var _honeycombNavigation3 = _interopRequireDefault(require("./navigation/js/honeycomb.navigation.vertical"));
var _honeycombNotification = _interopRequireDefault(require("./notification/js/honeycomb.notification.block"));
var _honeycombPolyfill = _interopRequireDefault(require("./polyfill/js/honeycomb.polyfill.index-of"));
var _honeycombPolyfill2 = _interopRequireDefault(require("./polyfill/js/honeycomb.polyfill.custom-event"));
var _honeycomb12 = _interopRequireDefault(require("./reveal/js/honeycomb.reveal"));
var _honeycomb13 = _interopRequireDefault(require("./scroll/js/honeycomb.scroll"));
var _honeycomb14 = _interopRequireDefault(require("./sticky/js/honeycomb.sticky"));
var _honeycomb15 = _interopRequireDefault(require("./svg/js/honeycomb.svg"));
var _honeycomb16 = _interopRequireDefault(require("./tabs/js/honeycomb.tabs"));
var _honeycomb17 = _interopRequireDefault(require("./toggle/js/honeycomb.toggle"));
var _honeycomb18 = _interopRequireDefault(require("./video/js/honeycomb.video"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
/* import-sort-ignore */

// Google analytics.

_honeycombAnalytics["default"].setAccountId('G-XXX');
_honeycombAnalytics["default"].init();

// Pingdom.

_honeycombAnalytics2["default"].init();

// Animation.

_honeycombAnimation["default"].init();

// Base.

window.breakpoints = _honeycomb.breakpoints;

// Browser.

_honeycomb2["default"].init();

// Carousel.

window.addEventListener('load', function () {
  _honeycomb3["default"].init();
});

// Chart.

_honeycomb4["default"].init();

// Chat.

_honeycombChat["default"].init();
window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.Chat = window.Honeycomb.Chat || {};
window.Honeycomb.Chat.Intercom = _honeycombChat["default"];

// Code

_honeycomb5["default"].init();

// Content.

window.addEventListener('load', function () {
  _honeycomb6["default"].init();
});

// Context menu

_honeycomb7["default"].init();

// Document.

_honeycombDocument["default"].init();

// Equalise.

_honeycomb8["default"].init();

// Filter.

_honeycomb9["default"].init();

// Forms.

_honeycomb10["default"].init();

// Marketo forms.

_honeycombForms["default"].init();
window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.Marketo = _honeycombForms["default"];

// Lightbox.

_honeycomb11["default"].init();

// Google map.

window.initMap = _honeycombMaps["default"].initialiseMap;
_honeycombMaps["default"].init({
  callback: 'window.initMap'
});

// Navigation

_honeycombNavigation["default"].init();
_honeycombNavigation2["default"].init();
_honeycombNavigation3["default"].init();

// Notification

_honeycombNotification["default"].init();
window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.notifications = _honeycombNotification["default"];

// Polyfills.

(0, _honeycombPolyfill["default"])();
(0, _honeycombPolyfill2["default"])();

// Reveal.

_honeycomb12["default"].init();

// Scroll.

_honeycomb13["default"].init();

// Sticky.

_honeycomb14["default"].init();

// SVG.

_honeycomb15["default"].init();

// Tabs.

_honeycomb16["default"].init({
  equalise: _honeycomb8["default"].init,
  googleMap: _honeycombMaps["default"].init
});

// Toggle.

_honeycomb17["default"].init();

// Video.

_honeycomb18["default"].init({
  analytics: _honeycombAnalytics["default"]
});

},{"./analytics/js/honeycomb.analytics.google":1,"./analytics/js/honeycomb.analytics.pingdom":2,"./animation/js/honeycomb.animation.fade":3,"./base/js/honeycomb.base":4,"./browser/js/honeycomb.browser":5,"./carousel/js/honeycomb.carousel":6,"./chart/js/honeycomb.chart":7,"./chat/js/honeycomb.chat.intercom":8,"./code/js/honeycomb.code":9,"./content/js/honeycomb.content":10,"./context-menu/js/honeycomb.context-menu":11,"./document/js/honeycomb.document.viewport":18,"./equalise/js/honeycomb.equalise":19,"./filter/js/honeycomb.filter":20,"./forms/js/honeycomb.forms":21,"./forms/js/honeycomb.forms.marketo":22,"./lightbox/js/honeycomb.lightbox":24,"./maps/js/honeycomb.maps.google":25,"./navigation/js/honeycomb.navigation.dropdown":26,"./navigation/js/honeycomb.navigation.header":27,"./navigation/js/honeycomb.navigation.vertical":28,"./notification/js/honeycomb.notification.block":29,"./polyfill/js/honeycomb.polyfill.custom-event":31,"./polyfill/js/honeycomb.polyfill.index-of":32,"./reveal/js/honeycomb.reveal":33,"./scroll/js/honeycomb.scroll":34,"./sticky/js/honeycomb.sticky":35,"./svg/js/honeycomb.svg":36,"./tabs/js/honeycomb.tabs":37,"./toggle/js/honeycomb.toggle":38,"./video/js/honeycomb.video":39}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
var _this = void 0;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var init = function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  window.addEventListener('load', initLightbox.bind(_this, config));
};
var initLightbox = function initLightbox() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var els = document.querySelectorAll('.js-lightbox, .js-lightbox--video, .js-lightbox--iframe, .js-lightbox--image, .js-lightbox--inline, .js-lightbox--ajax, .js-lightbox--swf, .js-lightbox--html');
  if (els.length) {
    if (typeof window.jQuery.fancybox === 'undefined') {
      if (typeof config.url === 'undefined') {
        config.url = 'lightbox/vendor/jquery.fancybox.min.js';
      }
      _honeycombDocument["default"].load(config.url, function () {
        initLightbox();
      });
    } else {
      // Use BEM style modifiers to set type of content for lightbox.
      window.jQuery('.js-lightbox').fancybox();
      window.jQuery('.js-lightbox--video, .js-lightbox--iframe').fancybox({
        type: 'iframe'
      });
      window.jQuery('.js-lightbox--image').fancybox({
        type: 'image'
      });
      window.jQuery('.js-lightbox--inline').fancybox({
        type: 'inline'
      });
      window.jQuery('.js-lightbox--ajax').fancybox({
        type: 'ajax'
      });
      window.jQuery('.js-lightbox--swf').fancybox({
        type: 'swf'
      });
      window.jQuery('.js-lightbox--html').fancybox({
        type: 'html'
      });
    }
  }
};
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var $maps;
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
    se.src = "//maps.googleapis.com/maps/api/js?libraries=places&callback=".concat(options.callback);
    s.parentNode.insertBefore(se, s);
  }
};
var initialiseMap = function initialiseMap() {
  $maps.each(function () {
    var $this = window.jQuery(this);
    var config = getConfig($this);
    var map;
    if (!config.streetView) {
      // Normal map type.
      map = new window.google.maps.Map(this, {
        center: new window.google.maps.LatLng(config.lat, config["long"]),
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
        position: new window.google.maps.LatLng(config.lat, config["long"]),
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
  config["long"] = $map.attr('data-google-map-long') || 0;
  config.zoom = parseInt($map.attr('data-google-map-zoom'), 10) || 10;
  config.mapTypeId = window.google.maps.MapTypeId.ROADMAP;
  config.disableDefaultUI = $map.attr('data-google-map-disable-ui') === 'true' ? true : false;
  config.scrollwheel = $map.attr('data-google-map-scrollwheel') === 'false' ? false : true;
  config.draggable = $map.attr('data-google-map-draggable') === 'false' ? false : true;
  config.place = $map.attr('data-google-map-place') || false;
  config.streetView = $map.attr('data-google-map-street-view') || false;
  return config;
};
var _default = exports["default"] = {
  init: init,
  initialiseMap: initialiseMap
};

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var selector = '.js-dropdown';
var classNameOpen = 'open';
var classNameClosed = 'closed';
var classNameNoArrow = 'dropdown--no-arrow';
var attributeArrowAdded = 'data-arrow-added';
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
    if ($this.hasClass(classNameNoArrow)) return;
    if ($this.find('ul').length > 0 && $this.attr(attributeArrowAdded) !== 'true') {
      var $a = window.jQuery("<a>".concat(getArrowSvg(), "</a>")).attr('href', '#toggle').attr('tabindex', '-1') // Remove the dropdown arrow from the tab index, as it just duplicates the original anchor
      .addClass('arrow');
      $this.addClass("dropdown ".concat(classNameClosed));
      $this.attr(attributeArrowAdded, 'true');
      $a.appendTo($this);
    }
  });
};

/**
 * Get the string of SVG to use for the arrow.
 * 
 * @returns {String} The string of SVG to use for the arrow
 */
var getArrowSvg = function getArrowSvg() {
  return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 8.79l1-1c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l4.6 4.6 4.6-4.6c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l1 1c0.088 0.090 0.143 0.214 0.143 0.35s-0.055 0.26-0.143 0.35l-7 7-7-7c-0.095-0.091-0.153-0.219-0.153-0.36 0-0.131 0.051-0.251 0.134-0.34l-0 0z"></path></svg>';
};

// check if a specified dropdown is a parent of an event target
var dropdownIsActive = function dropdownIsActive(dropdown, target) {
  var parentDropdowns = [];
  var parent = target.parentElement;

  // list all dropdowns found in the event target's ancestors
  while (parent !== null) {
    if (parent.classList.contains('dropdown')) {
      parentDropdowns.push(parent);
    }
    parent = parent.parentElement;
  }

  // return true if the specified dropdown is an event target ancestor
  for (var i = 0; i < parentDropdowns.length; i++) {
    var parentDropdown = parentDropdowns[i];
    if (dropdown === parentDropdown) {
      return true;
    }
  }
  return false;
};
var handle = function handle() {
  var links = document.querySelectorAll("li[".concat(attributeArrowAdded, "] > a"));
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var dropdown = e.target.closest('.dropdown');
      if (!dropdown) return;
      if (dropdown.classList.contains(classNameOpen)) {
        dropdown.classList.remove(classNameOpen);
        dropdown.classList.add(classNameClosed);
      } else {
        dropdown.classList.add(classNameOpen);
        dropdown.classList.remove(classNameClosed);
      }
    });
  });

  // close all open dropdowns when clicking elsewhere in the document
  document.querySelector('body').addEventListener('click', function (event) {
    // Only proceed if there are any open dropdowns
    if (document.querySelector(".dropdown.".concat(classNameOpen))) {
      var dropdowns = document.querySelectorAll('.dropdown');
      var target = event.target;

      // loop through all dropdowns
      for (var i = 0; i < dropdowns.length; i++) {
        var dropdown = dropdowns[i];
        var dropdownIsOpen = dropdown.classList.contains(classNameOpen);

        // close open, inactive dropdowns
        if (!dropdownIsActive(dropdown, target) && dropdownIsOpen) {
          dropdown.classList.remove(classNameOpen);
          dropdown.classList.add(classNameClosed);
        }
      }
    }
  });
};
var _default = exports["default"] = {
  init: init,
  addArrows: addArrows
};

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
    $header.addClass('header--primary--has-inner-container');
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
      var $toggle = window.jQuery(this).siblings('a[href="#toggle"]');
      if ($toggle) {
        e.preventDefault();
        $toggle.trigger('click');
      }
    }
  });
};
var _default = exports["default"] = {
  init: init
};

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var collapseClass = 'nav--vertical__collapse';
var collapsedClass = 'nav--vertical--collapsed';
var activeClass = 'nav--vertical__active';
var parentActiveClass = 'nav--vertical__active-parent';
var toggleClass = 'nav--vertical__toggle';
var init = function init() {
  var navs = document.querySelectorAll('.nav--vertical');
  var _loop = function _loop() {
    var nav = navs[i];
    var as = nav.querySelectorAll('a');
    var _loop2 = function _loop2() {
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
      _loop2();
    }
  };
  for (var i = 0; i < navs.length; i++) {
    _loop();
  }
};
var toggle = function toggle(e, a) {
  e.preventDefault();
  var parent = a.parentElement;
  if (parent.className.match(activeClass) !== null) {
    parent.className = parent.className.replace(parentActiveClass, '').replace(activeClass, '');
  } else {
    parent.className = parent.className + " ".concat(parentActiveClass);
  }
};
var update = function update(e, nav, a) {
  e.preventDefault();

  // Remove all active classes.
  var items = nav.querySelectorAll(".".concat(activeClass));
  for (var i = 0; i < items.length; i++) {
    var re = new RegExp(activeClass, 'g');
    items[i].className = items[i].className.replace(re, '');
  }

  // Add active class to parent.
  a.parentElement.className = a.parentElement.className + " ".concat(activeClass);

  // Add parent active class to parent list items.
  var el = a.parentElement.parentElement;
  while (el.className.match('nav--vertical') === null) {
    if (el.nodeName === 'LI') {
      el.className = el.className + " ".concat(parentActiveClass);
    }
    el = el.parentElement;
  }
};
var collapse = function collapse(e, nav) {
  e.preventDefault();
  if (nav.className.match(collapsedClass) === null) {
    nav.className = nav.className + " ".concat(collapsedClass);
  } else {
    nav.className = nav.className.replace(collapsedClass, '');
  }
};
var _default = exports["default"] = {
  init: init
};

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
      type: false,
      // Could be either 'font' or 'image'.
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
var _default = exports["default"] = {
  init: init,
  block: notification,
  buildNotification: buildNotification
};

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDeprecatedFunctionToConsole = void 0;
var logDeprecatedFunctionToConsole = exports.logDeprecatedFunctionToConsole = function logDeprecatedFunctionToConsole() {
  var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var module = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '14.2.0';
  var warning = "\"".concat(func, "\" has been deprecated ");
  if (module !== '') {
    warning += "from the \"".concat(module, "\" module ");
  }
  warning += "in Honeycomb web toolkit v".concat(version, " and will be removed in a later version.");
  window.console.warn(warning);
};

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// polyfill for window.CustomEvent
// from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

// this gets used by honeycomb.tabs and honeycomb.reveal
// honeycomb.reveal fires a CustomEvent which honeycomb.tabs listens for, so that honeycomb.tabs can unset/reset its fixed heights

var CustomEvent = function CustomEvent() {
  if (typeof window.CustomEvent !== 'function') {
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = function (event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
  }
};
var _default = exports["default"] = CustomEvent;

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = exports["default"] = indexOf;

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _this = void 0;
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
        var $groupButtons = window.jQuery('.js-reveal-cta[data-reveal-group="' + group + '"]');
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
    var $buttons = window.jQuery('.js-reveal-cta[href="' + hash + '"]');
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
          callback.call(_this);
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
    var $buttons = window.jQuery('.js-reveal-cta[href="' + hash + '"]');
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
          callback.call(_this);
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
var _default = exports["default"] = {
  init: init,
  toggle: toggle,
  open: open,
  close: close
};

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// scrollTo - Scroll to an area on the page.
var init = function init() {
  scrollOnClick();
  scrollBeforeSticky();
};

/**
 * Default to an animation interval of 500ms.
 * 
 * If the user has prefers-reduced-motion enabled,
 * we return 0 so the scrolling is not animated. 
 */
var getAnimationTiming = function getAnimationTiming() {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion || reducedMotion.matches) {
    return 0;
  } else {
    return 500;
  }
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
      var _window$jQuery;
      e.preventDefault();
      var hashTop = (_window$jQuery = window.jQuery(hash)) === null || _window$jQuery === void 0 || (_window$jQuery = _window$jQuery.offset()) === null || _window$jQuery === void 0 ? void 0 : _window$jQuery.top;
      if (typeof hashTop === 'undefined') {
        window.console.warn("Honeycomb: Element with ID \"".concat(hash, "\" not found, so can't scroll to it."));
        return;
      }
      var timing = getAnimationTiming();
      window.jQuery('html, body').animate({
        scrollTop: window.jQuery(hash).offset().top + offset
      }, timing, function () {
        window.location.hash = hash;
        if (focus) {
          window.jQuery("#".concat(focus)).focus();
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

        // It's possible for offset to be undefined, so check it exists
        var offset = elementToScrollTo.offset();
        if (offset) {
          window.jQuery('html, body').animate({
            scrollTop: offset.top - heightToReverse
          }, 500);
        }
      }
    }, 1000);
  });
};
var _default = exports["default"] = {
  init: init
};

},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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
      _honeycombDocument["default"].load(config.url, function () {
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
var _default = exports["default"] = {
  init: init
};

},{"../../document/js/honeycomb.document.load-script":16}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var init = function init() {
  var imgs = document.querySelectorAll('img.js-svg');
  var _loop = function _loop() {
    var img = imgs[i];
    var src = img.getAttribute('src').replace(/(.png)|(.gif)/, '.svg');
    var newImage = new Image();
    newImage.src = src;
    newImage.onload = function () {
      img.setAttribute('src', src);
    };
  };
  for (var i = 0; i < imgs.length; i++) {
    _loop();
  }
};
var _default = exports["default"] = {
  init: init
};

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _honeycomb = _interopRequireDefault(require("../../browser/js/honeycomb.browser"));
var _honeycombDocument = _interopRequireDefault(require("../../document/js/honeycomb.document.load-script"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var init = function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // If IE7, bail!
  if (_honeycomb["default"].isIE7()) {
    return false;
  }
  var tabbed = document.querySelectorAll('.js-tabbed');
  if (tabbed.length) {
    if (typeof window.jQuery.fn.tabs === 'undefined') {
      if (typeof config.url === 'undefined') {
        config.url = 'tabs/vendor/jquery.tabs.min.js';
      }
      _honeycombDocument["default"].load(config.url, function () {
        init(config);
      });
    } else {
      var _iterator = _createForOfIteratorHelper(tabbed),
        _step;
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
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }
};
var _default = exports["default"] = {
  init: init
};

},{"../../browser/js/honeycomb.browser":5,"../../document/js/honeycomb.document.load-script":16}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var hook = '.js-toggle';
var activeClass = 'active';
var init = function init() {
  var toggles = document.querySelectorAll(hook);
  if (toggles.length > 0) {
    var _iterator = _createForOfIteratorHelper(toggles),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var tog = _step.value;
        // Hide the toggle items.
        var items = tog.querySelectorAll("".concat(hook, "-item"));
        for (var i = 0; i < items.length; i++) {
          items[i].style.display = 'none';
        }

        // Show the first item.
        items[0].style.display = 'block';

        // Add active state to the first nav item.
        var as = tog.querySelectorAll("".concat(hook, "-nav a"));
        var _iterator2 = _createForOfIteratorHelper(as),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var a = _step2.value;
            a.classList.remove(activeClass);

            // Add toggle handler.
            a.addEventListener('click', function (e) {
              e.preventDefault();
              toggle(e.target.getAttribute('href'));
            });
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        as[0].classList.add(activeClass);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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
  var items = toggle.querySelectorAll("".concat(hook, "-item"));
  var _iterator3 = _createForOfIteratorHelper(items),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      item.style.display = 'none';
    }

    // Show the selected item.
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  toggleItem.style.display = 'block';

  // Update the active state.
  var links = toggle.querySelectorAll("".concat(hook, "-nav a"));
  var _iterator4 = _createForOfIteratorHelper(links),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var link = _step4.value;
      link.classList.remove(activeClass);
      if (link.getAttribute('href') === "#".concat(target)) {
        link.classList.add(activeClass);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
};
var _default = exports["default"] = {
  init: init
};

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
// Default options for video playback.
var options = {
  autohide: 1,
  autoplay: 0,
  controls: 0,
  showinfo: 0,
  loop: 0
};
var videos = {};
var analytics;
var init = function init() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  analytics = options.analytics || false;
  loadPlayerAPIs();
  addInlineVideos();
};

// Load the Youtube and Vimeo player APIs as required
var loadPlayerAPIs = function loadPlayerAPIs() {
  var videoContainers = document.querySelectorAll('.js-video-container');
  for (var i = 0; i < videoContainers.length; i++) {
    var videoContainer = videoContainers[i];
    var videoId = videoContainer.getAttribute('data-video-id');
    if (videoId) {
      // If video is already loaded, skip.
      // We look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.
      if (videoContainer.querySelector("iframe[id^=\"".concat(videoId, "\"], video"))) {
        continue;
      }
      if (isVimeoId(videoId)) {
        // Load Vimeo player API
        loadScript('https://player.vimeo.com/api/player.js');
      } else {
        // Load Youtube player API
        loadScript('https://www.youtube.com/iframe_api');
      }
    }
  }
};

// Error handler for loading scripts 
// Useful if e.g. youtube is blocked 
// Written as a longhand function instead of an arrow function to preserve the this keyword.
var loadScriptHandleError = function loadScriptHandleError() {
  window.console.error("".concat(this.src, " failed to load"));
  if (this.src.match('youtube')) {
    var videoContainers = document.querySelectorAll('.js-video-container');
    var _iterator = _createForOfIteratorHelper(videoContainers),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var videoContainer = _step.value;
        videoContainer.innerHTML = "\n                <div class=\"notification notification--block notification--fail spaced\">\n                    <div class=\"notification--block__inner-container\">\n                        <figure class=\"notification__icon\">\n                            <span class=\"icon icon--fail\"></span>\n                        </figure>\n                        <div class=\"notification__body\">\n                            <p class=\"gamma\">We could not reach youtube.com</p>\n                            <p>youtube.com may currently be down, or may be blocked by your network.</p>\n                        </div>\n                    </div>\n                </div>\n            ";
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

// Load a script, if it has not already been added to the DOM
var loadScript = function loadScript(src) {
  if (document.querySelector("script[src=\"".concat(src, "\"]"))) {
    return;
  }
  var tag = document.createElement('script');
  var firstScriptTag = document.getElementsByTagName('script')[0];
  tag.src = src;
  tag.onload = addInlineVideos;
  tag.onerror = loadScriptHandleError;
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

// If the video ID is only numbers, treat it as a Vimeo ID
var isVimeoId = function isVimeoId(id) {
  if (typeof id !== 'string') {
    return false;
  }
  return !!id.match(/^[0-9]*$/);
};
var isLocalVideoId = function isLocalVideoId(id) {
  var extensions = ['mp4', 'webm'];
  var isLocalVideo = false;
  extensions.forEach(function (ext) {
    if (id.match(".".concat(ext)) !== null) {
      isLocalVideo = true;
    }
  });
  return isLocalVideo;
};

// calculate second values for 10%, 20% etc. for event tracking
var calculatePercentages = function calculatePercentages(duration) {
  var percentage;
  var percentages = {};
  for (var i = 1; i < 10; i++) {
    percentage = i * 10 + '%';
    percentages[percentage] = duration * (i / 10);
  }
  return percentages;
};
var trackVideoEvent = function trackVideoEvent(videoId) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (analytics) {
    params.video = "".concat(videoId, " - ").concat(document.location.pathname);
    analytics.trackEvent(event, params);
  }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
var trackGoal = function trackGoal(videoId) {
  trackVideoEvent(videoId, 'video_goal');
  return true;
};

// Track events when we have passed our set duration markers
var trackVideoEventsSoFar = function trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId) {
  // check goal conditions
  if (!goalTracked) {
    if (currentTime > percentages['20%'] && percentages['20%'] > 30) {
      goalTracked = trackGoal(videoId);
    } else if (currentTime > 30 && percentages['20%'] < 30) {
      goalTracked = trackGoal(videoId);
    }
  }
  return [goalTracked, percentages];
};

// Handler for Unstarted event
var handleUnstartedEvent = function handleUnstartedEvent(videoId, duration) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('unstarted', videoId, duration);
  }
};

// Handler for Play event
// Track an event when a video starts playing
var handlePlayEvent = function handlePlayEvent(videoId, duration) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('play', videoId, duration);
  }
};

// Handler for Pause event
var handlePauseEvent = function handlePauseEvent(videoId, duration, currentTime, goalTracked, percentages) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('pause', videoId, duration);
  }
  return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};

// Handler for Stop event
var handleStopEvent = function handleStopEvent(videoId, duration, currentTime, goalTracked, percentages) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('ended', videoId, duration);
  }
  return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};

// add event listeners to the Vimeo player
var attachVimeoPlayerEventListeners = function attachVimeoPlayerEventListeners(player, videoId, goalTracked) {
  var pauseEventsAttached = false;
  player.on('loaded', function (data) {
    handleUnstartedEvent(videoId, data.duration);
  });
  player.on('play', function (data) {
    var percentages = calculatePercentages(data.duration);
    if (!pauseEventsAttached) {
      player.on('pause', function (data) {
        handlePauseEvent(videoId, data.duration, data.seconds, goalTracked, percentages);
      });
      player.on('ended', function (data) {
        handleStopEvent(videoId, data.duration, data.seconds, goalTracked, percentages);
      });
      pauseEventsAttached = true;
    }
    handlePlayEvent(videoId, data.duration);
  });
};
var addHtmlVideoPlayer = function addHtmlVideoPlayer(src, options, element) {
  console.log('Add HTML video player', {
    src: src,
    options: options,
    element: element
  });

  // Clear the contents of the target element.
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  var videoPlayer = document.createElement('video');
  videoPlayer.setAttribute('src', src);

  // Autoplay.
  if (options.autoplay) {
    videoPlayer.muted = true;
    // videoPlayer.playsInline = true;
    videoPlayer.autoplay = true;
  }

  // Controls.
  if (options.controls) {
    videoPlayer.controls = true;
  }

  // Loop.
  if (options.loop) {
    videoPlayer.loop = true;
  }
  element.appendChild(videoPlayer);
};

// Search the document for video containers, 
// and load any video players that need loading. 
var addInlineVideos = function addInlineVideos() {
  var videoCounter = 0;
  var videoContainers = document.querySelectorAll('.js-video-container');
  var _iterator2 = _createForOfIteratorHelper(videoContainers),
    _step2;
  try {
    var _loop = function _loop() {
      var videoContainer = _step2.value;
      var videoId = videoContainer.getAttribute('data-video-id');

      // If video is already loaded, skip.
      // NB we look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.
      if (videoContainer.querySelector("iframe[id^=\"".concat(videoId, "\"]"))) {
        return 1; // continue
      }
      var duration;
      var currentTime;
      var percentages;
      var goalTracked = false;
      if (videoId) {
        // Append empty div which will get replaced by video.
        var videoDiv = document.createElement('div');
        videoDiv.setAttribute('id', "".concat(videoId, "-").concat(videoCounter));
        videoContainer.innerHTML = '';
        videoContainer.appendChild(videoDiv);

        // Get the options (data attributes)
        var _options = getOptions(videoContainer);
        var playerSettings;
        if (isVimeoId(videoId)) {
          // Vimeo player settings
          playerSettings = {
            id: videoId,
            width: 640,
            autoplay: _options.autoplay,
            loop: _options.loop || false
          };
        } else {
          // YouTube player settings
          playerSettings = {
            width: 640,
            height: 360,
            videoId: videoId,
            playerVars: {
              rel: 0,
              autohide: _options.autohide,
              autoplay: _options.autoplay,
              mute: _options.mute,
              controls: _options.controls,
              showinfo: _options.showinfo,
              loop: _options.loop,
              enablejsapi: 1
            },
            events: {
              onStateChange: function onStateChange(event) {
                // Reset the video ID, current time and duration
                videoId = event.target.getVideoData().video_id;
                currentTime = event.target.getCurrentTime();
                duration = duration || event.target.getDuration();

                // Unstarted event
                if (event.data === window.YT.PlayerState.UNSTARTED) {
                  handleUnstartedEvent(videoId, duration);
                }

                // Play events
                if (event.data === window.YT.PlayerState.PLAYING) {
                  percentages = percentages || calculatePercentages(duration);
                  handlePlayEvent(videoId, duration);
                }

                // Pause events
                if (event.data === window.YT.PlayerState.PAUSED) {
                  var _handlePauseEvent = handlePauseEvent(videoId, duration, currentTime, goalTracked, percentages);
                  var _handlePauseEvent2 = _slicedToArray(_handlePauseEvent, 2);
                  goalTracked = _handlePauseEvent2[0];
                  percentages = _handlePauseEvent2[1];
                }

                // End events
                if (event.data === window.YT.PlayerState.ENDED) {
                  var _handleStopEvent = handleStopEvent(videoId, duration, currentTime, goalTracked, percentages);
                  var _handleStopEvent2 = _slicedToArray(_handleStopEvent, 2);
                  goalTracked = _handleStopEvent2[0];
                  percentages = _handleStopEvent2[1];
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
        }

        // Replace the empty div with the video player iframe.
        if (isVimeoId(videoId)) {
          // load vimeo player
          if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
            // create player
            var player = new window.Vimeo.Player("".concat(videoId, "-").concat(videoCounter), playerSettings);
            videos["".concat(videoId, "-").concat(videoCounter)] = player;
            videoContainer.setAttribute('data-video-loaded', 'true');

            // add event listeners 
            attachVimeoPlayerEventListeners(player, videoId, goalTracked);
          }
        } else if (isLocalVideoId(videoId)) {
          videoContainer.classList.add('video-container--html-player');
          addHtmlVideoPlayer(videoId, _options, videoDiv.parentElement);
        } else {
          // load youtube player
          if (window.YT && typeof window.YT.Player === 'function') {
            videos["".concat(videoId, "-").concat(videoCounter)] = new window.YT.Player("".concat(videoId, "-").concat(videoCounter), playerSettings);
            videoContainer.setAttribute('data-video-loaded', 'true');
          }
        }
      }

      // Increase the counter.
      videoCounter++;
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      if (_loop()) continue;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};
var getOptions = function getOptions(video) {
  // Copy the defaults.
  var optionsCopy = Object.assign({}, options);

  // Autohide.
  if (video.hasAttribute('data-video-auto-hide')) {
    optionsCopy.autohide = video.getAttribute('data-video-auto-hide');
  }

  // Autoplay.
  if (video.hasAttribute('data-video-auto-play')) {
    optionsCopy.autoplay = video.getAttribute('data-video-auto-play') === 'true' ? 1 : 0;
    optionsCopy.mute = 1; // Autoplaying an embedded player requires it to be muted
  }

  // Controls.
  if (video.hasAttribute('data-video-controls')) {
    optionsCopy.controls = video.getAttribute('data-video-controls') === 'true' ? 1 : 0;
  }

  // Show info.
  if (video.hasAttribute('data-video-show-info')) {
    optionsCopy.showinfo = video.getAttribute('data-video-show-info');
  }

  // Loop.
  if (video.hasAttribute('data-video-loop')) {
    optionsCopy.loop = video.getAttribute('data-video-loop') === 'true' ? 1 : 0;
  }

  // Return the options object.
  return optionsCopy;
};

// Add the video when the YouTube iframe API library has loaded.
window.onYouTubeIframeAPIReady = function () {
  addInlineVideos();
};
var _default = exports["default"] = {
  init: init,
  options: options,
  addInlineVideos: addInlineVideos,
  videos: videos
};

},{}]},{},[23]);
