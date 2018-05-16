// Default options for video playback.
let options = {
    autohide: 1,
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    loop: 0
};

let videos = {};

let analytics;

let init = ( options = {} ) => {
    analytics = options.analytics || false;
    loadYouTubeIframeAPI();
};

let loadYouTubeIframeAPI = () => {
    let videoContainer = document.querySelectorAll('.js-video-container');
    if (videoContainer.length > 0) {
        let tag = document.createElement('script');
        let firstScriptTag = document.getElementsByTagName('script')[0];
        tag.src = 'https://www.youtube.com/iframe_api';
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
};

// calculate second values for 10%, 20% etc. for event tracking
let calculatePercentages = duration => {
    let percentage;
    let percentages = {};
    for (let i = 1; i < 10; i++) {
        percentage = i * 10 + '%';
        percentages[percentage] = duration * (i / 10);
    }
    return percentages;
};

let trackVideoEvent = ( event, videoId, value ) => {
    if (analytics) {
        analytics.trackEvent('Video', `${videoId} - ${document.location.pathname}`, value);
    }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
let trackGoal = ( event, videoId ) => {
    trackVideoEvent(event, videoId, 'goal');
    return true;
};

let addInlineVideos = () => {
    let videoCounter = 0;
    let videoContainers = document.querySelectorAll('.js-video-container');
    for (let videoContainer of videoContainers) {
        let videoId = videoContainer.getAttribute('data-video-id');
        let duration;
        let currentTime;
        let percentages;
        let goalTracked = false;

        if (videoId) {

            // Append empty div which will get replaced by video.
            let videoDiv = document.createElement('div');
            videoDiv.setAttribute('id', `${videoId}-${videoCounter}`);
            videoContainer.appendChild(videoDiv);

            // Get the options (data attributes)
            let options = getOptions(videoContainer);

            let playerSettings = {
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
                    onStateChange: ( event ) => {

                        // Reset the video ID.
                        videoId = event.target.getVideoData().video_id;

                        if ( event.data === window.YT.PlayerState.PLAYING ) {

                            // Video playing.
                            let iframe = event.target.getIframe();

                            duration = duration || event.target.getDuration();
                            percentages = percentages || calculatePercentages(duration);

                            if (!iframe.hasAttribute('data-ga-tracked') && analytics) {
                                let container = iframe.parentElement;

                                if (container.hasAttribute('data-ga-track')) {

                                    // Track the video in GA (Google Analytics).
                                    let category = container.getAttribute('data-ga-track-category') || null;
                                    let action = container.getAttribute('data-ga-track-action') || null;
                                    let label = container.getAttribute('data-ga-track-label') || null;
                                    let value = container.getAttribute('data-ga-track-value') || null;

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
                            for (let i in percentages) {
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
            const listId = videoContainer.getAttribute('data-video-list-id');
            if (listId) {
                playerSettings.playerVars.listType = 'playlist';
                playerSettings.playerVars.list = listId;
            }

            // start time
            const start = videoContainer.getAttribute('data-video-start-time');
            if (start) {
                playerSettings.playerVars.start = start;
            }
            
            // Replace the empty div with the video player iframe.
            videos[`${videoId}-${videoCounter}`] = new window.YT.Player(`${videoId}-${videoCounter}`, playerSettings);
        }

        // Increase the counter.
        videoCounter++;
    }
};

let getOptions = video => {

    // Copy the defaults.
    let options = Object.assign({}, options);

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
window.onYouTubeIframeAPIReady = () => {
    // set ready flag for use in React apps
    window.youTubeIframeAPIReady = true;

    addInlineVideos();
};

export default {
    init,
    options,
    addInlineVideos,
    videos
};
