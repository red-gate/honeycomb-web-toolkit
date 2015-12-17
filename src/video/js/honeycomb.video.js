var Honeycomb = Honeycomb || {};

Honeycomb.Video = (function($) {

  // Default options for video playback.
  var options = {
    autohide: 1,
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    loop: 0
  };

  var videos = {};

  var init = function init() {
    loadYouTubeIframeAPI();
    addBackgroundVideos();
  };

  var loadYouTubeIframeAPI = function loadYouTubeIframeAPI() {
    if($('.js-video-container').length > 0) {
      var tag = document.createElement('script');
      var firstScriptTag = document.getElementsByTagName('script')[0];

      tag.src = 'https://www.youtube.com/iframe_api';
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  };

  // calculate second values for 10%, 20% etc. for event tracking
  var calculatePercentages = function calculatePercentages(duration) {
    var percentage;
    var percentages = {};
    for (i = 1; i < 10; i++) {
      percentage = i * 10 + '%';
      percentages[percentage] = duration * (i / 10);
    }
   return percentages; 
  }

  var trackVideoEvent = function trackVideoEvent(event, value) {
    Honeycomb.Analytics.Google.trackEvent('Video', event.target.getVideoUrl() + ' - ' + document.location.pathname, value);
  }

  // we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer 
  var trackGoal = function trackGoal(event) {
    trackVideoEvent(event, 'goal');
    return true;
  }

  var addInlineVideos = function addInlineVideos() {
    var videoCounter = 0;
    $('.js-video-container').each(function() {
      var $this = $(this);
      var videoId = $this.attr('data-video-id');
      var duration;
      var currentTime;
      var percentages;
      var goalTracked = false;

      if(videoId) {

        // Append empty div which will get replaced by video.
        $this.append($('<div/>').attr('id', videoId + '-' + videoCounter));

        // Get the options (data attributes)
        var options = getOptions($this);

        // Replace the empty div with the video player iframe.
        videos[videoId + '-' + videoCounter] = new YT.Player(videoId + '-' + videoCounter, {
          width: 640,
          height: 360,
          videoId: videoId,
          playerVars: {
            rel: 0,
            autohide: options.autohide,
            autoplay: options.autoplay,
            controls: options.controls,
            showinfo: options.showinfo,
            loop: options.loop,
            enablejsapi: 1
          },
          events: {
            onReady: function(event) {
              // Add the 'video' class to the dynamically added iframe.
              $("iframe#" + $(event.target.getVideoEmbedCode()).attr('id')).addClass('video');
            },
            onStateChange: function(event) {


              if(event.data === YT.PlayerState.PLAYING) {

                // Video playing.
                var $video = $("iframe#" + $(event.target.getVideoEmbedCode()).attr('id'));

                duration = duration || event.target.getDuration();
                percentages = percentages || calculatePercentages(duration);

                if(!$video.attr("data-ga-tracked")) {
                  var $container = $video.parent();

                  if($container.attr('data-ga-track')) {
                    // Track the video in GA (Google Analytics).
                    var category = $container.attr('data-ga-track-category') || null;
                    var action = $container.attr('data-ga-track-action') || null;
                    var label = $container.attr('data-ga-track-label') || null;
                    var value = $container.attr('data-ga-track-value') || null;

                    // Call the tracking event.
                    Honeycomb.Analytics.Google.trackEvent(category, action, label, value);
                  }
                  // Add a tracked data attribute to prevent from tracking multiple times.
                  $video.attr('data-ga-tracked', 'true');

                  trackVideoEvent(event, '0%');
                }
              }

              if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                currentTime = event.target.getCurrentTime();

                // check goal conditions 
                if (!goalTracked) {
                  if (currentTime > percentages['20%'] && percentages['20%'] > 30) {
                    goalTracked = trackGoal(event);
                  }
                  else if (currentTime > 30){
                    goalTracked = trackGoal(event);
                  }
                }

                // check what percentages the playhead has passed
                for (var i in percentages) {
                  if (currentTime > percentages[i]) {
                    trackVideoEvent(event, i);
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
    });
};

var addBackgroundVideos = function addBackgroundVideos() {
  $('[data-background-video-id]').each(function() {
    var $this = $(this);
    var videoId = $this.attr('data-background-video-id');
    var $videoContainer = $('<div class="js-video-container"></div>');
    var $video = $('<iframe />');

      // Get the options (data attributes)
      var options = getOptions($this);
      options.autoplay = 1;

      var src = '//www.youtube.com/embed/' + videoId +
      '?rel=0&autohide=' + options.autohide +
      '&autoplay=' + options.autoplay +
      '&controls=' + options.controls +
      '&showinfo=' + options.showinfo +
      '&loop=' + options.loop +
      '&enablejsapi=1';

      $this.wrapInner('<div class="js-background-video__content"></div>');

      $video.attr('class', 'js-background-video__video')
      .attr('width', 640)
      .attr('height', 360)
      .attr('src', src);

      $video.appendTo($videoContainer);
      $videoContainer.prependTo($this);
    });
};

var getOptions = function getOptions($this) {

    // Copy the defaults.
    var options = jQuery.extend({}, Honeycomb.Video.options);

    // Autohide.
    if($this.attr('data-video-auto-hide')) {
      options.autohide = $this.attr('data-video-auto-hide');
    }

    // Autoplay.
    if($this.attr('data-video-auto-play')) {
      options.autoplay = $this.attr('data-video-auto-play');
    }

    // Controls.
    if($this.attr('data-video-controls')) {
      options.controls = $this.attr('data-video-controls');
    }

    // Show info.
    if($this.attr('data-video-show-info')) {
      options.showinfo = $this.attr('data-video-show-info');
    }

    // Loop.
    if($this.attr('data-video-loop')) {
      options.loop = $this.attr('data-video-loop');
    }

    // Return the options object.
    return options;
  };

  return {
    init: init,
    options: options,
    addInlineVideos: addInlineVideos,
    videos: videos
  };

})(jQuery);

jQuery(function() {
  Honeycomb.Video.init();
});

// Add the video when the iframe API library has loaded.
window.onYouTubeIframeAPIReady = function() {
  Honeycomb.Video.addInlineVideos();
};
