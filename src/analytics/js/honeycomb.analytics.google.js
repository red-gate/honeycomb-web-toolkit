let accountId;
let sites;
let optimizeContainerId;
let crossDomainAccountId;
let crossDomain = false;
let crossDomainTrackerName = 'crossDomain';

let init = ( s = false ) => {

    // If the account ID is not set, then don't carry on.
    if ( ! accountId || ( accountId === 'UA-XXX' ) ) {
        window.console.warn('Honeycomb: Google Analytics account ID is not set, therefore the Google Analytics script will not be loaded.');
        return false;
    }

    // Add the tracking script.
    addScript();

    // Init the analytics accounts.
    initAccount( accountId, crossDomainAccountId );

    // Track a page view.
    if ( s.trackPageView !== false ) {
        trackPageView();
    }

    // Set up tracking alias helper.
    setupTrackingAlias();

    // Track YouTube video views.
    trackYouTubeViews();
};

let setAccountId = accId => {
    accountId = accId;
};

let setCrossDomainAccountId = accId => {
    crossDomain = true;
    crossDomainAccountId = accId;
};

let setSites = s => {
    sites = s;
};

let setOptimizeId = id => {
    optimizeContainerId = id;
};

// Add the Google Analytics script to the page.
// Expanded out the isogram iife.
let addScript = () => {
    window.GoogleAnalyticsObject = 'ga';
    window.ga = window.ga || function() {
        ( window.ga.q = window.ga.q || [] ).push( arguments );
    };
    window.ga.l = 1 * new Date();

    let script = document.createElement( 'script' );
    script.async = 1;
    script.src = '//www.google-analytics.com/analytics.js';

    let firstScript = document.getElementsByTagName( 'script' )[ 0 ];
    firstScript.parentNode.insertBefore( script, firstScript );
};

// Initialise the account, with the account ID.
let initAccount = (accountId, crossDomainAccountId) => {
    if ( ! accountId || ( accountId === 'UA-XXX' ) ) {
        return false;
    }

    if ( typeof window.ga === 'undefined' ) return false;

    // Create the tracker for the individual property.
    // allowLinker defaults to 'false'
    window.ga( 'create', accountId, 'auto' ); 
    
    // Create the cross-domain tracker, and set it to allow cross-domain linker parameters.
    // Also enable the auto-linker and pass in a list of sites.
    // Our implementation of multiple trackers follows this guide: https://www.simoahava.com/gtm-tips/cross-domain-tracking-with-multiple-ga-trackers/
    if ( crossDomainAccountId && sites ) {
        window.ga( 'create', crossDomainAccountId, { name: crossDomainTrackerName, cookieName: '_crossDomainGa', 'allowLinker': true } );        
        window.ga( `${crossDomainTrackerName}.require`, 'linker' );
        window.ga( `${crossDomainTrackerName}.linker:autoLink`, sites );
    }

    if ( optimizeContainerId ) {
        window.ga('require', optimizeContainerId);
    }

    // Anonymise IP addresses by default.
    window.ga( 'set', 'anonymizeIp', true );
};

// Track a page view on all trackers.
let trackPageView = ( url = false ) => {
    const options = url ? { page : url } : {};

    if ( typeof window.ga === 'undefined' ) return false;

    // Track pageview for the default tracker
    window.ga( 'send', 'pageview', options );

    // Track pageview for the crossdomain tracker, if set
    if ( crossDomain ) {
        window.ga( `${crossDomainTrackerName}.send`, 'pageview', options );
    }
};

// Track an event on the default tracker
let trackEvent = ( category = '', action = '', label = null, value = null ) => {
    if ( typeof window.ga === 'undefined' ) return false;

    window.ga( 'send', 'event', category, action, label, value );
};

// Set a custom variable on the default tracker
let setCustomVariable = ( index, name, value ) => {
    if ( typeof window.ga === 'undefined' ) return false;

    let options = {};
    options[ 'dimension' + index ] = value;
    window.ga( 'send', 'pageview', options );
};

// Track youtube video views.
let trackYouTubeViews = () => {
    let els = document.querySelectorAll( '.lightbox--video' );
    for ( let i = 0; i < els.length; i++ ) {
        els[i].addEventListener( 'click', ( e ) => {
            let videoId = e.target.href.replace( /http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g, '' );
            trackEvent( 'Video', window.location.pathname, videoId );
        } );
    }
};

// Click track (helper for instead of onclick="ga(send...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
let setupTrackingAlias = (element = document) => {
    let els = element.querySelectorAll( '[data-ga-track]' );
    for ( let i = 0; i < els.length; i++ ) {
        els[i].addEventListener( 'click', ( e ) => {
            let target = e.target;

            // Ensure that the target is the element with the tracking info,
            // rather than a child of it. E.g. image within a link would be target
            // rather than the link. This prevents that from happening.
            while (!target.hasAttribute('data-ga-track')) {
                target = target.parentElement;
            }

            let category = target.getAttribute( 'data-ga-track-category' ) || null;
            let action = target.getAttribute( 'data-ga-track-action' ) || null;
            let label = target.getAttribute( 'data-ga-track-label' ) || null;
            let value = target.getAttribute( 'data-ga-track-value' ) || null;

            // Process Google tracking event.
            trackEvent( category, action, label, value );
        } );
    }
};

export default {
    init,
    setAccountId,
    setCrossDomainAccountId,
    setSites,
    setOptimizeId,
    trackPageView,
    trackEvent,
    setCustomVariable,
    accountId,
    setupTrackingAlias
};
