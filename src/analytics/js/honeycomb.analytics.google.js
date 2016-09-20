let accountId;

let init = () => {

    // If the account ID is not set, then don't carry on.
    if ( ! accountId || ( accountId === 'UA-XXX' ) ) {
      console.error('Google Analytics account ID is not set.');
      return false;
    }

    // Add the tracking script.
    addScript();

    // Init the analytics accounts.
    initAccount( accountId );

    // Track a page view.
    trackPageView();

    // Set up tracking alias helper.
    setupTrackingAlias();

    // Track YouTube video views.
    trackYouTubeViews();
};

let setAccountId = ( accId ) => {
    accountId = accId;
};

// Add the Google Analytics script to the page.
let addScript = () => {
    (function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
};

// Initialise the account, with the account ID.
let initAccount = ( accountId ) => {
    if ( ! accountId || ( accountId === 'UA-XXX' ) ) {
        console.log( 'Google Analytics account ID is not set.' );
        return false;
    }

    ga( 'create', accountId, 'auto' );
};

// Track a page view.
let trackPageView = ( url = false ) => {
    if( url ) {
        ga( 'send', 'pageview', {
            'page': url
        } );
    } else {
        ga( 'send', 'pageview' );
    }
};

// Track an event.
let trackEvent = ( category = '', action = '', label = null, value = null ) => {
    ga( 'send', 'event', category, action, label, value );
};

// Set a custom variable.
let setCustomVariable = ( index, name, value, scope ) => {
    let options = {};
    options[ 'dimension' + index ] = value;
    ga( 'send', 'pageview', options );
};

// Track youtube video views.
let trackYouTubeViews = () => {
    let els = document.querySelectorAll( '.lightbox--video' );
    for ( let i = 0; i < els.length; i++ ) {
        els[i].addEventListener( 'click', () => {
            let videoId = this.href.replace( /http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '' );
            trackEvent( 'Video', window.location.pathname, videoId );
        } );
    }
};

// Click track (helper for instead of onclick="ga(send...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
let setupTrackingAlias = () => {
    let els = document.querySelectorAll( '[data-ga-track]' );
    for ( let i = 0; i < els.length; i++ ) {
        els[i].addEventListener( 'click', () => {
            let category = this.getAttribute( 'data-ga-track-category' ) || null;
            let action = this.getAttribute( 'data-ga-track-action' ) || null;
            let label = this.getAttribute( 'data-ga-track-label' ) || null;
            let value = this.getAttribute( 'data-ga-track-value' ) || null;

            // Process Google tracking event.
            trackEvent( category, action, label, value );
        } );
    }
};

export default {
    init: init,
    setAccountId: setAccountId,
    trackPageView: trackPageView,
    trackEvent: trackEvent,
    setCustomVariable: setCustomVariable,
    accountId: accountId
};
