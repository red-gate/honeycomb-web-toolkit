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
            if ( videoContainer.querySelector( `iframe[id^="${videoId}"], video` ) ) {
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

// Error handler for loading scripts 
// Useful if e.g. youtube is blocked 
// Written as a longhand function instead of an arrow function to preserve the this keyword.
const loadScriptHandleError = function() {
    window.console.error(`${this.src} failed to load`);
    
    if ( this.src.match('youtube') ) {
        let videoContainers = document.querySelectorAll('.js-video-container');
        for (let videoContainer of videoContainers) {
            videoContainer.innerHTML = `
                <div class="notification notification--block notification--fail spaced">
                    <div class="notification--block__inner-container">
                        <figure class="notification__icon">
                            <span class="icon icon--fail"></span>
                        </figure>
                        <div class="notification__body">
                            <p class="gamma">We could not reach youtube.com</p>
                            <p>youtube.com may currently be down, or may be blocked by your network.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
};

// Load a script, if it has not already been added to the DOM
const loadScript = src => {
    if ( document.querySelector(`script[src="${src}"]`) ) {
        return;
    }

    const tag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];
    tag.src = src;
    tag.onload = addInlineVideos;
    tag.onerror = loadScriptHandleError;
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};


// If the video ID is only numbers, treat it as a Vimeo ID
const isVimeoId = id => {
    if ( typeof id !== 'string' ) {
        return false;
    }

    return !! id.match(/^[0-9]*$/);
};

const isLocalVideoId = (id) => {
    const extensions = ['mp4', 'webm'];
    let isLocalVideo = false;
    extensions.forEach((ext) => {
        if (id.match(`.${ext}`) !== null) {
            isLocalVideo = true;
        }
    });

    return isLocalVideo;
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

const trackVideoEvent = ( videoId, event = '', params = {} ) => {
    if (analytics) {
        params.video = `${videoId} - ${document.location.pathname}`;
        analytics.trackEvent(event, params);
    }
};

// we want to track a special event when we hit either 20% or 30 seconds through the video, whichever is longer
const trackGoal = ( videoId ) => {
    trackVideoEvent(videoId, 'video_goal');
    return true;
};

// Track events when we have passed our set duration markers
const trackVideoEventsSoFar = (goalTracked, percentages, currentTime, videoId) => {
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
const handleUnstartedEvent = (videoId, duration) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('unstarted', videoId, duration);
    }
};


// Handler for Play event
// Track an event when a video starts playing
const handlePlayEvent = (videoId, duration ) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('play', videoId, duration);
    }
};

// Handler for Pause event
const handlePauseEvent = (videoId, duration, currentTime, goalTracked, percentages ) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('pause', videoId, duration);
    }

    return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};

// Handler for Stop event
const handleStopEvent = (videoId, duration, currentTime, goalTracked, percentages ) => {
    if ( typeof window.onVideoPlayerStateChange === 'function' ) {
        window.onVideoPlayerStateChange('ended', videoId, duration);
    }

    return trackVideoEventsSoFar(goalTracked, percentages, currentTime, videoId);
};


// add event listeners to the Vimeo player
const attachVimeoPlayerEventListeners = (player, videoId, goalTracked) => {
    let pauseEventsAttached = false;


    player.on('loaded', data => {
        handleUnstartedEvent( videoId, data.duration );
    });

    player.on('play', data => {
        const percentages = calculatePercentages( data.duration );

        if ( ! pauseEventsAttached ) {
            player.on('pause', data => {
                handlePauseEvent( videoId, data.duration, data.seconds, goalTracked, percentages );
            });
        
            player.on('ended', data => {
                handleStopEvent( videoId, data.duration, data.seconds, goalTracked, percentages );
            });

            pauseEventsAttached = true;
        }

        handlePlayEvent( videoId, data.duration );
    });
};

const addHtmlVideoPlayer = (src, options, element) => {
    // Clear the contents of the target element.
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', src);

    // Autoplay.
    if (options.autoplay) {
        videoPlayer.muted = true;
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
                        mute: options.mute,
                        controls: options.controls,
                        showinfo: options.showinfo,
                        loop: options.loop,
                        enablejsapi: 1,
                        
                    },
                    events: {
                        onStateChange: ( event ) => {
                            // Reset the video ID, current time and duration
                            videoId = event.target.getVideoData().video_id;
                            currentTime = event.target.getCurrentTime();
                            duration = duration || event.target.getDuration();

                            // Unstarted event
                            if ( event.data === window.YT.PlayerState.UNSTARTED ) {
                                handleUnstartedEvent(videoId, duration);
                            }

                            // Play events
                            if ( event.data === window.YT.PlayerState.PLAYING ) {
                                percentages = percentages || calculatePercentages(duration);
                                handlePlayEvent(videoId, duration);
                            }

                            // Pause events
                            if ( event.data === window.YT.PlayerState.PAUSED ) {
                                [goalTracked, percentages] = handlePauseEvent( videoId, duration, currentTime, goalTracked, percentages );
                            }

                            // End events
                            if ( event.data === window.YT.PlayerState.ENDED ) {
                                [goalTracked, percentages] = handleStopEvent( videoId, duration, currentTime, goalTracked, percentages );
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
            } else if (isLocalVideoId(videoId)) {
                videoContainer.classList.add('video-container--html-player');
                addHtmlVideoPlayer(videoId, options, videoDiv.parentElement);
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
    let optionsCopy = Object.assign({}, options);

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
window.onYouTubeIframeAPIReady = () => {
    addInlineVideos();
};

export default {
    init,
    options,
    addInlineVideos,
    videos
};
