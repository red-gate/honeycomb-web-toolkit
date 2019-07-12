// Default options for video playback.
const options = {
    autohide: 1,
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    loop: 0
};

const videos = {};

let analytics;

const init = ( options = {} ) => {
    analytics = options.analytics || false;

    loadPlayerAPIs();
    addInlineVideos();
};

// Load the Youtube and Vimeo player APIs as required
const loadPlayerAPIs = () => {
    const videoContainers = document.querySelectorAll('.js-video-container');

    for ( let i = 0; i < videoContainers.length; i++ ) {
        const videoContainer = videoContainers[i];

        const videoId = videoContainer.getAttribute('data-video-id');

        if (videoId) {
            // If video is already loaded, skip.
            // We look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.
            if ( videoContainer.querySelector( `iframe[id^="${videoId}"]` ) ) {
                continue;
            }

            if ( isVimeoId(videoId) ) {
                // Load Vimeo player API
                loadScript('https://player.vimeo.com/api/player.js');
            } else {
                // Load Youtube player API
                loadScript('https://www.youtube.com/iframe_api');
            }
        }
    }
};

// Load a script, if it has not already been added to the DOM
const loadScript = src => {
    if ( document.querySelector(`script[src="${src}"`) ) {
        return;
    }

    const tag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];
    tag.src = src;
    tag.onload = addInlineVideos;
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};


// If the video ID is only numbers, treat it as a Vimeo ID
const isVimeoId = id => {
    if ( typeof id !== 'string' ) {
        return false;
    }

    return !! id.match(/^[0-9]*$/);
};


// calculate second values for 10%, 20% etc. for event tracking
const calculatePercentages = duration => {
    let percentage;
    const percentages = {};
    for (let i = 1; i < 10; i++) {
        percentage = i * 10 + '%';
        percentages[percentage] = duration * (i / 10);
    }
    return percentages;
};

const trackVideoEvent = ( videoId, value ) => {
    if (analytics) {
        analytics.trackEvent('Video', `${videoId} - ${document.location.pathname}`, value);
    }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
const trackGoal = ( videoId ) => {
    trackVideoEvent( videoId, 'goal');
    return true;
};

// Track events when we have passed our set duration markers
const trackVideoEventsSoFar = (goalTracked, percentages, currentTime, videoId) => {
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
            trackVideoEvent(videoId, i);
            delete percentages[i];
        }
    }

    return [goalTracked, percentages];
};


// Handler for Unstarted event
const handleUnstartedEvent = () => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('unstarted');
    }
};


// Handler for Play event
// Track an event when a video starts playing
const handlePlayEvent = (videoId, player) => {
    let iframe; 

    // get iframe from player 
    if ( typeof player.getIframe === 'function' ) {
        // youtube method
        iframe = player.getIframe();
    } else {
        // vimeo method
        iframe = player.element;
    }

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

        trackVideoEvent(videoId, '0%');
    }

    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('play');
    }
};

// Handler for Pause event
const handlePauseEvent = (goalTracked, percentages, currentTime, videoId) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('pause');
    }

    return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};

// Handler for Stop event
const handleStopEvent = (goalTracked, percentages, currentTime, videoId) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('stop');
    }

    return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};


// add event listeners to the Vimeo player
const attachVimeoPlayerEventListeners = (player, videoId, goalTracked) => {
    let pauseEventsAttached = false;

    player.on('play', data => {
        const percentages = calculatePercentages( data.duration );

        if ( ! pauseEventsAttached ) {
            player.on('pause', data => {
                handlePauseEvent( goalTracked, percentages, data.seconds, videoId);
            });
        
            player.on('ended', data => {
                handlePauseEvent( goalTracked, percentages, data.seconds, videoId);
            });

            pauseEventsAttached = true;
        }

        handlePlayEvent( videoId, player );
    });
};


// Search the document for video containers, 
// and load any video players that need loading. 
const addInlineVideos = () => {
    let videoCounter = 0;
    let videoContainers = document.querySelectorAll('.js-video-container');
    for (let videoContainer of videoContainers) {

        let videoId = videoContainer.getAttribute('data-video-id');

        // If video is already loaded, skip.
        // NB we look for the iframe for the specific video, because in React we may be reusing an old VideoPlayer component.
        if ( videoContainer.querySelector( `iframe[id^="${videoId}"]` ) ) {
            continue;
        }

        let duration;
        let currentTime;
        let percentages;
        let goalTracked = false;

        if (videoId) {

            // Append empty div which will get replaced by video.
            let videoDiv = document.createElement('div');
            videoDiv.setAttribute('id', `${videoId}-${videoCounter}`);
            videoContainer.innerHTML = '';
            videoContainer.appendChild(videoDiv);

            // Get the options (data attributes)
            let options = getOptions(videoContainer);


            let playerSettings;

            if ( isVimeoId(videoId) ) {
                // Vimeo player settings
                playerSettings = {
                    id: videoId,
                    width: 640,
                    autoplay: options.autoplay,
                    loop: options.loop || false
                };

            } else {

                // YouTube player settings
                playerSettings = {
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
                            // Reset the video ID and current time
                            videoId = event.target.getVideoData().video_id;
                            currentTime = event.target.getCurrentTime();

                            // Unstarted event
                            if ( event.data === window.YT.PlayerState.UNSTARTED ) {
                                handleUnstartedEvent();
                            }

                            // Play events
                            if ( event.data === window.YT.PlayerState.PLAYING ) {
                                duration = duration || event.target.getDuration();
                                percentages = percentages || calculatePercentages(duration);
                                handlePlayEvent(videoId, event.target);
                            }

                            // Pause events
                            if ( event.data === window.YT.PlayerState.PAUSED ) {
                                [goalTracked, percentages] = handlePauseEvent(goalTracked, percentages, currentTime, videoId);
                            }

                            // End events
                            if ( event.data === window.YT.PlayerState.ENDED ) {
                                [goalTracked, percentages] = handleStopEvent(goalTracked, percentages, currentTime, videoId);
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

            }

            // Replace the empty div with the video player iframe.
            if ( isVimeoId(videoId) ) {
                // load vimeo player
                if ( window.Vimeo && typeof window.Vimeo.Player === 'function' ) {
                    // create player
                    const player = new window.Vimeo.Player(`${videoId}-${videoCounter}`, playerSettings); 
                    videos[`${videoId}-${videoCounter}`] = player;
                    videoContainer.setAttribute('data-video-loaded', 'true'); 

                    // add event listeners 
                    attachVimeoPlayerEventListeners( player, videoId, goalTracked );
                }

            } else {
                // load youtube player
                if ( window.YT && typeof window.YT.Player === 'function' ) {
                    videos[`${videoId}-${videoCounter}`] = new window.YT.Player(`${videoId}-${videoCounter}`, playerSettings);
                    videoContainer.setAttribute('data-video-loaded', 'true'); 
                }
            }
        }

        // Increase the counter.
        videoCounter++;
    }
};

const getOptions = video => {

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

// Add the video when the YouTube iframe API library has loaded.
window.onYouTubeIframeAPIReady = () => {
    addInlineVideos();
};

export default {
    init,
    options,
    addInlineVideos,
    videos
};
