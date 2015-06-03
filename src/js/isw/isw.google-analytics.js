var Honeycomb = Honeycomb || {};

Honeycomb.Analytics = Honeycomb.Analytics || {};

Honeycomb.Analytics.Google = (function($) {

  // Account ID - THIS NEEDS TO BE SET TO YOUR GOOGLE ANALYTICS ACCOUNT ID.
  var accountId = 'UA-XXX';

  var init = function init() {

    // If the account ID is not set, then don't carry on.
    if(!accountId || (accountId === 'UA-XXX')) {
      console.error('Google Analytics account ID is not set.');
      return false;
    }

    // Add the tracking script.
    addScript();

    // Init the analytics accounts.
    initAccount(accountId);

    // Track a page view.
    trackPageView();

    // Set up tracking alias helper.
    setupTrackingAlias();

    // Track YouTube video views.
    trackYouTubeViews();
  };

  // Add the Google Analytics script to the page.
  var addScript = function addScript() {
    console.log("Adding script");
    (function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  };

  // Initialise the account, with the account ID.
  var initAccount = function initAccount(accountId) {
    if(!accountId || (accountId === 'UA-XXX')) {
      console.log('Google Analytics account ID is not set.');
      return false;
    }

    ga('create', accountId, 'auto');
  };

  // Track a page view.
  var trackPageView = function trackPageView(url) {
    url = url || false;

    if(url) {
      ga('send', 'pageview', {
        'page': url
      });
    } else {
      ga('send', 'pageview');
    }
  };

  // Track an event.
  var trackEvent = function trackEvent(category, action, label, value) {
    category = category || '';
    action = action || '';
    label = label || null;
    value = value || null;

    ga('send', 'event', category, action, label, value);
  };

  // Set a custom variable.
  var setCustomVariable = function setCustomVariable(index, name, value, scope) {
    var options = {};
    options['dimension' + index] = value;
    ga('send', 'pageview', options);
  };

  // Track youtube video views.
  var trackYouTubeViews = function trackYouTubeViews() {
    $('.lightbox--video').on('click', function() {
      var videoId = this.href.replace(/http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '');
      Honeycomb.Analytics.Google.trackEvent('Video', window.location.pathname, videoId);
    });
  };

  // Click track (helper for instead of onclick="ga(send...)".
  // Use data-attributes instead. Keeps HTML nicer and easy to update in the
  // future).
  var setupTrackingAlias = function setupTrackingAlias() {
    $('[data-ga-track]').on('click', function() {
      var $this = $(this);
      var category = $this.attr('data-ga-track-category') || null;
      var action = $this.attr('data-ga-track-action') || null;
      var label = $this.attr('data-ga-track-label') || null;
      var value = $this.attr('data-ga-track-value') || null;

      // Process Google tracking event.
      Honeycomb.Analytics.Google.trackEvent(category, action, label, value);
    });
  };

  return {
    init: init,
    trackPageView: trackPageView,
    trackEvent: trackEvent,
    setCustomVariable: setCustomVariable,
  };
})(jQuery);

jQuery(function() {
  // Honeycomb.Analytics.Google.init();
});
