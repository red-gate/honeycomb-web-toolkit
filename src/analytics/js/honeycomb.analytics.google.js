import cookieConsent from '../../cookie-consent/js/honeycomb.cookie-consent';
import { load } from '../../document/js/honeycomb.document.load-script';
import { logDeprecatedFunctionToConsole } from '../../notification/js/honeycomb.notification.log-deprecated-function';

let accountId;
let crossDomainAccountId;

const consentProperties = [
    'ad_storage',
    'ad_user_data',
    'ad_personalization',
    'analytics_storage',
];

const init = () => {

    // If the account ID is not set, then don't carry on.
    if (!accountId || (accountId === 'G-XXX')) {
        window.console.warn('Honeycomb: Google Analytics account ID is not set, therefore the Google Analytics script will not be loaded.');
        return false;
    }

    // Add the tracking script.
    addScript().then(() => {

        // Init the analytics accounts.
        initAccount(accountId, crossDomainAccountId);

        // Set up tracking alias helper.
        setupTrackingAlias();

        // Track lightbox video views.
        trackLightboxVideoViews();

        // Do console error if window.ga called, but doesn't exist, as V4 is now window.gtag().
        window.ga = window.ga || function () {
            window.console.error(
                'Honeycomb web toolkit has now been updated to use Google Analytics V4 (gtag). Please update any `window.ga()` references to use the new V4 API.',
                arguments
            );
        };
    });
};

const isExcludedEnvironment = () => {
    const excludedEnvironments = [
        'localhost',
        'local.red-gate.com',
        'local.honeycomb.com',
        'local.simple-talk.com',
        'webstaging.red-gate.com',
        'coredev-uat',
    ];

    let isExcluded = false;
    excludedEnvironments.forEach(environment => {
        if (window.location.host.includes(environment)) {
            isExcluded = true;
        }
    });

    return isExcluded;
};

const setAccountId = accId => {
    accountId = accId;
};

const setCrossDomainAccountId = accId => {
    crossDomainAccountId = accId;
};

// Add the Google Analytics script to the page.
// Expanded out the isogram iife.
const addScript = () => {
    return new Promise((resolve, reject) => {
        load(`https://www.googletagmanager.com/gtag/js?id=${accountId}`, () => {
            resolve();
        }, {
            async:true
        }, () => {
            reject('Google Analytics script not loaded');
        });
    });
};

// Initialise the account, with the account ID.
const initAccount = (accountId, crossDomainAccountId = null) => {
    if (!accountId || (accountId === 'G-XXX')) {
        return false;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
        window.dataLayer.push(arguments);
    };

    // Set default values of consent to denied.
    const defaultConsent = {
        wait_for_update: 500,
    };
    consentProperties.forEach((prop) => {
        defaultConsent[prop] = 'denied';
    });
    window.gtag('consent', 'default', defaultConsent);

    window.gtag('js', new Date());

    // Add account IDs.
    const configOptions = {};
    if (isExcludedEnvironment()) {
        configOptions['debug_mode'] = true;
    }
    window.gtag('config', accountId, configOptions);
    if (crossDomainAccountId) {
        window.gtag('config', crossDomainAccountId, configOptions);
    }

    // Update consent for storing cookies if targeting consent given.
    const hasTargetingConsent = cookieConsent.hasConsent('targeting');
    if (hasTargetingConsent) {
        const updatedConsent = {};
        consentProperties.forEach((prop) => {
            updatedConsent[prop] = 'granted';
        });
        window.gtag('consent', 'update', updatedConsent);
    }
};

// Track a page view on all trackers.
const trackPageView = ( url = '' ) => {
    const options = (url !== '') ? {
        page_location : url,
    } : {};

    trackEvent('page_view', options);
};

// Track an event.
const trackEvent = (event = '', params = {}) => {
    if (event === '') return false;
    if (typeof window.gtag === 'undefined') return false;

    window.gtag('event', event, params);
};

// Track youtube video views.
const trackLightboxVideoViews = () => {
    const els = document.querySelectorAll('.lightbox--video, .js-lightbox--video');
    for (let i=0; i<els.length; i++) {
        els[i].addEventListener('click', (e) => {
            let target = e.target;

            // Ensure target is the link, rather than a child element.
            while (!target.hasAttribute('href')) {
                target = target.parentElement;
            }

            const videoId = target.href.replace(
                /http(s)*:\/\/www.youtube.com\/embed\/|\?.*/g,
                ''
            );
            const url = new URL(target.href);
            trackEvent('video_start', {
                video_current_time: 0,
                video_percent: 0,
                video_url: url.origin + url.pathname,
                video_id: videoId,
                lightbox: true,
            });
        });
    }
};

// Click track (helper for instead of onclick="gtag('event', ...)".
// Use data-attributes instead. Keeps HTML nicer and easy to update in the
// future).
const setupTrackingAlias = (element = document) => {
    const els = element.querySelectorAll('[data-ga-track]');
    for (let i=0; i<els.length; i++) {
        els[i].addEventListener('click', (e) => {
            let target = e.target;

            // Ensure that the target is the element with the tracking info,
            // rather than a child of it. E.g. image within a link would be target
            // rather than the link. This prevents that from happening.
            while (!target.hasAttribute('data-ga-track')) {
                target = target.parentElement;
            }

            const event = target.getAttribute('data-ga-track-event');
            if (event === null) return;

            // Get attributes that match 'data-ga-track-'.
            const eventParams = {};
            for (const attr of target.attributes) {
                if (attr.name.match('data-ga-track-') && !attr.name.match('data-ga-track-event')) {
                    eventParams[attr.name.substring('data-ga-track-'.length)] = attr.value;
                }
            }

            // Process the Google tracking event.
            trackEvent(event, eventParams);
        } );
    }
};

const setCustomVariable = (...args) => {
    logDeprecatedFunctionToConsole('setCustomVariable', 'Google Analytics', '14.2.0');
};

const setOptimizeId = (...args) => {
    logDeprecatedFunctionToConsole('setOptimizeId', 'Google Analytics', '14.2.0');
};

const setSites = (...args) => {
    logDeprecatedFunctionToConsole('setSites', 'Google Analytics', '14.2.0');
};

// Listen for cookie consent updates and update consent based on the
// "targeting" group.
window.addEventListener('CookieConsent', (e) => {
    const consent =
        Object.prototype.hasOwnProperty.call(e.detail.groups, 'targeting') &&
        e.detail.groups.targeting == 1
            ? 'granted'
            : 'denied';

    if (typeof window.gtag === 'function') {
        const updatedConsent = {};
        consentProperties.forEach((prop) => {
            updatedConsent[prop] = consent;
        });
        window.gtag('consent', 'update', updatedConsent);
    }
});

export default {
    init,
    accountId,
    isExcludedEnvironment,
    setupTrackingAlias,
    setAccountId,
    setCrossDomainAccountId,
    trackEvent,
    trackPageView,

    setCustomVariable,
    setOptimizeId,
    setSites,
};

export {
    accountId,
    isExcludedEnvironment,
    setupTrackingAlias,
    trackEvent,
    trackPageView,
};