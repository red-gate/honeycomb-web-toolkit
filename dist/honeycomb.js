(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var accountId;
var sites;
var optimizeContainerId;
var crossDomainAccountId;
var crossDomain = false;
var crossDomainTrackerName = 'crossDomain';

var init = function init() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false; // If the account ID is not set, then don't carry on.

  if (!accountId || accountId === 'UA-XXX') {
    window.console.warn('Honeycomb: Google Analytics account ID is not set, therefore the Google Analytics script will not be loaded.');
    return false;
  } // Add the tracking script.


  addScript(); // Init the analytics accounts.

  initAccount(accountId, crossDomainAccountId); // Track a page view.

  if (s.trackPageView !== false) {
    trackPageView();
  } // Set up tracking alias helper.


  setupTrackingAlias(); // Track YouTube video views.

  trackYouTubeViews();
};

var setAccountId = function setAccountId(accId) {
  accountId = accId;
};

var setCrossDomainAccountId = function setCrossDomainAccountId(accId) {
  crossDomain = true;
  crossDomainAccountId = accId;
};

var setSites = function setSites(s) {
  sites = s;
};

var setOptimizeId = function setOptimizeId(id) {
  optimizeContainerId = id;
}; // Add the Google Analytics script to the page.
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
}; // Initialise the account, with the account ID.


var initAccount = function initAccount(accountId, crossDomainAccountId) {
  if (!accountId || accountId === 'UA-XXX') {
    return false;
  }

  if (typeof window.ga === 'undefined') return false; // Create the tracker for the individual property.
  // allowLinker defaults to 'false'

  window.ga('create', accountId, 'auto'); // Create the cross-domain tracker, and set it to allow cross-domain linker parameters.
  // Also enable the auto-linker and pass in a list of sites.
  // Our implementation of multiple trackers follows this guide: https://www.simoahava.com/gtm-tips/cross-domain-tracking-with-multiple-ga-trackers/

  if (crossDomainAccountId && sites) {
    window.ga('create', crossDomainAccountId, {
      name: crossDomainTrackerName,
      cookieName: '_crossDomainGa',
      'allowLinker': true
    });
    window.ga("".concat(crossDomainTrackerName, ".require"), 'linker');
    window.ga("".concat(crossDomainTrackerName, ".linker:autoLink"), sites);
  }

  if (optimizeContainerId) {
    window.ga('require', optimizeContainerId);
  } // Anonymise IP addresses by default.


  window.ga('set', 'anonymizeIp', true);
}; // Track a page view on all trackers.


var trackPageView = function trackPageView() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var options = url ? {
    page: url
  } : {};
  if (typeof window.ga === 'undefined') return false; // Track pageview for the default tracker

  window.ga('send', 'pageview', options); // Track pageview for the crossdomain tracker, if set

  if (crossDomain) {
    window.ga("".concat(crossDomainTrackerName, ".send"), 'pageview', options);
  }
}; // Track an event on the default tracker


var trackEvent = function trackEvent() {
  var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (typeof window.ga === 'undefined') return false;
  window.ga('send', 'event', category, action, label, value);
}; // Set a custom variable on the default tracker


var setCustomVariable = function setCustomVariable(index, name, value) {
  if (typeof window.ga === 'undefined') return false;
  var options = {};
  options['dimension' + index] = value;
  window.ga('send', 'pageview', options);
}; // Track youtube video views.


var trackYouTubeViews = function trackYouTubeViews() {
  var els = document.querySelectorAll('.lightbox--video');

  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', function (e) {
      var videoId = e.target.href.replace(/http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '');
      trackEvent('Video', window.location.pathname, videoId);
    });
  }
}; // Click track (helper for instead of onclick="ga(send...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).


var setupTrackingAlias = function setupTrackingAlias() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var els = element.querySelectorAll('[data-ga-track]');

  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', function (e) {
      var target = e.target; // Ensure that the target is the element with the tracking info,
      // rather than a child of it. E.g. image within a link would be target
      // rather than the link. This prevents that from happening.

      while (!target.hasAttribute('data-ga-track')) {
        target = target.parentElement;
      }

      var category = target.getAttribute('data-ga-track-category') || null;
      var action = target.getAttribute('data-ga-track-action') || null;
      var label = target.getAttribute('data-ga-track-label') || null;
      var value = target.getAttribute('data-ga-track-value') || null; // Process Google tracking event.

      trackEvent(category, action, label, value);
    });
  }
};

var _default = {
  init: init,
  setAccountId: setAccountId,
  setCrossDomainAccountId: setCrossDomainAccountId,
  setSites: setSites,
  setOptimizeId: setOptimizeId,
  trackPageView: trackPageView,
  trackEvent: trackEvent,
  setCustomVariable: setCustomVariable,
  accountId: accountId,
  setupTrackingAlias: setupTrackingAlias
};
exports["default"] = _default;

},{}],2:[function(require,module,exports){
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

var _default = {
  init: init
};
exports["default"] = _default;

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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.date = exports.breakpoints = void 0;
var version = 'Version goes here';
exports.version = version;
var date = 'Date goes here';
exports.date = date;
var breakpoints = [{
  'breakpoint': 'large',
  'width': 9999
}, {
  'breakpoint': 'medium',
  'width': 768
}, {
  'breakpoint': 'small',
  'width': 480
}];
exports.breakpoints = breakpoints;

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

var _default = {
  init: init,
  isIE7: isIE7
};
exports["default"] = _default;

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
  var rightButton = carousel.querySelector('.slick-next'); // If pagination (nav)

  if (nav && leftButton && rightButton) {
    // Give the pagination a class so can style.
    nav.className = nav.className + ' carousel-has-pagination'; // move buttons inside <ul>

    nav.appendChild(rightButton);
    nav.appendChild(leftButton); // reposition buttons

    rightButton.style.transform = 'translate(0px, 0px)'; // the left button can't be the first element in the <ul>, otherwise it messes up the navigation, which counts <ul> child elements to map the slides to the links - adding a new first-child pushes the links off by one
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
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}; // If no jQuery then break;

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
      (function () {
        var onInitEvent = document.createEvent('Event');
        var onBeforeChangeEvent = document.createEvent('Event');
        var onAfterChangeEvent = document.createEvent('Event');
        onInitEvent.initEvent('onCarouselInit', true, true);
        onBeforeChangeEvent.initEvent('onCarouselBeforeChange', true, true);
        onAfterChangeEvent.initEvent('onCarouselAfterChange', true, true);

        var _loop = function _loop(i) {
          var carousel = carousels[i];
          var options = {
            autoplaySpeed: 4000,
            dotsClass: 'slick-dots carousel__pagination',
            adaptiveHeight: false,
            dots: true
          }; // Arrows.

          if (carousel.getAttribute('data-carousel-arrows')) {
            options.arrows = carousel.getAttribute('data-carousel-arrows') === 'true';
          } // Autoplay


          if (carousel.getAttribute('data-carousel-autoplay')) {
            options.autoplay = carousel.getAttribute('data-carousel-autoplay') === 'true';
          } // Pagination / Dots.


          if (carousel.getAttribute('data-carousel-pagination') && carousel.getAttribute('data-carousel-pagination') === 'false') {
            options.dots = false;
          } // Fade.


          if (carousel.getAttribute('data-carousel-fade')) {
            options.fade = carousel.getAttribute('data-carousel-fade') === 'true';
          } // Adaptive Height (Automatically update height)


          if (carousel.getAttribute('data-carousel-auto-height')) {
            options.adaptiveHeight = carousel.getAttribute('data-carousel-auto-height') === 'true';
          } // Autoplay speed.


          if (carousel.getAttribute('data-carousel-autoplay-speed')) {
            options.autoplaySpeed = carousel.getAttribute('data-carousel-autoplay-speed');
          } // rearrange nav


          window.jQuery(carousel).on('init', function () {
            rearrangeNav(carousel);
          }); // Dispatch init event.

          window.jQuery(carousel).on('init', function (slick) {
            onInitEvent.carousel = {
              carousel: slick.target
            };
            carousel.dispatchEvent(onInitEvent);
          }); // Dispatch beforeChange event.

          window.jQuery(carousel).on('beforeChange', function (slick, currentSlide) {
            onBeforeChangeEvent.carousel = {
              carousel: slick.target,
              current: {
                index: currentSlide.currentSlide,
                element: slick.target.querySelector('.slick-slide[data-slick-index="' + currentSlide.currentSlide + '"]')
              }
            };
            carousel.dispatchEvent(onBeforeChangeEvent);
          }); // Dispatch afterChange event.

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
          _loop(i);
        }
      })();
    }
  }
};

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],7:[function(require,module,exports){
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
} // Default colours if not supplied.


var colours = ['204, 0, 0', // Red
'60, 133, 223', // Blue
'26, 172, 30', // Green
'252, 144, 3', // Orange
'254, 209, 0', // Yellow
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
        config.url = 'chart/vendor/chart.js.2.4.0.min.js';
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
        pointHoverRadius: pointRadius
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
  var options = {}; // Stacked bar chart.

  if ((type === 'bar' || type === 'horizontalBar') && stacked) {
    options.scales = options.scales || {};
    options.scales.xAxes = options.scales.xAxes || [];
    options.scales.xAxes[0] = options.scales.xAxes[0] || {};
    options.scales.xAxes[0].stacked = true;
    options.scales.yAxes = options.scales.yAxes || [];
    options.scales.yAxes[0] = options.scales.yAxes[0] || {};
    options.scales.yAxes[0].stacked = true;
  } // Gridlines (on by default).


  if (!verticalGridlines) {
    options.scales = options.scales || {};
    options.scales.xAxes = options.scales.xAxes || [];
    options.scales.xAxes[0] = options.scales.xAxes[0] || {};
    options.scales.xAxes[0].gridLines = options.scales.xAxes[0].gridLines || {};
    options.scales.xAxes[0].gridLines.display = false;
  }

  if (!horizontalGridlines) {
    options.scales = options.scales || {};
    options.scales.yAxes = options.scales.yAxes || [];
    options.scales.yAxes[0] = options.scales.yAxes[0] || {};
    options.scales.yAxes[0].gridLines = options.scales.yAxes[0].gridLines || {};
    options.scales.yAxes[0].gridLines.display = false;
  } // Legend.


  if (legend === 'false') {
    options.legend = options.legend || {};
    options.legend.display = false;
  } // Legend position.


  if (legendPosition) {
    options.legend = options.legend || {};
    options.legend.display = true;
    options.legend.position = legendPosition;
  } // Legend callback.


  if (legendOnClick !== 'true') {
    options.legend = options.legend || {};

    options.legend.onClick = function () {};
  } // Animation.


  if (animation === 'false') {
    options.animation = options.animation || {};
    options.animation.duration = 0;
  } // Vertical axis


  if (verticalAxis === 'false') {
    options.scales = options.scales || {};
    options.scales.xAxes = options.scales.xAxes || [];
    options.scales.xAxes[0] = options.scales.xAxes[0] || {};
    options.scales.xAxes[0].display = false;
  } // Horizontal axis


  if (horizontalAxis === 'false') {
    options.scales = options.scales || {};
    options.scales.yAxes = options.scales.yAxes || [];
    options.scales.yAxes[0] = options.scales.yAxes[0] || {};
    options.scales.yAxes[0].display = false;
  } // Tooltips


  if (tooltips && tooltips === 'false') {
    options.tooltips = options.tooltips || {};
    options.tooltips.enabled = false;
  }

  return options;
};

var setGlobalSettings = function setGlobalSettings() {
  window.Chart.defaults.global.defaultFontFamily = 'Roboto';
  window.Chart.defaults.global.legend.position = 'bottom';
  window.Honeycomb = window.Honeycomb || {};
  window.Honeycomb.charts = window.Honeycomb.charts || [];
};

var getData = function getData(chart) {
  var $deferred = window.jQuery.Deferred(); // Get data from inline JavaScript.

  if (chart.hasAttribute('data-chart-source')) {
    var dataSource = chart.getAttribute('data-chart-source');
    $deferred.resolve(typeof window[dataSource] !== 'undefined' ? window[dataSource] : typeof _this[dataSource] !== 'undefined' ? _this[dataSource] : null); // Get data from an ajax request (JSON).
  } else if (chart.hasAttribute('data-chart-url')) {
    var _dataSource = chart.getAttribute('data-chart-url');

    window.jQuery.getJSON(_dataSource, function (data) {
      $deferred.resolve(data);
    }); // No data source, return null.
  } else {
    $deferred.resolve(null);
  }

  return $deferred;
};

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],8:[function(require,module,exports){
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
      window.Intercom('update', window.intercomSettings); // Execute init callback if there is one, and it's a function.

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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],9:[function(require,module,exports){
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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12,"../../document/js/honeycomb.document.load-style":13}],10:[function(require,module,exports){
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

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

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
          var el = _step.value; // Get first breakpoint.

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
var _default = {
  init: init
};
exports["default"] = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var init = function init() {
  var els = document.querySelectorAll('.js-context-menu'); // Add event handlers

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

    document.addEventListener('click', handleClickAway); // Close context menus when resizing window (rather than recalculating positioning)

    window.addEventListener('resize', closeMenus);
  }
}; // Get the position of an element relative to the document


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
} // Handler for clicking on the context menu control


var handleContextMenuControlClick = function handleContextMenuControlClick(event) {
  event.preventDefault();
  var contextMenu = event.target.closest('.js-context-menu'); // Toggle context menu open state

  if (contextMenu.classList.contains('js-context-menu--open')) {
    closeMenu(contextMenu);
  } else {
    openMenu(contextMenu);
  }
};

var openMenu = function openMenu(contextMenu) {
  contextMenu.classList.add('js-context-menu--open'); // In order to overlay the context menu list over the other document content
  // and avoid problems with parent container overflow,
  // we move the context menu list up to the body, 
  // absolutely positioned in the correct position. 
  // We replace the list in its original parent when the menu is closed. 

  var contextMenuList = contextMenu.querySelector('.js-context-menu__list');
  var control = contextMenu.querySelector('.js-context-menu__control');
  var offset = getOffset(control); // Set position and classes

  var top = offset.top + offset.height + 10;
  var left = offset.left + 20;

  if (contextMenu.classList.contains('js-context-menu--right')) {
    contextMenuList.classList.add('js-context-menu__list--right');
    left -= offset.width + 20;
  }

  contextMenuList.style.top = "".concat(top, "px");
  contextMenuList.style.left = "".concat(left, "px");
  contextMenuList.classList.add('js-context-menu__list--open'); // create unique identifier to associate the context menu with the floating element 

  var id = Date.now() + Math.random();
  contextMenu.setAttribute('data-context-menu-id', id);
  contextMenuList.setAttribute('data-context-menu-id', id); // Add menu to DOM

  document.body.appendChild(contextMenuList);
};

var closeMenu = function closeMenu(contextMenu) {
  contextMenu.classList.remove('js-context-menu--open'); // remove any floating open lists from the body and replace them in their parent container

  var id = contextMenu.getAttribute('data-context-menu-id');

  if (id) {
    var floatingList = document.querySelector(".js-context-menu__list[data-context-menu-id=\"".concat(id, "\""));

    if (floatingList) {
      floatingList.classList.remove('js-context-menu__list--open');
      contextMenu.appendChild(floatingList);
    }
  }
}; // Close all context menus


var closeMenus = function closeMenus() {
  var els = document.querySelectorAll('.js-context-menu--open');

  if (els.length) {
    for (var i = 0; i < els.length; i++) {
      closeMenu(els[i]);
    }
  }
}; // Handler for clicking away from the context menu


var handleClickAway = function handleClickAway(event) {
  var openContextMenus = document.querySelectorAll('.js-context-menu--open'); // Close all open context menus when clicking away

  for (var i = 0; i < openContextMenus.length; i++) {
    var openContextMenu = openContextMenus[i];
    var control = openContextMenu.querySelector('.js-context-menu__control');
    var id = openContextMenu.getAttribute('data-context-menu-id');
    var list = document.querySelector(".js-context-menu__list[data-context-menu-id=\"".concat(id, "\"]")); // make sure the user is not clicking on the context menu control or list

    if (!(control.contains(event.target) || list.contains(event.target))) {
      closeMenu(openContextMenu);
    }
  }
};

var _default = {
  init: init
};
exports["default"] = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var load = function load() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var errorCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (url !== false) {
    var se = document.createElement('script');
    var honeycombPath = window.Honeycomb && window.Honeycomb.path ? window.Honeycomb.path : '';
    se.type = 'text/javascript';
    se.src = url.match('://') !== null ? url : honeycombPath + url;
    var done = false; // When the script has loaded, apply the callback.

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
    } // Custom attributes.


    for (var prop in attrs) {
      se[prop] = attrs[prop];
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
  }
};

var _default = {
  load: load
};
exports["default"] = _default;

},{}],13:[function(require,module,exports){
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
    var done = false; // When the stylesheet has loaded, apply the callback.

    link.onload = link.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true;

        if (typeof callback === 'function') {
          callback.apply(this);
        }
      }
    }; // Custom attributes.


    for (var prop in attrs) {
      link[prop] = attrs[prop];
    }

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
  }
};

var _default = {
  load: load
};
exports["default"] = _default;

},{}],14:[function(require,module,exports){
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
} // Toggle class when elements in/out of the viewport. (https://github.com/edwardcasbon/jquery.inViewport)


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
        window.jQuery(this).addClass('vp-out'); // Note that we don't remove the 'vp-in' class. Once it's in, it's in (to prevent multiple occurances of animation).
      });
    }
  }
};

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],15:[function(require,module,exports){
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

var config = {}; // Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)

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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0; // Filter (Hide/Show) content on a page.

var init = function init() {
  if (typeof window.jQuery === 'undefined') {
    window.console.warn('Honeycomb: jQuery not found, so filter functionality won\'t work as expected');
    return;
  } // Get the filter.


  var $filter = window.jQuery('.js-filter'); // If there's no filter on the page then stop.

  if ($filter.length === 0) {
    return false;
  } // When the update button is clicked, update the filter.


  $filter.on('click", ".js-filter__update', function () {
    updateFilter.call(this);
  }); // When any of the filter items are changed (selected/deselected), update
  // the filter.

  $filter.on('change', '.js-filter__item', function () {
    updateFilter.call(this);
  }); // When the reset button is clicked, reset the filter.

  $filter.on('click', '.js-filter__reset', function () {
    resetFilter.call(this);
  }); // Update the filter on init.

  updateFilter.call($filter.get(0).childNodes[0]);
}; // Update the filter.


var updateFilter = function updateFilter() {
  var $this = window.jQuery(this);
  var $filter = $this.parents('.js-filter');
  var $items = $filter.find('.js-filter__item');
  var $content = window.jQuery('[data-filter-content]');
  var enabledItems = [];
  var enabledContent = []; // Get the enabled items.

  $items.each(function () {
    var $this = window.jQuery(this);

    if ($this.prop('checked')) {
      enabledItems.push($this.attr('data-filter-term'));
    }
  }); // Show/Hide the relevant content.

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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],17:[function(require,module,exports){
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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],18:[function(require,module,exports){
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
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
/**
 * The default form settings.
 * 
 * Exported so they can be imported by the React implementation.
 */


var defaults = {
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
  }
};
/**
 * Create a custom config object by merging the default 
 * with the user supplied config.
 * 
 * @param {object} c The user supplied config.
 * @return {object} The defaults merged with the user supplied config.
 */

exports.defaults = defaults;

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
  } // Remove all the Marketo form embedded style attributes.


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
  var customSuccess = false; // Is there a follow up URL supplied?

  if (config.followUpUrl !== null) {
    customSuccess = true;
  } // Is there a custom success callback?


  if (config.success.callback !== null && typeof config.success.callback !== 'undefined') {
    customSuccess = true;
  } // Is there a custom success message?


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
  var config = createConfig(c); // Load the Marketo form script, and once loaded, load the 
  // form, and apply any callbacks.
  // See API documentation at https://developers.marketo.com/javascript-api/forms/api-reference/ .

  _honeycombDocument["default"].load(config.formsJavaScriptUrl, function () {
    if (typeof window.MktoForms2 === 'undefined') return; // If there's no form ID, then don't go any further.

    if (config.formId === '') return;
    window.MktoForms2.loadForm(config.rootUrl, config.munchkinId, config.formId, function (marketoForm) {
      var marketoFormElement = marketoForm.getFormElem().get(0);
      removeDefaultStyles();
      formatCheckboxes(marketoFormElement);

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
          } // If there's a custom message, then replace the form wit this message.


          if (config.success.message !== null) {
            $form.html(config.success.message);
          } // Add a class to describe the form has been successfully submitted.


          $form.addClass('mktoFormSubmitted mktoFormSubmitted--successful'); // Return false to stop the form from reloading the page.

          return false;
        });
      }

      marketoForm.onValidate(function (successful) {
        if (!successful) {
          marketoForm.submittable(false);
        } else {
          // Do some custom validation.
          // Get the fields and their values from the form.
          var fields = marketoForm.vals(); // Custom object for storing info about the fail.

          var fail = {
            isFail: false,
            message: '',
            element: null
          }; // Email validation.

          if (typeof fields.Email !== 'undefined') {
            // Email regex provided by https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/using_regular_expressions_to_validate_email_addresses.htm.
            // Check that the format is acceptable to Salesforce (only valid salesforce characters, single @, at least one . character in domain).
            var emailRegex = RegExp('^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$');

            if (emailRegex.test(fields.Email.toLowerCase()) === false) {
              fail.isFail = true;
              fail.message = 'Please enter a valid email address.';
              fail.element = marketoForm.getFormElem().find('input[name="Email"]');
            }
          } // If form validation fails.


          if (fail.isFail) {
            // Stop the form from being submittable.
            marketoForm.submittable(false); // Show an error message against the invalid field.

            marketoForm.showErrorMessage(fail.message, fail.element); //Scroll to the highest erroring field.

            var invalidSection = fail.element.get(0).previousSibling;
            invalidSection.scrollIntoView({
              block: 'center'
            }); // Display the field as invalid using the Marketo class.

            fail.element.get(0).classList.add('mktoInvalid');
          } else {
            // All is good, continue as normal.
            marketoForm.submittable(true);
          }
        }
      });
    });
  }, {}, handleError);
};

var init = function init(callback) {
  if (typeof callback === 'function') {
    callback.call(_this);
  }
};

var _default = {
  create: create,
  init: init
};
exports["default"] = _default;

},{"../../analytics/js/honeycomb.analytics.google":1,"../../document/js/honeycomb.document.load-script":12}],19:[function(require,module,exports){
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


_honeycombAnalytics["default"].setAccountId('UA-XXX');

_honeycombAnalytics["default"].init(); // Pingdom.


_honeycombAnalytics2["default"].init(); // Animation.


_honeycombAnimation["default"].init(); // Base.


window.breakpoints = _honeycomb.breakpoints; // Browser.

_honeycomb2["default"].init(); // Carousel.


window.addEventListener('load', function () {
  _honeycomb3["default"].init();
}); // Chart.

_honeycomb4["default"].init(); // Chat.


_honeycombChat["default"].init();

window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.Chat = window.Honeycomb.Chat || {};
window.Honeycomb.Chat.Intercom = _honeycombChat["default"]; // Code

_honeycomb5["default"].init(); // Content.


window.addEventListener('load', function () {
  _honeycomb6["default"].init();
}); // Context menu

_honeycomb7["default"].init(); // Document.


_honeycombDocument["default"].init(); // Equalise.


_honeycomb8["default"].init(); // Filter.


_honeycomb9["default"].init(); // Forms.


_honeycomb10["default"].init(); // Marketo forms.


_honeycombForms["default"].init();

window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.Marketo = _honeycombForms["default"]; // Lightbox.

_honeycomb11["default"].init(); // Google map.


window.initMap = _honeycombMaps["default"].initialiseMap;

_honeycombMaps["default"].init({
  callback: 'window.initMap'
}); // Navigation


_honeycombNavigation["default"].init();

_honeycombNavigation2["default"].init();

_honeycombNavigation3["default"].init(); // Notification


_honeycombNotification["default"].init();

window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.notifications = _honeycombNotification["default"]; // Polyfills.

(0, _honeycombPolyfill["default"])();
(0, _honeycombPolyfill2["default"])(); // Reveal.

_honeycomb12["default"].init(); // Scroll.


_honeycomb13["default"].init(); // Sticky.


_honeycomb14["default"].init(); // SVG.


_honeycomb15["default"].init(); // Tabs.


_honeycomb16["default"].init({
  equalise: _honeycomb8["default"].init,
  googleMap: _honeycombMaps["default"].init
}); // Toggle.


_honeycomb17["default"].init(); // Video.


_honeycomb18["default"].init({
  analytics: _honeycombAnalytics["default"]
});

},{"./analytics/js/honeycomb.analytics.google":1,"./analytics/js/honeycomb.analytics.pingdom":2,"./animation/js/honeycomb.animation.fade":3,"./base/js/honeycomb.base":4,"./browser/js/honeycomb.browser":5,"./carousel/js/honeycomb.carousel":6,"./chart/js/honeycomb.chart":7,"./chat/js/honeycomb.chat.intercom":8,"./code/js/honeycomb.code":9,"./content/js/honeycomb.content":10,"./context-menu/js/honeycomb.context-menu":11,"./document/js/honeycomb.document.viewport":14,"./equalise/js/honeycomb.equalise":15,"./filter/js/honeycomb.filter":16,"./forms/js/honeycomb.forms":17,"./forms/js/honeycomb.forms.marketo":18,"./lightbox/js/honeycomb.lightbox":20,"./maps/js/honeycomb.maps.google":21,"./navigation/js/honeycomb.navigation.dropdown":22,"./navigation/js/honeycomb.navigation.header":23,"./navigation/js/honeycomb.navigation.vertical":24,"./notification/js/honeycomb.notification.block":25,"./polyfill/js/honeycomb.polyfill.custom-event":26,"./polyfill/js/honeycomb.polyfill.index-of":27,"./reveal/js/honeycomb.reveal":28,"./scroll/js/honeycomb.scroll":29,"./sticky/js/honeycomb.sticky":30,"./svg/js/honeycomb.svg":31,"./tabs/js/honeycomb.tabs":32,"./toggle/js/honeycomb.toggle":33,"./video/js/honeycomb.video":34}],20:[function(require,module,exports){
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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],21:[function(require,module,exports){
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

var _default = {
  init: init,
  initialiseMap: initialiseMap
};
exports["default"] = _default;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var selector = '.js-dropdown';
var classNameOpen = 'open';
var classNameClosed = 'closed';
var classNameNoArrow = 'dropdown--no-arrow';

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

    if ($this.find('ul').length > 0 && $this.attr('data-arrow-added') !== 'true') {
      var $a = window.jQuery("<a>".concat(getArrowSvg(), "</a>")).attr('href', '#toggle').attr('tabindex', '-1') // Remove the dropdown arrow from the tab index, as it just duplicates the original anchor
      .addClass('arrow');
      $this.addClass("dropdown ".concat(classNameClosed));
      $this.attr('data-arrow-added', 'true');
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
}; // check if a specified dropdown is a parent of an event target


var dropdownIsActive = function dropdownIsActive(dropdown, target) {
  var parentDropdowns = [];
  var parent = target.parentElement; // list all dropdowns found in the event target's ancestors

  while (parent !== null) {
    if (parent.classList.contains('dropdown')) {
      parentDropdowns.push(parent);
    }

    parent = parent.parentElement;
  } // return true if the specified dropdown is an event target ancestor


  for (var i = 0; i < parentDropdowns.length; i++) {
    var parentDropdown = parentDropdowns[i];

    if (dropdown === parentDropdown) {
      return true;
    }
  }

  return false;
};

var handle = function handle() {
  if (typeof window.jQuery === 'undefined') {
    window.console.warn('Honeycomb: jQuery not found, so dropdown functionality won\'t work as expected');
    return;
  }

  var $body = window.jQuery('body');
  $body.on('click', '.js-dropdown a[href="#toggle"]', function (e) {
    var $this = window.jQuery(this);
    var $dropdown = $this.parent();
    e.preventDefault();

    if ($dropdown.hasClass(classNameOpen)) {
      $dropdown.removeClass(classNameOpen).addClass(classNameClosed);
    } else {
      $dropdown.addClass(classNameOpen).removeClass(classNameClosed);
    }
  }); // close all open dropdowns when clicking elsewhere in the document

  document.querySelector('body').addEventListener('click', function (event) {
    // Only proceed if there are any open dropdowns
    if (document.querySelector(".dropdown.".concat(classNameOpen))) {
      var dropdowns = document.querySelectorAll('.dropdown');
      var target = event.target; // loop through all dropdowns

      for (var i = 0; i < dropdowns.length; i++) {
        var dropdown = dropdowns[i];
        var dropdownIsOpen = dropdown.classList.contains(classNameOpen); // close open, inactive dropdowns

        if (!dropdownIsActive(dropdown, target) && dropdownIsOpen) {
          dropdown.classList.remove(classNameOpen);
          dropdown.classList.add(classNameClosed);
        }
      }
    }
  });
};

var _default = {
  init: init,
  addArrows: addArrows
};
exports["default"] = _default;

},{}],23:[function(require,module,exports){
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
  }); // When an item that has a submenu is clicked toggle the menu, rather than
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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],24:[function(require,module,exports){
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
    parent.className = parent.className + " ".concat(parentActiveClass);
  }
};

var update = function update(e, nav, a) {
  e.preventDefault(); // Remove all active classes.

  var items = nav.querySelectorAll(".".concat(activeClass));

  for (var i = 0; i < items.length; i++) {
    var re = new RegExp(activeClass, 'g');
    items[i].className = items[i].className.replace(re, '');
  } // Add active class to parent.


  a.parentElement.className = a.parentElement.className + " ".concat(activeClass); // Add parent active class to parent list items.

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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0; // Click handler for close buttons on statically built notifications.

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
}; // Build the notification HTML.


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
  var self = this; // User specified options.

  this.options = options; // Default settings.

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
  }; // Customised settings.

  this.settings = {}; // Show time.

  this.init = function init() {
    // Generate the settings array (Merging default settings and user options).
    window.jQuery.extend(true, self.settings, self.defaults, self.options); // Build the notification.

    self.notification = window.jQuery(buildNotification(self.settings)); // Show the notification.

    self.show(); // Add the close click handler.

    self.notification.on('click', '.notification__close', function (e) {
      e.preventDefault();
      self.close();
    });
  }; // Show the notification.


  this.show = function show() {
    // Hide the notification.
    self.notification.hide(); // Display the notification.

    self.settings.container.prepend(self.notification); // Slide the notification down.

    self.notification.slideDown();

    if (self.settings.duration) {
      self.timeoutId = window.setTimeout(function () {
        self.close.call(self);
      }, self.settings.duration);
    }
  }; // Close the notification.


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
  }; // Kick off.


  self.init();
};

var _default = {
  init: init,
  block: notification,
  buildNotification: buildNotification
};
exports["default"] = _default;

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0; // polyfill for window.CustomEvent
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

var _default = CustomEvent;
exports["default"] = _default;

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0; // Polyfill for the array indexOf command.

var indexOf = function indexOf() {
  if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i
    /*opt*/
    ) {
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

var _default = indexOf;
exports["default"] = _default;

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _this = void 0; // Reveal - Hide/Show content.


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
    var $this = window.jQuery(this); // Setup cta's.

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
          var $groupContent = window.jQuery(window.jQuery(groupButton).attr('href')); // If the content is visible (should only be 1), then close and open.

          if ($groupContent.is(':visible')) {
            close(groupButton, function () {
              open(that, callback);
            });
          } else {
            // Content's not visible, so just increase the counter for the check later.
            closed++;
          }
        } // No revealed content is open, so go ahead and open.


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
        $buttons.addClass('close'); // Update buttons.

        $buttons.each(function () {
          var $button = window.jQuery(this);

          if ($button.attr('data-reveal-cta-close-html')) {
            $button.html($button.attr('data-reveal-cta-close-html'));
          }
        }); // Callback

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
        $buttons.removeClass('close'); // Update buttons.

        $buttons.each(function () {
          var $button = window.jQuery(this);

          if ($button.attr('data-reveal-cta-open-html')) {
            $button.html($button.attr('data-reveal-cta-open-html'));
          }
        }); // Callback

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

var _default = {
  init: init,
  toggle: toggle,
  open: open,
  close: close
};
exports["default"] = _default;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0; // scrollTo - Scroll to an area on the page.

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
      var _window$jQuery, _window$jQuery$offset;

      e.preventDefault();
      var hashTop = (_window$jQuery = window.jQuery(hash)) === null || _window$jQuery === void 0 ? void 0 : (_window$jQuery$offset = _window$jQuery.offset()) === null || _window$jQuery$offset === void 0 ? void 0 : _window$jQuery$offset.top;

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
  var hash = a.hash; // IE doesn't include the starting / on the pathname.

  var pathname = a.pathname.charAt(0) === '/' ? a.pathname : '/' + a.pathname; // If Href doesn't have a path, just a hash, then reset pathname.

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
        } // It's possible for offset to be undefined, so check it exists


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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],30:[function(require,module,exports){
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
} // Initialise sticky element functionality. (https://github.com/edwardcasbon/jquery.sticky)


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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../document/js/honeycomb.document.load-script":12}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],32:[function(require,module,exports){
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

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var init = function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}; // If IE7, bail!

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
          }; // Scroll animation

          var scrollTo = tab.getAttribute('data-tabs-scroll-to');

          if (scrollTo) {
            options.scrollTo = scrollTo === 'true';
          } // Scroll animation offset


          var scrollToOffset = tab.getAttribute('data-tabs-scroll-to-offset');

          if (scrollToOffset) {
            options.scrollToOffset = scrollToOffset;
          } // Pagination


          var pagination = tab.getAttribute('data-tabs-pagination');

          if (pagination) {
            options.pagination = pagination === 'true';
          } // Reload ajax requests


          var reloadAjax = tab.getAttribute('data-tabs-reload-ajax');

          if (reloadAjax) {
            options.reloadAjax = reloadAjax === 'true';
          } // Tab change callbacks


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
          } // Apply tabs plugin.


          window.jQuery(tab).tabs(options); // Callback.

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

var _default = {
  init: init
};
exports["default"] = _default;

},{"../../browser/js/honeycomb.browser":5,"../../document/js/honeycomb.document.load-script":12}],33:[function(require,module,exports){
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

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

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
        var tog = _step.value; // Hide the toggle items.

        var items = tog.querySelectorAll("".concat(hook, "-item"));

        for (var i = 0; i < items.length; i++) {
          items[i].style.display = 'none';
        } // Show the first item.


        items[0].style.display = 'block'; // Add active state to the first nav item.

        var as = tog.querySelectorAll("".concat(hook, "-nav a"));

        var _iterator2 = _createForOfIteratorHelper(as),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var a = _step2.value;
            a.classList.remove(activeClass); // Add toggle handler.

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
  } // Hide all the items.


  var items = toggle.querySelectorAll("".concat(hook, "-item"));

  var _iterator3 = _createForOfIteratorHelper(items),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      item.style.display = 'none';
    } // Show the selected item.

  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  toggleItem.style.display = 'block'; // Update the active state.

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

var _default = {
  init: init
};
exports["default"] = _default;

},{}],34:[function(require,module,exports){
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

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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
        e: function e(_e2) {
          throw _e2;
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
    e: function e(_e3) {
      didErr = true;
      err = _e3;
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

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
} // Default options for video playback.


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
}; // Load the Youtube and Vimeo player APIs as required


var loadPlayerAPIs = function loadPlayerAPIs() {
  var videoContainers = document.querySelectorAll('.js-video-container');

  for (var i = 0; i < videoContainers.length; i++) {
    var videoContainer = videoContainers[i];
    var videoId = videoContainer.getAttribute('data-video-id');

    if (videoId) {
      // If video is already loaded, skip.
      // We look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.
      if (videoContainer.querySelector("iframe[id^=\"".concat(videoId, "\"]"))) {
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
}; // Error handler for loading scripts 
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
}; // Load a script, if it has not already been added to the DOM


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
}; // If the video ID is only numbers, treat it as a Vimeo ID


var isVimeoId = function isVimeoId(id) {
  if (typeof id !== 'string') {
    return false;
  }

  return !!id.match(/^[0-9]*$/);
}; // calculate second values for 10%, 20% etc. for event tracking


var calculatePercentages = function calculatePercentages(duration) {
  var percentage;
  var percentages = {};

  for (var i = 1; i < 10; i++) {
    percentage = i * 10 + '%';
    percentages[percentage] = duration * (i / 10);
  }

  return percentages;
};

var trackVideoEvent = function trackVideoEvent(videoId, value) {
  if (analytics) {
    analytics.trackEvent('Video', "".concat(videoId, " - ").concat(document.location.pathname), value);
  }
}; // we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer


var trackGoal = function trackGoal(videoId) {
  trackVideoEvent(videoId, 'goal');
  return true;
}; // Track events when we have passed our set duration markers


var trackVideoEventsSoFar = function trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId) {
  // check goal conditions
  if (!goalTracked) {
    if (currentTime > percentages['20%'] && percentages['20%'] > 30) {
      goalTracked = trackGoal(event, videoId);
    } else if (currentTime > 30 && percentages['20%'] < 30) {
      goalTracked = trackGoal(event, videoId);
    }
  } // check what percentages the playhead has passed


  for (var i in percentages) {
    if (currentTime > percentages[i]) {
      trackVideoEvent(videoId, i);
      delete percentages[i];
    }
  }

  return [goalTracked, percentages];
}; // Handler for Unstarted event


var handleUnstartedEvent = function handleUnstartedEvent(videoId, duration) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('unstarted', videoId, duration);
  }
}; // Handler for Play event
// Track an event when a video starts playing


var handlePlayEvent = function handlePlayEvent(videoId, duration, player) {
  var iframe; // get iframe from player 

  if (typeof player.getIframe === 'function') {
    // youtube method
    iframe = player.getIframe();
  } else {
    // vimeo method
    iframe = player.element;
  }

  if (!iframe.hasAttribute('data-ga-tracked') && analytics) {
    var container = isVimeoId(videoId) ? iframe.parentElement.parentElement : iframe.parentElement;

    if (container.hasAttribute('data-ga-track')) {
      // Track the video in GA (Google Analytics).
      var category = container.getAttribute('data-ga-track-category') || null;
      var action = container.getAttribute('data-ga-track-action') || null;
      var label = container.getAttribute('data-ga-track-label') || null;
      var value = container.getAttribute('data-ga-track-value') || null; // Call the tracking event.

      analytics.trackEvent(category, action, label, value);
    } // Add a tracked data attribute to prevent from tracking multiple times.


    iframe.setAttribute('data-ga-tracked', true);
    trackVideoEvent(videoId, '0%');
  }

  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('play', videoId, duration);
  }
}; // Handler for Pause event


var handlePauseEvent = function handlePauseEvent(videoId, duration, currentTime, goalTracked, percentages) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('pause', videoId, duration);
  }

  return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
}; // Handler for Stop event


var handleStopEvent = function handleStopEvent(videoId, duration, currentTime, goalTracked, percentages) {
  if (typeof window.onVideoPlayerStateChange === 'function') {
    window.onVideoPlayerStateChange('ended', videoId, duration);
  }

  return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
}; // add event listeners to the Vimeo player


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

    handlePlayEvent(videoId, data.duration, player);
  });
}; // Search the document for video containers, 
// and load any video players that need loading. 


var addInlineVideos = function addInlineVideos() {
  var videoCounter = 0;
  var videoContainers = document.querySelectorAll('.js-video-container');

  var _iterator2 = _createForOfIteratorHelper(videoContainers),
      _step2;

  try {
    var _loop = function _loop() {
      var videoContainer = _step2.value;
      var videoId = videoContainer.getAttribute('data-video-id'); // If video is already loaded, skip.
      // NB we look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.

      if (videoContainer.querySelector("iframe[id^=\"".concat(videoId, "\"]"))) {
        return "continue";
      }

      var duration = void 0;
      var currentTime = void 0;
      var percentages = void 0;
      var goalTracked = false;

      if (videoId) {
        // Append empty div which will get replaced by video.
        var videoDiv = document.createElement('div');
        videoDiv.setAttribute('id', "".concat(videoId, "-").concat(videoCounter));
        videoContainer.innerHTML = '';
        videoContainer.appendChild(videoDiv); // Get the options (data attributes)

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
                duration = duration || event.target.getDuration(); // Unstarted event

                if (event.data === window.YT.PlayerState.UNSTARTED) {
                  handleUnstartedEvent(videoId, duration);
                } // Play events


                if (event.data === window.YT.PlayerState.PLAYING) {
                  percentages = percentages || calculatePercentages(duration);
                  handlePlayEvent(videoId, duration, event.target);
                } // Pause events


                if (event.data === window.YT.PlayerState.PAUSED) {
                  var _handlePauseEvent = handlePauseEvent(videoId, duration, currentTime, goalTracked, percentages);

                  var _handlePauseEvent2 = _slicedToArray(_handlePauseEvent, 2);

                  goalTracked = _handlePauseEvent2[0];
                  percentages = _handlePauseEvent2[1];
                } // End events


                if (event.data === window.YT.PlayerState.ENDED) {
                  var _handleStopEvent = handleStopEvent(videoId, duration, currentTime, goalTracked, percentages);

                  var _handleStopEvent2 = _slicedToArray(_handleStopEvent, 2);

                  goalTracked = _handleStopEvent2[0];
                  percentages = _handleStopEvent2[1];
                }
              }
            }
          }; // playlist settings

          var listId = videoContainer.getAttribute('data-video-list-id');

          if (listId) {
            playerSettings.playerVars.listType = 'playlist';
            playerSettings.playerVars.list = listId;
          } // start time


          var start = videoContainer.getAttribute('data-video-start-time');

          if (start) {
            playerSettings.playerVars.start = start;
          }
        } // Replace the empty div with the video player iframe.


        if (isVimeoId(videoId)) {
          // load vimeo player
          if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
            // create player
            var player = new window.Vimeo.Player("".concat(videoId, "-").concat(videoCounter), playerSettings);
            videos["".concat(videoId, "-").concat(videoCounter)] = player;
            videoContainer.setAttribute('data-video-loaded', 'true'); // add event listeners 

            attachVimeoPlayerEventListeners(player, videoId, goalTracked);
          }
        } else {
          // load youtube player
          if (window.YT && typeof window.YT.Player === 'function') {
            videos["".concat(videoId, "-").concat(videoCounter)] = new window.YT.Player("".concat(videoId, "-").concat(videoCounter), playerSettings);
            videoContainer.setAttribute('data-video-loaded', 'true');
          }
        }
      } // Increase the counter.


      videoCounter++;
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};

var getOptions = function getOptions(video) {
  // Copy the defaults.
  var optionsCopy = Object.assign({}, options); // Autohide.

  if (video.hasAttribute('data-video-auto-hide')) {
    optionsCopy.autohide = video.getAttribute('data-video-auto-hide');
  } // Autoplay.


  if (video.hasAttribute('data-video-auto-play')) {
    optionsCopy.autoplay = video.getAttribute('data-video-auto-play');
  } // Controls.


  if (video.hasAttribute('data-video-controls')) {
    optionsCopy.controls = video.getAttribute('data-video-controls');
  } // Show info.


  if (video.hasAttribute('data-video-show-info')) {
    optionsCopy.showinfo = video.getAttribute('data-video-show-info');
  } // Loop.


  if (video.hasAttribute('data-video-loop')) {
    optionsCopy.loop = video.getAttribute('data-video-loop');
  } // Return the options object.


  return optionsCopy;
}; // Add the video when the YouTube iframe API library has loaded.


window.onYouTubeIframeAPIReady = function () {
  addInlineVideos();
};

var _default = {
  init: init,
  options: options,
  addInlineVideos: addInlineVideos,
  videos: videos
};
exports["default"] = _default;

},{}]},{},[19]);
